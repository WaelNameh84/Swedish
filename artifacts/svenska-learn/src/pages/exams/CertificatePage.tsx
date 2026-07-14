import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Award, Download, Lock } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const LEVEL_NAMES: Record<string, string> = {
  A1: "مبتدئ", A2: "مبتدئ متقدم", B1: "متوسط", B2: "متوسط متقدم", C1: "متقدم", C2: "متمكن",
};

interface Report {
  certifiedLevels: Record<string, { percentage: number; date: string }>;
}

export default function CertificatePage() {
  const { level } = useParams<{ level?: string }>();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/exams/report`).then((r) => r.json()).then(setReport).catch(() => setReport({ certifiedLevels: {} }));
  }, []);

  if (level) {
    const cert = report?.certifiedLevels?.[level];
    return (
      <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
        <GameHeader title="الشهادة" subtitle={`المستوى ${level}`} backHref="/exams" />
        <div className="p-4">
          {!report ? (
            <div className="h-64 bg-muted animate-pulse rounded-2xl" />
          ) : !cert ? (
            <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-3">
              <Lock className="w-10 h-10 opacity-40" />
              <p>لم تحصل على شهادة هذا المستوى بعد</p>
              <Link href={`/exams/run/level?level=${level}`} className="text-primary underline text-sm">
                اختبر مستواك الآن
              </Link>
            </div>
          ) : (
            <div
              className="relative rounded-3xl border-4 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 p-8 text-center overflow-hidden print:border-4"
              id="certificate"
            >
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-amber-200/40 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-200/30 rounded-full" />
              <Award className="w-14 h-14 text-amber-500 mx-auto mb-3" />
              <p className="text-xs font-bold text-amber-700 tracking-widest">SVENSKA — تعلم السويدية</p>
              <h2 className="text-2xl font-black text-foreground mt-3">شهادة إتمام المستوى</h2>
              <div className="text-5xl font-black text-amber-600 my-4">{level}</div>
              <p className="text-sm text-muted-foreground">{LEVEL_NAMES[level]}</p>
              <p className="text-sm text-foreground font-semibold mt-4">
                بنتيجة <span className="text-amber-600 font-black">{cert.percentage}%</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {cert.date ? new Date(cert.date).toLocaleDateString("ar") : ""}
              </p>
            </div>
          )}
          {cert && (
            <button
              onClick={() => window.print()}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-2xl font-bold hover:bg-primary/90"
            >
              <Download className="w-4 h-4" /> طباعة / حفظ الشهادة
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="الشهادات" subtitle="شهاداتك بحسب المستوى" backHref="/exams" />
      <div className="p-4 grid grid-cols-2 gap-3">
        {LEVELS.map((l) => {
          const cert = report?.certifiedLevels?.[l];
          return (
            <Link
              key={l}
              href={`/exams/certificate/${l}`}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                cert ? "border-amber-400 bg-amber-50" : "border-border bg-card opacity-70"
              }`}
            >
              {cert ? <Award className="w-7 h-7 text-amber-500" /> : <Lock className="w-6 h-6 text-muted-foreground" />}
              <span className="font-black text-lg">{l}</span>
              <span className="text-[11px] text-muted-foreground">{cert ? `${cert.percentage}%` : "غير مُعتمد"}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
