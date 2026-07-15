---
name: Gemini audio understanding rejects browser-recorded webm
description: Why Gemini-based speech-to-text failed for browser MediaRecorder audio, and the fix pattern.
---

Gemini's `generateContent` audio understanding only accepts a fixed MIME allowlist: `audio/wav`, `audio/mp3`, `audio/aiff`, `audio/aac`, `audio/ogg`, `audio/flac` (see https://ai.google.dev/gemini-api/docs/generate-content/audio#supported-formats). It rejects `audio/webm` — which is what browsers' `MediaRecorder` produces by default — with a generic failure.

**Why:** any feature that records audio in-browser (voice translator, pronunciation checker, transcription) and forwards it straight to Gemini as `inlineData` will silently fail for every Gemini-only user (no OpenAI key configured), even though OpenAI Whisper accepts webm fine. The bug only shows up when the fallback path is actually exercised (Gemini-only key), so it's easy to miss in dev/testing with an OpenAI key present.

**How to apply:** before sending browser-recorded audio to Gemini, transcode it server-side to a supported container (WAV is simplest — trivial header, no compression). Use a bundled static ffmpeg binary (`ffmpeg-static` package) spawned via `child_process`, piping the buffer through stdin/stdout — don't require a system ffmpeg install, since production hosts (e.g. Render's plain Node runtime) don't have one and this project already avoids native/system deps (see the `tesseract.js` WASM-OCR precedent instead of a native OCR lib).

Two bundler gotchas hit when doing this under esbuild (this project's `build.mjs`):
1. If the build's install step uses `pnpm install --ignore-scripts`, packages needing a postinstall binary download (like `ffmpeg-static`) get skipped — add the package name to the existing `pnpm rebuild esbuild tesseract.js ...` allowlist step in `render.yaml`.
2. Don't trust `ffmpeg-static`'s own exported binary path when the importing module gets bundled — esbuild's `banner` in this repo rewrites `__dirname` to the dist folder, so `ffmpeg-static`'s internal `path.join(__dirname, 'ffmpeg')` resolves to the wrong place. Instead resolve the real installed path yourself at runtime with `createRequire(import.meta.url).resolve("ffmpeg-static/package.json")` and join the binary name from that directory — this walks real `node_modules` on disk and is bundler-proof.
