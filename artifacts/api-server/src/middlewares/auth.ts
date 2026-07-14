import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

// Augment Express Request so req.userId is available after requireAuth runs.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Gates a route behind a real Clerk session. Web auth is cookie-based —
// Clerk's browser SDK sends the session cookie automatically, so this only
// needs to read getAuth(req). Attaches req.userId for downstream handlers.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "يلزم تسجيل الدخول للوصول إلى هذا المحتوى" });
  }
  req.userId = userId;
  next();
}
