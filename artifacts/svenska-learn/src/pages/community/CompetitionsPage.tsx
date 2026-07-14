import { useEffect, useState } from "react";
import { Swords, Clock } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Competition {
  id: string;
  title: string;
  metric: string;
  durationDays: number;
  demoLeaderTop3: string[];
  endsAt: string;
  yourXp: number;
}

function timeLeft(endsAt: string): string {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return "انتهت";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return days > 0 ? `${days} يوم و ${hours} ساعة متبقية` : `${hours} ساعة متبقية`;
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[] | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/community/competitions`)
      .then((r) => r.json())
      .then((d) => setCompetitions(d.competitions))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="المنافسات" subtitle="تحديات جماعية أسبوعية وشهرية" backHref="/community" />
      <div className="p-4 flex flex-col gap-3">
        <div className="bg-muted/40 border border-border rounded-xl p-2.5 text-[11px] text-muted-foreground text-center">
          المنافسات وقوائم المتصدرين هنا تجريبية لعرض شكل الميزة
        </div>
        {!competitions ? (
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
        ) : (
          competitions.map((c) => (
            <div key={c.id} className="bg-card border border-card-border rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Swords className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">{c.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">المعيار: {c.metric}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 rounded-lg px-2.5 py-1.5 w-fit">
                <Clock className="w-3.5 h-3.5" /> {timeLeft(c.endsAt)}
              </div>
              <div>
                <span className="text-[11px] font-semibold text-foreground">المتصدرون حالياً:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {c.demoLeaderTop3.map((name, i) => (
                    <span key={name} className="text-[11px] bg-secondary px-2 py-1 rounded-full text-foreground">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground">
                نقاطك الحالية: <span className="font-bold text-foreground">{c.yourXp} XP</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
