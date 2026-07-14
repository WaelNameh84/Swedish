import { Router } from "express";
import { db } from "@workspace/db";
import { lessonsTable, lessonSectionsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/lessons/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid lesson id" });

    const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id));
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const sections = await db
      .select()
      .from(lessonSectionsTable)
      .where(eq(lessonSectionsTable.lessonId, id))
      .orderBy(asc(lessonSectionsTable.orderIndex));

    res.json({
      id: lesson.id,
      title: lesson.title,
      titleSv: lesson.titleSv,
      description: lesson.description,
      category: lesson.category,
      difficulty: lesson.difficulty,
      level: lesson.level,
      skill: lesson.skill,
      durationMinutes: lesson.durationMinutes,
      isLocked: lesson.isLocked,
      completionPercentage: lesson.completionPercentage,
      lastAccessedAt: lesson.lastAccessedAt ? lesson.lastAccessedAt.toISOString() : null,
      sections: sections.map((s) => ({
        id: s.id,
        orderIndex: s.orderIndex,
        sectionType: s.sectionType,
        titleAr: s.titleAr,
        content: s.content,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get lesson detail");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/lessons/:id/progress", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid lesson id" });
    const { completionPercentage } = req.body as { completionPercentage: number };

    const [updated] = await db
      .update(lessonsTable)
      .set({
        completionPercentage: Math.min(100, Math.max(0, completionPercentage)),
        lastAccessedAt: new Date(),
      })
      .where(eq(lessonsTable.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Lesson not found" });
    res.json({ id: updated.id, completionPercentage: updated.completionPercentage });
  } catch (err) {
    req.log.error({ err }, "Failed to update lesson progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
