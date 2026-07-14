import { useEffect, useState } from "react";
import { UserPlus, UserCheck, Flame } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Friend {
  id: string;
  name: string;
  emoji: string;
  xp: number;
  level: number;
  streak: number;
  isFriend: boolean;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/community/friends`)
      .then((r) => r.json())
      .then((d) => setFriends(d.friends))
      .catch(() => {});
  }, []);

  const toggle = async (id: string) => {
    setPending(id);
    try {
      const res = await fetch(`${BASE}/api/community/friends/${id}/toggle`, { method: "POST" });
      const data = await res.json();
      setFriends((prev) => prev?.map((f) => (f.id === id ? { ...f, isFriend: data.isFriend } : f)) ?? null);
    } finally {
      setPending(null);
    }
  };

  const addedCount = friends?.filter((f) => f.isFriend).length ?? 0;

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="الأصدقاء" subtitle={`${addedCount} صديق مضاف`} backHref="/community" />
      <div className="p-4 flex flex-col gap-2">
        <div className="bg-muted/40 border border-border rounded-xl p-2.5 text-[11px] text-muted-foreground text-center mb-1">
          قائمة تجريبية لعرض شكل الميزة — إضافة/إزالة الأصدقاء هنا تُحفظ فعلياً لحسابك
        </div>
        {!friends ? (
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
        ) : (
          friends.map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-card-border">
              <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-xl shrink-0">{f.emoji}</div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground block truncate">{f.name}</span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  المستوى {f.level} <Flame className="w-3 h-3 text-orange-500" /> {f.streak} يوم
                </span>
              </div>
              <button
                onClick={() => toggle(f.id)}
                disabled={pending === f.id}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors disabled:opacity-50 ${
                  f.isFriend ? "bg-emerald-100 text-emerald-700" : "bg-primary text-primary-foreground"
                }`}
              >
                {f.isFriend ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {f.isFriend ? "صديق" : "إضافة"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
