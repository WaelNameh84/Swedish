// Unified AI provider layer: every AI feature in this app tries OpenAI
// first (if a key is configured, via env var or the admin's saved key),
// then falls back to Gemini automatically if only a Gemini key is
// configured. This lets the app work whichever provider the admin has a
// working key for, without the caller needing to know which one is active.
import { getOpenAI } from "./openai";
import { getGemini, geminiGenerateText, geminiTranscribeAudio } from "./gemini";

export const AI_NOT_CONFIGURED_MESSAGE =
  "ميزة الذكاء الاصطناعي غير مفعّلة بعد. أضف مفتاح OpenAI أو Gemini من صفحة الأدمن لتفعيلها.";

export async function isAIAvailable(): Promise<boolean> {
  if (await getOpenAI()) return true;
  return !!(await getGemini());
}

/**
 * Runs a system-prompt + user-text chat completion, preferring OpenAI and
 * falling back to Gemini. Returns the raw text (or cleaned JSON string when
 * `json` is set) and which provider actually answered.
 */
export async function generateText(
  systemPrompt: string,
  userText: string,
  opts: { model?: string; json?: boolean; maxOutputTokens?: number } = {}
): Promise<{ text: string; provider: "openai" | "gemini" } | null> {
  const openai = await getOpenAI();
  if (openai) {
    const completion = await openai.chat.completions.create({
      model: opts.model ?? "gpt-5.4-mini",
      max_completion_tokens: opts.maxOutputTokens ?? 2048,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const text = opts.json ? raw.trim().replace(/^```json\s*|```\s*$/g, "") : raw;
    return { text, provider: "openai" };
  }

  if (await getGemini()) {
    const text = await geminiGenerateText(systemPrompt, userText, {
      json: opts.json,
      maxOutputTokens: opts.maxOutputTokens,
    });
    return { text, provider: "gemini" };
  }

  return null;
}

/** Transcribes spoken audio to text, preferring OpenAI Whisper and falling back to Gemini. */
export async function transcribeAudio(
  buffer: Buffer,
  mimeType: string,
  language?: string
): Promise<{ text: string; provider: "openai" | "gemini" } | null> {
  const openai = await getOpenAI();
  if (openai) {
    const audioFile = new File([new Uint8Array(buffer)], "recording.webm", { type: mimeType });
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-mini-transcribe",
      ...(language ? { language } : {}),
    });
    return { text: transcription.text?.trim() ?? "", provider: "openai" };
  }

  if (await getGemini()) {
    const text = await geminiTranscribeAudio(buffer, mimeType, language);
    return { text, provider: "gemini" };
  }

  return null;
}
