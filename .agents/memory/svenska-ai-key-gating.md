---
name: Svenska AI feature gating
description: Why AI-dependent features in the Svenska app wait on a user-supplied OpenAI key instead of the Replit AI Integrations proxy.
---

The user explicitly declined enabling the Replit AI Integrations OpenAI proxy for this project. AI-only features (smart error correction, AI pronunciation evaluation, grammar explanations, AI chat/homework generation) must stay gated behind a **user-supplied OpenAI API key**, to be entered later via the app's Settings page — do not re-propose the Replit AI Integrations proxy for this project unless the user brings it up again.

**Why:** explicit user decision to self-manage the key rather than use Replit's managed proxy.

**How to apply:** when adding new AI-powered features to this app, route them through the same "bring your own key via Settings" pattern (check for the key, prompt the user to add it there) rather than wiring up the AI Integrations proxy. Non-AI approaches should be preferred wherever they can meet the need — see the audio-tts memory for one example (browser `speechSynthesis`). For translation/voice/OCR specifically: the free public Google Translate endpoint (proxied server-side to dodge CORS/key issues), the browser Web Speech API (`speechSynthesis` + `SpeechRecognition`), and client-side `tesseract.js` OCR together cover translation, voice, and image-text needs with no AI key at all.
