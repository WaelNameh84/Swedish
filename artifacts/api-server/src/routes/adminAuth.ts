import { Router } from "express";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE_MS,
  checkAdminPassword,
  createAdminSessionToken,
  isValidAdminSession,
} from "../middlewares/adminAuth";

const router = Router();

// POST /admin/auth/login
router.post("/admin/auth/login", (req, res) => {
  const { password } = req.body as { password?: string };

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: "لم يتم ضبط كلمة مرور المسؤول في هذه البيئة" });
  }

  if (typeof password !== "string" || !checkAdminPassword(password)) {
    return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
  }

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
router.get("/admin/auth/session", (req, res) => {
  res.json({ authenticated: isValidAdminSession(req.cookies?.[ADMIN_COOKIE_NAME]) });
});

export default router;
