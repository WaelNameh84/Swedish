import { Router } from "express";
import { db } from "@workspace/db";
import { userSettingsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

async function getOrCreateSettings() {
  const existing = await db.select().from(userSettingsTable).limit(1);
  if (existing.length > 0) return existing[0];
  const [created] = await db.insert(userSettingsTable).values({}).returning();
  return created;
}

// GET /settings/user
router.get("/settings/user", async (_req, res) => {
  try {
    const settings = await getOrCreateSettings();
    // mask API keys before sending
    res.json({
      ...settings,
      geminiApiKey: settings.geminiApiKey ? "••••••••" : "",
      openaiApiKey: settings.openaiApiKey ? "••••••••" : "",
      imageGenApiKey: settings.imageGenApiKey ? "••••••••" : "",
      translationApiKey: settings.translationApiKey ? "••••••••" : "",
      // expose whether keys are set
      hasGeminiKey: Boolean(settings.geminiApiKey),
      hasOpenaiKey: Boolean(settings.openaiApiKey),
      hasImageGenKey: Boolean(settings.imageGenApiKey),
      hasTranslationKey: Boolean(settings.translationApiKey),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// PATCH /settings/user — partial update
router.patch("/settings/user", async (req, res) => {
  try {
    const existing = await getOrCreateSettings();
    const allowed = [
      "appLanguage", "darkMode",
      "notificationsEnabled", "dailyReminderEnabled", "reminderTime",
      "geminiApiKey", "openaiApiKey", "imageGenApiKey", "translationApiKey",
      "audioEnabled", "audioSpeed", "audioVoice",
      "readingSpeed",
      "dataCollectionEnabled", "analyticsEnabled", "twoFactorEnabled",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    const [updated] = await db.update(userSettingsTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(sql`id = ${existing.id}`)
      .returning();

    res.json({
      ...updated,
      geminiApiKey: updated.geminiApiKey ? "••••••••" : "",
      openaiApiKey: updated.openaiApiKey ? "••••••••" : "",
      imageGenApiKey: updated.imageGenApiKey ? "••••••••" : "",
      translationApiKey: updated.translationApiKey ? "••••••••" : "",
      hasGeminiKey: Boolean(updated.geminiApiKey),
      hasOpenaiKey: Boolean(updated.openaiApiKey),
      hasImageGenKey: Boolean(updated.imageGenApiKey),
      hasTranslationKey: Boolean(updated.translationApiKey),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
