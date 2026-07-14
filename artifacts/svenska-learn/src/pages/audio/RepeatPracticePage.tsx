import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Repeat, Shuffle, Play } from "lucide-react";
import { useAudioSettings } from "@/lib/audioSettings";
import { speak, speakWithTranslation } from "@/lib/speech";
import { useRadioWords } from "./useRadioWords";

const REPEAT_COUNTS = [3, 5, 10];

export default function RepeatPracticePage() {
  const { words, loading } = useRadioWords(50);
  const { speed, autoTranslate } = useAudioSettings();
  const [wordIndex, setWordIndex] = useState(0);
  const [count, setCount] = useState(5);
  const [busy, setBusy] = useState(false);
  const [round, setRound] = useState(0);

  const current = words[wordIndex];

  function pickRandom() {
    if (words.length === 0) return;
    const i = Math.floor(Math.random() * words.length);
    setWordIndex(i);
  }

  async function playRepeats() {
    if (!current || busy) return;
    setBusy(true);
    for (let i = 0; i < count; i++) {
      setRound(i + 1);
      await speak(current.word, { lang: "sv-SE", rate: speed });
      await new Promise((r) => setTimeout(r, 400));
    }
    if (autoTranslate) {
      await speakWithTranslation(current.word, current.translation, { rate: speed, autoTranslate: true });
    }
    setBusy(false);
    setRound(0);
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/audio-learning" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Repeat className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">تكرار الكلمات</h1>
          <p className="text-xs text-muted-foreground mt-0.5">كرّر نطق الكلمة لتثبيتها في الذاكرة</p>
        </div>
      </header>

      <div className="p-4 flex flex-col items-center gap-6 pt-10">
        {loading ? (
          <p className="text-sm text-muted-foreground">جارٍ تحميل الكلمات...</p>
        ) : !current ? (
          <p className="text-sm text-muted-foreground">لا توجد كلمات متاحة الآن.</p>
        ) : (
          <>
            <div className="text-center space-y-1">
              <p className="text-3xl font-black text-foreground" dir="ltr">{current.word}</p>
              <p className="text-lg text-muted-foreground">{current.translation}</p>
            </div>

            <button
              onClick={pickRandom}
              className="flex items-center gap-1.5 text-sm text-primary font-semibold"
            >
              <Shuffle className="w-4 h-4" /> كلمة جديدة
            </button>

            <div>
              <p className="text-xs text-muted-foreground text-center mb-2">عدد مرات التكرار</p>
              <div className="grid grid-cols-3 gap-2 w-48">
                {REPEAT_COUNTS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCount(c)}
                    className={`py-2 rounded-xl text-sm font-bold transition-colors ${
                      count === c ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {c}×
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={playRepeats}
              disabled={busy}
              className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              <Play className="w-7 h-7" />
            </button>

            {busy && (
              <p className="text-sm text-muted-foreground">التكرار {round} من {count}…</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
