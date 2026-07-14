import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Clock,
  BookMarked,
  Target,
  AudioLines,
  Flame,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Overview {
  totalHours: number;
  totalWords: number;
  successRate: number | null;
  pronunciationLevel: string;
  pronunciationAvgScore: number | null;
  streakDays: number;
  totalDaysLearned: number;
  xpPoints: number;
  level: number;
  levelName: string;
}

interface Charts {
  examTimeline: { date: string; percentage: number; examType: string }[];
  pronunciationTimeline: { date: string; score: number }[];
  wordsByLevel: { level: string; count: number }[];
  activityCalendar: { date: string; count: number }[];
}

interface Comparison {
  exams: {
    thisWeek: { count: number; avgPercentage: number };
    lastWeek: { count: number; avgPercentage: number };
    thisMonth: { count: number; avgPercentage: number };
    lastMonth: { count: number; avgPercentage: number };
  };
  pronunciation: {
    thisWeek: { count: number; avgScore: number };
    lastWeek: { count: number; avgScore: number };
  };
}

export default function StatisticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);
  const [comparison, setComparison] = useState<Comparison | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/statistics/overview`).then((r) => r.json()).then(setOverview).catch(() => {});
    fetch(`${BASE}/api/statistics/charts`).then((r) => r.json()).then(setCharts).catch(() => {});
    fetch(`${BASE}/api/statistics/comparison`).then((r) => r.json()).then(setComparison).catch(() => {});
  }, []);

  const examChartData = charts?.examTimeline.map((e, i) => ({ name: `#${i + 1}`, percentage: e.percentage })) ?? [];
  const pronChartData = charts?.pronunciationTimeline.map((p, i) => ({ name: `#${i + 1}`, score: p.score })) ?? [];

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">الإحصائيات</h1>
          <p className="text-xs text-muted-foreground mt-0.5">تتبّع تقدّمك الحقيقي في تعلم السويدية</p>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-5">
        {!overview ? (
          <div className="h-40 bg-muted animate-pulse rounded-2xl" />
        ) : (
          <>
            {/* Overview cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Clock} value={`${overview.totalHours}`} unit="ساعة" label="ساعات التعلم" color="text-blue-500" />
              <StatCard icon={BookMarked} value={overview.totalWords} unit="كلمة" label="عدد الكلمات" color="text-emerald-500" />
              <StatCard
                icon={Target}
                value={overview.successRate !== null ? `${overview.successRate}%` : "—"}
                label="نسبة النجاح بالاختبارات"
                color="text-orange-500"
              />
              <StatCard icon={AudioLines} value={overview.pronunciationLevel} label="مستوى النطق" color="text-purple-500" small />
              <StatCard icon={Flame} value={overview.streakDays} unit="يوم" label="الأيام المتتالية" color="text-red-500" />
              <StatCard icon={BarChart3} value={overview.totalDaysLearned} unit="يوم" label="إجمالي أيام التعلم" color="text-indigo-500" />
            </div>

            {/* Activity calendar */}
            <section className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">نشاطك آخر 30 يوماً</h3>
              {charts ? (
                <div className="grid grid-cols-10 gap-1.5" dir="ltr">
                  {charts.activityCalendar.map((d) => (
                    <div
                      key={d.date}
                      title={`${d.date}: ${d.count} نشاط`}
                      className={`aspect-square rounded-[4px] ${
                        d.count === 0
                          ? "bg-muted"
                          : d.count === 1
                          ? "bg-primary/30"
                          : d.count >= 3
                          ? "bg-primary"
                          : "bg-primary/60"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-16 bg-muted animate-pulse rounded-xl" />
              )}
              <p className="text-[10px] text-muted-foreground mt-2">يعكس أيام إكمال اختبارات أو تقييمات نطق فعلية</p>
            </section>

            {/* Charts */}
            <section className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" /> تطور نتائج الاختبارات
              </h3>
              {examChartData.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">لا توجد بيانات بعد — أكمل اختباراً لتظهر هنا</p>
              ) : (
                <div className="h-44" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={examChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="percentage" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                <AudioLines className="w-4 h-4 text-purple-500" /> تطور درجات النطق
              </h3>
              {pronChartData.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">جرّب تقييم AI للنطق ليظهر تطورك هنا</p>
              ) : (
                <div className="h-44" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pronChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                <BookMarked className="w-4 h-4 text-emerald-500" /> توزيع الكلمات حسب المستوى
              </h3>
              {!charts || charts.wordsByLevel.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">لا توجد بيانات</p>
              ) : (
                <div className="h-44" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.wordsByLevel}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="level" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            {/* Performance comparison */}
            <section className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">مقارنة الأداء</h3>
              {!comparison ? (
                <div className="h-24 bg-muted animate-pulse rounded-xl" />
              ) : (
                <div className="flex flex-col gap-3">
                  <ComparisonRow
                    label="متوسط نتائج الاختبارات"
                    current={comparison.exams.thisWeek.avgPercentage}
                    previous={comparison.exams.lastWeek.avgPercentage}
                    unit="%"
                    periodLabel="هذا الأسبوع مقابل الأسبوع الماضي"
                  />
                  <ComparisonRow
                    label="عدد الاختبارات المكتملة"
                    current={comparison.exams.thisMonth.count}
                    previous={comparison.exams.lastMonth.count}
                    unit=""
                    periodLabel="هذا الشهر مقابل الشهر الماضي"
                  />
                  <ComparisonRow
                    label="متوسط درجة النطق"
                    current={comparison.pronunciation.thisWeek.avgScore}
                    previous={comparison.pronunciation.lastWeek.avgScore}
                    unit="%"
                    periodLabel="هذا الأسبوع مقابل الأسبوع الماضي"
                  />
                </div>
              )}
            </section>

            {/* Quick links */}
            <section className="bg-card border border-card-border rounded-2xl p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">روابط سريعة</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/profile" className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                  <span className="text-sm font-semibold text-foreground">عرض الملف الشخصي</span>
                  <span className="text-muted-foreground text-xs">←</span>
                </Link>
                <Link href="/exams" className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                  <span className="text-sm font-semibold text-foreground">الذهاب إلى الاختبارات</span>
                  <span className="text-muted-foreground text-xs">←</span>
                </Link>
                <Link href="/community/leaderboard" className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                  <span className="text-sm font-semibold text-foreground">الترتيب العالمي</span>
                  <span className="text-muted-foreground text-xs">←</span>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  unit,
  label,
  color,
  small,
}: {
  icon: any;
  value: string | number;
  unit?: string;
  label: string;
  color: string;
  small?: boolean;
}) {
  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 flex flex-col gap-1.5">
      <Icon className={`w-5 h-5 ${color}`} />
      <div className="flex items-baseline gap-1">
        <span className={`font-black text-foreground ${small ? "text-base" : "text-2xl"}`}>{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      <span className="text-[11px] text-muted-foreground leading-snug">{label}</span>
    </div>
  );
}

function ComparisonRow({
  label,
  current,
  previous,
  unit,
  periodLabel,
}: {
  label: string;
  current: number;
  previous: number;
  unit: string;
  periodLabel: string;
}) {
  const diff = current - previous;
  const isUp = diff > 0;
  const isDown = diff < 0;
  return (
    <div className="flex items-center justify-between bg-muted/40 rounded-xl px-3 py-2.5">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground">{periodLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-black text-foreground">
          {current}
          {unit}
        </span>
        <span
          className={`flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
            isUp
              ? "bg-emerald-100 text-emerald-700"
              : isDown
              ? "bg-rose-100 text-rose-600"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {Math.abs(diff)}
          {unit}
        </span>
      </div>
    </div>
  );
}
