import { useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Mic, Square, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

const SUGGESTED_PHRASES = [
  "Hej, hur mår du idag?",
  "Jag skulle vilja beställa en kaffe.",
  "Var ligger tågstationen?",
  "Tack så mycket för hjälpen!",
];

export default function PronunciationPage() {
  const [targetText, setTargetText] = useState(SUGGESTED_PHRASES[0]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiDisabled, setAiDisabled] = useState(false);
  const [result, setResult] = useState<{ score: number; heardText: string; feedback: string } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    setResult(null);
    setAiDisabled(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        void submitRecording();
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch {
      setError("لم نتمكن من الوصول إلى الميكروفون. تأكد من إعطاء الإذن للمتصفح.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const submitRecording = async () => {
    setLoading(true);
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      formData.append("targetText", targetText);

      const res = await fetch(`${BASE_URL}/api/ai-teacher/pronunciation`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
        if (data.aiDisabled) setAiDisabled(true);
        return;
      }
      setResult(data);
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-28">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/ai-teacher" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Mic className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground leading-tight">تقييم النطق</h1>
      </header>

      <div className="p-4 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          اختر جملة أو اكتب جملتك الخاصة، ثم اضغط على الميكروفون ونطقها بالسويدية للحصول على تقييم فوري.
        </p>

        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PHRASES.map((p) => (
            <button
              key={p}
              onClick={() => setTargetText(p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                targetText === p
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border"
              }`}
              dir="ltr"
            >
              {p}
            </button>
          ))}
        </div>

        <Input
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          dir="ltr"
          className="text-[15px] bg-card font-medium"
          placeholder="اكتب جملة بالسويدية لنطقها"
        />

        <div className="flex flex-col items-center gap-3 py-6">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={loading}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
              recording ? "bg-destructive text-destructive-foreground scale-110" : "bg-primary text-primary-foreground"
            }`}
          >
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : recording ? (
              <Square className="w-7 h-7" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
          <span className="text-xs text-muted-foreground">
            {loading ? "جارٍ التقييم..." : recording ? "اضغط للإيقاف" : "اضغط وابدأ النطق"}
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
            {aiDisabled && (
              <p className="mt-1 text-muted-foreground">
                سيتم تفعيل هذه الميزة بعد ربط مفتاح OpenAI بالمشروع.
              </p>
            )}
          </div>
        )}

        {result && (
          <div className="p-4 rounded-2xl bg-card border border-card-border shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                  result.score >= 80
                    ? "bg-emerald-500/15 text-emerald-600"
                    : result.score >= 50
                    ? "bg-amber-500/15 text-amber-600"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {result.score}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">درجة النطق</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> ما سمعه النظام: <span dir="ltr">{result.heardText || "—"}</span>
                </span>
              </div>
            </div>
            <p className="text-[15px] text-foreground leading-relaxed">{result.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}
