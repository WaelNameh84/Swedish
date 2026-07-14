import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { webauthnCredentialsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { clerkClient, getAuth } from "@clerk/express";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

// Real platform-authenticator (Face ID / Touch ID / Windows Hello) biometric
// login, layered on top of Clerk. Clerk owns the account/session; this table
// only maps a device's passkey credential to the Clerk userId it belongs to,
// so a verified biometric assertion can be exchanged for a real Clerk
// sign-in token. Challenges are short-lived and kept in memory (single
// dev/prod instance) rather than a DB table, since they are throwaway.
const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const challenges = new Map<string, { challenge: string; expiresAt: number }>();

function putChallenge(key: string, challenge: string) {
  challenges.set(key, { challenge, expiresAt: Date.now() + CHALLENGE_TTL_MS });
}

function takeChallenge(key: string): string | null {
  const entry = challenges.get(key);
  challenges.delete(key);
  if (!entry || entry.expiresAt < Date.now()) return null;
  return entry.challenge;
}

function rpInfo(req: import("express").Request) {
  const host = req.hostname; // no port, no protocol — required for rpID
  const origin = `${req.protocol}://${req.get("host")}`;
  return { rpID: host, rpName: "Svenska - تعلم السويدية", origin };
}

// POST /webauthn/register-options — start registering this device's
// fingerprint/Face ID for the signed-in user (called from Settings).
router.post("/webauthn/register-options", requireAuth, async (req, res) => {
  try {
    const userId = req.userId!;
    const { rpID, rpName } = rpInfo(req);
    const existing = await db
      .select()
      .from(webauthnCredentialsTable)
      .where(eq(webauthnCredentialsTable.userId, userId));

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(userId),
      userName: userId,
      attestationType: "none",
      excludeCredentials: existing.map((c) => ({ id: c.credentialId })),
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
        authenticatorAttachment: "platform",
      },
    });

    putChallenge(`register:${userId}`, options.challenge);
    res.json(options);
  } catch (err) {
    req.log.error({ err }, "Failed to build WebAuthn registration options");
    res.status(500).json({ error: "حدث خطأ أثناء تجهيز تفعيل البصمة" });
  }
});

// POST /webauthn/register-verify — finish registering this device.
router.post("/webauthn/register-verify", requireAuth, async (req, res) => {
  try {
    const userId = req.userId!;
    const { rpID, origin } = rpInfo(req);
    const response = req.body as RegistrationResponseJSON;
    const expectedChallenge = takeChallenge(`register:${userId}`);
    if (!expectedChallenge) {
      return res.status(400).json({ error: "انتهت صلاحية طلب التفعيل، حاول مرة أخرى" });
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ error: "تعذر تأكيد البصمة" });
    }

    const { credential } = verification.registrationInfo;
    await db.insert(webauthnCredentialsTable).values({
      userId,
      credentialId: credential.id,
      publicKey: Buffer.from(credential.publicKey).toString("base64url"),
      counter: credential.counter,
      deviceLabel: (req.body?.deviceLabel as string) || "هذا الجهاز",
    });

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to verify WebAuthn registration");
    res.status(500).json({ error: "تعذر تفعيل الدخول بالبصمة على هذا الجهاز" });
  }
});

// GET /webauthn/status — does the signed-in user have biometric enabled on
// any device? Used by Settings to show the toggle state.
router.get("/webauthn/status", requireAuth, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(webauthnCredentialsTable)
      .where(eq(webauthnCredentialsTable.userId, req.userId!));
    res.json({ enabled: rows.length > 0, devices: rows.map((r) => ({ id: r.id, label: r.deviceLabel, createdAt: r.createdAt })) });
  } catch (err) {
    req.log.error({ err }, "Failed to load WebAuthn status");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /webauthn/:id — disable biometric login for one registered device.
router.delete("/webauthn/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db
      .delete(webauthnCredentialsTable)
      .where(eq(webauthnCredentialsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to remove WebAuthn credential");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /webauthn/login-options — public: start a biometric login. No
// allowCredentials list is sent since credentials are resident/discoverable
// — the OS picks whichever passkey on this device matches this rpID.
router.post("/webauthn/login-options", async (req, res) => {
  try {
    const { rpID } = rpInfo(req);
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "required",
    });
    // Keyed by the challenge itself — there's no session yet to key off of.
    putChallenge(options.challenge, options.challenge);
    res.json(options);
  } catch (err) {
    req.log.error({ err }, "Failed to build WebAuthn login options");
    res.status(500).json({ error: "حدث خطأ أثناء تجهيز الدخول بالبصمة" });
  }
});

// POST /webauthn/login-verify — public: verify the biometric assertion and
// mint a real Clerk sign-in token the frontend exchanges for a session.
router.post("/webauthn/login-verify", async (req, res) => {
  try {
    const { rpID, origin } = rpInfo(req);
    const response = req.body as AuthenticationResponseJSON;
    const clientData = JSON.parse(
      Buffer.from(response.response.clientDataJSON, "base64url").toString("utf-8"),
    ) as { challenge: string };
    const expectedChallenge = takeChallenge(clientData.challenge);
    if (!expectedChallenge) {
      return res.status(400).json({ error: "انتهت صلاحية طلب الدخول، حاول مرة أخرى" });
    }

    const [stored] = await db
      .select()
      .from(webauthnCredentialsTable)
      .where(eq(webauthnCredentialsTable.credentialId, response.id));
    if (!stored) {
      return res.status(404).json({ error: "هذا الجهاز غير مسجّل للدخول بالبصمة" });
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: stored.credentialId,
        publicKey: Buffer.from(stored.publicKey, "base64url"),
        counter: stored.counter,
      },
    });

    if (!verification.verified) {
      return res.status(401).json({ error: "تعذر تأكيد البصمة" });
    }

    await db
      .update(webauthnCredentialsTable)
      .set({ counter: verification.authenticationInfo.newCounter })
      .where(eq(webauthnCredentialsTable.id, stored.id));

    const signInToken = await clerkClient.signInTokens.createSignInToken({
      userId: stored.userId,
      expiresInSeconds: 60,
    });

    res.json({ ticket: signInToken.token });
  } catch (err) {
    req.log.error({ err }, "Failed to verify WebAuthn login");
    res.status(500).json({ error: "تعذر الدخول بالبصمة" });
  }
});

export default router;
