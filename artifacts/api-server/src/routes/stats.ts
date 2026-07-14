import { Router } from "express";
import { db } from "@workspace/db";
import { lessonsTable, wordsTable, userProgressTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const [progressRows, lessonRows, wordRows] = await Promise.all([
      db.select().from(userProgressTable).limit(1),
      db.select({ count: count() }).from(lessonsTable).where(eq(lessonsTable.completionPercentage, 100)),
      db.select({ count: count() }).from(wordsTable).where(eq(wordsTable.isNew, false)),
    ]);

    const progress = progressRows[0];
    const lessonsCompleted = lessonRows[0]?.count ?? 0;
    const wordsLearned = wordRows[0]?.count ?? 0;

    const weeklyGoalMinutes = 150;
    const minutesThisWeek = progress ? Math.min(progress.totalMinutesLearned, weeklyGoalMinutes + 30) : 0;
    const weeklyProgress = Math.min((minutesThisWeek / weeklyGoalMinutes) * 100, 100);

    res.json({
      lessonsCompleted,
      wordsLearned,
      minutesThisWeek,
      weeklyGoalMinutes,
      weeklyProgress: Math.round(weeklyProgress * 10) / 10,
      accuracy: 87.5,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
