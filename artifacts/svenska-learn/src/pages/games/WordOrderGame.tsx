import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWordPool, shuffle, type PoolWord } from "@/lib/useWordPool";
import { speak } from "@/lib/speech";
import GameHeader from "@/components/GameHeader";
import { ResultCard } from "./MultipleChoiceGame";

interface Q { sentence: string; translation: string; tokens: string[]; correct: string[] }

function buildQuestions(pool: PoolWord[]): Q[] {
  const withExamples = pool.filter((w) => w.examples && w.examples.length > 0);
  const seen = new Set<string>();
  const questions: Q[] = [];
  for (const w of withExamples) {
    const ex = w.examples[0];
    const clean = ex.sv.replace(/[.,!?]/g, "").trim();
    if (seen.has(clean) || clean.split(" ").length < 3) continue;
    seen.add(clean);
    const correct = clean.split(" ");
    questions.push({ sentence: ex.sv, translation: ex.ar, tokens: shuffle(correct), correct });
    if (questions.length >= 8) break;
  }
  return questions;
}

export default function WordOrderGame() {
  const { words, loading } = useWordPool(100);
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => buildQuestions(words), [words, seed]);
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[current];
  const activeTokens = remaining.length || picked.length ? remaining : q?.tokens ?? [];

  const pick = (word: string, idx: number) => {
    if (result) return;
    const pool = remaining.length || picked.length ? remaining : q.tokens;
    const next = [...pool];
    next.splice(idx, 1);
    setRemaining(next);
    setPicked((p) => [...p, word]);
  };

  const undo = () => {
    if (result || picked.length === 0) return;
    const last = picked[picked.length - 1];
    setPicked((p) => p.slice(0, -1));
    setRemaining((r) => [...r, last]);
  };

  const check = () => {
    const correct = picked.join(" ") === q.correct.join(" ");
    setResult(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setDone(true); return; }
    setCurrent((c) => c + 1);
    setPicked([]);
    setRemaining([]);
    setResult(null);
  };

  const restart = () => {
    setSeed((s) => s + 1); setCurrent(0); setPicked([]); setRemaining([]); setResult(null); setScore(0); setDone(false);
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="ترتيب الكلمات" subtitle={loading ? "" : `${Math.min(current + 1, questions.length)} / ${questions.length}`} />
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
              <div className="bg-card border border-card-border rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">رتّب الكلمات لتكوين الجملة الصحيحة</p>
                  <button onClick={() => speak(q.sentence, { lang: "sv-SE" })} className="text-primary">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{q.translation}</p>
              </div>

              {/* Answer slot */}
              <div
                dir="ltr"
                className={cn(
                  "min-h-16 border-2 rounded-2xl p-3 flex flex-wrap gap-2 mb-4 items-center",
                  result === "correct" ? "border-emerald-400 bg-emerald-50" :
                  result === "wrong" ? "border-rose-400 bg-rose-50" : "border-dashed border-border bg-muted/30"
                )}
              >
                {picked.length === 0 && <span className="text-xs text-muted-foreground">اضغط على الكلمات أدناه بالترتيب الصحيح</span>}
                {picked.map((w, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-sm">{w}</span>
                ))}
              </div>

              {/* Word bank */}
              <div dir="ltr" className="flex flex-wrap gap-2 mb-4">
                {activeTokens.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => pick(w, i)}
                    disabled={!!result}
                    className="px-3 py-1.5 rounded-lg bg-card border border-border font-bold text-sm hover:border-primary/40"
                  >
                    {w}
                  </button>
                ))}
              </div>

              <div className="flex gap-2.5">
                <button onClick={undo} disabled={!!result || picked.length === 0} className="px-4 py-3 rounded-2xl bg-muted font-bold text-sm disabled:opacity-40">
                  <X className="w-4 h-4" />
                </button>
                {result ? (
                  <button onClick={next} className="flex-1 bg-primary text-primary-foreground py-3 rounded-2xl font-black text-sm hover:bg-primary/90">
                    {current + 1 >= questions.length ? "النتيجة النهائية" : "السؤال التالي ←"}
                  </button>
                ) : (
                  <button
                    onClick={check}
                    disabled={activeTokens.length > 0}
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-2xl font-black text-sm hover:bg-primary/90 disabled:opacity-40"
                  >
                    تحقق من الترتيب
                  </button>
                )}
              </div>
              {result === "wrong" && (
                <p className="text-sm text-muted-foreground mt-3 text-center" dir="ltr">
                  الترتيب الصحيح: <span className="font-bold text-foreground">{q.correct.join(" ")}</span>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
