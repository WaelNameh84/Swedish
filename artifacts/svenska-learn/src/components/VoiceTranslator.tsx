import { useRef, useState } from "react";
import { Languages, Mic, Square, Loader2, Volume2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

const LANG_LABEL: Record<string, string> = { sv: "السويدية", ar: "العربية", en: "الإنكليزية" };

type Turn = {
  id: number;
  detectedLang: string;
  targetLang: string;
  original: string;
  translation: string;
};

export default function VoiceTranslator() {
  const [open, setOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [error, setError] = useState<string | null>(null);
  const [aiDisabled, setAiDisabled] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    setError(null);
    setAiDisabled(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        void handleTurn();
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
      setStatus("listening");
    } catch {
      setError("لم نتمكن من الوصول إلى الميكروفون. تأكد من إعطاء الإذن للمتصفح.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleTurn = async () => {
    setStatus("thinking");
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });

      // 1) Speech-to-text
      const sttForm = new FormData();
      sttForm.append("audio", blob, "recording.webm");
      sttForm.append("targetText", "");
      const sttRes = await fetch(`${BASE_URL}/api/ai-teacher/transcribe`, {
        method: "POST",
        body: sttForm,
      });
      const sttData = await sttRes.json();
      if (!sttRes.ok) {
        setError(sttData.error || "تعذر فهم الصوت");
        if (sttData.aiDisabled) setAiDisabled(true);
        setStatus("idle");
        return;
      }
      const heard: string = sttData.text?.trim();
      if (!heard) {
        setError("لم أسمع شيئاً واضحاً، حاول مرة أخرى.");
        setStatus("idle");
        return;
      }

      // 2) Translate
      const trRes = await fetch(`${BASE_URL}/api/ai-teacher/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: heard }),
      });
      const trData = await trRes.json();
      if (!trRes.ok) {
        setError(trData.error || "تعذرت الترجمة");
        if (trData.aiDisabled) setAiDisabled(true);
        setStatus("idle");
        return;
      }

      const turn: Turn = {
        id: Date.now(),
        detectedLang: trData.detectedLang,
        targetLang: trData.targetLang,
        original: heard,
        translation: trData.translation,
      };
      setTurns((prev) => [turn, ...prev]);

      // 3) Speak translation aloud
      setStatus("speaking");
      const speakRes = await fetch(`${BASE_URL}/api/ai-teacher/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trData.translation, lang: trData.targetLang }),
      });
      if (speakRes.ok) {
        const audioBlob = await speakRes.blob();
        const url = URL.createObjectURL(audioBlob);
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = url;
        await audioRef.current.play().catch(() => {});
      }
      setStatus("idle");
    } catch {
      setError("تعذر الاتصال بالخادم");
      setStatus("idle");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="مترجم فوري"
          className="fixed bottom-[84px] left-4 z-[65] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-500 shadow-lg flex items-center justify-center text-primary-foreground active:scale-95 transition-transform"
        >
          <Languages className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85dvh] rounded-t-3xl flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-border flex-row items-center justify-between text-right">
          <SheetTitle className="text-base">المترجم الفوري — سويدي ⇄ عربي</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {turns.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center my-auto gap-3 py-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Languages className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
                اضغط على الميكروفون وتحدّث بالسويدية أو العربية أو الإنكليزية — سأفهم اللغة تلقائياً وأترجمها فوراً صوتاً ونصاً.
              </p>
            </div>
          )}

          {turns.map((t) => (
            <div key={t.id} className="rounded-2xl border border-card-border bg-card p-3 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{LANG_LABEL[t.detectedLang] ?? t.detectedLang}</span>
                <span>←→</span>
                <span>{LANG_LABEL[t.targetLang] ?? t.targetLang}</span>
              </div>
              <p dir="auto" className="text-[15px] text-foreground font-medium">{t.original}</p>
              <div className="h-px bg-border" />
              <p dir="auto" className="text-[15px] text-primary font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 shrink-0" /> {t.translation}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mx-4 mb-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
            {aiDisabled && (
              <p className="mt-1 text-muted-foreground">سيتم تفعيل هذه الميزة بعد ربط مفتاح OpenAI بالمشروع.</p>
            )}
          </div>
        )}

        <div className="p-4 border-t border-border flex flex-col items-center gap-2 pb-safe">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={status === "thinking" || status === "speaking"}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
              recording ? "bg-destructive text-destructive-foreground scale-110" : "bg-primary text-primary-foreground"
            }`}
          >
            {status === "thinking" || status === "speaking" ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : recording ? (
              <Square className="w-6 h-6" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </button>
          <span className="text-xs text-muted-foreground">
            {status === "listening" && "أستمع..."}
            {status === "thinking" && "أترجم..."}
            {status === "speaking" && "أنطق الترجمة..."}
            {status === "idle" && !recording && "اضغط للتحدث"}
          </span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
