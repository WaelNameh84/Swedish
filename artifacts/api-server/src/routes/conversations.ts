import { Router } from "express";
import { db } from "@workspace/db";
import { conversationsTable, conversationLinesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/conversations", async (req, res) => {
  try {
    const rows = await db.select().from(conversationsTable);
    res.json(
      rows.map((row) => ({
        id: row.id,
        title: row.title,
        titleAr: row.titleAr,
        scenario: row.scenario,
        category: row.category,
        difficulty: row.difficulty,
      }))
    );
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
    if (!conv) return res.status(404).json({ error: "Conversation not found" });

    const lines = await db
      .select()
      .from(conversationLinesTable)
      .where(eq(conversationLinesTable.conversationId, id))
      .orderBy(asc(conversationLinesTable.orderIndex));

    res.json({
      id: conv.id,
      title: conv.title,
      titleAr: conv.titleAr,
      scenario: conv.scenario,
      category: conv.category,
      difficulty: conv.difficulty,
      lines: lines.map((l) => ({
        id: l.id,
        orderIndex: l.orderIndex,
        speaker: l.speaker,
        speakerName: l.speakerName,
        textSv: l.textSv,
        textAr: l.textAr,
        phonetic: l.phonetic ?? null,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
