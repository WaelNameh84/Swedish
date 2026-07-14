import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Row {
  id: string;
  name: string;
  emoji: string;
  xp: number;
  level: number;
  streak: number;
  isYou: boolean;
  rank: number;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<{ leaderboard: Row[]; yourRank: number | null } | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/community/leaderboard`).then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  const medalColor = (rank: number) =>
    rank === 1 ? "text-yellow-500" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-600" : "text-muted-foreground";

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="الترتيب العالمي" subtitle="بيانات توضيحية + نقاطك الحقيقية" backHref="/community" />
      <div className="p-4 flex flex-col gap-2">
        <div className="bg-muted/40 border border-border rounded-xl p-2.5 text-[11px] text-muted-foreground text-center mb-1">
          الأسماء الأخرى تجريبية لعرض شكل الترتيب — نقاطك وترتيبك (أنت) حقيقية من تقدمك الفعلي
        </div>
        {!data ? (
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
        ) : (
          data.leaderboard.map((row) => (
            <div
              key={row.id}
              className={`flex items-center gap-3 p-3 rounded-2xl border ${
                row.isYou ? "bg-primary/10 border-primary/40" : "bg-card border-card-border"
              }`}
            >
              <span className={`w-7 text-center font-black text-sm ${medalColor(row.rank)}`}>#{row.rank}</span>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg shrink-0">
                {row.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground truncate">{row.name}</span>
                  {row.isYou && (
                    <span className="text-[10px] font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded-full shrink-0">أنت</span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground">المستوى {row.level} • 🔥 {row.streak} يوم</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Trophy className="w-3.5 h-3.5 text-accent" />
                <span className="text-sm font-black text-foreground">{row.xp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
