import React, { useState } from "react";
import { Link } from "wouter";
import {
  Languages,
  Bot,
  BookOpen,
  Clock,
  Star,
  ChevronLeft,
  Trophy,
  CheckCircle2,
  Target,
  Headphones,
  Mic,
  AlignLeft,
  MessageSquare,
  Flame,
  Lock,
  Volume2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetDailyChallenges,
  useCompleteChallenge,
  useGetLessons,
  getGetLessonsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────── */
type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const LEVELS: { level: Level; label: string; desc: string; color: string; bg: string; border: string }[] = [
  { level: "A1", label: "A1", desc: "مبتدئ", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800" },
  { level: "A2", label: "A2", desc: "أساسي",  color: "text-cyan-700 dark:text-cyan-300",    bg: "bg-cyan-50 dark:bg-cyan-950/40",    border: "border-cyan-200 dark:border-cyan-800" },
  { level: "B1", label: "B1", desc: "متوسط",  color: "text-blue-700 dark:text-blue-300",   bg: "bg-blue-50 dark:bg-blue-950/40",   border: "border-blue-200 dark:border-blue-800" },
  { level: "B2", label: "B2", desc: "فوق المتوسط", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-50 dark:bg-violet-950/40", border: "border-violet-200 dark:border-violet-800" },
  { level: "C1", label: "C1", desc: "متقدم",  color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-950/40", border: "border-orange-200 dark:border-orange-800" },
  { level: "C2", label: "C2", desc: "إتقان",  color: "text-rose-700 dark:text-rose-300",   bg: "bg-rose-50 dark:bg-rose-950/40",   border: "border-rose-200 dark:border-rose-800" },
];

const STORAGE_KEY = "svenska_selected_level";

/* ─── Animations ─────────────────────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

/* ─── Level Picker ───────────────────────────────────────────────── */
function LevelPicker({ onSelect }: { onSelect: (l: Level) => void }) {
  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center gap-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="text-center flex flex-col gap-2"
      >
        <div className="text-5xl mb-2">🇸🇪</div>
        <h1 className="text-3xl font-bold text-foreground">مرحباً بك!</h1>
        <p className="text-muted-foreground text-base">اختر مستواك لنبدأ رحلة تعلّم السويدية</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 w-full"
      >
        {LEVELS.map(({ level, label, desc, color, bg, border }) => (
          <motion.button
            key={level}
            variants={item}
            onClick={() => onSelect(level)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-2 p-7 rounded-3xl border-2 transition-all duration-200 active:scale-95 hover:shadow-lg",
              bg, border
            )}
          >
            <span className={cn("text-5xl font-black tracking-tight", color)}>{label}</span>
            <span className={cn("text-sm font-semibold", color)}>{desc}</span>
          </motion.button>
        ))}
      </motion.div>

      <p className="text-xs text-muted-foreground text-center">
        يمكنك تغيير المستوى في أي وقت من الصفحة الرئيسية
      </p>
    </div>
  );
}

/* ─── Dashboard (after level selection) ─────────────────────────── */
function Dashboard({ level, onChangeLevel }: { level: Level; onChangeLevel: () => void }) {
  const levelMeta = LEVELS.find((l) => l.level === level)!;

  const { data: lessons, isLoading: isLoadingLessons } = useGetLessons(
    { level },
    { query: { queryKey: getGetLessonsQueryKey({ level }) } }
  );

  const { data: challenges, isLoading: isLoadingChallenges } = useGetDailyChallenges();
  const completeChallenge = useCompleteChallenge();

  const handleChallengeComplete = (id: number, isCompleted: boolean) => {
    if (isCompleted || completeChallenge.isPending) return;
    completeChallenge.mutate({ id });
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "vocabulary": return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "listening":  return <Headphones className="w-5 h-5 text-purple-500" />;
      case "speaking":   return <Mic className="w-5 h-5 text-green-500" />;
      case "reading":    return <BookOpen className="w-5 h-5 text-orange-500" />;
      case "grammar":    return <AlignLeft className="w-5 h-5 text-indigo-500" />;
      default:           return <Target className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-10">
      <motion.div
        className="flex flex-col gap-7 w-full px-4 md:px-0"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* ── Header ── */}
        <motion.header variants={item} className="pt-8 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-bold text-foreground">أهلاً وسهلاً 👋</h1>
            <p className="text-sm text-muted-foreground">هيّا نتعلّم السويدية معاً</p>
          </div>

          {/* Level badge */}
          <button
            onClick={onChangeLevel}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all active:scale-95",
              levelMeta.bg, levelMeta.border
            )}
          >
            <span className={cn("text-xl font-black", levelMeta.color)}>{level}</span>
            <span className={cn("text-xs font-semibold", levelMeta.color)}>{levelMeta.desc}</span>
          </button>
        </motion.header>

        {/* ── Two main feature cards ── */}
        <motion.section variants={item} className="grid grid-cols-2 gap-4">
          {/* Translator */}
          <Link href="/translator" className="block">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 flex flex-col gap-3 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-[0.97] h-full">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/70 mb-0.5">فوري</p>
                <h3 className="text-lg font-bold leading-tight">المترجم</h3>
              </div>
            </div>
          </Link>

          {/* AI Practice Chat */}
          <Link href="/chat" className="block">
            <div className="bg-gradient-to-br from-violet-500 to-violet-700 rounded-3xl p-6 flex flex-col gap-3 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all active:scale-[0.97] h-full">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/70 mb-0.5">ذكاء اصطناعي</p>
                <h3 className="text-lg font-bold leading-tight">تدرّب الآن</h3>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* ── Lessons for this level ── */}
        <motion.section variants={item} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              دروس المستوى {level}
            </h2>
            <Link href="/lessons">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                الكل
              </span>
            </Link>
          </div>

          {isLoadingLessons ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : lessons && lessons.length > 0 ? (
            <div className="flex flex-col gap-3">
              {lessons.slice(0, 8).map((lesson) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                  <div className="bg-card border border-card-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary/40 hover:shadow-md transition-all active:scale-[0.98]">
                    {/* Progress ring */}
                    <div className="shrink-0 w-12 h-12 rounded-full border-4 border-muted flex items-center justify-center relative">
                      <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-muted" />
                        <circle
                          cx="20" cy="20" r="16"
                          fill="transparent" stroke="currentColor" strokeWidth="4"
                          className="text-primary transition-all"
                          strokeDasharray={16 * 2 * Math.PI}
                          strokeDashoffset={16 * 2 * Math.PI - ((lesson.completionPercentage ?? 0) / 100) * (16 * 2 * Math.PI)}
                        />
                      </svg>
                      {(lesson.completionPercentage ?? 0) === 100 ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {lesson.completionPercentage ?? 0}%
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {lesson.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground truncate">{lesson.title}</h3>
                      <p className="text-xs text-muted-foreground font-mono truncate" dir="ltr">{lesson.titleSv}</p>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">{lesson.duration}د</span>
                    </div>
                  </div>
                </Link>
              ))}

              {lessons.length > 8 && (
                <Link href="/lessons">
                  <Button variant="outline" className="w-full rounded-2xl">
                    عرض باقي الدروس ({lessons.length - 8} درس)
                    <ChevronLeft className="w-4 h-4 mr-1" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/30 rounded-2xl text-sm text-muted-foreground">
              لا توجد دروس للمستوى {level} حتى الآن
            </div>
          )}
        </motion.section>

        {/* ── Daily Challenges ── */}
        <motion.section variants={item} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              تحديات اليوم
            </h2>
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              يتجدد يومياً
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {isLoadingChallenges ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
            ) : challenges && challenges.length > 0 ? (
              challenges.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => handleChallengeComplete(challenge.id, challenge.isCompleted)}
                  disabled={challenge.isCompleted || completeChallenge.isPending}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border text-right transition-all",
                    challenge.isCompleted
                      ? "bg-muted/50 border-muted opacity-60 cursor-default"
                      : "bg-card border-card-border shadow-sm hover:border-primary/40 active:scale-[0.98]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      challenge.isCompleted ? "bg-muted" : "bg-secondary"
                    )}>
                      {challenge.isCompleted
                        ? <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                        : getChallengeIcon(challenge.type)}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className={cn("font-bold text-sm", challenge.isCompleted ? "text-muted-foreground" : "text-foreground")}>
                        {challenge.title}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">{challenge.description}</span>
                    </div>
                  </div>
                  {!challenge.isCompleted && (
                    <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg shrink-0">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300">+{challenge.xpReward}</span>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center p-6 bg-muted/30 rounded-2xl text-sm text-muted-foreground">
                لا توجد تحديات متاحة اليوم
              </div>
            )}
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────── */
export default function Home() {
  const [level, setLevel] = useState<Level | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as Level) || null;
  });

  const handleSelect = (l: Level) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLevel(l);
  };

  const handleChangeLevel = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLevel(null);
  };

  return (
    <AnimatePresence mode="wait">
      {level === null ? (
        <motion.div
          key="picker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          <LevelPicker onSelect={handleSelect} />
        </motion.div>
      ) : (
        <motion.div
          key={`dashboard-${level}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Dashboard level={level} onChangeLevel={handleChangeLevel} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
