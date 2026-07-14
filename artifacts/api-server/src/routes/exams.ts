import { Router } from "express";
import { db } from "@workspace/db";
import { dictionaryTable, examAttemptsTable } from "@workspace/db";
import { eq, and, sql, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const COUNT_BY_TYPE: Record<string, number> = {
  daily: 10,
  weekly: 25,
  monthly: 50,
  level: 20,
};

const PASS_THRESHOLD = 70;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// GET /exams/questions?type=daily|weekly|monthly|level&level=A1&count=
router.get("/exams/questions", async (req, res) => {
  try {
    const type = (req.query.type as string) || "daily";
    const level = req.query.level as string | undefined;
    const count = Math.min(
      Number(req.query.count) || COUNT_BY_TYPE[type] || 10,
      80
    );

    let rows;
    if (type === "level" && level) {
      rows = await db
        .select()
        .from(dictionaryTable)
        .where(eq(dictionaryTable.level, level))
        .orderBy(sql`random()`)
        .limit(count);
    } else {
      rows = await db
        .select()
        .from(dictionaryTable)
        .orderBy(sql`random()`)
        .limit(count);
    }

    if (rows.length === 0) {
      return res.json({ examType: type, level: level ?? null, questions: [], total: 0 });
    }

    // Pool of translations/words for distractors
    const allWords = rows.map((r) => r.word);
    const allTranslations = rows.map((r) => r.translation);

    const questions = rows.map((row, idx) => {
      const templates: Array<"sv-ar" | "ar-sv" | "fill"> = ["sv-ar", "ar-sv"];
      if (row.examples && row.examples.length > 0) templates.push("fill");
      const template = templates[Math.floor(Math.random() * templates.length)];

      if (template === "ar-sv") {
        const distractors = shuffle(allWords.filter((w) => w !== row.word)).slice(0, 3);
        const options = shuffle([row.word, ...distractors]);
        return {
          id: row.id,
          type: "ar-sv" as const,
          prompt: row.translation,
          options,
          correctIndex: options.indexOf(row.word),
        };
      }

      if (template === "fill" && row.examples && row.examples.length > 0) {
        const example = row.examples[0];
        const blanked = example.sv.replace(new RegExp(row.word, "i"), "____");
        const distractors = shuffle(allWords.filter((w) => w !== row.word)).slice(0, 3);
        const options = shuffle([row.word, ...distractors]);
        return {
          id: row.id,
          type: "fill" as const,
          prompt: `${blanked}\n(${example.ar})`,
          options,
          correctIndex: options.indexOf(row.word),
        };
      }

      const distractors = shuffle(allTranslations.filter((t) => t !== row.translation)).slice(0, 3);
      const options = shuffle([row.translation, ...distractors]);
      return {
        id: row.id,
        type: "sv-ar" as const,
        prompt: row.word,
        phonetic: row.phonetic,
        options,
        correctIndex: options.indexOf(row.translation),
      };
    });

    res.json({ examType: type, level: level ?? null, questions, total: questions.length });
  } catch (err) {
    req.log.error({ err }, "Failed to build exam questions");
    res.status(500).json({ error: "حدث خطأ أثناء تحضير الاختبار" });
  }
});

// POST /exams/attempts
router.post("/exams/attempts", requireAuth, async (req, res) => {
  try {
    const { examType, level, score, total, durationSeconds, details } = req.body ?? {};
    if (!examType || typeof score !== "number" || typeof total !== "number" || total <= 0) {
      return res.status(400).json({ error: "بيانات المحاولة غير صالحة" });
    }
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= PASS_THRESHOLD;

    const [row] = await db
      .insert(examAttemptsTable)
      .values({
        userId: req.userId!,
        examType,
        level: level ?? null,
        score,
        total,
        percentage,
        passed,
        durationSeconds: durationSeconds ?? 0,
        details: details ?? [],
      })
      .returning();

    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Failed to save exam attempt");
    res.status(500).json({ error: "حدث خطأ أثناء حفظ نتيجة الاختبار" });
  }
});

// GET /exams/attempts?limit=20&examType=
router.get("/exams/attempts", requireAuth, async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const rows = await db
      .select()
      .from(examAttemptsTable)
      .where(eq(examAttemptsTable.userId, req.userId!))
      .orderBy(desc(examAttemptsTable.createdAt))
      .limit(limit);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list exam attempts");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /exams/report — aggregated performance report + certified levels
router.get("/exams/report", requireAuth, async (req, res) => {
  try {
    const all = await db
      .select()
      .from(examAttemptsTable)
      .where(eq(examAttemptsTable.userId, req.userId!))
      .orderBy(desc(examAttemptsTable.createdAt));

    const totalAttempts = all.length;
    const avgPercentage = totalAttempts
      ? Math.round(all.reduce((s, r) => s + r.percentage, 0) / totalAttempts)
      : 0;

    // Certified levels: latest passed "level" attempt per level
    const certifiedLevels: Record<string, { percentage: number; date: string }> = {};
    for (const row of all) {
      if (row.examType === "level" && row.passed && row.level && !certifiedLevels[row.level]) {
        certifiedLevels[row.level] = {
          percentage: row.percentage,
          date: row.createdAt ? row.createdAt.toISOString() : "",
        };
      }
    }

    // Streak: consecutive days (including today) with at least one attempt
    const dayset = new Set(
      all.map((r) => (r.createdAt ? r.createdAt.toISOString().slice(0, 10) : ""))
    );
    let streak = 0;
    const cursor = new Date();
    while (true) {
      const key = cursor.toISOString().slice(0, 10);
      if (dayset.has(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }

    const byType: Record<string, number> = {};
    for (const row of all) byType[row.examType] = (byType[row.examType] ?? 0) + 1;

    res.json({
      totalAttempts,
      avgPercentage,
      streak,
      byType,
      certifiedLevels,
      history: all.slice(0, 30).map((r) => ({
        id: r.id,
        examType: r.examType,
        level: r.level,
        percentage: r.percentage,
        passed: r.passed,
        createdAt: r.createdAt ? r.createdAt.toISOString() : null,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to build performance report");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
