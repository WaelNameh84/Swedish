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
- New sections live under `src/pages/games/*`, `src/pages/exams/*`, `src/pages/translator/*`, `src/pages/pronunciation/*`, each with a hub page (`GamesHubPage`, `ExamsHubPage`, `TranslatorHubPage`, `PronunciationHubPage`) and matching `AppSidebar.tsx` tool arrays (`gamesTools`, `examsTools`, `translatorTools`, `pronunciationTools`)
- `SettingsPage.tsx` — placeholder UI for enabling AI features later (no key is requested yet)

## Architecture decisions

- New feature routes (games/exams/translator/pronunciation) use plain Express routes + raw `fetch` on the frontend, not the OpenAPI/Orval codegen pipeline — faster to iterate and matches existing precedent (`VerbsPage`/`DictionaryPage`).
- Games/Exams/Translator/Pronunciation are built to work with **zero AI dependency**: free Google Translate endpoint (server-proxied to avoid CORS/key issues), browser-native `speechSynthesis`/`SpeechRecognition` for TTS/STT, and client-side `tesseract.js` OCR for camera/image translation. Exams are auto-graded from `dictionaryTable` words (no AI grading).
- AI-only features (smart correction, AI pronunciation evaluation, grammar explanations, AI chat) remain gated behind a **user-supplied OpenAI API key** entered via the Settings page (not yet built out — currently just an informational placeholder). The user explicitly declined the Replit AI Integrations OpenAI proxy; do not re-propose it — route new AI features through the same "bring your own key via Settings" flow instead.

## Product

Svenska teaches Swedish to Arabic speakers. Core sections: Lessons, Dictionary, Verbs, Conversations, AI-teacher chat, Audio Learning, Pronunciation practice, Games (7 word/vocab games), Exams (daily/weekly/monthly/level tests with certificates + performance reports), and a Live Translator (text/voice/camera OCR/two-person conversation mode, ~130+ languages) — all translation/voice/OCR features work without any AI key.

## User preferences

- Build features to work fully without requiring an AI/OpenAI key when a non-AI approach (browser APIs, free public endpoints, deterministic logic) can cover the same need.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
