import { Router } from "express";
import { db } from "@workspace/db";
import { dictionaryTable } from "@workspace/db";
import { ilike, eq, or, sql, asc } from "drizzle-orm";

const router = Router();

// GET /dictionary/categories
router.get("/dictionary/categories", async (req, res) => {
  try {
    const rows = await db
      .selectDistinct({ category: dictionaryTable.category })
      .from(dictionaryTable)
      .orderBy(asc(dictionaryTable.category));
    res.json(rows.map((r) => r.category));
  } catch (err) {
    req.log.error({ err }, "Failed to get dictionary categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /dictionary/random
router.get("/dictionary/random", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(dictionaryTable)
      .orderBy(sql`random()`)
      .limit(1);
    if (!rows[0]) return res.status(404).json({ error: "No words found" });
    res.json(formatWord(rows[0]));
  } catch (err) {
    req.log.error({ err }, "Failed to get random word");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /dictionary/search?q=&level=&category=&limit=&offset=
router.get("/dictionary/search", async (req, res) => {
  try {
    const q = (req.query.q as string) || "";
    const level = req.query.level as string | undefined;
    const category = req.query.category as string | undefined;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Number(req.query.offset) || 0;

    const conditions = [];
    if (q.trim()) {
      conditions.push(
        or(
          ilike(dictionaryTable.word, `%${q}%`),
          ilike(dictionaryTable.translation, `%${q}%`),
          ilike(dictionaryTable.phonetic, `%${q}%`)
        )!
      );
    }
    if (level) conditions.push(eq(dictionaryTable.level, level));
    if (category) conditions.push(eq(dictionaryTable.category, category));

    let query = db.select().from(dictionaryTable);
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}`) as typeof query;
    }

    const rows = await query
      .orderBy(asc(dictionaryTable.word))
      .limit(limit)
      .offset(offset);

    // Count total
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(dictionaryTable);
    if (conditions.length > 0) {
      countQuery = countQuery.where(conditions.length === 1 ? conditions[0] : sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}`) as typeof countQuery;
    }
    const [{ count }] = await countQuery;

    res.json({
      words: rows.map(formatWord),
      total: Number(count),
      offset,
      limit,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to search dictionary");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /dictionary/word/:id
router.get("/dictionary/word/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [row] = await db
      .select()
      .from(dictionaryTable)
      .where(eq(dictionaryTable.id, id));

    if (!row) return res.status(404).json({ error: "Word not found" });
    res.json(formatWord(row));
  } catch (err) {
    req.log.error({ err }, "Failed to get word");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatWord(row: typeof dictionaryTable.$inferSelect) {
  return {
    id: row.id,
    word: row.word,
    translation: row.translation,
    phonetic: row.phonetic,
    partOfSpeech: row.partOfSpeech,
    gender: row.gender,
    plural: row.plural,
    level: row.level,
    category: row.category,
    imageUrl: row.imageUrl,
    audioUrl: row.audioUrl,
    examples: row.examples ?? [],
    synonyms: row.synonyms ?? [],
    antonyms: row.antonyms ?? [],
    conjugations: row.conjugations ?? null,
  };
}

export default router;
