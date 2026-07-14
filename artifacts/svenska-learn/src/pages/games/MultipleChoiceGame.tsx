import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Volume2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWordPool, shuffle, type PoolWord } from "@/lib/useWordPool";
import { speak } from "@/lib/speech";
import GameHeader from "@/components/GameHeader";

interface Question {
  word: PoolWord;
  options: string[];
  correctIndex: number;
}

function buildQuestions(pool: PoolWord[], count: number): Question[] {
  const picks = pool.slice(0, count);
  return picks.map((word) => {
    const distractors = shuffle(pool.filter((w) => w.id !== word.id))
      .slice(0, 3)
      .map((w) => w.translation);
    const options = shuffle([word.translation, ...distractors]);
    return { word, options, correctIndex: options.indexOf(word.translation) };
  });
}

export default function MultipleChoiceGame() {
  const { words, loading } = useWordPool(60);
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => buildQuestions(words, Math.min(10, words.length)), [words, seed]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[current];

  const choose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setDone(true); return; }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="اختيار من متعدد" subtitle={loading ? "" : `${current + 1 > questions.length ? questions.length : current + 1} / ${questions.length}`} />
      <div className="p-4">
        {loading ? (
          <div className="h-56 bg-muted animate-pulse rounded-2xl" />
        ) : questions.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">لا توجد كلمات كافية حالياً</p>
        ) : done ? (
          <ResultCard score={score} total={questions.length} onRestart={restart} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <div className="bg-card border border-card-border rounded-2xl p-6 mb-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">ما ترجمة الكلمة؟</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-foreground" dir="ltr">{q.word.word}</span>
                  <button onClick={() => speak(q.word.word, { lang: "sv-SE" })} className="text-primary">
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1" dir="ltr">/{q.word.phonetic}/</p>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => choose(idx)}
                    disabled={selected !== null}
                    className={cn(
                      "w-full text-right px-4 py-3.5 rounded-2xl border-2 font-semibold text-sm transition-all",
                      selected === null
                        ? "border-border bg-card hover:border-primary/40"
                        : idx === q.correctIndex
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : idx === selected
                        ? "border-rose-400 bg-rose-50 text-rose-700"
                        : "border-border bg-card opacity-50"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selected !== null && (
                <button
                  onClick={next}
                  className="w-full mt-4 bg-primary text-primary-foreground py-3.5 rounded-2xl font-black text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
                >
                  {current + 1 >= questions.length ? "النتيجة النهائية" : "السؤال التالي ←"}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export function ResultCard({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
  const pct = total ? Math.round((score / total) * 100) : 0;
  return (
    <div className="text-center py-10">
      <div className="text-6xl mb-4">{pct >= 70 ? "🏆" : pct >= 40 ? "💪" : "📚"}</div>
      <h2 className="text-2xl font-black mb-1">انتهت اللعبة!</h2>
      <p className="text-muted-foreground mb-6">
        نتيجتك: <span className="font-black text-primary text-xl">{score}</span> / {total} ({pct}%)
      </p>
      <button
        onClick={onRestart}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-primary/90"
      >
        <RotateCcw className="w-4 h-4" /> العب مرة أخرى
      </button>
    </div>
  );
}

export const IconCheckSquare = CheckSquare;
