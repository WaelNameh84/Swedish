import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MCQQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  imageUrl?: string | null;
}

// Generic multiple-choice quiz with immediate per-question correction
// (selecting an answer reveals the correct option right away), used across
// Dictionary / Conversations / other sections that need a graded test.
export function MCQuiz({ questions }: { questions: MCQQuestion[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center" dir="rtl">
        <p className="text-sm text-muted-foreground font-semibold">لا يوجد اختبار متاح لهذا المحتوى بعد</p>
      </div>
    );
  }

  const q = questions[current];

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-5" dir="rtl">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <div>
          <p className="text-4xl font-black text-foreground">{pct}%</p>
          <p className="text-muted-foreground font-semibold mt-1">
            {score} من {questions.length} إجابة صحيحة
          </p>
        </div>
        <p className="font-bold text-foreground">
          {pct >= 90 ? "ممتاز! أداء رائع 🎉" : pct >= 70 ? "جيد جداً! استمر." : pct >= 40 ? "لا بأس، راجع وحاول مجدداً." : "تحتاج لمراجعة هذا المحتوى."}
        </p>
        <button
          onClick={restart}
          className="mx-auto flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-foreground font-bold text-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة الاختبار
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-muted-foreground">
          <span>السؤال {current + 1} من {questions.length}</span>
          <span>النتيجة: {score}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${(current / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {q.imageUrl && (
            <div className="w-full h-32 rounded-2xl overflow-hidden bg-muted">
              <img src={q.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
          <div className="bg-card border border-card-border rounded-2xl p-4">
            <p className="font-bold text-foreground leading-relaxed" dir="ltr" style={{ direction: /[\u0600-\u06FF]/.test(q.question) ? "rtl" : "ltr" }}>
              {q.question}
            </p>
          </div>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectOpt = i === q.correct;
              const showState = selected !== null;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={selected !== null}
                  className={cn(
                    "w-full py-3.5 px-4 rounded-2xl text-sm font-semibold text-right transition-all border flex items-center justify-between gap-2",
                    !showState && "bg-card border-card-border text-foreground hover:border-primary/30 hover:bg-secondary/50 active:scale-[0.98]",
                    showState && isCorrectOpt && "bg-emerald-50 border-emerald-400 text-emerald-800",
                    showState && isSelected && !isCorrectOpt && "bg-rose-50 border-rose-400 text-rose-800",
                    showState && !isSelected && !isCorrectOpt && "opacity-50 border-card-border"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-black text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </span>
                  {showState && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {showState && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {selected !== null && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className={cn("rounded-2xl p-3 text-center font-black text-sm", selected === q.correct ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200")}>
                  {selected === q.correct ? "✓ إجابة صحيحة!" : `✗ إجابة خاطئة — الصحيحة: ${q.options[q.correct]}`}
                </div>
                {q.explanation && (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={next}
        disabled={selected === null}
        className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
      >
        {current + 1 >= questions.length ? "عرض النتيجة" : "السؤال التالي"}
      </button>
    </div>
  );
}
