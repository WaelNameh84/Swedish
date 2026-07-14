import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Moon, Play, Square } from "lucide-react";
import { useAudioSettings } from "@/lib/audioSettings";
import { speakWithTranslation, stopSpeaking } from "@/lib/speech";
import { useRadioWords } from "./useRadioWords";

const DURATIONS = [15, 30, 45, 60];

export default function SleepModePage() {
  const { words, loading } = useRadioWords(60);
  const { speed, autoTranslate, backgroundPlay } = useAudioSettings();
  const [duration, setDuration] = useState(30);
  const [running, setRunning] = useState(false);
  const [remainingSec, setRemainingSec] = useState(0);
  const runningRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (backgroundPlay && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "وضع النوم — Svenska",
        artist: "استماع هادئ قبل النوم",
      });
    }
  }, [backgroundPlay]);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      stopSpeaking();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function start() {
    if (words.length === 0) return;
    runningRef.current = true;
    setRunning(true);
    setRemainingSec(duration * 60);

    timerRef.current = setInterval(() => {
      setRemainingSec((s) => {
        if (s <= 1) {
          stop();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    let i = 0;
    while (runningRef.current) {
      const w = words[i % words.length];
      await speakWithTranslation(w.word, w.translation, {
        rate: Math.max(0.6, speed - 0.15),
        autoTranslate,
      });
      if (!runningRef.current) break;
      await new Promise((r) => setTimeout(r, 3500));
      i++;
    }
  }

  function stop() {
    runningRef.current = false;
    setRunning(false);
    stopSpeaking();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  const mm = String(Math.floor(remainingSec / 60)).padStart(2, "0");
  const ss = String(remainingSec % 60).padStart(2, "0");

  return (
    <div
      className={`min-h-[100dvh] w-full max-w-2xl mx-auto pb-24 transition-colors ${
        running ? "bg-slate-950 text-slate-100" : ""
      }`}
      dir="rtl"
    >
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-4 flex items-center gap-3 ${
          running ? "bg-slate-950/95 border-slate-800" : "bg-background/95 border-border"
        }`}
      >
        <Link
          href="/audio-learning"
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            running ? "bg-slate-800" : "bg-muted"
          }`}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <Moon className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">تشغيل أثناء النوم</h1>
          <p className={`text-xs mt-0.5 ${running ? "text-slate-400" : "text-muted-foreground"}`}>
            استماع هادئ يساعدك على النوم والتعلم معاً
          </p>
        </div>
      </header>

      <div className="p-4 flex flex-col items-center gap-8 pt-14">
        {loading ? (
          <p className="text-sm text-muted-foreground">جارٍ تحميل الكلمات...</p>
        ) : (
          <>
            {!running ? (
              <>
                <p className="text-sm text-muted-foreground">اختر مدة الاستماع</p>
                <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`py-3 rounded-xl text-sm font-bold transition-colors ${
                        duration === d
                          ? "bg-indigo-500 text-white"
                          : "bg-muted text-foreground hover:bg-indigo-50"
                      }`}
                    >
                      {d} د
                    </button>
                  ))}
                </div>
                <button
                  onClick={start}
                  disabled={words.length === 0}
                  className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-40"
                >
                  <Play className="w-7 h-7" />
                </button>
              </>
            ) : (
              <>
                <div className="w-44 h-44 rounded-full bg-indigo-500/10 border-4 border-indigo-500/30 flex items-center justify-center">
                  <Moon className="w-16 h-16 text-indigo-300 animate-pulse" />
                </div>
                <p className="text-4xl font-black tabular-nums">{mm}:{ss}</p>
                <p className="text-sm text-slate-400">يتم تشغيل الكلمات بصوت هادئ وبطيء…</p>
                <button
                  onClick={stop}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 text-slate-100"
                >
                  <Square className="w-4 h-4" /> إيقاف
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
