import { Router } from "express";
import { db } from "@workspace/db";
import {
  userProgressTable,
  lessonsTable,
  wordsTable,
  dictionaryTable,
  verbsTable,
  conversationsTable,
  examAttemptsTable,
  pronunciationAttemptsTable,
  chatMessagesTable,
  languagesTable,
  grammarTable,
  certificatesTable,
  aiHistoryTable,
  favoritesTable,
  notificationsTable,
} from "@workspace/db";
import { count, sql, desc } from "drizzle-orm";

const router = Router();

// GET /admin/overview — dashboard stats
router.get("/admin/overview", async (_req, res) => {
  try {
    const [
      usersCount,
      lessonsCount,
      wordsCount,
      dictCount,
      verbsCount,
      convsCount,
      examsCount,
      aiHistoryCount,
      notifCount,
      certsCount,
    ] = await Promise.all([
      db.select({ count: count() }).from(userProgressTable),
      db.select({ count: count() }).from(lessonsTable),
      db.select({ count: count() }).from(wordsTable),
      db.select({ count: count() }).from(dictionaryTable),
      db.select({ count: count() }).from(verbsTable),
      db.select({ count: count() }).from(conversationsTable),
      db.select({ count: count() }).from(examAttemptsTable),
      db.select({ count: count() }).from(aiHistoryTable),
      db.select({ count: count() }).from(notificationsTable),
      db.select({ count: count() }).from(certificatesTable),
    ]);

    res.json({
      users: Number(usersCount[0]?.count ?? 0),
      lessons: Number(lessonsCount[0]?.count ?? 0),
      words: Number(wordsCount[0]?.count ?? 0) + Number(dictCount[0]?.count ?? 0),
      verbs: Number(verbsCount[0]?.count ?? 0),
      conversations: Number(convsCount[0]?.count ?? 0),
      exams: Number(examsCount[0]?.count ?? 0),
      aiHistory: Number(aiHistoryCount[0]?.count ?? 0),
      notifications: Number(notifCount[0]?.count ?? 0),
      certificates: Number(certsCount[0]?.count ?? 0),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/users — user list
router.get("/admin/users", async (_req, res) => {
  try {
    const users = await db.select().from(userProgressTable).orderBy(desc(userProgressTable.updatedAt)).limit(50);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/lessons — lessons list
router.get("/admin/lessons", async (_req, res) => {
  try {
    const lessons = await db.select().from(lessonsTable).orderBy(lessonsTable.id).limit(100);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/words — words list
router.get("/admin/words", async (_req, res) => {
  try {
    const [words, dict] = await Promise.all([
      db.select().from(wordsTable).orderBy(desc(wordsTable.createdAt)).limit(50),
      db.select().from(dictionaryTable).orderBy(desc(dictionaryTable.createdAt)).limit(50),
    ]);
    res.json({ words, dictionary: dict });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/conversations — conversations list
router.get("/admin/conversations", async (_req, res) => {
  try {
    const convs = await db.select().from(conversationsTable).orderBy(conversationsTable.id).limit(50);
    res.json(convs);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/exams — exam attempts
router.get("/admin/exams", async (_req, res) => {
  try {
    const exams = await db.select().from(examAttemptsTable).orderBy(desc(examAttemptsTable.completedAt)).limit(50);
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/ai-history — AI interactions history
router.get("/admin/ai-history", async (_req, res) => {
  try {
    const history = await db.select().from(aiHistoryTable).orderBy(desc(aiHistoryTable.createdAt)).limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/reports — aggregated performance report
router.get("/admin/reports", async (_req, res) => {
  try {
    const [examStats, pronStats, progress] = await Promise.all([
      db.select({
        avgScore: sql<number>`coalesce(avg(${examAttemptsTable.percentage}), 0)`,
        total: count(),
        examType: examAttemptsTable.examType,
      }).from(examAttemptsTable).groupBy(examAttemptsTable.examType),
      db.select({
        avgScore: sql<number>`coalesce(avg(${pronunciationAttemptsTable.score}), 0)`,
        total: count(),
      }).from(pronunciationAttemptsTable),
      db.select().from(userProgressTable).limit(1),
    ]);

    res.json({
      examsByType: examStats,
      pronunciationAvg: Number(pronStats[0]?.avgScore ?? 0),
      pronunciationTotal: Number(pronStats[0]?.total ?? 0),
      userProgress: progress[0] ?? null,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/languages — languages list
router.get("/admin/languages", async (_req, res) => {
  try {
    const langs = await db.select().from(languagesTable).orderBy(languagesTable.name);
    res.json(langs);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/backup — export all data as JSON
router.get("/admin/backup", async (_req, res) => {
  try {
    const [users, lessons, words, dict, verbs, convs, exams, pron, certs] = await Promise.all([
      db.select().from(userProgressTable),
      db.select().from(lessonsTable),
      db.select().from(wordsTable),
      db.select().from(dictionaryTable),
      db.select().from(verbsTable),
      db.select().from(conversationsTable),
      db.select().from(examAttemptsTable),
      db.select().from(pronunciationAttemptsTable),
      db.select().from(certificatesTable),
    ]);

    res.json({
      exportedAt: new Date().toISOString(),
      version: "1.0",
      data: { users, lessons, words, dictionary: dict, verbs, conversations: convs, exams, pronunciationAttempts: pron, certificates: certs },
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /admin/notifications — notifications list
router.get("/admin/notifications", async (_req, res) => {
  try {
    const notifs = await db.select().from(notificationsTable).orderBy(desc(notificationsTable.createdAt)).limit(50);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /admin/notifications — create notification
router.post("/admin/notifications", async (req, res) => {
  try {
    const { title, body, type = "info" } = req.body as { title: string; body: string; type?: string };
    if (!title || !body) return res.status(400).json({ error: "title and body required" });
    const [notif] = await db.insert(notificationsTable).values({ title, body, type }).returning();
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
