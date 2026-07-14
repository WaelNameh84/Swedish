import { Router } from "express";
import { db } from "@workspace/db";
import {
  userProgressTable,
  wordsTable,
  examAttemptsTable,
  pronunciationAttemptsTable,
  lessonsTable,
} from "@workspace/db";
import { eq, count, sql, and } from "drizzle-orm";
import { computeAchievements } from "../lib/achievements";
import { requireAuth } from "../middlewares/auth";
import { getOrCreateUserProgress } from "../lib/userProvisioning";

const router = Router();

router.get("/user/progress", requireAuth, async (req, res) => {
  try {
    const row = await getOrCreateUserProgress(req.userId!);
    res.json({
      level: row.level,
      levelName: row.levelName,
      xpPoints: row.xpPoints,
      xpToNextLevel: row.xpToNextLevel,
      streakDays: row.streakDays,
      totalDaysLearned: row.totalDaysLearned,
      totalMinutesLearned: row.totalMinutesLearned,
      completionPercentage: Number(row.completionPercentage),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get user progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /user/profile — aggregated profile view (avatar, level, achievements
// summary, certificates, languages) for the Profile section.
router.get("/user/profile", requireAuth, async (req, res) => {
  try {
    const userId = req.userId!;
    const progress = await getOrCreateUserProgress(userId);

    const [wordRows, lessonRows, examAgg, pronAgg, examAll] = await Promise.all([
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

    const certifiedLevels: Record<string, { percentage: number; date: string }> = {};
    for (const row of examAll) {
      if (row.examType === "level" && row.passed && row.level && !certifiedLevels[row.level]) {
        certifiedLevels[row.level] = {
          percentage: row.percentage,
          date: row.createdAt ? row.createdAt.toISOString() : "",
        };
      }
    }

    const achievements = computeAchievements({
      lessonsCompleted: lessonRows[0]?.count ?? 0,
      wordsLearned: wordRows[0]?.count ?? 0,
      streakDays: progress.streakDays,
      examTotalAttempts: Number(examAgg[0]?.total ?? 0),
      examAvgPercentage: Math.round(Number(examAgg[0]?.avg ?? 0)),
      certifiedLevelsCount: Object.keys(certifiedLevels).length,
      pronunciationAvgScore: Math.round(Number(pronAgg[0]?.avg ?? 0)),
      pronunciationTotalAttempts: Number(pronAgg[0]?.total ?? 0),
    });

    res.json({
      displayName: progress.displayName,
      avatarEmoji: progress.avatarEmoji,
      avatarColor: progress.avatarColor,
      level: progress.level,
      levelName: progress.levelName,
      xpPoints: progress.xpPoints,
      xpToNextLevel: progress.xpToNextLevel,
      streakDays: progress.streakDays,
      totalDaysLearned: progress.totalDaysLearned,
      achievementsUnlocked: achievements.filter((a) => a.unlocked).length,
      achievementsTotal: achievements.length,
      certifiedLevels,
      languages: [{ code: "sv", name: "السويدية", isLearning: true, level: progress.levelName }],
      translatorLanguagesCount: 130,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get user profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /user/profile — update avatar/display name for the signed-in user
router.patch("/user/profile", requireAuth, async (req, res) => {
  try {
    const { displayName, avatarEmoji, avatarColor } = (req.body ?? {}) as {
      displayName?: string;
      avatarEmoji?: string;
      avatarColor?: string;
    };
    const progress = await getOrCreateUserProgress(req.userId!);
    const update: Record<string, unknown> = {};
    if (typeof displayName === "string" && displayName.trim()) update.displayName = displayName.trim().slice(0, 40);
    if (typeof avatarEmoji === "string" && avatarEmoji.trim()) update.avatarEmoji = avatarEmoji.trim();
    if (typeof avatarColor === "string" && avatarColor.trim()) update.avatarColor = avatarColor.trim();

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "لا يوجد تغييرات لحفظها" });
    }

    const [updated] = await db
      .update(userProgressTable)
      .set(update)
      .where(eq(userProgressTable.id, progress.id))
      .returning();

    res.json({
      displayName: updated.displayName,
      avatarEmoji: updated.avatarEmoji,
      avatarColor: updated.avatarColor,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update user profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
