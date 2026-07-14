import { Router } from "express";
import { db } from "@workspace/db";
import { lessonsTable } from "@workspace/db";
import { desc, eq, and } from "drizzle-orm";

const router = Router();

router.get("/lessons", async (req, res) => {
  try {
    const { level, skill } = req.query as { level?: string; skill?: string };

    const conditions = [];
    if (level) conditions.push(eq(lessonsTable.level, level));
    if (skill) conditions.push(eq(lessonsTable.skill, skill));

    const rows = await db
      .select()
      .from(lessonsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(lessonsTable.level, lessonsTable.skill, lessonsTable.id);

    res.json(
      rows.map((row) => ({
        id: row.id,
        title: row.title,
        titleSv: row.titleSv,
        description: row.description,
        category: row.category,
        difficulty: row.difficulty,
        level: row.level,
        skill: row.skill,
        durationMinutes: row.durationMinutes,
        isLocked: row.isLocked,
        completionPercentage: row.completionPercentage,
        imageUrl: row.imageUrl ?? null,
        lastAccessedAt: row.lastAccessedAt ? row.lastAccessedAt.toISOString() : null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get lessons");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/lessons/recent", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(lessonsTable)
      .orderBy(desc(lessonsTable.lastAccessedAt))
      .limit(1);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No lessons found" });
    }

    const row = rows[0];
    res.json({
      id: row.id,
      title: row.title,
      titleSv: row.titleSv,
      description: row.description,
      category: row.category,
      difficulty: row.difficulty,
      level: row.level,
      skill: row.skill,
      durationMinutes: row.durationMinutes,
      isLocked: row.isLocked,
      completionPercentage: row.completionPercentage,
      lastAccessedAt: row.lastAccessedAt ? row.lastAccessedAt.toISOString() : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get recent lesson");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
