import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Zap, Users2 } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Challenge {
  id: number;
  title: string;
  description: string;
  type: string;
  xpReward: number;
  isCompleted: boolean;
  expiresAt: string | null;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [pending, setPending] = useState<number | null>(null);

  const load = () => {
    fetch(`${BASE}/api/challenges/daily`)
      .then((r) => r.json())
      .then(setChallenges)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const complete = async (id: number) => {
    setPending(id);
    try {
      await fetch(`${BASE}/api/challenges/${id}/complete`, { method: "POST" });
      load();
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="التحديات" subtitle="تحدياتك اليومية الحقيقية" backHref="/community" />
      <div className="p-4 flex flex-col gap-2">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-2.5 mb-1">
          <Users2 className="w-4 h-4 text-primary shrink-0" />
          <p className="text-[11px] text-foreground leading-relaxed">
            آلاف المتعلمين يكملون هذه التحديات اليومية معك — إتمامك هنا حقيقي ويُحتسب في نقاطك وإحصائياتك.
          </p>
        </div>
        {!challenges ? (
          <div className="h-48 bg-muted animate-pulse rounded-2xl" />
        ) : challenges.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">لا توجد تحديات متاحة حالياً</p>
        ) : (
          challenges.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-card-border">
              <button
                onClick={() => !c.isCompleted && complete(c.id)}
                disabled={c.isCompleted || pending === c.id}
                className="shrink-0"
              >
                {c.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-semibold block truncate ${c.isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {c.title}
                </span>
                <span className="text-[11px] text-muted-foreground block truncate">{c.description}</span>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full shrink-0">
                <Zap className="w-3 h-3" /> {c.xpReward}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
