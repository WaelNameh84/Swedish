---
name: Express sub-router auth scoping bug pattern
description: Why an unscoped router.use(requireAuth) in one feature router can silently 401 unrelated routes mounted later.
---

In this codebase, every feature router (`chat.ts`, `community.ts`, `statistics.ts`, etc.) is its own `express.Router()`, but all of them are mounted at the shared root with no path prefix (`router.use(chatRouter)` in `routes/index.ts`, not `router.use("/chat", chatRouter)`), because each file defines its own absolute paths internally (e.g. `/chat/...`).

Calling `router.use(requireAuth)` (no path) inside one of these files makes that middleware run for **every** request that flows through the shared router chain, not just requests matching that file's own routes — because Express only skips a sub-router's stack once a route inside it actually matches and responds; an unscoped `.use()` matches all paths and can 401 (short-circuit) requests meant for routers mounted later in the chain.

This broke public WebAuthn login endpoints (`/webauthn/login-options`, mounted after `community.ts` in the router list) — every request got 401'd by `community`'s blanket `requireAuth` before ever reaching `webauthn.ts`.

**Why:** the fix is to scope the middleware to the router's own prefix: `router.use("/community", requireAuth)` instead of `router.use(requireAuth)`.

**How to apply:** whenever adding router-wide (not per-route) auth middleware in a file that will be mounted alongside sibling routers at the shared root, always pass that router's own path prefix as the first arg to `.use()`. Per-route `requireAuth` (as a route handler arg) doesn't have this problem.
