import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, GitCompare, Square, Shuffle, Volume2, Mic2, Play } from "lucide-react";
import { useRadioWords } from "@/pages/audio/useRadioWords";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { speak } from "@/lib/speech";

export default function ComparePronunciationPage() {
  const { words, loading } = useRadioWords(40);
  const [index, setIndex] = useState(0);
  const { recording, audioUrl, error, start, stop, reset } = useVoiceRecorder();
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    if (words.length > 0) setIndex(Math.floor(Math.random() * words.length));
  }, [words.length]);

  const word = words[index];

  const nextWord = () => {
    reset();
    if (words.length > 0) setIndex(Math.floor(Math.random() * words.length));
  };

  const playComparison = async () => {
    if (!word || !audioUrl) return;
    setComparing(true);
    await speak(word.word, { lang: "sv-SE" });
    await new Promise((r) => setTimeout(r, 300));
    await new Promise<void>((resolve) => {
      const audio = new Audio(audioUrl);
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
    setComparing(false);
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-28">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/pronunciation" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <GitCompare className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground leading-tight">مقارنة النطق</h1>
      </header>

      <div className="p-4 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          استمع للنطق الأصلي، سجّل صوتك، ثم شغّل الاثنين تباعاً لتسمع الفرق بنفسك.
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
          <button onClick={nextWord} className="mt-2 flex items-center gap-1.5 text-xs text-primary font-medium">
            <Shuffle className="w-3.5 h-3.5" /> كلمة أخرى
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/60">
            <span className="text-xs font-semibold text-muted-foreground">1. النطق الأصلي</span>
            <button
              onClick={() => word && speak(word.word, { lang: "sv-SE" })}
              disabled={!word}
              className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/60">
            <span className="text-xs font-semibold text-muted-foreground">2. صوتك</span>
            <button
              onClick={recording ? stop : start}
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                recording ? "bg-destructive text-destructive-foreground scale-110" : "bg-primary text-primary-foreground"
              }`}
            >
              {recording ? <Square className="w-6 h-6" /> : <Mic2 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {audioUrl && (
          <button
            onClick={playComparison}
            disabled={comparing}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
          >
            <Play className="w-4 h-4" /> {comparing ? "جارٍ التشغيل..." : "قارن الآن (الأصلي ثم صوتك)"}
          </button>
        )}
      </div>
    </div>
  );
}
