import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Mic2, Square, Shuffle, Volume2, RotateCcw } from "lucide-react";
import { useRadioWords } from "@/pages/audio/useRadioWords";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { speak } from "@/lib/speech";

export default function RecordVoicePage() {
  const { words, loading } = useRadioWords(40);
  const [index, setIndex] = useState(0);
  const { recording, audioUrl, error, start, stop, reset } = useVoiceRecorder();

  useEffect(() => {
    if (words.length > 0) setIndex(Math.floor(Math.random() * words.length));
  }, [words.length]);

  const word = words[index];

  const nextWord = () => {
    reset();
    if (words.length > 0) setIndex(Math.floor(Math.random() * words.length));
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-28">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/pronunciation" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Mic2 className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground leading-tight">تسجيل صوتك</h1>
      </header>

      <div className="p-4 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          سجّل نفسك تنطق الكلمة، ثم استمع للتسجيل لتسمع كيف يبدو نطقك. لا حاجة لاتصال بالإنترنت.
        </p>

        <div className="p-5 rounded-2xl bg-card border border-card-border shadow-sm flex flex-col items-center gap-2 text-center">
          {loading && !word ? (
            <span className="text-sm text-muted-foreground">جارٍ التحميل...</span>
          ) : word ? (
            <>
              <span className="text-2xl font-bold text-foreground" dir="ltr">{word.word}</span>
              <span className="text-sm text-muted-foreground">{word.translation}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">لا توجد كلمات متاحة حالياً</span>
          )}
          <button
            onClick={nextWord}
            className="mt-2 flex items-center gap-1.5 text-xs text-primary font-medium"
          >
            <Shuffle className="w-3.5 h-3.5" /> كلمة أخرى
          </button>
        </div>

        <button
          onClick={() => word && speak(word.word, { lang: "sv-SE" })}
          disabled={!word}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-foreground text-sm font-medium disabled:opacity-50"
        >
          <Volume2 className="w-4 h-4" /> استمع للنطق الصحيح
        </button>

        <div className="flex flex-col items-center gap-3 py-6">
          <button
            onClick={recording ? stop : start}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
              recording ? "bg-destructive text-destructive-foreground scale-110" : "bg-primary text-primary-foreground"
            }`}
          >
            {recording ? <Square className="w-7 h-7" /> : <Mic2 className="w-8 h-8" />}
          </button>
          <span className="text-xs text-muted-foreground">
            {recording ? "اضغط للإيقاف" : "اضغط وابدأ التسجيل"}
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
            <button
              onClick={reset}
              className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" /> أعد التسجيل
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
