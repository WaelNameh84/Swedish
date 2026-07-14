import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWordPool, shuffle, type PoolWord } from "@/lib/useWordPool";
import { speak } from "@/lib/speech";
import GameHeader from "@/components/GameHeader";
import { ResultCard } from "./MultipleChoiceGame";

interface Q {
  word: PoolWord;
  sentence: string;
  translation: string;
  options: string[];
  correctIndex: number;
}

function buildQuestions(pool: PoolWord[]): Q[] {
  const withExamples = pool.filter((w) => w.examples && w.examples.length > 0);
  const usable = withExamples.slice(0, 10);
  return usable.map((word) => {
    const ex = word.examples[0];
    const sentence = ex.sv.replace(new RegExp(word.word, "i"), "____");
    const distractors = shuffle(pool.filter((w) => w.id !== word.id)).slice(0, 3).map((w) => w.word);
    const options = shuffle([word.word, ...distractors]);
    return { word, sentence, translation: ex.ar, options, correctIndex: options.indexOf(word.word) };
  });
}

export default function MissingWordGame() {
  const { words, loading } = useWordPool(80);
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => buildQuestions(words), [words, seed]);
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
  const restart = () => { setSeed((s) => s + 1); setCurrent(0); setSelected(null); setScore(0); setDone(false); };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="الكلمة الناقصة" subtitle={loading ? "" : `${Math.min(current + 1, questions.length)} / ${questions.length}`} />
      <div className="p-4">
        {loading ? (
          <div className="h-56 bg-muted animate-pulse rounded-2xl" />
        ) : questions.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">لا توجد جمل كافية حالياً</p>
        ) : done ? (
          <ResultCard score={score} total={questions.length} onRestart={restart} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <div className="bg-card border border-card-border rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">أكمل الجملة بالكلمة الصحيحة</p>
                  <button onClick={() => speak(q.word.examples[0].sv, { lang: "sv-SE" })} className="text-primary">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-lg font-bold text-foreground" dir="ltr">{q.sentence}</p>
                <p className="text-sm text-muted-foreground mt-1">{q.translation}</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => choose(idx)}
                    disabled={selected !== null}
                    dir="ltr"
                    className={cn(
                      "px-4 py-3.5 rounded-2xl border-2 font-bold text-sm transition-all",
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
