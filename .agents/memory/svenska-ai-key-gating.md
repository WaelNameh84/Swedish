---
name: Svenska AI key gating
description: How getOpenAI() resolves the API key for gated AI features (chat, corrections, pronunciation AI, AI voice).
---

`getOpenAI()` in `artifacts/api-server/src/lib/openai.ts` is async. It checks `OPENAI_API_KEY` env var first, then falls back to the user's own key stored on `user_settings.openai_api_key` (set via the app's Settings page). All three call sites (`chat.ts`, `aiTeacher.ts`, `pronunciation.ts`) must `await` it.

**Why:** the user declined the Replit AI Integrations proxy and no env key is set in this project, so without the DB fallback every AI-gated feature (including the new AI voice) would be permanently unavailable — the Settings UI implies "add your key here to unlock AI features" but nothing previously read that stored key.

**How to apply:** any new AI-gated route must `await getOpenAI()` (or `await isAIAvailable()`), not call it synchronously. If a future feature needs the key elsewhere (e.g. a script), reuse `getOpenAI()` rather than reading `user_settings` directly.
