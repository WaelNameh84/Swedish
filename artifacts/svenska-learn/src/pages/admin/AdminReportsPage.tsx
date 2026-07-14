import { useEffect, useState } from "react";
import { BarChart2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminReportsPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch(BASE + "/api/admin/reports").then(r => r.json()).then(setReport).catch(() => {});
  }, []);

  const chartData = report?.examsByType?.map((e: any) => ({
    name: e.examType,
    score: e.avgScore
  })) || [];

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <BarChart2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">التقارير والإحصائيات العامة</h1>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-6">
        {!report ? (
          <div className="h-40 bg-muted animate-pulse rounded-2xl" />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-card-border rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-muted-foreground">متوسط تقييم النطق</h3>
                <div className="text-3xl font-black mt-2 text-purple-500">{report.pronunciationAvg || 0}%</div>
                <p className="text-xs text-muted-foreground mt-1">من {report.pronunciationTotal || 0} تقييم</p>
              </div>
              <div className="bg-card border border-card-border rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-muted-foreground">تقدم المستخدمين</h3>
                <div className="text-3xl font-black mt-2 text-blue-500">{report.userProgress?.avgLevel || 1}</div>
                <p className="text-xs text-muted-foreground mt-1">متوسط المستوى الحالي</p>
              </div>
            </div>

            <section className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" /> متوسط درجات الاختبارات حسب النوع
              </h3>
              {chartData.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">لا توجد بيانات</p>
              ) : (
                <div className="h-64 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)' }}
                        cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                      />
                      <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
