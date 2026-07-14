import { useEffect, useState } from "react";
import { BarChart3, Flame, Target, ListChecks } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const TYPE_LABELS: Record<string, string> = {
  daily: "يومي", weekly: "أسبوعي", monthly: "شهري", level: "مستوى",
};

interface Report {
  totalAttempts: number;
  avgPercentage: number;
  streak: number;
  byType: Record<string, number>;
  certifiedLevels: Record<string, { percentage: number; date: string }>;
  history: Array<{ id: number; examType: string; level: string | null; percentage: number; passed: boolean; createdAt: string | null }>;
}

export default function PerformanceReportPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/exams/report`).then((r) => r.json()).then(setReport).catch(() => setReport(null));
  }, []);

  const chartData = report?.history
    .slice()
    .reverse()
    .map((h, i) => ({ name: `#${i + 1}`, percentage: h.percentage })) ?? [];

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="تقرير الأداء" subtitle="نتائجك عبر الزمن" backHref="/exams" />
      <div className="p-4 flex flex-col gap-4">
        {!report ? (
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2.5">
              <StatCard icon={ListChecks} value={report.totalAttempts} label="محاولات" color="text-blue-500" />
              <StatCard icon={Target} value={`${report.avgPercentage}%`} label="متوسط النتيجة" color="text-emerald-500" />
              <StatCard icon={Flame} value={report.streak} label="أيام متتالية" color="text-orange-500" />
            </div>

            <div className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-primary" /> تطور النتائج
              </h3>
              {chartData.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">لا توجد نتائج بعد — خذ اختباراً لتبدأ</p>
              ) : (
                <div className="h-48" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="percentage" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">آخر المحاولات</h3>
              <div className="flex flex-col divide-y divide-border">
                {report.history.slice(0, 10).map((h) => (
                  <div key={h.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {TYPE_LABELS[h.examType] ?? h.examType} {h.level ? `(${h.level})` : ""}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {h.createdAt ? new Date(h.createdAt).toLocaleDateString("ar") : ""}
                      </span>
                    </div>
                    <span className={`font-black text-xs px-2 py-0.5 rounded-full ${h.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>
                      {h.percentage}%
                    </span>
                  </div>
                ))}
                {report.history.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">لا توجد محاولات مسجلة بعد</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: any; value: string | number; label: string; color: string }) {
  return (
    <div className="bg-card border border-card-border rounded-2xl p-3.5 flex flex-col items-center gap-1 text-center">
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="text-lg font-black text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
