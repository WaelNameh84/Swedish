---
name: Svenska admin-only AI keys
description: How AI provider API keys are hidden from regular users and gated behind an admin login.
---

AI provider keys (`openaiApiKey`, `geminiApiKey`, `imageGenApiKey`, `translationApiKey` on `user_settings`) are never exposed via the public `/api/settings/user` endpoint — it strips those fields on both GET and PATCH. They can only be read/written through `/api/admin/keys` (GET/PATCH) and verified via `/api/admin/keys/verify`, all behind `requireAdmin` middleware.

Admin auth is a lightweight password gate, not a full user/account system (this app has none): `POST /api/admin/auth/login` checks the `ADMIN_PASSWORD` secret and issues an HMAC-signed (`SESSION_SECRET`), httpOnly `admin_session` cookie (12h TTL, `middlewares/adminAuth.ts`). The frontend admin keys page (`pages/admin/AdminAIKeysPage.tsx`) shows a password prompt when `GET /api/admin/auth/session` says unauthenticated.

**Why:** the user explicitly asked that API keys not be visible to regular users, only to an admin, but the app has no accounts/roles to hang that off of.

**How to apply:** any new admin-only surface should reuse `requireAdmin` from `middlewares/adminAuth.ts` rather than inventing a new gate. Only `/admin/keys*` and `/admin/auth/*` are currently protected — other `/admin/*` routes (dashboard, users, lessons, etc.) remain open; extend deliberately if that scope ever needs to grow.
