// ─── Speech synthesis helper ────────────────────────────────────────────────
// Wraps window.speechSynthesis with a promise-based API and language-aware
// voice selection. Works fully client-side (no network needed once the
// browser's speech engine/voices are loaded), which is why every "Audio
// Learning" feature works without an OpenAI key.

export type SpeechLang = "sv-SE" | "ar-SA" | "en-US";

let voicesCache: SpeechSynthesisVoice[] = [];

function refreshVoices() {
  if (!window.speechSynthesis) return;
  voicesCache = window.speechSynthesis.getVoices();
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function pickVoice(lang: SpeechLang): SpeechSynthesisVoice | undefined {
  const short = lang.split("-")[0];
  return (
    voicesCache.find((v) => v.lang === lang) ??
    voicesCache.find((v) => v.lang.startsWith(short)) ??
    undefined
  );
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

export function speak(
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

/** Speak text in any language code (e.g. from the translator), best-effort voice match. */
export function speakAny(text: string, langCode: string, rate = 0.95): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSupported() || !text) {
      resolve();
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = rate;
    const voice =
      voicesCache.find((v) => v.lang === langCode) ??
      voicesCache.find((v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase())) ??
      undefined;
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
