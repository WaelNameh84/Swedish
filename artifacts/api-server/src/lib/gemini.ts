import { GoogleGenAI } from "@google/genai";
import { db } from "@workspace/db";
import { userSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GLOBAL_SETTINGS_USER_ID } from "./openai";

// Second AI provider: some admins only have a Gemini key (no OpenAI billing
// set up), so every AI feature below tries OpenAI first, then falls back to
// Gemini automatically if only a Gemini key is configured.

let envClient: GoogleGenAI | null = null;
let envAttempted = false;

function getEnvClient(): GoogleGenAI | null {
  if (!envAttempted) {
    envAttempted = true;
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      envClient = new GoogleGenAI({ apiKey });
    }
  }
  return envClient;
}

let userKeyClientCache: { key: string; client: GoogleGenAI } | null = null;

export async function getGemini(): Promise<GoogleGenAI | null> {
  const envClient = getEnvClient();
  if (envClient) return envClient;

  const [settings] = await db
    .select()
    .from(userSettingsTable)
    .where(eq(userSettingsTable.userId, GLOBAL_SETTINGS_USER_ID))
    .limit(1);
  const userKey = settings?.geminiApiKey?.trim();
  if (!userKey) return null;

  if (userKeyClientCache && userKeyClientCache.key === userKey) return userKeyClientCache.client;
  const client = new GoogleGenAI({ apiKey: userKey });
  userKeyClientCache = { key: userKey, client };
  return client;
}

const TEXT_MODEL = "gemini-2.5-flash";

function cleanJson(raw: string): string {
  return raw.trim().replace(/^```json\s*|```\s*$/g, "");
}

/** Plain-text or JSON chat completion. Mirrors the OpenAI chat.completions shape used elsewhere in this app. */
export async function geminiGenerateText(
  systemPrompt: string,
  userText: string,
  opts: { json?: boolean; maxOutputTokens?: number } = {}
): Promise<string> {
  const gemini = await getGemini();
  if (!gemini) throw new Error("Gemini not configured");

  const response = await gemini.models.generateContent({
    model: TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: userText }] }],
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: opts.maxOutputTokens ?? 2048,
      ...(opts.json ? { responseMimeType: "application/json" } : {}),
    },
  });

  const text = response.text ?? "";
  return opts.json ? cleanJson(text) : text;
}

/** Transcribes spoken audio to text using Gemini's native audio understanding. */
export async function geminiTranscribeAudio(
  buffer: Buffer,
  mimeType: string,
  language?: string
): Promise<string> {
  const gemini = await getGemini();
  if (!gemini) throw new Error("Gemini not configured");

  const prompt = language
    ? `Transcribe the spoken ${language === "sv" ? "Swedish" : language} audio verbatim. Reply with only the transcribed text, no commentary, no quotes.`
    : "Transcribe the spoken audio verbatim. Reply with only the transcribed text, no commentary, no quotes.";

  const response = await gemini.models.generateContent({
    model: TEXT_MODEL,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }, { inlineData: { mimeType, data: buffer.toString("base64") } }],
      },
    ],
    config: { maxOutputTokens: 1024 },
  });

  return (response.text ?? "").trim();
}
