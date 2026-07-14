# Svenska — تعلم السويدية

تطبيق ويب لتعلم اللغة السويدية للناطقين بالعربية، يشمل دروساً، محادثات، مفردات يومية، وتدريب تفاعلي.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/svenska-learn` — the web app (React + Vite frontend, Wouter routing, RTL Arabic UI)
- `artifacts/api-server` — Express API (raw routes for new features; Orval-generated hooks for older CRUD-style features)
- `lib/db` — Drizzle schema (source of truth for DB tables), migrations via `pnpm --filter @workspace/db run push`
- New sections live under `src/pages/games/*`, `src/pages/exams/*`, `src/pages/translator/*`, `src/pages/pronunciation/*`, `src/pages/community/*`, each with a hub page (`GamesHubPage`, `ExamsHubPage`, `TranslatorHubPage`, `PronunciationHubPage`, `CommunityHubPage`) and matching `AppSidebar.tsx` tool arrays (`gamesTools`, `examsTools`, `translatorTools`, `pronunciationTools`, `communityTools`)
- `StatisticsPage.tsx` and `ProfilePage.tsx` are single comprehensive dashboard pages (not hub+subpages) linked directly from `mainLinks` in `AppSidebar.tsx`
- `SettingsPage.tsx` — placeholder UI for enabling AI features later (no key is requested yet)

## Architecture decisions

- New feature routes (games/exams/translator/pronunciation/statistics/achievements/community) use plain Express routes + raw `fetch` on the frontend, not the OpenAPI/Orval codegen pipeline — faster to iterate and matches existing precedent (`VerbsPage`/`DictionaryPage`).
- Games/Exams/Translator/Pronunciation are built to work with **zero AI dependency**: free Google Translate endpoint (server-proxied to avoid CORS/key issues), browser-native `speechSynthesis`/`SpeechRecognition` for TTS/STT, and client-side `tesseract.js` OCR for camera/image translation. Exams are auto-graded from `dictionaryTable` words (no AI grading).
- AI-only features (smart correction, AI pronunciation evaluation, grammar explanations, AI chat, AI voice) are gated behind an OpenAI key: `getOpenAI()` (`artifacts/api-server/src/lib/openai.ts`) prefers `OPENAI_API_KEY` env var, and falls back to a key saved via the admin-only keys page (`user_settings.openai_api_key`) — so it's now async, callers must `await` it. The user explicitly declined the Replit AI Integrations OpenAI proxy; do not re-propose it.
- **AI provider keys are admin-only.** The regular Settings page no longer shows or edits `openaiApiKey`/`geminiApiKey`/`imageGenApiKey`/`translationApiKey` — `GET/PATCH /api/settings/user` strips those fields entirely. They live behind `/admin/ai-keys` (linked from `/admin/ai` and the sidebar's admin section), protected by `requireAdmin` middleware (`artifacts/api-server/src/middlewares/adminAuth.ts`): a password login (`ADMIN_PASSWORD` secret) issues a signed, HMAC'd (`SESSION_SECRET`), httpOnly `admin_session` cookie valid 12h. The keys page also has a "تحقق" (verify) button per key — real live checks for OpenAI (`models.list`) and Gemini (REST models endpoint); imageGen/translation keys aren't wired to any real provider call yet, so verify honestly reports "no automatic check available" rather than faking success.
- **Human AI voice**: Settings → "الصوت والقراءة" has a "صوت بشري بالذكاء الاصطناعي" toggle (disabled until an OpenAI key resolves via `getOpenAI()`). When on, `speak()`/`speakAny()` in `src/lib/speech.ts` call the existing `/ai-teacher/speak` OpenAI TTS endpoint and fall back to the browser voice automatically on any failure. When off (default, free path), browser `speechSynthesis` voices are scored by name heuristics (Natural/Neural/Enhanced/Wavenet/Studio > default > Compact/eSpeak) and the best-available voice per language is auto-selected; users can also pick a specific installed voice from a dropdown. Preferences live in `localStorage["svenska_audio_settings"]` (see `lib/audioSettings.tsx`), which `speech.ts` reads directly since it isn't a React module.
- Successful `/pronunciation/evaluate` results are persisted to `pronunciationAttemptsTable` (via `/pronunciation/attempts`) so Statistics/Profile can show a real "مستوى النطق" derived from actual scored attempts; shows "لم يبدأ التقييم بعد" until AI is enabled and used at least once.
- **Community section is demo/mock data** (leaderboard other-learners, friends, groups, competitions) since there is no auth/multi-user system yet — see `svenska-community-demo-data` memory. The real user's own row (from `userProgressTable`) is merged into the leaderboard with `isYou: true` so their rank/XP is always accurate. Friend-add/group-join actions persist for real (via `friendIds`/`joinedGroupIds` jsonb columns on `userProgressTable`). Daily challenges (`/community/challenges`) and achievement-sharing (`/community/share`) use fully real data — no mocking.
- Achievements are computed on the fly (not stored) in `artifacts/api-server/src/lib/achievements.ts` from real progress/exam/pronunciation data, shared between `/achievements` and `/user/profile`.
- **Accounts & login**: real per-user accounts via Replit-managed Clerk (email/password, Google, forgot-password, sessions). `/` is public (`WelcomePage` when signed out, the real `Home` dashboard when signed in via a `Show`-based gate); every other learning route redirects signed-out visitors to `/`. `/admin/*` keeps its own separate `ADMIN_PASSWORD`-cookie auth, untouched by Clerk. Real device biometric login (Face ID/Touch ID) is a custom WebAuthn layer on top of Clerk — see `clerk-webauthn-biometric` memory for the pattern.
- **Multi-tenancy scope is deliberately partial** — see `svenska-multi-tenancy-scope` memory for exactly which tables are per-user vs. still global, and why.
- **Express sub-routers mounted at the shared root must scope `router.use(requireAuth)` to their own path prefix** (e.g. `router.use("/chat", requireAuth)`), never call it unscoped — see `express-subrouter-auth-scoping` memory.

## Product

Svenska teaches Swedish to Arabic speakers. Core sections: Lessons, Dictionary, Verbs, Conversations, AI-teacher chat, Audio Learning, Pronunciation practice, Games (7 word/vocab games), Exams (daily/weekly/monthly/level tests with certificates + performance reports), a Live Translator (text/voice/camera OCR/two-person conversation mode, ~130+ languages — works without any AI key), Statistics (real learning-hours/words/success-rate/pronunciation-level/streak dashboard with charts and week/month comparisons), Community (demo leaderboard/friends/groups/competitions + real daily challenges and achievement-sharing), and Profile (avatar, level/XP, achievements, certificates, languages).

## User preferences

- Build features to work fully without requiring an AI/OpenAI key when a non-AI approach (browser APIs, free public endpoints, deterministic logic) can cover the same need.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
