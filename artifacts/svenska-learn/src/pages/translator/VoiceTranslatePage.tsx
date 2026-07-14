import { useState } from "react";
import { Mic, ArrowLeftRight, Volume2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import GameHeader from "@/components/GameHeader";
import LanguagePicker from "@/components/LanguagePicker";
import { translateText, toSpeechLang } from "@/lib/translate";
import { speakAny } from "@/lib/speech";
import { isRecognitionSupported, listenOnce } from "@/lib/speechRecognition";

export default function VoiceTranslatePage() {
  const [source, setSource] = useState("sv");
  const [target, setTarget] = useState("ar");
  const [heard, setHeard] = useState("");
  const [translated, setTranslated] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const swap = () => {
    setSource(target);
    setTarget(source);
    setHeard(translated);
    setTranslated(heard);
  };

  const record = async () => {
    setError("");
    if (!isRecognitionSupported()) {
      setError("التعرف على الصوت غير مدعوم في هذا المتصفح، جرّب Chrome على الجوال أو الحاسوب");
      return;
    }
    setListening(true);
    setHeard("");
    setTranslated("");
    try {
      const text = await listenOnce(toSpeechLang(source));
      setHeard(text);
      if (text.trim()) {
        setLoading(true);
        const res = await translateText(text, target, source);
        setTranslated(res.translation);
        await speakAny(res.translation, toSpeechLang(target));
      }
    } catch (e: any) {
      setError(e.message || "حدث خطأ");
    } finally {
      setListening(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="صوت لصوت" subtitle="تحدث واستمع للترجمة فوراً" backHref="/translator" />
      <div className="p-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <LanguagePicker value={source} onChange={setSource} excludeAuto />
          <button onClick={swap} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <LanguagePicker value={target} onChange={setTarget} excludeAuto />
        </div>

        <div className="flex flex-col items-center gap-3 py-6">
          <button
            onClick={record}
            disabled={listening || loading}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95",
              listening ? "bg-rose-500 animate-pulse" : "bg-primary"
            )}
          >
            {loading ? <Loader2 className="w-9 h-9 text-white animate-spin" /> : <Mic className="w-9 h-9 text-white" />}
          </button>
          <p className="text-xs text-muted-foreground">
            {listening ? "أستمع الآن..." : loading ? "جاري الترجمة..." : "اضغط وتحدث"}
          </p>
        </div>

        {error && <p className="text-sm text-rose-600 text-center">{error}</p>}

        {heard && (
          <div className="bg-card border border-card-border rounded-2xl p-4">
            <p className="text-[10px] text-muted-foreground mb-1">ما قلته</p>
            <p className="text-base font-semibold text-foreground">{heard}</p>
          </div>
        )}

        {translated && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <p className="text-[10px] text-muted-foreground mb-1">الترجمة</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-lg font-bold text-foreground">{translated}</p>
              <button onClick={() => speakAny(translated, toSpeechLang(target))} className="text-primary shrink-0">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
