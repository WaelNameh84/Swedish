const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface Language {
  code: string;
  name: string;
}

let languagesCache: Language[] | null = null;

export async function getLanguages(): Promise<Language[]> {
  if (languagesCache) return languagesCache;
  const res = await fetch(`${BASE}/api/translate/languages`);
  const data = await res.json();
  languagesCache = data;
  return data;
}

export async function translateText(
  text: string,
  target: string,
  source: string = "auto"
): Promise<{ translation: string; detectedSource: string }> {
  const res = await fetch(`${BASE}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, target }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "فشلت الترجمة");
  }
  return res.json();
}

/** Maps a translate language code to a BCP-47 speech tag for TTS/STT best-effort. */
export function toSpeechLang(code: string): string {
  const map: Record<string, string> = {
    ar: "ar-SA", sv: "sv-SE", en: "en-US", fr: "fr-FR", de: "de-DE", es: "es-ES",
    it: "it-IT", pt: "pt-PT", ru: "ru-RU", "zh-CN": "zh-CN", "zh-TW": "zh-TW",
    ja: "ja-JP", ko: "ko-KR", hi: "hi-IN", ur: "ur-PK", fa: "fa-IR", tr: "tr-TR",
    nl: "nl-NL", pl: "pl-PL", uk: "uk-UA", tl: "fil-PH",
  };
  return map[code] ?? code;
}
