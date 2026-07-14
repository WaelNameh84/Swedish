import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Dumbbell, Square, Volume2, Mic2, ChevronLeft, RotateCcw } from "lucide-react";
import { useRadioWords } from "@/pages/audio/useRadioWords";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { speak } from "@/lib/speech";

export default function PronunciationExercisesPage() {
  const { words, loading } = useRadioWords(15);
  const [index, setIndex] = useState(0);
  const { recording, audioUrl, error, start, stop, reset } = useVoiceRecorder();

  const word = words[index];
  const done = words.length > 0 && index >= words.length;

  const next = () => {
    reset();
    setIndex((i) => i + 1);
  };

  const restart = () => {
    reset();
    setIndex(0);
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-28">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/pronunciation" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">تمارين النطق</h1>
          {words.length > 0 && !done && (
            <p className="text-xs text-muted-foreground mt-0.5">
              كلمة {Math.min(index + 1, words.length)} من {words.length}
            </p>
          )}
        </div>
      </header>

      <div className="p-4 flex flex-col gap-4">
        {loading && words.length === 0 ? (
          <span className="text-sm text-muted-foreground text-center py-10">جارٍ التحميل...</span>
        ) : done ? (
          <div className="p-6 rounded-2xl bg-card border border-card-border shadow-sm flex flex-col items-center gap-3 text-center">
            <span className="text-lg font-bold text-foreground">أحسنت! أنهيت جميع التمارين 🎉</span>
            <button
              onClick={restart}
              className="flex items-center gap-1.5 text-sm text-primary font-medium"
            >
              <RotateCcw className="w-4 h-4" /> ابدأ من جديد
            </button>
          </div>
        ) : word ? (
          <>
            <div className="p-5 rounded-2xl bg-card border border-card-border shadow-sm flex flex-col items-center gap-2 text-center">
              <span className="text-2xl font-bold text-foreground" dir="ltr">{word.word}</span>
              <span className="text-sm text-muted-foreground">{word.translation}</span>
            </div>

            <button
              onClick={() => speak(word.word, { lang: "sv-SE" })}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-foreground text-sm font-medium"
            >
              <Volume2 className="w-4 h-4" /> استمع للنطق الصحيح
            </button>

            <div className="flex flex-col items-center gap-3 py-4">
              <button
                onClick={recording ? stop : start}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  recording ? "bg-destructive text-destructive-foreground scale-110" : "bg-primary text-primary-foreground"
                }`}
              >
                {recording ? <Square className="w-7 h-7" /> : <Mic2 className="w-8 h-8" />}
              </button>
              <span className="text-xs text-muted-foreground">
                {recording ? "اضغط للإيقاف" : "اضغط وانطق الكلمة"}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {audioUrl && (
              <div className="p-4 rounded-2xl bg-card border border-card-border shadow-sm flex flex-col gap-3">
                <span className="text-sm font-semibold text-foreground">تسجيلك</span>
                <audio src={audioUrl} controls className="w-full" />
              </div>
            )}

            <button
              onClick={next}
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              التالي <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <span className="text-sm text-muted-foreground text-center py-10">لا توجد كلمات متاحة حالياً</span>
        )}
      </div>
    </div>
  );
}
