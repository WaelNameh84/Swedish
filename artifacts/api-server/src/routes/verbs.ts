import { Router } from "express";
import { db } from "@workspace/db";
import { verbsTable } from "@workspace/db";
import { ilike, eq, or, sql, asc } from "drizzle-orm";

const router = Router();

const fmt = (row: typeof verbsTable.$inferSelect) => ({
  id: row.id,
  infinitiv: row.infinitiv,
  presens: row.presens,
  preteritum: row.preteritum,
  supinum: row.supinum,
  imperativ: row.imperativ,
  futurum: row.futurum,
  presensParticip: row.presensParticip,
  perfektParticip: row.perfektParticip,
  passivPresens: row.passivPresens,
  passivPreteritum: row.passivPreteritum,
  translation: row.translation,
  phonetic: row.phonetic,
  group: row.group,
  level: row.level,
  category: row.category,
  imageUrl: row.imageUrl,
  notes: row.notes,
  examples: row.examples ?? [],
  quizSentences: row.quizSentences ?? [],
});

// GET /verbs/search?q=&level=&group=&category=&limit=&offset=
router.get("/verbs/search", async (req, res) => {
  try {
    const q = (req.query.q as string) || "";
    const level = req.query.level as string | undefined;
    const group = req.query.group as string | undefined;
    const category = req.query.category as string | undefined;
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const offset = Number(req.query.offset) || 0;

    const conditions: any[] = [];
    if (q.trim()) {
      conditions.push(
        or(
          ilike(verbsTable.infinitiv, `%${q}%`),
          ilike(verbsTable.translation, `%${q}%`),
          ilike(verbsTable.presens, `%${q}%`)
        )!
      );
    }
    if (level) conditions.push(eq(verbsTable.level, level));
    if (group) conditions.push(eq(verbsTable.group, group));
    if (category) conditions.push(eq(verbsTable.category, category));

    const whereClause =
      conditions.length === 0
        ? undefined
        : conditions.length === 1
          ? conditions[0]
          : sql`${conditions.reduce((a: any, b: any) => sql`${a} AND ${b}`)}`;

    const rows = await db
      .select()
      .from(verbsTable)
      .$dynamic()
      .where(whereClause as any)
      .orderBy(asc(verbsTable.infinitiv))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(verbsTable)
      .$dynamic()
      .where(whereClause as any);

    res.json({ verbs: rows.map(fmt), total: Number(count), offset, limit });
  } catch (err) {
    req.log.error({ err }, "Failed to search verbs");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /verbs/groups
router.get("/verbs/groups", async (_req, res) => {
  try {
    const rows = await db
      .selectDistinct({ group: verbsTable.group })
      .from(verbsTable)
      .orderBy(asc(verbsTable.group));
    res.json(rows.map((r) => r.group));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /verbs/categories
router.get("/verbs/categories", async (_req, res) => {
  try {
    const rows = await db
      .selectDistinct({ category: verbsTable.category })
      .from(verbsTable)
      .orderBy(asc(verbsTable.category));
    res.json(rows.map((r) => r.category));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /verbs/quiz?level=&count=
router.get("/verbs/quiz", async (req, res) => {
  try {
    const level = req.query.level as string | undefined;
    const count = Math.min(Number(req.query.count) || 10, 20);

    const conditions: any[] = [];
    if (level) conditions.push(eq(verbsTable.level, level));

    const whereClause =
      conditions.length === 0 ? undefined : conditions[0];

    const rows = await db
      .select()
      .from(verbsTable)
      .$dynamic()
      .where(whereClause)
      .orderBy(sql`random()`)
      .limit(count);

    // Build quiz questions from quizSentences or generate from forms
    const questions = rows.flatMap((verb) => {
      if (verb.quizSentences && verb.quizSentences.length > 0) {
        return verb.quizSentences.slice(0, 2).map((q) => ({
          verbId: verb.id,
          infinitiv: verb.infinitiv,
          translation: verb.translation,
          form: q.form,
          sentence: q.sentence,
          answer: q.answer,
          sentenceTranslation: q.translation,
          distractors: [],
        }));
      }
      // Fallback: simple form question
      return [{
        verbId: verb.id,
        infinitiv: verb.infinitiv,
        translation: verb.translation,
        form: "presens",
        sentence: `Jag ___ varje dag. (${verb.infinitiv})`,
        answer: verb.presens,
        sentenceTranslation: `أنا ___ كل يوم.`,
        distractors: [],
      }];
    });

    res.json(questions.slice(0, count));
  } catch (err) {
    req.log.error({ err }, "Failed to get verb quiz");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /verbs/:id
router.get("/verbs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const [row] = await db.select().from(verbsTable).where(eq(verbsTable.id, id));
    if (!row) return res.status(404).json({ error: "Verb not found" });
    res.json(fmt(row));
  } catch (err) {
    req.log.error({ err }, "Failed to get verb" );
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
