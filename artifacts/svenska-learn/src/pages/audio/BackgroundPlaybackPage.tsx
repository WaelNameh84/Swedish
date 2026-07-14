import { Link } from "wouter";
import { ChevronRight, Cast, Play } from "lucide-react";
import { useAudioSettings } from "@/lib/audioSettings";
import { speak } from "@/lib/speech";

export default function BackgroundPlaybackPage() {
  const { backgroundPlay, setBackgroundPlay, speed } = useAudioSettings();

  function testMediaSession() {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "اختبار التشغيل بالخلفية",
        artist: "Svenska",
      });
      navigator.mediaSession.playbackState = "playing";
    }
    speak("Det här är ett test av bakgrundsuppspelning.", { lang: "sv-SE", rate: speed });
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/audio-learning" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Cast className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">تشغيل بالخلفية</h1>
          <p className="text-xs text-muted-foreground mt-0.5">أدوات تحكّم على شاشة القفل وسماعات البلوتوث</p>
        </div>
      </header>

      <div className="p-5 space-y-6">
        <div className="bg-card border border-card-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-bold text-foreground">إظهار أدوات تحكّم بالخلفية</p>
            <p className="text-xs text-muted-foreground mt-1">
              يُفعّل عناصر تحكّم النظام (تشغيل/إيقاف/التالي) في راديو اللغة والنوم
            </p>
          </div>
          <button
            onClick={() => setBackgroundPlay(!backgroundPlay)}
            className={`w-14 h-8 rounded-full transition-colors relative shrink-0 ${
              backgroundPlay ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                backgroundPlay ? "translate-x-1" : "translate-x-7"
              }`}
            />
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-sm leading-relaxed">
          ملاحظة: استمرار الصوت أثناء قفل الشاشة أو تبديل التطبيقات يعتمد على متصفحك ونظام هاتفك.
          في معظم الأجهزة يُفضّل تثبيت التطبيق على الشاشة الرئيسية وإبقاؤه مفتوحاً في الخلفية بدل إغلاقه بالكامل.
        </div>

        <button
          onClick={testMediaSession}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold"
        >
          <Play className="w-4 h-4" /> تجربة أدوات التحكّم
        </button>
      </div>
    </div>
  );
}
