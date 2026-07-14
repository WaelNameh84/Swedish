import { Router } from "express";
import { getAuth } from "@clerk/express";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE_MS,
  checkAdminPassword,
  createAdminSessionToken,
  isValidAdminSession,
  getIsAdminForUser,
  setIsAdminForUser,
} from "../middlewares/adminAuth";

const router = Router();

// POST /admin/auth/login
// Claims (or re-confirms) admin access for the caller's own Clerk account.
// The caller must already be signed in with a normal account — the password
// is a one-time claim, after which that account controls everything and can
// just sign in normally from then on (no more password prompt).
router.post("/admin/auth/login", async (req, res) => {
  const { password } = req.body as { password?: string };

  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "يلزم تسجيل الدخول بحسابك العادي أولاً قبل إدخال كلمة مرور المسؤول" });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: "لم يتم ضبط كلمة مرور المسؤول في هذه البيئة" });
  }

  if (typeof password !== "string" || !checkAdminPassword(password)) {
    return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
  }

  await setIsAdminForUser(userId, true);

  // Also set the legacy cookie so any code still relying on it keeps working.
  res.cookie(ADMIN_COOKIE_NAME, createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_COOKIE_MAX_AGE_MS,
  });
  res.json({ ok: true });
});

// POST /admin/auth/logout
router.post("/admin/auth/logout", (_req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME);
  res.json({ ok: true });
});

// GET /admin/auth/session
// Authenticated if either the legacy password-session cookie is valid, or
// the signed-in Clerk account has already claimed admin access.
router.get("/admin/auth/session", async (req, res) => {
  if (isValidAdminSession(req.cookies?.[ADMIN_COOKIE_NAME])) {
    return res.json({ authenticated: true });
  }

  const auth = getAuth(req);
  const userId = auth?.userId;
  if (userId) {
    const isAdmin = await getIsAdminForUser(userId);
    if (isAdmin) return res.json({ authenticated: true });
  }

  res.json({ authenticated: false });
});

export default router;
