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

// Fields intentionally excluded from this public endpoint: geminiApiKey,
// openaiApiKey, imageGenApiKey, translationApiKey. Those are AI provider
// keys and are only readable/writable by an authenticated admin via
// /admin/keys (see routes/adminKeys.ts) — regular users must never see or
// set them here.

// GET /settings/user
router.get("/settings/user", async (_req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const { geminiApiKey, openaiApiKey, imageGenApiKey, translationApiKey, ...safeSettings } = settings;
    res.json(safeSettings);
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

    const { geminiApiKey, openaiApiKey, imageGenApiKey, translationApiKey, ...safeUpdated } = updated;
    res.json(safeUpdated);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
