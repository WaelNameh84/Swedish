import { Router } from "express";
import { db } from "@workspace/db";
import { lessonsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

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
      category: row.category,
      difficulty: row.difficulty,
      completionPercentage: row.completionPercentage,
      lastAccessedAt: row.lastAccessedAt ? row.lastAccessedAt.toISOString() : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get recent lesson");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
