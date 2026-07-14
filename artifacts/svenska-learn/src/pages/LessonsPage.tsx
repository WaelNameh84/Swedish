import { useState } from "react";
import { useLocation, Link } from "wouter";
import { 
  BookOpen, 
  PenLine, 
  Headphones, 
  MessageCircle, 
  GraduationCap, 
  ClipboardList, 
  Clock, 
  Lock, 
  Star,
  ChevronRight,
  Volume2,
  type LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useGetLessons, 
  getGetLessonsQueryKey 
} from "@workspace/api-client-react";
import { speak } from "@/lib/speech";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type Skill = "reading" | "writing" | "listening" | "speaking" | "grammar" | "tests" | undefined;

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  A1: "مبتدئ",
  A2: "أساسي",
  B1: "متوسط",
  B2: "فوق المتوسط",
  C1: "متقدم",
  C2: "إتقان",
};

const SKILLS: { label: string; value: Skill }[] = [
  { label: "الكل", value: undefined },
  { label: "القراءة", value: "reading" },
  { label: "الكتابة", value: "writing" },
  { label: "الاستماع", value: "listening" },
  { label: "المحادثة", value: "speaking" },
  { label: "القواعد", value: "grammar" },
  { label: "الاختبارات", value: "tests" },
];

const SKILL_ICONS: Record<NonNullable<Skill>, React.ElementType> = {
  reading: BookOpen,
  writing: PenLine,
  listening: Headphones,
  speaking: MessageCircle,
  grammar: GraduationCap,
  tests: ClipboardList,
};

const DIFFICULTY_COLORS = {
  beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  intermediate: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const DIFFICULTY_LABELS = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

export default function LessonsPage() {
  const [, navigate] = useLocation();
  const [selectedLevel, setSelectedLevel] = useState<Level>("A1");
  const [selectedSkill, setSelectedSkill] = useState<Skill>(undefined);

  const { data: lessons, isLoading } = useGetLessons(
    { level: selectedLevel, skill: selectedSkill || undefined },
    { 
      query: { 
        queryKey: getGetLessonsQueryKey({ level: selectedLevel, skill: selectedSkill || undefined }) 
      } 
    }
  );

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24 md:py-8 flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-4 px-4 md:px-0 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md z-10 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">الدروس</h1>
        {!isLoading && lessons && (
          <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {lessons.length} درس
          </span>
        )}
      </header>

      <div className="flex flex-col gap-6 pt-6 px-4 md:px-0">
        {/* Level Tabs */}
        <section className="flex flex-col gap-3">
          <div className="w-full overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2">
            <div className="flex gap-2 w-max">
              {LEVELS.map((level) => {
                const isActive = selectedLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={cn(
                      "px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-95",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-100"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 scale-95 opacity-80"
                    )}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-center text-sm font-medium text-muted-foreground">
            {LEVEL_DESCRIPTIONS[selectedLevel]}
          </div>
        </section>

        {/* Skill Pills */}
        <section className="w-full overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2">
          <div className="flex gap-2 w-max">
            {SKILLS.map((skill) => {
              const isActive = selectedSkill === skill.value;
              return (
                <button
                  key={skill.label}
                  onClick={() => setSelectedSkill(skill.value)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-card border border-card-border text-foreground hover:border-primary/30"
                  )}
                >
                  {skill.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Lessons List */}
        <section className="flex flex-col gap-4 mt-2">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 w-full rounded-2xl" />
                ))}
              </motion.div>
            ) : lessons && lessons.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {lessons.map((lesson) => {
                  const Icon = SKILL_ICONS[lesson.skill as NonNullable<Skill>] || BookOpen;
                  const isLocked = lesson.isLocked;
                  const isCompleted = lesson.completionPercentage === 100;

                  return (
                    <Link
                      key={lesson.id}
                      href={!isLocked ? `/lessons/${lesson.id}` : undefined}
                      onClick={(e) => { if (isLocked) e.preventDefault(); }}
                      className={cn(
                        "relative bg-card border border-card-border rounded-2xl overflow-hidden transition-all duration-300 block",
                        !isLocked && "hover:border-primary/40 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md",
                        isLocked && "opacity-70 grayscale-[0.3]"
                      )}
                    >
                      {/* Cover Image */}
                      {(lesson as any).imageUrl && (
                        <div className="relative w-full h-36 overflow-hidden">
                          <img
                            src={(lesson as any).imageUrl}
                            alt={lesson.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-2 right-2 flex items-center gap-1">
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider", DIFFICULTY_COLORS[lesson.difficulty])}>
                              {DIFFICULTY_LABELS[lesson.difficulty]}
                            </span>
                          </div>
                          {isLocked && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Lock Overlay (no image) */}
                      {isLocked && !(lesson as any).imageUrl && (
                        <div className="absolute inset-0 z-10 bg-background/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 bg-background/80 rounded-full flex items-center justify-center shadow-sm">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-semibold text-foreground/80 bg-background/80 px-3 py-1 rounded-full shadow-sm">
                            يتطلب إتمام المستوى السابق
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-4 relative z-0 p-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={cn("text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider", DIFFICULTY_COLORS[lesson.difficulty])}>
                              {DIFFICULTY_LABELS[lesson.difficulty]}
                            </span>
                            {isCompleted && (
                              <div className="flex items-center gap-1 bg-accent/20 text-accent-foreground px-2 py-1 rounded-md">
                                <Star className="w-3 h-3 fill-accent text-accent" />
                                <span className="text-[10px] font-bold">مكتمل</span>
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{lesson.title}</h3>
                          <div className="flex items-center gap-1.5 mb-3">
                            <p className="text-xs text-muted-foreground font-medium line-clamp-1 flex-1" dir="ltr">{lesson.titleSv}</p>
                            {!isLocked && lesson.titleSv && (
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); speak(lesson.titleSv, { lang: "sv-SE" }); }}
                                className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors shrink-0"
                                aria-label="استمع للنطق"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          
                          {lesson.description && (
                            <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed mb-4">
                              {lesson.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">{lesson.durationMinutes} دقيقة</span>
                              </div>
                              {!isCompleted && lesson.completionPercentage > 0 && (
                                <div className="flex items-center gap-1.5 max-w-[90px]">
                                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full transition-all duration-500"
                                      style={{ width: `${lesson.completionPercentage}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-primary">
                                    {lesson.completionPercentage}%
                                  </span>
                                </div>
                              )}
                            </div>
                            {!isLocked && (
                              <ChevronRight className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center text-center p-12 bg-card border border-card-border rounded-2xl gap-4 mt-4"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground">لا توجد دروس</h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  لا توجد دروس في هذا المستوى والمهارة حتى الآن.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
