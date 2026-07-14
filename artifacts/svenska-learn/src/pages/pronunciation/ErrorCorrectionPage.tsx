import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, AlertTriangle, Square, Shuffle, Volume2, Mic2, Loader2, CheckCircle2 } from "lucide-react";
import { useRadioWords } from "@/pages/audio/useRadioWords";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { speak } from "@/lib/speech";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

interface ErrorItem {
  word: string;
  issue: string;
}

export default function ErrorCorrectionPage() {
  const { words, loading: wordsLoading } = useRadioWords(40);
  const [index, setIndex] = useState(0);
  const { recording, audioBlob, error: recError, start, stop, reset } = useVoiceRecorder();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiDisabled, setAiDisabled] = useState(false);
  const [result, setResult] = useState<{ errors: ErrorItem[]; tip: string } | null>(null);

  useEffect(() => {
    if (words.length > 0) setIndex(Math.floor(Math.random() * words.length));
  }, [words.length]);

  const word = words[index];

  const nextWord = () => {
    reset();
    setResult(null);
    setError(null);
    setAiDisabled(false);
    if (words.length > 0) setIndex(Math.floor(Math.random() * words.length));
  };

  const submit = async (blob: Blob) => {
    if (!word) return;
    setSubmitting(true);
    setError(null);
    setAiDisabled(false);
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      formData.append("targetText", word.example?.sv ?? word.word);

      const res = await fetch(`${BASE_URL}/api/pronunciation/errors`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
        if (data.aiDisabled) setAiDisabled(true);
        return;
      }
      setResult({ errors: data.errors ?? [], tip: data.tip ?? "" });
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (audioBlob) void submit(audioBlob);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  const target = word ? word.example?.sv ?? word.word : "";

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-28">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/pronunciation" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <AlertTriangle className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground leading-tight">تصحيح الأخطاء</h1>
      </header>

      <div className="p-4 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          انطق الجملة، وسيحدد الذكاء الاصطناعي الكلمات التي تحتاج تحسيناً ويشرح سبب كل خطأ.
        </p>

        <div className="p-5 rounded-2xl bg-card border border-card-border shadow-sm flex flex-col items-center gap-2 text-center">
          {wordsLoading && !word ? (
            <span className="text-sm text-muted-foreground">جارٍ التحميل...</span>
          ) : word ? (
            <>
              <span className="text-xl font-bold text-foreground" dir="ltr">{target}</span>
              <span className="text-sm text-muted-foreground">{word.translation}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">لا توجد كلمات متاحة حالياً</span>
          )}
          <button onClick={nextWord} className="mt-2 flex items-center gap-1.5 text-xs text-primary font-medium">
            <Shuffle className="w-3.5 h-3.5" /> جملة أخرى
          </button>
        </div>

        <button
          onClick={() => target && speak(target, { lang: "sv-SE" })}
          disabled={!word}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-foreground text-sm font-medium disabled:opacity-50"
        >
          <Volume2 className="w-4 h-4" /> استمع للنطق الصحيح
        </button>

        <div className="flex flex-col items-center gap-3 py-6">
          <button
            onClick={recording ? stop : start}
            disabled={submitting || !word}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all disabled:opacity-50 ${
              recording ? "bg-destructive text-destructive-foreground scale-110" : "bg-primary text-primary-foreground"
            }`}
          >
            {submitting ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : recording ? (
              <Square className="w-7 h-7" />
            ) : (
              <Mic2 className="w-8 h-8" />
            )}
          </button>
          <span className="text-xs text-muted-foreground">
            {submitting ? "جارٍ التحليل..." : recording ? "اضغط للإيقاف" : "اضغط وانطق الجملة"}
          </span>
        </div>

        {(error || recError) && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error || recError}
            {aiDisabled && (
              <p className="mt-1 text-muted-foreground">
                سيتم تفعيل هذه الميزة بعد ربط مفتاح OpenAI بالمشروع.
              </p>
            )}
          </div>
        )}

        {result && (
          <div className="p-4 rounded-2xl bg-card border border-card-border shadow-sm flex flex-col gap-3">
            {result.errors.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-semibold">نطق واضح، لم نجد أخطاءً بارزة!</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">كلمات تحتاج تحسيناً</span>
                {result.errors.map((e, i) => (
                  <div key={i} className="p-3 rounded-xl bg-destructive/5 border border-destructive/15">
                    <span className="text-sm font-bold text-destructive" dir="ltr">{e.word}</span>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{e.issue}</p>
                  </div>
                ))}
              </div>
            )}
            {result.tip && (
              <p className="text-[15px] text-foreground leading-relaxed border-t border-border pt-3">{result.tip}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
