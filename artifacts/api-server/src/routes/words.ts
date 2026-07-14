import { Router } from "express";
import { db } from "@workspace/db";
import { wordsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router = Router();

router.get("/words/new", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(wordsTable)
      .where(eq(wordsTable.isNew, true))
      .orderBy(desc(wordsTable.learnedAt))
      .limit(10);

    res.json(
      rows.map((row) => ({
        id: row.id,
        word: row.word,
        translation: row.translation,
        phonetic: row.phonetic,
        category: row.category,
        isNew: row.isNew,
        learnedAt: row.learnedAt ? row.learnedAt.toISOString() : null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get new words");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/words/daily", async (req, res) => {
  try {
    // Rotate 5 words per day based on day of year
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const allWords = await db.select().from(wordsTable);
    if (allWords.length === 0) return res.json([]);

    // Pick 5 words rotating daily
    const startIdx = (dayOfYear * 5) % allWords.length;
    const dailyWords = [];
    for (let i = 0; i < 5; i++) {
      dailyWords.push(allWords[(startIdx + i) % allWords.length]);
    }

    res.json(
      dailyWords.map((row) => ({
        id: row.id,
        word: row.word,
        translation: row.translation,
        phonetic: row.phonetic,
        category: row.category,
        isNew: row.isNew,
        learnedAt: row.learnedAt ? row.learnedAt.toISOString() : null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get daily words");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
