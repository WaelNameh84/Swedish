import OpenAI from "openai";
import { db } from "@workspace/db";
import { userSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// AI provider keys entered by the admin are a single app-wide row, not tied
// to any one learner account, so they use a fixed sentinel userId rather
// than a real Clerk id. Shared with routes/adminKeys.ts, which writes here.
export const GLOBAL_SETTINGS_USER_ID = "__admin_global__";

let envClient: OpenAI | null = null;
let envAttempted = false;

function getEnvClient(): OpenAI | null {
  if (!envAttempted) {
    envAttempted = true;
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      envClient = new OpenAI({ apiKey });
    }
  }
  return envClient;
}

let userKeyClientCache: { key: string; client: OpenAI } | null = null;

/**
 * Lazily builds the OpenAI client. Prefers the platform-provided
 * OPENAI_API_KEY env var when present; otherwise falls back to the user's
 * own key entered via Settings (stored on user_settings.openai_api_key) so
 * AI features work for users who bring their own key without an env var.
 */
export async function getOpenAI(): Promise<OpenAI | null> {
  const envClient = getEnvClient();
  if (envClient) return envClient;

  const [settings] = await db
    .select()
    .from(userSettingsTable)
    .where(eq(userSettingsTable.userId, GLOBAL_SETTINGS_USER_ID))
    .limit(1);
  const userKey = settings?.openaiApiKey?.trim();
  if (!userKey) return null;

  if (userKeyClientCache && userKeyClientCache.key === userKey) return userKeyClientCache.client;
  const client = new OpenAI({ apiKey: userKey });
  userKeyClientCache = { key: userKey, client };
  return client;
}

export async function isAIAvailable(): Promise<boolean> {
  return !!(await getOpenAI());
}

export const AI_NOT_CONFIGURED_MESSAGE =
  "ميزة الذكاء الاصطناعي غير مفعّلة بعد. أضف مفتاح OpenAI الخاص بك لتفعيلها.";
