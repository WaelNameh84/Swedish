import { Router } from "express";
import { db } from "@workspace/db";
import { userProgressTable } from "@workspace/db";

const router = Router();

router.get("/user/progress", async (req, res) => {
  try {
    const rows = await db.select().from(userProgressTable).limit(1);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User progress not found" });
    }
    const row = rows[0];
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

export default router;
