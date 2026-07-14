import { Link } from "wouter";
import { ChevronRight, Languages, Play } from "lucide-react";
import { useAudioSettings } from "@/lib/audioSettings";
import { speakWithTranslation } from "@/lib/speech";

export default function AutoTranslatePage() {
  const { autoTranslate, setAutoTranslate, speed } = useAudioSettings();

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/audio-learning" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Languages className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">ترجمة تلقائية</h1>
          <p className="text-xs text-muted-foreground mt-0.5">نطق الترجمة العربية بعد كل جملة سويدية</p>
        </div>
      </header>

      <div className="p-5 space-y-6">
        <div className="bg-card border border-card-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-bold text-foreground">تفعيل الترجمة الصوتية</p>
            <p className="text-xs text-muted-foreground mt-1">
              يُستخدم في راديو اللغة، النوم، وتكرار الكلمات
            </p>
          </div>
          <button
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={`w-14 h-8 rounded-full transition-colors relative shrink-0 ${
              autoTranslate ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                autoTranslate ? "translate-x-1" : "translate-x-7"
              }`}
            />
          </button>
        </div>

        <button
          onClick={() =>
            speakWithTranslation("Jag lär mig svenska varje dag.", "أنا أتعلم السويدية كل يوم.", {
              rate: speed,
              autoTranslate: true,
            })
          }
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold"
        >
          <Play className="w-4 h-4" /> تجربة (سويدي ثم عربي)
        </button>
      </div>
    </div>
  );
}
