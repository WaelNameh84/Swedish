import OpenAI from "openai";

let client: OpenAI | null = null;
let attempted = false;

/** Lazily builds the OpenAI client from the user's own OPENAI_API_KEY. */
export function getOpenAI(): OpenAI | null {
  if (!attempted) {
    attempted = true;
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      client = new OpenAI({ apiKey });
    }
  }
  return client;
}

export function isAIAvailable(): boolean {
  return !!getOpenAI();
}

export const AI_NOT_CONFIGURED_MESSAGE =
  "ميزة الذكاء الاصطناعي غير مفعّلة بعد. أضف مفتاح OpenAI الخاص بك لتفعيلها.";
