import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const TYPE_LABELS: Record<string, string> = {
  daily: "الاختبار اليومي",
  weekly: "الاختبار الأسبوعي",
  monthly: "الاختبار الشهري",
  level: "اختبار المستوى",
};

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

interface Question {
  id: number;
  type: "sv-ar" | "ar-sv" | "fill";
  prompt: string;
  phonetic?: string;
  options: string[];
  correctIndex: number;
}

export default function ExamRunnerPage() {
  const { type = "daily" } = useParams<{ type: string }>();
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const [level, setLevel] = useState(search.get("level") || "");
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<{ question: string; correct: boolean }>>([]);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [startedAt] = useState(Date.now());

  const needsLevelPick = type === "level" && !level;

  const loadQuestions = (lvl?: string) => {
    setQuestions(null);
    const params = new URLSearchParams({ type });
    if (lvl) params.set("level", lvl);
    fetch(`${BASE}/api/exams/questions?${params}`)
      .then((r) => r.json())
      .then((d) => setQuestions(d.questions || []))
      .catch(() => setQuestions([]));
  };

  useEffect(() => {
    if (!needsLevelPick) loadQuestions(level || undefined);
  }, [type, level]);

  const q = questions?.[current];

  const choose = (idx: number) => {
    if (selected !== null || !q) return;
    setSelected(idx);
    const correct = idx === q.correctIndex;
    setAnswers((a) => [...a, { question: q.prompt, correct }]);
  };

  const next = () => {
    if (!questions) return;
    if (current + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const score = answers.filter((a) => a.correct).length;
  const total = questions?.length ?? 0;
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= 70;

  useEffect(() => {
    if (!done || saving || total === 0) return;
    setSaving(true);
    fetch(`${BASE}/api/exams/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examType: type,
        level: type === "level" ? level : null,
        score,
        total,
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
        details: answers,
      }),
    }).catch(() => {});
  }, [done]);

  if (needsLevelPick) {
    return (
      <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
        <GameHeader title="اختبار المستوى" subtitle="اختر المستوى الذي تريد اختباره" backHref="/exams" />
        <div className="p-4 grid grid-cols-3 gap-2.5">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className="py-6 rounded-2xl border-2 border-border bg-card font-black text-lg hover:border-primary/40"
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader
        title={TYPE_LABELS[type] ?? "اختبار"}
        subtitle={questions ? `${Math.min(current + 1, total)} / ${total}` : "جاري تحضير الأسئلة..."}
        backHref="/exams"
      />
      <div className="p-4">
        {!questions ? (
          <div className="h-56 bg-muted animate-pulse rounded-2xl" />
        ) : total === 0 ? (
          <p className="text-center text-muted-foreground py-16">لا توجد أسئلة كافية لهذا الاختبار حالياً</p>
        ) : done ? (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">{passed ? "🏆" : "📚"}</div>
            <h2 className="text-2xl font-black mb-1">{passed ? "أحسنت! نجحت في الاختبار" : "انتهى الاختبار"}</h2>
            <p className="text-muted-foreground mb-2">
              نتيجتك: <span className="font-black text-primary text-xl">{score}</span> / {total} ({percentage}%)
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              {passed ? "نسبة النجاح 70% أو أكثر — تم تسجيل نتيجتك." : "تحتاج 70% للنجاح — حاول مرة أخرى."}
            </p>
            <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
              {passed && type === "level" && (
                <Link
                  href={`/exams/certificate/${level}`}
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-amber-600"
                >
                  <Award className="w-4 h-4" /> عرض الشهادة
                </Link>
              )}
              <button
                onClick={() => {
                  setCurrent(0); setSelected(null); setAnswers([]); setDone(false); setSaving(false);
                  loadQuestions(type === "level" ? level : undefined);
                }}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-primary/90"
              >
                <RotateCcw className="w-4 h-4" /> اختبار جديد
              </button>
              <Link href="/exams" className="text-sm text-muted-foreground underline text-center py-1">
                رجوع إلى الاختبارات
              </Link>
            </div>
          </div>
        ) : q ? (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <div className="bg-card border border-card-border rounded-2xl p-5 mb-4 whitespace-pre-line">
                <p className="text-xs text-muted-foreground mb-2">
                  {q.type === "sv-ar" ? "ما ترجمة الكلمة؟" : q.type === "ar-sv" ? "أي كلمة سويدية تعني هذا؟" : "أكمل الجملة"}
                </p>
                <p className={cn("font-black text-foreground", q.type === "fill" ? "text-base" : "text-2xl")} dir={q.type === "ar-sv" ? "rtl" : "ltr"}>
                  {q.prompt}
                </p>
                {q.phonetic && <p className="text-xs text-muted-foreground mt-1" dir="ltr">/{q.phonetic}/</p>}
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => choose(idx)}
                    disabled={selected !== null}
                    dir={q.type === "ar-sv" || q.type === "fill" ? "ltr" : "rtl"}
                    className={cn(
                      "w-full text-right px-4 py-3.5 rounded-2xl border-2 font-semibold text-sm transition-all",
                      selected === null
                        ? "border-border bg-card hover:border-primary/40"
                        : idx === q.correctIndex
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : idx === selected
                        ? "border-rose-400 bg-rose-50 text-rose-700"
                        : "border-border bg-card opacity-50"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selected !== null && (
                <button
                  onClick={next}
                  className="w-full mt-4 bg-primary text-primary-foreground py-3.5 rounded-2xl font-black text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
                >
                  {current + 1 >= total ? "النتيجة النهائية" : "السؤال التالي ←"}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}
