import { Link } from "wouter";
import { ChevronRight, Gauge, Play } from "lucide-react";
import { useAudioSettings } from "@/lib/audioSettings";
import { speak } from "@/lib/speech";

const PRESETS = [
  { label: "بطيء جداً", value: 0.6 },
  { label: "بطيء", value: 0.8 },
  { label: "عادي", value: 1.0 },
  { label: "سريع", value: 1.3 },
  { label: "سريع جداً", value: 1.7 },
];

export default function AudioSpeedPage() {
  const { speed, setSpeed } = useAudioSettings();

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/audio-learning" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Gauge className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">سرعة الصوت</h1>
          <p className="text-xs text-muted-foreground mt-0.5">يطبَّق على كل ميزات النطق في التطبيق</p>
        </div>
      </header>

      <div className="p-5 space-y-8">
        <div className="bg-card border border-card-border rounded-2xl p-5 text-center">
          <p className="text-4xl font-black text-primary">{speed.toFixed(1)}x</p>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full mt-4 accent-primary"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span>0.5x</span>
            <span>2.0x</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setSpeed(p.value)}
              className={`py-3 rounded-xl text-sm font-bold transition-colors ${
                Math.abs(speed - p.value) < 0.05
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => speak("Hej, hur mår du idag?", { lang: "sv-SE", rate: speed })}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold"
        >
          <Play className="w-4 h-4" /> تجربة السرعة
        </button>
      </div>
    </div>
  );
}
