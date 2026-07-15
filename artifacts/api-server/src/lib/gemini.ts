import { GoogleGenAI } from "@google/genai";
import { db } from "@workspace/db";
import { userSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { GLOBAL_SETTINGS_USER_ID } from "./openai";

// Resolved manually (instead of importing ffmpeg-static's default export)
// because esbuild bundling rewrites __dirname, which breaks that package's
// own internal path.join(__dirname, "ffmpeg") lookup. require.resolve here
// runs at actual runtime against the real node_modules on disk, so it always
// finds the binary regardless of how the calling module was bundled.
function resolveFfmpegBinaryPath(): string | null {
  try {
    const require = createRequire(import.meta.url);
    const pkgPath = require.resolve("ffmpeg-static/package.json");
    const exe = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
    return path.join(path.dirname(pkgPath), exe);
  } catch {
    return null;
  }
}

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

// Gemini's audio understanding only accepts a fixed set of container/codec
// types (wav, mp3, aiff, aac, ogg, flac) — see
// https://ai.google.dev/gemini-api/docs/generate-content/audio#supported-formats.
// Browsers record audio/webm (opus), which Gemini rejects, so every clip is
// transcoded to WAV via a bundled ffmpeg binary (no system ffmpeg install
// required — matches the existing tesseract.js WASM/no-native-deps pattern)
// before it's sent to Gemini.
function transcodeToWav(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const ffmpegPath = resolveFfmpegBinaryPath();
    if (!ffmpegPath) {
      reject(new Error("ffmpeg-static binary not found"));
      return;
    }
    const proc = spawn(ffmpegPath, [
      "-i", "pipe:0",
      "-f", "wav",
      "-ar", "16000",
      "-ac", "1",
      "pipe:1",
    ]);
    const chunks: Buffer[] = [];
    let stderr = "";
    proc.stdout.on("data", (chunk) => chunks.push(chunk));
    proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-500)}`));
    });
    proc.stdin.on("error", () => {
      // Ignore EPIPE if ffmpeg exits before we finish writing.
    });
    proc.stdin.end(buffer);
  });
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

  const wavBuffer = await transcodeToWav(buffer);

  const response = await gemini.models.generateContent({
    model: TEXT_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "audio/wav", data: wavBuffer.toString("base64") } },
        ],
      },
    ],
    config: { maxOutputTokens: 1024 },
  });

  return (response.text ?? "").trim();
}
