import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Users2, BookOpen, BookMarked, MessageCircle, ClipboardCheck, Bot, BarChart2, HardDrive, Settings, Globe, Bell, Award } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(BASE + "/api/admin/overview").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const cards = [
    { title: "المستخدمون", value: data?.users ?? "-", icon: Users2, link: "/admin/users", color: "text-blue-500" },
    { title: "الدروس", value: data?.lessons ?? "-", icon: BookOpen, link: "/admin/lessons", color: "text-emerald-500" },
    { title: "الكلمات والأفعال", value: (data?.words || 0) + (data?.verbs || 0) || "-", icon: BookMarked, link: "/admin/words", color: "text-orange-500" },
    { title: "المحادثات", value: data?.conversations ?? "-", icon: MessageCircle, link: "/admin/conversations", color: "text-purple-500" },
    { title: "الاختبارات", value: data?.exams ?? "-", icon: ClipboardCheck, link: "/admin/exams", color: "text-rose-500" },
    { title: "سجل الذكاء الاصطناعي", value: data?.aiHistory ?? "-", icon: Bot, link: "/admin/ai", color: "text-cyan-500" },
    { title: "الإحصائيات", value: "عرض", icon: BarChart2, link: "/admin/reports", color: "text-indigo-500" },
    { title: "الإشعارات", value: data?.notifications ?? "-", icon: Bell, link: "/admin/settings", color: "text-yellow-500" },
    { title: "الشهادات", value: data?.certificates ?? "-", icon: Award, link: "/admin/exams", color: "text-indigo-500" }
  ];

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">لوحة الإدارة</h1>
          <p className="text-xs text-muted-foreground mt-0.5">نظرة عامة على التطبيق</p>
        </div>
      </header>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link key={i} href={c.link} className="bg-card border border-card-border rounded-2xl p-4 flex flex-col gap-2 hover:bg-secondary/50 transition-colors">
              <Icon className={`w-6 h-6 ${c.color}`} />
              <span className="text-2xl font-black text-foreground">{c.value}</span>
              <span className="text-xs font-semibold text-muted-foreground">{c.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
