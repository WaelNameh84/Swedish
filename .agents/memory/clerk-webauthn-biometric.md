---
name: Clerk + WebAuthn hybrid biometric login
description: How real device biometric login (Face ID/Touch ID) is layered on top of Replit-managed Clerk auth, and why.
---

Clerk owns the account/session. Biometric login is a separate WebAuthn layer bridged to Clerk via a sign-in ticket — Clerk itself has no native WebAuthn/passkey API exposed through the React SDK used here.

Flow:
1. Register (post-login, from Settings): `@simplewebauthn/server` generates registration options for a **resident/discoverable** platform authenticator (`authenticatorSelection: { residentKey: "required", userVerification: "required", authenticatorAttachment: "platform" }`). The verified credential is stored in a small `webauthn_credentials` table keyed by Clerk `userId`.
2. Login (pre-auth, from the sign-in page): a public endpoint issues an authentication challenge with no `allowCredentials` list — resident credentials let the OS/browser pick the matching passkey itself, so no device-local userId hint is needed. On successful assertion verify, the server mints a Clerk sign-in ticket via `clerkClient.signInTokens.createSignInToken({ userId, expiresInSeconds })`. The frontend exchanges it with the **legacy** `useSignIn()` hook (`import { useSignIn } from "@clerk/react/legacy"`, not the default signal-based `@clerk/react` export, which uses a different Future API) via `signIn.create({ strategy: "ticket", ticket })` + `setActive`.

**Why:** Clerk's React SDK (v6+) ships two parallel `useSignIn` APIs — a new signal-based one at `@clerk/react` (`{ signIn, errors, fetchStatus }`, no `.create()`/`isLoaded`) and the classic promise-based one at `@clerk/react/legacy` (`{ isLoaded, signIn }` with `signIn.create()`). The ticket-exchange custom-flow pattern only works with the legacy import.

**How to apply:** For any future custom Clerk sign-in flow (not just biometric), import `useSignIn`/`useSignUp` from `@clerk/react/legacy`, not the package root.

Challenge storage: an in-memory `Map` with a short TTL (single-instance app, throwaway ceremony data) — keyed by `userId` for registration (session exists), keyed by the challenge value itself for login (no session exists yet).
