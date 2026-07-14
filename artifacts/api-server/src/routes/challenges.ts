import { Router } from "express";
import { db } from "@workspace/db";
import { dailyChallengesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

// Seed templates — used when no challenges exist yet
const CHALLENGE_TEMPLATES = [
  { title: "تعلم 5 كلمات جديدة", description: "احفظ 5 كلمات سويدية جديدة اليوم", type: "vocabulary", xpReward: 20 },
  { title: "استمع وكرر", description: "استمع إلى 3 جمل سويدية وكررها بصوت عالٍ", type: "listening", xpReward: 15 },
  { title: "تحدث لمدة دقيقتين", description: "تحدث بالسويدية لمدة دقيقتين متواصلتين", type: "speaking", xpReward: 25 },
  { title: "قواعد اللغة", description: "أكمل تمرين تصريف الأفعال", type: "grammar", xpReward: 30 },
  { title: "اقرأ فقرة", description: "اقرأ فقرة كاملة بالسويدية بصوت عالٍ", type: "reading", xpReward: 20 },
];

/** Start of tomorrow midnight — challenges expire when tomorrow begins */
function startOfTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Start of today midnight */
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

router.get("/challenges/daily", async (req, res) => {
  try {
    const now = new Date();
    const todayStart = startOfToday();
    const rows = await db.select().from(dailyChallengesTable).limit(10);

    // Need reset when:
    //  1. No rows at all (fresh DB)
    //  2. All rows have expiresAt before today's midnight (yesterday's challenges)
    //  3. expiresAt is null on any row
    const needsReset =
      rows.length === 0 ||
      rows.every((r) => !r.expiresAt || r.expiresAt <= todayStart);

    if (needsReset) {
      if (rows.length === 0) {
        await db.insert(dailyChallengesTable).values(
          CHALLENGE_TEMPLATES.map((t) => ({
            ...t,
            isCompleted: false,
            expiresAt: startOfTomorrow(),
          }))
        );
      } else {
        await db
          .update(dailyChallengesTable)
          .set({ isCompleted: false, expiresAt: startOfTomorrow() });
      }
    }

    const fresh = await db.select().from(dailyChallengesTable).limit(5);
    res.json(
      fresh.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        xpReward: row.xpReward,
        isCompleted: row.isCompleted,
        expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get daily challenges");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/challenges/:id/complete", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid challenge ID" });
    }

    const updated = await db
      .update(dailyChallengesTable)
      .set({ isCompleted: true })
      .where(eq(dailyChallengesTable.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const row = updated[0];
    res.json({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      xpReward: row.xpReward,
      isCompleted: row.isCompleted,
      expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to complete challenge");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
