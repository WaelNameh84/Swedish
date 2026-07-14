import { Router } from "express";
import { db } from "@workspace/db";
import { dailyChallengesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/challenges/daily", async (req, res) => {
  try {
    const rows = await db.select().from(dailyChallengesTable).limit(5);
    res.json(
      rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        xpReward: row.xpReward,
        isCompleted: row.isCompleted,
        expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get daily challenges");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/challenges/:id/complete", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid challenge ID" });
    }

    const updated = await db
      .update(dailyChallengesTable)
      .set({ isCompleted: true })
      .where(eq(dailyChallengesTable.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const row = updated[0];
    res.json({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      xpReward: row.xpReward,
      isCompleted: row.isCompleted,
      expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to complete challenge");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
