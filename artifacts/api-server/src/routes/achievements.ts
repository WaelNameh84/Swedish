import { Router } from "express";
import { db } from "@workspace/db";
import { userProgressTable, wordsTable, examAttemptsTable, pronunciationAttemptsTable, lessonsTable } from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";
import { computeAchievements } from "../lib/achievements";
import { requireAuth } from "../middlewares/auth";
import { getOrCreateUserProgress } from "../lib/userProvisioning";

const router = Router();

router.get("/achievements", requireAuth, async (req, res) => {
  try {
    const userId = req.userId!;
    const [progress, wordRows, lessonRows, examAgg, pronAgg, examAll] = await Promise.all([
      getOrCreateUserProgress(userId),
      db.select({ count: count() }).from(wordsTable).where(eq(wordsTable.isNew, false)),
      db.select({ count: count() }).from(lessonsTable).where(eq(lessonsTable.completionPercentage, 100)),
      db
        .select({ avg: sql<number>`coalesce(avg(${examAttemptsTable.percentage}), 0)`, total: sql<number>`count(*)` })
        .from(examAttemptsTable)
        .where(eq(examAttemptsTable.userId, userId)),
      db
        .select({ avg: sql<number>`coalesce(avg(${pronunciationAttemptsTable.score}), 0)`, total: sql<number>`count(*)` })
        .from(pronunciationAttemptsTable)
        .where(eq(pronunciationAttemptsTable.userId, userId)),
      db.select().from(examAttemptsTable).where(eq(examAttemptsTable.userId, userId)),
    ]);

    const certifiedLevels = new Set<string>();
    for (const row of examAll) {
      if (row.examType === "level" && row.passed && row.level) certifiedLevels.add(row.level);
    }

    const achievements = computeAchievements({
      lessonsCompleted: lessonRows[0]?.count ?? 0,
      wordsLearned: wordRows[0]?.count ?? 0,
      streakDays: progress?.streakDays ?? 0,
      examTotalAttempts: Number(examAgg[0]?.total ?? 0),
      examAvgPercentage: Math.round(Number(examAgg[0]?.avg ?? 0)),
      certifiedLevelsCount: certifiedLevels.size,
      pronunciationAvgScore: Math.round(Number(pronAgg[0]?.avg ?? 0)),
      pronunciationTotalAttempts: Number(pronAgg[0]?.total ?? 0),
    });

    res.json({
      achievements,
      unlockedCount: achievements.filter((a) => a.unlocked).length,
      totalCount: achievements.length,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to build achievements");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
