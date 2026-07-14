import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWordPool, shuffle, type PoolWord } from "@/lib/useWordPool";
import GameHeader from "@/components/GameHeader";
import { ResultCard } from "./MultipleChoiceGame";

interface Q { word: PoolWord; options: PoolWord[]; correctIndex: number }

function buildQuestions(pool: PoolWord[]): Q[] {
  const withImages = pool.filter((w) => !!w.imageUrl);
  const picks = withImages.slice(0, 10);
  return picks.map((word) => {
    const distractors = shuffle(withImages.filter((w) => w.id !== word.id)).slice(0, 3);
    const options = shuffle([word, ...distractors]);
    return { word, options, correctIndex: options.indexOf(word) };
  });
}

export default function PictureGame() {
  const { words, loading } = useWordPool(150);
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
      <GameHeader title="لعبة الصور" subtitle={loading ? "" : `${Math.min(current + 1, questions.length)} / ${questions.length}`} />
      <div className="p-4">
        {loading ? (
          <div className="h-56 bg-muted animate-pulse rounded-2xl" />
        ) : questions.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3">
            <ImageIcon className="w-10 h-10 opacity-40" />
            <p>لا توجد كلمات بصور كافية حالياً</p>
          </div>
        ) : done ? (
          <ResultCard score={score} total={questions.length} onRestart={restart} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <div className="bg-card border border-card-border rounded-2xl p-6 mb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">أي صورة تمثّل الكلمة؟</p>
                <span className="text-2xl font-black text-foreground" dir="ltr">{q.word.word}</span>
                <p className="text-sm text-muted-foreground mt-1">{q.word.translation}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, idx) => (
                  <button
                    key={opt.id}
                    onClick={() => choose(idx)}
                    disabled={selected !== null}
                    className={cn(
                      "relative rounded-2xl overflow-hidden border-2 aspect-square transition-all",
                      selected === null
                        ? "border-border hover:border-primary/40"
                        : idx === q.correctIndex
                        ? "border-emerald-400 ring-2 ring-emerald-300"
                        : idx === selected
                        ? "border-rose-400 opacity-60"
                        : "border-border opacity-50"
                    )}
                  >
                    <img src={opt.imageUrl ?? ""} alt={opt.word} className="w-full h-full object-cover" />
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
