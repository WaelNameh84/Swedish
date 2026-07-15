import { Router } from "express";
import OpenAI from "openai";
import { db } from "@workspace/db";
import { userSettingsTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";
import { GLOBAL_SETTINGS_USER_ID } from "../lib/openai";

const router = Router();

const KEY_FIELDS = ["openaiApiKey", "geminiApiKey", "imageGenApiKey", "translationApiKey"] as const;
type KeyField = (typeof KEY_FIELDS)[number];

async function getOrCreateSettings() {
  const existing = await db
    .select()
    .from(userSettingsTable)
    .where(eq(userSettingsTable.userId, GLOBAL_SETTINGS_USER_ID))
    .limit(1);
  if (existing.length > 0) return existing[0];
  const [created] = await db
    .insert(userSettingsTable)
    .values({ userId: GLOBAL_SETTINGS_USER_ID })
    .returning();
  return created;
}

function maskedKeys(settings: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const field of KEY_FIELDS) {
    const value = settings[field] as string | null | undefined;
    out[field] = value ? "••••••••" : "";
    out[`has${field[0].toUpperCase()}${field.slice(1, -"ApiKey".length)}Key`] = Boolean(value);
  }
  return out;
}

// All routes below require a valid admin session cookie.
router.use("/admin/keys", requireAdmin);

// GET /admin/keys
router.get("/admin/keys", async (_req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(maskedKeys(settings as unknown as Record<string, unknown>));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// PATCH /admin/keys — partial update of AI provider keys only
router.patch("/admin/keys", async (req, res) => {
  try {
    const existing = await getOrCreateSettings();
    const updates: Record<string, unknown> = {};
    for (const field of KEY_FIELDS) {
      if (field in req.body) updates[field] = req.body[field];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "لا توجد مفاتيح لتحديثها" });
    }

    const [updated] = await db
      .update(userSettingsTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(sql`id = ${existing.id}`)
      .returning();

    res.json(maskedKeys(updated as unknown as Record<string, unknown>));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /admin/keys/verify — live-checks a key against its provider before saving
router.post("/admin/keys/verify", async (req, res) => {
  const { provider, apiKey } = req.body as { provider?: KeyField; apiKey?: string };

  if (!apiKey?.trim()) {
    return res.status(400).json({ ok: false, message: "المفتاح فارغ" });
  }

  try {
    switch (provider) {
      case "openaiApiKey": {
        const client = new OpenAI({ apiKey });
        await client.models.list();
        return res.json({ ok: true, message: "المفتاح صالح ويعمل مع OpenAI" });
      }
      case "geminiApiKey": {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
        );
        if (!r.ok) {
          const body = await r.text().catch(() => "");
          return res.json({ ok: false, message: `رفض Gemini المفتاح (HTTP ${r.status})`, detail: body.slice(0, 200) });
        }
        return res.json({ ok: true, message: "المفتاح صالح ويعمل مع Gemini" });
      }
      case "imageGenApiKey":
      case "translationApiKey":
        // These fields aren't wired to a specific provider call in this app yet,
        // so we can't run a real live check — say so honestly instead of a fake pass.
        return res.json({
          ok: null,
          message: "لا يوجد تحقق تلقائي متاح لهذا النوع من المفتاح حالياً؛ سيتم حفظه كما هو دون فحص.",
        });
      default:
        return res.status(400).json({ ok: false, message: "نوع مفتاح غير معروف" });
    }
  } catch (err: any) {
    const status = err?.status || err?.response?.status;
    const message = status
      ? `رفض المزود المفتاح (HTTP ${status})`
      : "تعذر الاتصال بمزود الخدمة للتحقق من المفتاح";
    return res.json({ ok: false, message });
  }
});

export default router;
