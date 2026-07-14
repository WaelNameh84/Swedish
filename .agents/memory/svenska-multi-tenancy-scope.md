---
name: Svenska multi-tenancy scope
description: Which DB tables became per-user vs. stayed global when Clerk accounts were added, and why.
---

When real accounts (Clerk) were added to Svenska, only these tables got a `userId` column and per-user scoping: `user_progress`, `user_settings`, `exam_attempts`, `pronunciation_attempts`, `chat_messages`.

Left global/unscoped on purpose: `favorites`, `notifications`, `ai_history`, `certificates` (only read in admin aggregate views, never exposed as "my data" anywhere), and lesson/word completion tracking (`lessonsTable.completionPercentage`, `wordsTable.isNew`).

**Why:** proper per-user completion tracking for lessons/words would need a join table (a much larger schema redesign) — explicitly deferred as a known, disclosed limitation rather than silently faking per-user state. The admin AI-provider-keys row in `user_settings` also isn't a real user — it uses a fixed sentinel `userId` (`"__admin_global__"`) so it can share the now-per-user table without being tied to any learner account.

**How to apply:** if extending "my data" surfaces, check this list first — a feature that reads one of the still-global tables and presents it as personal will be wrong for every account.
