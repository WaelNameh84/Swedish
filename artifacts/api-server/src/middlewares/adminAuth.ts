import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db, userProgressTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h
export const ADMIN_COOKIE_MAX_AGE_MS = SESSION_TTL_MS;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is required for admin sessions.");
  }
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

/** Builds a signed, expiring session token to store in the admin cookie. */
export function createAdminSessionToken(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(token: string | undefined | null): boolean {
  if (!token) return false;
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return false;
  const payload = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  const expires = Number(payload);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const expectedSig = sign(payload);
  const provided = Buffer.from(sig);
  const expected = Buffer.from(expectedSig);
  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(provided, expected);
}

/** Constant-time password comparison against ADMIN_PASSWORD. */
export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !candidate) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Looks up whether a Clerk-authenticated user has been granted admin access. */
export async function getIsAdminForUser(userId: string): Promise<boolean> {
  const rows = await db
    .select({ isAdmin: userProgressTable.isAdmin })
    .from(userProgressTable)
    .where(eq(userProgressTable.userId, userId))
    .limit(1);
  return rows[0]?.isAdmin ?? false;
}

/** Grants (or revokes) admin access for a Clerk-authenticated user's account. */
export async function setIsAdminForUser(userId: string, isAdmin: boolean): Promise<void> {
  const existing = await db.select({ id: userProgressTable.id }).from(userProgressTable).where(eq(userProgressTable.userId, userId)).limit(1);
  if (existing.length > 0) {
    await db.update(userProgressTable).set({ isAdmin }).where(eq(userProgressTable.userId, userId));
  } else {
    await db.insert(userProgressTable).values({ userId, isAdmin });
  }
}

/**
 * Route guard: allows either the legacy password-session cookie, or a normal
 * Clerk-signed-in account that has been granted admin access (isAdmin=true).
 * This lets an admin just sign in with their regular account going forward —
 * the password is only needed once, to claim admin access the first time.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];
  if (isValidAdminSession(token)) return next();

  const auth = getAuth(req);
  const userId = auth?.userId;
  if (userId) {
    const isAdmin = await getIsAdminForUser(userId);
    if (isAdmin) {
      req.userId = userId;
      return next();
    }
  }
  return res.status(401).json({ error: "غير مصرح — يلزم تسجيل دخول المسؤول" });
}
