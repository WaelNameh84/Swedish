import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Timer, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWordPool, shuffle, type PoolWord } from "@/lib/useWordPool";
import GameHeader from "@/components/GameHeader";
import { ResultCard } from "./MultipleChoiceGame";

interface Q { word: PoolWord; options: string[]; correctIndex: number }

function buildQuestions(pool: PoolWord[]): Q[] {
  return pool.map((word) => {
    const distractors = shuffle(pool.filter((w) => w.id !== word.id)).slice(0, 3).map((w) => w.translation);
    const options = shuffle([word.translation, ...distractors]);
    return { word, options, correctIndex: options.indexOf(word.translation) };
  });
}

const DURATION = 60;

export default function SpeedChallengeGame() {
  const { words, loading } = useWordPool(100);
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => shuffle(buildQuestions(words)), [words, seed]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started || done) return;
    if (timeLeft <= 0) { setDone(true); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, done]);

  const q = questions[current % questions.length];

  const choose = (idx: number) => {
    if (done) return;
    if (idx === q.correctIndex) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setCurrent((c) => c + 1);
  };

  const restart = () => {
    setSeed((s) => s + 1); setCurrent(0); setScore(0); setStreak(0); setTimeLeft(DURATION); setStarted(true); setDone(false);
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader
        title="تحدي السرعة"
        subtitle={loading ? "" : `النتيجة: ${score} • تتابع: ${streak}`}
        right={started && !done ? (
          <div className={cn("flex items-center gap-1 font-black text-sm px-2.5 py-1 rounded-full", timeLeft <= 10 ? "bg-rose-100 text-rose-600" : "bg-primary/10 text-primary")}>
            <Timer className="w-3.5 h-3.5" /> {timeLeft}s
          </div>
        ) : null}
      />
      <div className="p-4">
        {loading ? (
          <div className="h-56 bg-muted animate-pulse rounded-2xl" />
        ) : questions.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">لا توجد كلمات كافية حالياً</p>
        ) : !started ? (
          <div className="text-center py-14">
            <Zap className="w-14 h-14 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-black mb-2">جاهز للتحدي؟</h2>
            <p className="text-sm text-muted-foreground mb-6">أجب على أكبر عدد من الأسئلة في {DURATION} ثانية</p>
            <button onClick={() => setStarted(true)} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-black hover:bg-primary/90">
              ابدأ التحدي
            </button>
          </div>
        ) : done ? (
          <ResultCard score={score} total={Math.max(current, 1)} onRestart={restart} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-card border border-card-border rounded-2xl p-6 mb-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">ما ترجمة الكلمة؟</p>
                <span className="text-2xl font-black text-foreground" dir="ltr">{q.word.word}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => choose(idx)}
                    className="px-3 py-4 rounded-2xl border-2 border-border bg-card font-bold text-sm hover:border-primary/40 active:scale-95 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
