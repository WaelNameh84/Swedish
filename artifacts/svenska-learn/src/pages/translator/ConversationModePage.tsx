import { useState } from "react";
import { Mic, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import GameHeader from "@/components/GameHeader";
import LanguagePicker from "@/components/LanguagePicker";
import { translateText, toSpeechLang } from "@/lib/translate";
import { speakAny } from "@/lib/speech";
import { isRecognitionSupported, listenOnce } from "@/lib/speechRecognition";

interface Msg { side: "a" | "b"; original: string; translated: string }

export default function ConversationModePage() {
  const [langA, setLangA] = useState("ar");
  const [langB, setLangB] = useState("sv");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [activeSide, setActiveSide] = useState<"a" | "b" | null>(null);
  const [error, setError] = useState("");

  const speak = async (side: "a" | "b") => {
    if (!isRecognitionSupported()) {
      setError("التعرف على الصوت غير مدعوم في هذا المتصفح");
      return;
    }
    setError("");
    setActiveSide(side);
    const fromLang = side === "a" ? langA : langB;
    const toLang = side === "a" ? langB : langA;
    try {
      const text = await listenOnce(toSpeechLang(fromLang));
      if (!text.trim()) return;
      const res = await translateText(text, toLang, fromLang);
      setMessages((m) => [...m, { side, original: text, translated: res.translation }]);
      await speakAny(res.translation, toSpeechLang(toLang));
    } catch (e: any) {
      setError(e.message || "حدث خطأ");
    } finally {
      setActiveSide(null);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24 flex flex-col" dir="rtl">
      <GameHeader title="محادثة مباشرة" subtitle="محادثة ثنائية اللغة بين شخصين" backHref="/translator" />

      <div className="p-4 flex items-center justify-around border-b border-border">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground">الشخص الأول</span>
          <LanguagePicker value={langA} onChange={setLangA} excludeAuto />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground">الشخص الثاني</span>
          <LanguagePicker value={langB} onChange={setLangB} excludeAuto />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-10">
            اضغط على زر أحد الشخصين وتحدث، ستُترجم الجملة وتُقرأ بصوت عالٍ للطرف الآخر تلقائياً
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("max-w-[85%] flex flex-col gap-1", m.side === "a" ? "self-start items-start" : "self-end items-end")}>
            <div className={cn("rounded-2xl px-4 py-2.5", m.side === "a" ? "bg-muted" : "bg-primary/10")}>
              <p className="text-sm font-semibold text-foreground">{m.original}</p>
            </div>
            <div className={cn("rounded-2xl px-4 py-2 border border-dashed", m.side === "a" ? "border-border" : "border-primary/30")}>
              <p className="text-xs text-muted-foreground">{m.translated}</p>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-rose-600 text-center px-4">{error}</p>}

      <div className="p-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => speak("a")}
          disabled={activeSide !== null}
          className={cn(
            "flex flex-col items-center gap-2 py-5 rounded-2xl font-bold text-sm transition-all active:scale-95",
            activeSide === "a" ? "bg-rose-500 text-white animate-pulse" : "bg-muted text-foreground"
          )}
        >
          {activeSide === "a" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
          الشخص الأول
        </button>
        <button
          onClick={() => speak("b")}
          disabled={activeSide !== null}
          className={cn(
            "flex flex-col items-center gap-2 py-5 rounded-2xl font-bold text-sm transition-all active:scale-95",
            activeSide === "b" ? "bg-rose-500 text-white animate-pulse" : "bg-primary/10 text-primary"
          )}
        >
          {activeSide === "b" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
          الشخص الثاني
        </button>
      </div>
    </div>
  );
}
