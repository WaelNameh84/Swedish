import { Router } from "express";
import { db } from "@workspace/db";
import {
  userProgressTable,
  wordsTable,
  examAttemptsTable,
  pronunciationAttemptsTable,
  dictionaryTable,
} from "@workspace/db";
import { eq, count, sql, desc, gte } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { getOrCreateUserProgress } from "../lib/userProvisioning";

const router = Router();
// Scoped to this router's own path prefix — this router is mounted at the
// shared root, so an unscoped router.use(requireAuth) would intercept every
// request that flows through the shared router chain (including unrelated
// public routes like /webauthn/login-options mounted later).
router.use("/statistics", requireAuth);

function pronunciationLevelLabel(avg: number, total: number): string {
  if (total === 0) return "لم يبدأ التقييم بعد";
  if (avg >= 85) return "متقدم";
  if (avg >= 65) return "متوسط";
  return "مبتدئ";
}

// GET /statistics/overview
router.get("/statistics/overview", async (req, res) => {
  try {
    const userId = req.userId!;
    const [progress, wordRows, examAgg, pronAgg] = await Promise.all([
      getOrCreateUserProgress(userId),
      db.select({ count: count() }).from(wordsTable).where(eq(wordsTable.isNew, false)),
      db
        .select({
          avg: sql<number>`coalesce(avg(${examAttemptsTable.percentage}), 0)`,
          total: sql<number>`count(*)`,
        })
        .from(examAttemptsTable)
        .where(eq(examAttemptsTable.userId, userId)),
      db
        .select({
          avg: sql<number>`coalesce(avg(${pronunciationAttemptsTable.score}), 0)`,
          total: sql<number>`count(*)`,
        })
        .from(pronunciationAttemptsTable)
        .where(eq(pronunciationAttemptsTable.userId, userId)),
    ]);

    const wordsLearned = wordRows[0]?.count ?? 0;
    const examAvg = Math.round(Number(examAgg[0]?.avg ?? 0));
    const examTotal = Number(examAgg[0]?.total ?? 0);
    const pronAvg = Math.round(Number(pronAgg[0]?.avg ?? 0));
    const pronTotal = Number(pronAgg[0]?.total ?? 0);

    res.json({
      totalHours: progress ? Math.round((progress.totalMinutesLearned / 60) * 10) / 10 : 0,
      totalMinutes: progress?.totalMinutesLearned ?? 0,
      totalWords: wordsLearned,
      successRate: examTotal > 0 ? examAvg : null,
      pronunciationLevel: pronunciationLevelLabel(pronAvg, pronTotal),
      pronunciationAvgScore: pronTotal > 0 ? pronAvg : null,
      pronunciationTotalAttempts: pronTotal,
      streakDays: progress?.streakDays ?? 0,
      totalDaysLearned: progress?.totalDaysLearned ?? 0,
      xpPoints: progress?.xpPoints ?? 0,
      level: progress?.level ?? 1,
      levelName: progress?.levelName ?? "",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to build statistics overview");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /statistics/charts
router.get("/statistics/charts", async (req, res) => {
  try {
    const userId = req.userId!;
    const [examRows, pronRows, levelRows] = await Promise.all([
      db.select().from(examAttemptsTable).where(eq(examAttemptsTable.userId, userId)).orderBy(desc(examAttemptsTable.createdAt)).limit(60),
      db.select().from(pronunciationAttemptsTable).where(eq(pronunciationAttemptsTable.userId, userId)).orderBy(desc(pronunciationAttemptsTable.createdAt)).limit(60),
      db
        .select({ level: dictionaryTable.level, count: count() })
        .from(dictionaryTable)
        .groupBy(dictionaryTable.level),
    ]);

    const examTimeline = examRows
      .slice()
      .reverse()
      .map((r) => ({
        date: r.createdAt ? r.createdAt.toISOString().slice(0, 10) : "",
        percentage: r.percentage,
        examType: r.examType,
      }));

    const pronunciationTimeline = pronRows
      .slice()
      .reverse()
      .map((r) => ({
        date: r.createdAt ? r.createdAt.toISOString().slice(0, 10) : "",
        score: r.score,
      }));

    const wordsByLevel = levelRows
      .map((r) => ({ level: r.level, count: r.count }))
      .sort((a, b) => a.level.localeCompare(b.level));

    // Activity calendar: last 30 days, count of any real activity (exam or pronunciation attempts) per day
    const days: { date: string; count: number }[] = [];
    const today = new Date();
    const activityMap = new Map<string, number>();
    for (const r of examRows) {
      if (!r.createdAt) continue;
      const key = r.createdAt.toISOString().slice(0, 10);
      activityMap.set(key, (activityMap.get(key) ?? 0) + 1);
    }
    for (const r of pronRows) {
      if (!r.createdAt) continue;
      const key = r.createdAt.toISOString().slice(0, 10);
      activityMap.set(key, (activityMap.get(key) ?? 0) + 1);
    }
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, count: activityMap.get(key) ?? 0 });
    }

    res.json({ examTimeline, pronunciationTimeline, wordsByLevel, activityCalendar: days });
  } catch (err) {
    req.log.error({ err }, "Failed to build statistics charts");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /statistics/comparison
router.get("/statistics/comparison", async (req, res) => {
  try {
    const userId = req.userId!;
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [allExams, allPron] = await Promise.all([
      db.select().from(examAttemptsTable).where(eq(examAttemptsTable.userId, userId)),
      db.select().from(pronunciationAttemptsTable).where(eq(pronunciationAttemptsTable.userId, userId)),
    ]);

    function bucket<T extends { createdAt: Date | null }>(rows: T[], start: Date, end?: Date) {
      return rows.filter((r) => {
        if (!r.createdAt) return false;
        const t = r.createdAt.getTime();
        return t >= start.getTime() && (!end || t < end.getTime());
      });
    }

    const examsThisWeek = bucket(allExams, startOfThisWeek);
    const examsLastWeek = bucket(allExams, startOfLastWeek, startOfThisWeek);
    const examsThisMonth = bucket(allExams, startOfThisMonth);
    const examsLastMonth = bucket(allExams, startOfLastMonth, startOfThisMonth);

    const pronThisWeek = bucket(allPron, startOfThisWeek);
    const pronLastWeek = bucket(allPron, startOfLastWeek, startOfThisWeek);

    function avg(rows: { percentage?: number; score?: number }[], key: "percentage" | "score") {
      if (rows.length === 0) return 0;
      return Math.round(rows.reduce((s, r) => s + (r[key] ?? 0), 0) / rows.length);
    }

    res.json({
      exams: {
        thisWeek: { count: examsThisWeek.length, avgPercentage: avg(examsThisWeek, "percentage") },
        lastWeek: { count: examsLastWeek.length, avgPercentage: avg(examsLastWeek, "percentage") },
        thisMonth: { count: examsThisMonth.length, avgPercentage: avg(examsThisMonth, "percentage") },
        lastMonth: { count: examsLastMonth.length, avgPercentage: avg(examsLastMonth, "percentage") },
      },
      pronunciation: {
        thisWeek: { count: pronThisWeek.length, avgScore: avg(pronThisWeek, "score") },
        lastWeek: { count: pronLastWeek.length, avgScore: avg(pronLastWeek, "score") },
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to build statistics comparison");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
