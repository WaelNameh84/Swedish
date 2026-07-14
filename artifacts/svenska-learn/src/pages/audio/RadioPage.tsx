import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Radio, Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { useAudioSettings } from "@/lib/audioSettings";
import { speak, speakWithTranslation, stopSpeaking } from "@/lib/speech";
import { useRadioWords } from "./useRadioWords";

export default function RadioPage() {
  const { words, loading } = useRadioWords(50);
  const { speed, autoTranslate, backgroundPlay } = useAudioSettings();
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const playingRef = useRef(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (backgroundPlay && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "راديو اللغة السويدية",
        artist: "Svenska",
      });
      navigator.mediaSession.setActionHandler("play", () => togglePlay());
      navigator.mediaSession.setActionHandler("pause", () => togglePlay());
      navigator.mediaSession.setActionHandler("nexttrack", () => next());
    }
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundPlay]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  async function playFrom(i: number) {
    playingRef.current = true;
    setPlaying(true);
    let cur = i;
    while (playingRef.current && words.length > 0) {
      cur = cur % words.length;
      indexRef.current = cur;
      setIndex(cur);
      const w = words[cur];
      await speakWithTranslation(w.word, w.translation, { rate: speed, autoTranslate });
      if (!playingRef.current) break;
      await new Promise((r) => setTimeout(r, 500));
      cur++;
    }
  }

  function togglePlay() {
    if (playing) {
      playingRef.current = false;
      setPlaying(false);
      stopSpeaking();
    } else {
      playFrom(indexRef.current);
    }
  }

  function next() {
    stopSpeaking();
    playingRef.current = false;
    setPlaying(false);
    const n = (indexRef.current + 1) % Math.max(words.length, 1);
    setTimeout(() => playFrom(n), 50);
  }

  const current = words[index];

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/audio-learning" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Radio className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">راديو اللغة</h1>
          <p className="text-xs text-muted-foreground mt-0.5">استماع مستمر للكلمات والجمل</p>
        </div>
      </header>

      <div className="p-4 flex flex-col items-center gap-6 pt-10">
        {loading ? (
          <p className="text-sm text-muted-foreground">جارٍ تحميل الكلمات...</p>
        ) : words.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            لا توجد كلمات متاحة الآن. جرّب الاتصال بالإنترنت مرة واحدة لتنزيل حزمة كلمات (من صفحة "تنزيل للاستماع بدون إنترنت").
          </p>
        ) : (
          <>
            <div
              className={`w-40 h-40 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center transition-transform ${
                playing ? "scale-105" : ""
              }`}
            >
              <Radio className={`w-16 h-16 text-primary ${playing ? "animate-pulse" : ""}`} />
            </div>

            <div className="text-center space-y-1">
              <p className="text-3xl font-black text-foreground" dir="ltr">
                {current?.word}
              </p>
              <p className="text-lg text-muted-foreground">{current?.translation}</p>
              {current?.example && (
                <div className="mt-3 bg-muted/50 rounded-2xl p-3 text-right">
                  <p className="text-sm font-bold text-foreground" dir="ltr">{current.example.sv}</p>
                  <p className="text-xs text-muted-foreground mt-1">{current.example.ar}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                {playing ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full bg-muted flex items-center justify-center active:scale-95 transition-transform"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => speak(current?.word ?? "", { lang: "sv-SE", rate: speed })}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Volume2 className="w-4 h-4" /> إعادة نطق الكلمة الحالية
            </button>

            <p className="text-xs text-muted-foreground">
              الكلمة {index + 1} من {words.length} · السرعة {speed.toFixed(1)}x
            </p>
          </>
        )}
      </div>
    </div>
  );
}
