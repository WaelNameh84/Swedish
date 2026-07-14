---
name: Svenska-learn audio features use browser speechSynthesis
description: Why audio/TTS features in svenska-learn work without an OpenAI key, and where the pattern lives
---

The svenska-learn app already used `window.speechSynthesis` / `SpeechSynthesisUtterance` (in WordDetailSheet, VerbDetailSheet, ConversationsPage) before any AI-teacher work existed.

When building further audio-based features (radio, sleep mode, repetition, speed control, background playback, offline packages), reuse this browser-native TTS instead of assuming an OpenAI/ElevenLabs key is required.

**Why:** the user declined both ElevenLabs and the OpenAI AI-integrations proxy, and deferred providing their own OpenAI key. Browser speechSynthesis needs no server key, works fully client-side, and (on most devices) continues working offline after the first voice load — so it's the reliable fallback/default for word pronunciation and translation playback in this app, not just a stopgap.

**How to apply:** central helpers live in `artifacts/svenska-learn/src/lib/speech.ts` (promise-based `speak()`/`speakWithTranslation()`) and `src/lib/audioSettings.tsx` (shared speed/autoTranslate/backgroundPlay context, persisted to localStorage under `svenska_audio_settings`). Reuse these rather than re-wrapping speechSynthesis ad hoc in new pages.
