import { Router } from "express";
import { db } from "@workspace/db";
import { userProgressTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// Deterministic demo/showcase data — clearly not real accounts. Combined with
// the single real learner's live progress so the current user always sees an
// accurate reflection of their own standing. See svenska-community-demo-data
// memory for the rationale (no auth system exists yet).
const DEMO_LEARNERS = [
  { id: "l1", name: "أحمد المصري", emoji: "🧔", xp: 3200, level: 6, streak: 21 },
  { id: "l2", name: "سارة الحلبي", emoji: "👩", xp: 2850, level: 5, streak: 14 },
  { id: "l3", name: "يوسف التونسي", emoji: "🧑", xp: 2600, level: 5, streak: 9 },
  { id: "l4", name: "منى الجزائرية", emoji: "👩‍🦱", xp: 2100, level: 4, streak: 30 },
  { id: "l5", name: "خالد السعودي", emoji: "🧑‍🦲", xp: 1950, level: 4, streak: 5 },
  { id: "l6", name: "ليلى المغربية", emoji: "👱‍♀️", xp: 1700, level: 3, streak: 12 },
  { id: "l7", name: "عمر الأردني", emoji: "🧑‍🦳", xp: 1450, level: 3, streak: 3 },
  { id: "l8", name: "نور العراقية", emoji: "👩‍🦰", xp: 1200, level: 3, streak: 8 },
  { id: "l9", name: "طارق اللبناني", emoji: "🧑‍💼", xp: 950, level: 2, streak: 2 },
  { id: "l10", name: "هدى الفلسطينية", emoji: "🧕", xp: 780, level: 2, streak: 6 },
  { id: "l11", name: "بلال السوداني", emoji: "🧑‍🎓", xp: 620, level: 2, streak: 1 },
  { id: "l12", name: "رنا الكويتية", emoji: "👩‍🎓", xp: 430, level: 1, streak: 4 },
];

const DEMO_GROUPS = [
  { id: "g1", name: "مبتدئو السويدية", topic: "للمنضمين الجدد في رحلة تعلم السويدية", memberCount: 428 },
  { id: "g2", name: "نادي القراءة السويدي", topic: "قراءة نصوص سويدية بسيطة أسبوعياً", memberCount: 215 },
  { id: "g3", name: "التحضير لاختبار SFI", topic: "مجموعة تحضير مكثف لاختبارات اللغة الرسمية", memberCount: 356 },
  { id: "g4", name: "محبو النطق الصحيح", topic: "تمارين نطق ومقاطع صوتية يومية", memberCount: 189 },
  { id: "g5", name: "سويديون في المهجر", topic: "لمن يتعلم السويدية استعداداً للانتقال أو العمل", memberCount: 512 },
];

const DEMO_COMPETITIONS = [
  { id: "c1", title: "تحدي الأسبوع: أسرع 20 اختباراً", metric: "عدد الاختبارات المكتملة", durationDays: 7, demoLeaderTop3: ["أحمد المصري", "سارة الحلبي", "يوسف التونسي"] },
  { id: "c2", title: "ماراثون الكلمات الشهري", metric: "عدد الكلمات الجديدة المتعلَّمة", durationDays: 30, demoLeaderTop3: ["منى الجزائرية", "ليلى المغربية", "نور العراقية"] },
  { id: "c3", title: "تحدي النطق الأسبوعي", metric: "متوسط درجة تقييم النطق", durationDays: 7, demoLeaderTop3: ["خالد السعودي", "عمر الأردني", "طارق اللبناني"] },
];

function startOfWeek(): Date {
  const now = new Date();
  const d = new Date(now);
  d.setDate(now.getDate() - now.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

async function getProgress() {
  const rows = await db.select().from(userProgressTable).limit(1);
  return rows[0];
}

// GET /community/leaderboard
router.get("/community/leaderboard", async (_req, res) => {
  try {
    const progress = await getProgress();
    const you = {
      id: "you",
      name: progress?.displayName || "أنت",
      emoji: progress?.avatarEmoji || "🧑‍🎓",
      xp: progress?.xpPoints ?? 0,
      level: progress?.level ?? 1,
      streak: progress?.streakDays ?? 0,
      isYou: true,
    };
    const all = [...DEMO_LEARNERS.map((l) => ({ ...l, isYou: false })), you].sort((a, b) => b.xp - a.xp);
    const ranked = all.map((row, idx) => ({ ...row, rank: idx + 1 }));
    res.json({ leaderboard: ranked, yourRank: ranked.find((r) => r.isYou)?.rank ?? null, isDemoData: true });
  } catch (err) {
    _req.log.error({ err }, "Failed to build leaderboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /community/friends
router.get("/community/friends", async (_req, res) => {
  try {
    const progress = await getProgress();
    const friendIds = new Set(progress?.friendIds ?? []);
    const friends = DEMO_LEARNERS.map((l) => ({ ...l, isFriend: friendIds.has(l.id) }));
    res.json({ friends, isDemoData: true });
  } catch (err) {
    _req.log.error({ err }, "Failed to list friends");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /community/friends/:id/toggle
router.post("/community/friends/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    if (!DEMO_LEARNERS.some((l) => l.id === id)) {
      return res.status(404).json({ error: "غير موجود" });
    }
    const progress = await getProgress();
    if (!progress) return res.status(404).json({ error: "لا يوجد مستخدم" });
    const current = new Set(progress.friendIds ?? []);
    const nowFriend = !current.has(id);
    if (nowFriend) current.add(id);
    else current.delete(id);
    await db
      .update(userProgressTable)
      .set({ friendIds: Array.from(current) })
      .where(eq(userProgressTable.id, progress.id));
    res.json({ id, isFriend: nowFriend });
  } catch (err) {
    req.log.error({ err }, "Failed to toggle friend");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /community/groups
router.get("/community/groups", async (_req, res) => {
  try {
    const progress = await getProgress();
    const joined = new Set(progress?.joinedGroupIds ?? []);
    const groups = DEMO_GROUPS.map((g) => ({ ...g, isJoined: joined.has(g.id) }));
    res.json({ groups, isDemoData: true });
  } catch (err) {
    _req.log.error({ err }, "Failed to list groups");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /community/groups/:id/toggle
router.post("/community/groups/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    if (!DEMO_GROUPS.some((g) => g.id === id)) {
      return res.status(404).json({ error: "غير موجود" });
    }
    const progress = await getProgress();
    if (!progress) return res.status(404).json({ error: "لا يوجد مستخدم" });
    const current = new Set(progress.joinedGroupIds ?? []);
    const nowJoined = !current.has(id);
    if (nowJoined) current.add(id);
    else current.delete(id);
    await db
      .update(userProgressTable)
      .set({ joinedGroupIds: Array.from(current) })
      .where(eq(userProgressTable.id, progress.id));
    res.json({ id, isJoined: nowJoined });
  } catch (err) {
    req.log.error({ err }, "Failed to toggle group");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /community/competitions
router.get("/community/competitions", async (_req, res) => {
  try {
    const progress = await getProgress();
    const week = startOfWeek();
    const competitions = DEMO_COMPETITIONS.map((c) => {
      const endsAt = new Date(week);
      endsAt.setDate(week.getDate() + c.durationDays);
      return {
        ...c,
        endsAt: endsAt.toISOString(),
        yourXp: progress?.xpPoints ?? 0,
      };
    });
    res.json({ competitions, isDemoData: true });
  } catch (err) {
    _req.log.error({ err }, "Failed to list competitions");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
