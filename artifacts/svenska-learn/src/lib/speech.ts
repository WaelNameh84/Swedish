// ─── Speech synthesis helper ────────────────────────────────────────────────
// Two tiers of voice:
// 1. Free, works everywhere: window.speechSynthesis, but we now score all
//    available voices per language and prefer the most natural-sounding one
//    instead of whatever the browser defaults to (which is often a robotic
//    compact voice). Users can also pick a specific voice in Settings.
// 2. Optional "human" AI voice: OpenAI TTS via the API server's
//    /ai-teacher/speak endpoint. Only used when the user turns it on in
//    Settings AND has a working OpenAI key (env or their own, via Settings).
//    Falls back to the browser voice automatically if it's off or fails.

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const AUDIO_SETTINGS_KEY = "svenska_audio_settings";

export type SpeechLang = "sv-SE" | "ar-SA" | "en-US";

// ─── Browser voice selection ───────────────────────────────────────────────

let voicesCache: SpeechSynthesisVoice[] = [];

function refreshVoices() {
  if (!window.speechSynthesis) return;
  voicesCache = window.speechSynthesis.getVoices();
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

/** Higher score = more natural-sounding / higher-quality voice. */
function qualityScore(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (/natural|neural|enhanced|premium|wavenet|studio/.test(name)) score += 5;
  if (/online|google|microsoft/.test(name)) score += 2;
  if (voice.localService === false) score += 1; // network voices tend to be higher quality
  if (/compact|espeak|robot/.test(name)) score -= 4;
  return score;
}

function voicesForLang(lang: string): SpeechSynthesisVoice[] {
  const short = lang.split("-")[0].toLowerCase();
  return voicesCache.filter(
    (v) => v.lang.toLowerCase() === lang.toLowerCase() || v.lang.toLowerCase().startsWith(short)
  );
}

/** List available voices for a language, best first — used by the Settings voice picker. */
export function listVoicesForLang(lang: string): SpeechSynthesisVoice[] {
  return [...voicesForLang(lang)].sort((a, b) => qualityScore(b) - qualityScore(a));
}

function pickVoice(lang: SpeechLang): SpeechSynthesisVoice | undefined {
  const preferredURI = readAudioSettings().voiceURI;
  if (preferredURI) {
    const preferred = voicesCache.find((v) => v.voiceURI === preferredURI);
    if (preferred) return preferred;
  }
  const candidates = voicesForLang(lang);
  if (candidates.length === 0) return undefined;
  return candidates.slice().sort((a, b) => qualityScore(b) - qualityScore(a))[0];
}

function pickVoiceAny(langCode: string): SpeechSynthesisVoice | undefined {
  const candidates = voicesForLang(langCode);
  if (candidates.length === 0) return undefined;
  return candidates.slice().sort((a, b) => qualityScore(b) - qualityScore(a))[0];
}

// ─── Shared settings read (kept in sync with lib/audioSettings.tsx) ────────

interface StoredAudioSettings {
  useAiVoice: boolean;
  voiceURI: string | null;
}

function readAudioSettings(): StoredAudioSettings {
  try {
    const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
    if (!raw) return { useAiVoice: false, voiceURI: null };
    const parsed = JSON.parse(raw);
    return { useAiVoice: !!parsed.useAiVoice, voiceURI: parsed.voiceURI ?? null };
  } catch {
    return { useAiVoice: false, voiceURI: null };
  }
}

// ─── AI voice (OpenAI TTS) ──────────────────────────────────────────────────

let currentAiAudio: HTMLAudioElement | null = null;

function stopAiAudio() {
  if (currentAiAudio) {
    currentAiAudio.pause();
    currentAiAudio.src = "";
    currentAiAudio = null;
  }
}

/** Attempts AI playback; resolves true if it actually played, false to signal "fall back to browser voice". */
async function playAiVoice(text: string, langCode: string): Promise<boolean> {
  try {
    const lang = langCode.toLowerCase().startsWith("ar") ? "ar" : "sv";
    const res = await fetch(`${BASE}/api/ai-teacher/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });
    if (!res.ok) return false;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    stopAiAudio();
    const audio = new Audio(url);
    currentAiAudio = audio;
    await new Promise<void>((resolve) => {
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
    URL.revokeObjectURL(url);
    if (currentAiAudio === audio) currentAiAudio = null;
    return true;
  } catch {
    return false;
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function isSpeechSupported() {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

export function stopSpeaking() {
  stopAiAudio();
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

function speakBrowser(
  text: string,
  opts: { lang?: SpeechLang; rate?: number } = {}
): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSupported() || !text) {
      resolve();
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = opts.lang ?? "sv-SE";
    utter.rate = opts.rate ?? 0.9;
    const voice = pickVoice(utter.lang as SpeechLang);
    if (voice) utter.voice = voice;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.speak(utter);
  });
}

export async function speak(
  text: string,
  opts: { lang?: SpeechLang; rate?: number } = {}
): Promise<void> {
  if (!text) return;
  const lang = opts.lang ?? "sv-SE";
  if (readAudioSettings().useAiVoice) {
    const played = await playAiVoice(text, lang);
    if (played) return;
  }
  return speakBrowser(text, { ...opts, lang });
}

/** Speak text in any language code (e.g. from the translator), best-effort voice match. */
export async function speakAny(text: string, langCode: string, rate = 0.95): Promise<void> {
  if (!text) return;
  if (readAudioSettings().useAiVoice && (langCode.startsWith("sv") || langCode.startsWith("ar"))) {
    const played = await playAiVoice(text, langCode);
    if (played) return;
  }
  return new Promise((resolve) => {
    if (!isSpeechSupported()) {
      resolve();
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = rate;
    const voice = pickVoiceAny(langCode);
    if (voice) utter.voice = voice;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.speak(utter);
  });
}

/** Speak Swedish text, optionally followed by its Arabic translation. */
export async function speakWithTranslation(
  sv: string,
  ar: string | undefined,
  opts: { rate?: number; autoTranslate?: boolean } = {}
) {
  await speak(sv, { lang: "sv-SE", rate: opts.rate });
  if (opts.autoTranslate && ar) {
    await new Promise((r) => setTimeout(r, 250));
    await speak(ar, { lang: "ar-SA", rate: opts.rate });
  }
}
