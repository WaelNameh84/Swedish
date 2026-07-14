import { Router } from "express";
import { db } from "@workspace/db";
import { conversationsTable, conversationLinesTable } from "@workspace/db";
import { eq, asc, ilike, or } from "drizzle-orm";

const router = Router();

router.get("/conversations", async (req, res) => {
  try {
    const q = req.query.q as string | undefined;
    let query = db.select().from(conversationsTable);
    if (q?.trim()) {
      query = query.where(
        or(
          ilike(conversationsTable.titleAr, `%${q}%`),
          ilike(conversationsTable.title, `%${q}%`),
          ilike(conversationsTable.category, `%${q}%`)
        )!
      ) as typeof query;
    }
    const rows = await query.orderBy(asc(conversationsTable.id));
    res.json(rows.map(fmt));
  } catch (err) {
    req.log.error({ err }, "Failed to get conversations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [conv] = await db.select().from(conversationsTable).where(eq(conversationsTable.id, id));
    if (!conv) return res.status(404).json({ error: "Not found" });

    const lines = await db
      .select()
      .from(conversationLinesTable)
      .where(eq(conversationLinesTable.conversationId, id))
      .orderBy(asc(conversationLinesTable.orderIndex));

    res.json({
      ...fmt(conv),
      lines: lines.map(l => ({
        id: l.id,
        orderIndex: l.orderIndex,
        speaker: l.speaker,
        speakerName: l.speakerName,
        speakerRole: l.speakerRole ?? null,
        textSv: l.textSv,
        textAr: l.textAr,
        phonetic: l.phonetic ?? null,
        noteAr: l.noteAr ?? null,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

function fmt(row: typeof conversationsTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    titleAr: row.titleAr,
    scenario: row.scenario,
    category: row.category,
    difficulty: row.difficulty,
    emoji: row.emoji ?? "💬",
    imageUrl: row.imageUrl ?? null,
    durationMinutes: row.durationMinutes ?? 10,
    vocabList: row.vocabList ?? [],
    grammarTips: row.grammarTips ?? [],
    culturalNotes: row.culturalNotes ?? null,
    usefulPhrases: row.usefulPhrases ?? [],
    quiz: row.quiz ?? [],
  };
}

export default router;
