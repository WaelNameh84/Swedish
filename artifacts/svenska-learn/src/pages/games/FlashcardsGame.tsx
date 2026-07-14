import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronLeft, ChevronRight as ArrowRight, Layers } from "lucide-react";
import { useWordPool } from "@/lib/useWordPool";
import { speak } from "@/lib/speech";
import GameHeader from "@/components/GameHeader";

export default function FlashcardsGame() {
  const { words, loading, reshuffle } = useWordPool(40);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const word = words[index];

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1 < words.length ? i + 1 : 0));
  };
  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 >= 0 ? i - 1 : words.length - 1));
  };
  const markKnown = () => {
    if (word) setKnown((s) => new Set(s).add(word.id));
    goNext();
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader
        title="البطاقات التعليمية"
        subtitle={loading ? "" : `${index + 1} / ${words.length} • تعرفت على ${known.size}`}
      />
      <div className="p-4 flex flex-col items-center gap-5">
        {loading ? (
          <div className="h-64 w-full bg-muted animate-pulse rounded-3xl" />
        ) : !word ? (
          <p className="text-center text-muted-foreground py-16">لا توجد كلمات متاحة</p>
        ) : (
          <>
            <div className="w-full h-64 [perspective:1200px]" onClick={() => setFlipped((f) => !f)}>
              <motion.div
                className="relative w-full h-full cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.45 }}
              >
                <div
                  className="absolute inset-0 rounded-3xl bg-card border border-card-border shadow-md flex flex-col items-center justify-center gap-3 [backface-visibility:hidden]"
                >
                  <Layers className="w-6 h-6 text-primary/50" />
                  <span className="text-3xl font-black text-foreground" dir="ltr">{word.word}</span>
                  <span className="text-sm text-muted-foreground" dir="ltr">/{word.phonetic}/</span>
                  <p className="text-[11px] text-muted-foreground/70">اضغط لرؤية الترجمة</p>
                </div>
                <div
                  className="absolute inset-0 rounded-3xl bg-primary/10 border border-primary/30 flex flex-col items-center justify-center gap-3 [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <span className="text-2xl font-black text-primary text-center px-4">{word.translation}</span>
                  <span className="text-xs text-muted-foreground bg-background/60 px-2 py-0.5 rounded-full">{word.category}</span>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => speak(word.word, { lang: "sv-SE" })} className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-primary">
                <Volume2 className="w-5 h-5" />
              </button>
              <button onClick={goPrev} className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={markKnown}
                className="px-5 h-11 rounded-full bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600"
              >
                أعرفها ✓
              </button>
              <button onClick={goNext} className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <button onClick={reshuffle} className="text-xs text-muted-foreground underline">
              إعادة ترتيب البطاقات
            </button>
          </>
        )}
      </div>
    </div>
  );
}
