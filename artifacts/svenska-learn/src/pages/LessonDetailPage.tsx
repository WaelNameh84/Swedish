import { useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  ArrowRight,
  Clock,
  BookOpen,
  Volume2,
  PenLine,
  MessageCircle,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  Play,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetLessonDetail,
  getGetLessonDetailQueryKey,
  useUpdateLessonProgress,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

interface VocabWord {
  sv: string;
  ar: string;
  phonetic: string;
  example?: string;
  imageUrl?: string;
}

interface GrammarExample {
  sv: string;
  ar: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface ExerciseItem {
  type: "mcq" | "fill" | "translate";
  question: string;
  options?: string[];
  answer: string;
}

interface ReadingQuestion {
  question: string;
  answer: string;
}

// ── Section Components ──────────────────────────────────────────────────────

function IntroSection({ content }: { content: Record<string, unknown> }) {
  const objectives = (content.objectives as string[]) || [];
  const arabicIntro = content.arabicIntro as string;
  const imageUrl = content.imageUrl as string | undefined;

  return (
    <div className="space-y-5">
      {imageUrl && (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt="درس"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}
      <p className="text-foreground/90 leading-relaxed text-base font-medium" dir="rtl">
        {arabicIntro}
      </p>
      {objectives.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3" dir="rtl">
            ستتعلم في هذا الدرس:
          </p>
          {objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-foreground/80" dir="rtl">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>{obj}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VocabularySection({ content }: { content: Record<string, unknown> }) {
  const words = (content.words as VocabWord[]) || [];
  const imageUrl = content.imageUrl as string | undefined;
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {imageUrl && (
        <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt="مفردات"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      <div className="grid gap-3">
        {words.map((word, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-card-border rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <p className="font-bold text-foreground text-base" dir="ltr">{word.sv}</p>
                  <p className="text-sm text-muted-foreground" dir="rtl">{word.ar}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-lg" dir="ltr">
                  [{word.phonetic}]
                </span>
                {expanded === i ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>
            <AnimatePresence>
              {expanded === i && word.example && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-card-border/50 pt-3">
                    <p className="text-xs text-muted-foreground mb-1" dir="rtl">مثال:</p>
                    <p className="text-sm font-medium text-foreground italic" dir="ltr">{word.example}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GrammarSection({ content }: { content: Record<string, unknown> }) {
  const rule = content.rule as string;
  const explanation = content.explanation as string;
  const examples = (content.examples as GrammarExample[]) || [];
  const imageUrl = content.imageUrl as string | undefined;

  return (
    <div className="space-y-5">
      {imageUrl && (
        <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt="قواعد"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4">
        <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2" dir="rtl">القاعدة</p>
        <p className="font-semibold text-foreground text-sm leading-relaxed whitespace-pre-line" dir="rtl">
          {rule}
        </p>
      </div>
      {explanation && (
        <p className="text-sm text-foreground/80 leading-relaxed" dir="rtl">
          {explanation}
        </p>
      )}
      <div className="space-y-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider" dir="rtl">أمثلة:</p>
        {examples.map((ex, i) => (
          <div key={i} className="bg-card border border-card-border rounded-xl p-3 flex justify-between items-start gap-3">
            <p className="text-sm font-medium text-foreground flex-1" dir="ltr">{ex.sv}</p>
            <p className="text-sm text-muted-foreground text-right" dir="rtl">{ex.ar}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadingSection({ content }: { content: Record<string, unknown> }) {
  const passage = content.passage as string;
  const translation = content.translation as string;
  const questions = (content.questions as ReadingQuestion[]) || [];
  const imageUrl = content.imageUrl as string | undefined;
  const [showTranslation, setShowTranslation] = useState(false);
  const [answersShown, setAnswersShown] = useState<number[]>([]);

  return (
    <div className="space-y-5">
      {imageUrl && (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt="قراءة"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}
      <div className="bg-card border border-card-border rounded-2xl p-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3" dir="rtl">
          النص بالسويدية
        </p>
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-line" dir="ltr">{passage}</p>
      </div>
      <button
        onClick={() => setShowTranslation(!showTranslation)}
        className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-semibold transition-all active:scale-95 hover:bg-primary/5"
      >
        {showTranslation ? "إخفاء الترجمة" : "إظهار الترجمة"}
      </button>
      <AnimatePresence>
        {showTranslation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-secondary/30 rounded-2xl p-4 overflow-hidden"
          >
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3" dir="rtl">
              الترجمة
            </p>
            <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line" dir="rtl">
              {translation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {questions.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider" dir="rtl">
            أسئلة الفهم:
          </p>
          {questions.map((q, i) => (
            <div key={i} className="bg-card border border-card-border rounded-2xl p-4 space-y-2">
              <p className="font-semibold text-sm text-foreground" dir="rtl">{q.question}</p>
              <button
                onClick={() =>
                  setAnswersShown((prev) =>
                    prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]
                  )
                }
                className="text-xs font-bold text-primary"
              >
                {answersShown.includes(i) ? "إخفاء الإجابة" : "إظهار الإجابة"}
              </button>
              <AnimatePresence>
                {answersShown.includes(i) && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-emerald-600 font-medium p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
                    dir="rtl"
                  >
                    ✅ {q.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListeningSection({ content }: { content: Record<string, unknown> }) {
  const transcript = content.transcript as string;
  const questions = (content.questions as ReadingQuestion[]) || [];
  const imageUrl = content.imageUrl as string | undefined;
  const [showTranscript, setShowTranscript] = useState(false);
  const [answersShown, setAnswersShown] = useState<number[]>([]);

  return (
    <div className="space-y-5">
      {imageUrl && (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt="استماع"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent flex items-start p-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Volume2 className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold text-white">تمرين استماع</span>
            </div>
          </div>
        </div>
      )}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-4 h-4 text-primary" />
          <p className="text-xs font-bold text-primary uppercase tracking-wider">تدريب الاستماع</p>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed" dir="rtl">
          اقرأ النص أدناه بصوت عالٍ وتدرب على النطق الصحيح
        </p>
      </div>
      <button
        onClick={() => setShowTranscript(!showTranscript)}
        className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-semibold transition-all active:scale-95 hover:bg-primary/5"
      >
        {showTranscript ? "إخفاء النص" : "إظهار النص / النص الكامل"}
      </button>
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-card-border rounded-2xl p-4">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line" dir="rtl">{transcript}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {questions.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider" dir="rtl">أسئلة:</p>
          {questions.map((q, i) => (
            <div key={i} className="bg-card border border-card-border rounded-2xl p-4 space-y-2">
              <p className="font-semibold text-sm text-foreground" dir="rtl">{q.question}</p>
              <button
                onClick={() =>
                  setAnswersShown((prev) =>
                    prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]
                  )
                }
                className="text-xs font-bold text-primary"
              >
                {answersShown.includes(i) ? "إخفاء الإجابة" : "الإجابة"}
              </button>
              <AnimatePresence>
                {answersShown.includes(i) && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-emerald-600 font-medium p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
                    dir="rtl"
                  >
                    ✅ {q.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseSection({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as ExerciseItem[]) || [];
  const imageUrl = content.imageUrl as string | undefined;
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const handleCheck = (i: number) => {
    setChecked((prev) => ({ ...prev, [i]: true }));
  };

  return (
    <div className="space-y-5">
      {imageUrl && (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt="تمرين"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}
      {items.map((item, i) => {
        const isChecked = checked[i];
        const userAnswer = userAnswers[i] ?? "";
        const isCorrect =
          userAnswer.trim().toLowerCase() === item.answer.trim().toLowerCase();

        return (
          <div key={i} className="bg-card border border-card-border rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </div>
              <p className="font-semibold text-sm text-foreground" dir="rtl">{item.question}</p>
            </div>

            {item.type === "mcq" && item.options ? (
              <div className="grid grid-cols-2 gap-2">
                {item.options.map((opt, j) => {
                  const isSelected = userAnswers[i] === opt;
                  const isCorrectOpt = opt === item.answer;
                  return (
                    <button
                      key={j}
                      onClick={() => !isChecked && setUserAnswers((prev) => ({ ...prev, [i]: opt }))}
                      className={cn(
                        "py-2 px-3 rounded-xl text-sm font-medium text-center transition-all active:scale-95 border",
                        isChecked && isCorrectOpt
                          ? "bg-emerald-100 border-emerald-400 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : isChecked && isSelected && !isCorrectOpt
                          ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : isSelected
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-secondary border-card-border text-foreground hover:border-primary/30"
                      )}
                      dir="rtl"
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="text"
                placeholder="اكتب إجابتك هنا..."
                value={userAnswer}
                onChange={(e) =>
                  !isChecked && setUserAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                }
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                  isChecked && isCorrect
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20"
                    : isChecked && !isCorrect
                    ? "border-red-400 bg-red-50 text-red-800 dark:bg-red-900/20"
                    : "border-card-border bg-background focus:border-primary"
                )}
                dir="rtl"
              />
            )}

            {!isChecked ? (
              <button
                onClick={() => handleCheck(i)}
                disabled={!userAnswer}
                className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-40 active:scale-95 transition-all"
              >
                تحقق
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-xl text-sm font-semibold",
                  isCorrect
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20"
                    : "bg-red-50 text-red-700 dark:bg-red-900/20"
                )}
                dir="rtl"
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>إجابة صحيحة!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>الإجابة الصحيحة: {item.answer}</span>
                  </>
                )}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuizSection({
  content,
  onComplete,
}: {
  content: Record<string, unknown>;
  onComplete: (score: number) => void;
}) {
  const questions = (content.questions as QuizQuestion[]) || [];
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const total = questions.length;
  const currentQuestion = questions[currentQ];
  const hasAnswered = selectedAnswers[currentQ] !== undefined;

  const handleSelect = (optIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = optIndex;
      return next;
    });
  };

  const handleNext = () => {
    if (currentQ < total - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setSubmitted(true);
      setShowResult(true);
      const score = questions.filter((q, i) => selectedAnswers[i] === q.correct).length;
      onComplete(Math.round((score / total) * 100));
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelectedAnswers([]);
    setSubmitted(false);
    setShowResult(false);
  };

  if (showResult) {
    const score = questions.filter((q, i) => selectedAnswers[i] === q.correct).length;
    const pct = Math.round((score / total) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          {pct >= 70 ? (
            <Award className="w-12 h-12 text-primary" />
          ) : (
            <RotateCcw className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-4xl font-black text-foreground">{pct}%</p>
          <p className="text-lg font-semibold text-muted-foreground mt-1" dir="rtl">
            {score} من {total} إجابة صحيحة
          </p>
        </div>
        <p className="text-base font-medium text-foreground" dir="rtl">
          {pct >= 90
            ? "ممتاز! أداء رائع!"
            : pct >= 70
            ? "جيد جداً! استمر في التعلم."
            : "لا بأس! راجع الدرس وأعد المحاولة."}
        </p>
        <button
          onClick={handleReset}
          className="mx-auto flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-foreground font-semibold text-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة الاختبار</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span dir="rtl">السؤال {currentQ + 1} من {total}</span>
          <span>{Math.round(((currentQ) / total) * 100)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${((currentQ) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-card border border-card-border rounded-2xl p-5">
            <p className="font-bold text-foreground text-base leading-relaxed" dir="rtl">
              {currentQuestion.question}
            </p>
          </div>

          <div className="space-y-2">
            {currentQuestion.options.map((opt, j) => {
              const isSelected = selectedAnswers[currentQ] === j;
              return (
                <button
                  key={j}
                  onClick={() => handleSelect(j)}
                  className={cn(
                    "w-full py-3.5 px-4 rounded-2xl text-sm font-semibold text-right transition-all duration-200 active:scale-[0.98] border",
                    isSelected
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : "bg-card border-card-border text-foreground hover:border-primary/30 hover:bg-secondary/50"
                  )}
                  dir="rtl"
                >
                  <span className="font-black text-muted-foreground ml-2">{String.fromCharCode(65 + j)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handleNext}
        disabled={!hasAnswered}
        className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        dir="rtl"
      >
        {currentQ < total - 1 ? (
          <>
            <span>التالي</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </>
        ) : (
          <>
            <span>إنهاء الاختبار</span>
            <Star className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}

// ── Skill Icons ──────────────────────────────────────────────────────────────

const SKILL_ICONS: Record<string, React.ElementType> = {
  reading: BookOpen,
  writing: PenLine,
  listening: Volume2,
  speaking: MessageCircle,
  grammar: GraduationCap,
  tests: ClipboardList,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  intermediate: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

// ── Section Type Labels ──────────────────────────────────────────────────────

const SECTION_LABELS: Record<string, string> = {
  intro: "مقدمة",
  vocabulary: "مفردات",
  grammar: "قواعد",
  reading: "قراءة",
  listening: "استماع",
  exercise: "تمرين",
  quiz: "اختبار",
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LessonDetailPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const lessonId = parseInt(params.id || "0");
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const { data: lesson, isLoading } = useGetLessonDetail(lessonId, {
    query: { queryKey: getGetLessonDetailQueryKey(lessonId) },
  });

  const { mutate: updateProgress } = useUpdateLessonProgress();

  const handleSectionComplete = (sectionIndex: number, score?: number) => {
    if (!completedSections.includes(sectionIndex)) {
      const newCompleted = [...completedSections, sectionIndex];
      setCompletedSections(newCompleted);
      const total = lesson?.sections?.length || 1;
      const pct = Math.round((newCompleted.length / total) * 100);
      updateProgress({ id: lessonId, data: { completionPercentage: pct } });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24">
        <Skeleton className="h-56 w-full" />
        <div className="p-4 space-y-4 mt-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 flex-1 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="text-center" dir="rtl">
          <p className="text-muted-foreground">لم يتم العثور على الدرس</p>
          <button onClick={() => navigate("/lessons")} className="mt-4 text-primary font-semibold">
            العودة للدروس
          </button>
        </div>
      </div>
    );
  }

  const sections = lesson.sections || [];
  const Icon = SKILL_ICONS[lesson.skill] || BookOpen;
  const progress =
    completedSections.length > 0
      ? Math.round((completedSections.length / sections.length) * 100)
      : lesson.completionPercentage;

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-28">
      {/* Hero Image */}
      <div className="relative w-full h-56 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {(lesson as any).imageUrl ? (
          <img
            src={(lesson as any).imageUrl}
            alt={lesson.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate("/lessons")}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md active:scale-90 transition-all"
        >
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>

        {/* Level Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {lesson.level}
          </span>
          <span
            className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-full shadow-sm",
              DIFFICULTY_COLORS[lesson.difficulty]
            )}
          >
            {DIFFICULTY_LABELS[lesson.difficulty]}
          </span>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-card border border-card-border rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-foreground leading-tight" dir="rtl">
                {lesson.title}
              </h1>
              <p className="text-sm text-muted-foreground font-medium mt-0.5" dir="ltr">
                {lesson.titleSv}
              </p>
            </div>
          </div>

          {lesson.description && (
            <p className="text-sm text-foreground/75 leading-relaxed" dir="rtl">
              {lesson.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-muted-foreground text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{lesson.durationMinutes} دقيقة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" />
              <span>{sections.length} أقسام</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground" dir="rtl">التقدم</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      {sections.length > 0 && (
        <div className="px-4 mt-5">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {sections.map((section, i) => {
              const isCompleted = completedSections.includes(i);
              const isActive = activeSection === i;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(i)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 shrink-0",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-secondary text-foreground"
                  )}
                >
                  {isCompleted && !isActive && <CheckCircle2 className="w-3 h-3" />}
                  {SECTION_LABELS[section.sectionType] || section.sectionType}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Section Content */}
      <div className="px-4 mt-5">
        <AnimatePresence mode="wait">
          {sections[activeSection] && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-card-border rounded-2xl p-5 space-y-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground text-base" dir="rtl">
                  {sections[activeSection].titleAr}
                </h2>
                <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
                  {SECTION_LABELS[sections[activeSection].sectionType]}
                </span>
              </div>

              {sections[activeSection].sectionType === "intro" && (
                <IntroSection content={sections[activeSection].content as Record<string, unknown>} />
              )}
              {sections[activeSection].sectionType === "vocabulary" && (
                <VocabularySection content={sections[activeSection].content as Record<string, unknown>} />
              )}
              {sections[activeSection].sectionType === "grammar" && (
                <GrammarSection content={sections[activeSection].content as Record<string, unknown>} />
              )}
              {sections[activeSection].sectionType === "reading" && (
                <ReadingSection content={sections[activeSection].content as Record<string, unknown>} />
              )}
              {sections[activeSection].sectionType === "listening" && (
                <ListeningSection content={sections[activeSection].content as Record<string, unknown>} />
              )}
              {sections[activeSection].sectionType === "exercise" && (
                <ExerciseSection content={sections[activeSection].content as Record<string, unknown>} />
              )}
              {sections[activeSection].sectionType === "quiz" && (
                <QuizSection
                  content={sections[activeSection].content as Record<string, unknown>}
                  onComplete={(score) => handleSectionComplete(activeSection, score)}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-card-border">
                {activeSection > 0 && (
                  <button
                    onClick={() => setActiveSection((s) => s - 1)}
                    className="flex-1 py-3 rounded-xl border border-card-border text-sm font-bold text-foreground active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span dir="rtl">السابق</span>
                  </button>
                )}
                {activeSection < sections.length - 1 && (
                  <button
                    onClick={() => {
                      handleSectionComplete(activeSection);
                      setActiveSection((s) => s + 1);
                    }}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span dir="rtl">التالي</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                )}
                {activeSection === sections.length - 1 && (
                  <button
                    onClick={() => {
                      handleSectionComplete(activeSection);
                      navigate("/lessons");
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span dir="rtl">إنهاء الدرس</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
