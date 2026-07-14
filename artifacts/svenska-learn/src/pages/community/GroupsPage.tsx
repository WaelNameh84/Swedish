import { useEffect, useState } from "react";
import { Users, LogIn, LogOut } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Group {
  id: string;
  name: string;
  topic: string;
  memberCount: number;
  isJoined: boolean;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/community/groups`)
      .then((r) => r.json())
      .then((d) => setGroups(d.groups))
      .catch(() => {});
  }, []);

  const toggle = async (id: string) => {
    setPending(id);
    try {
      const res = await fetch(`${BASE}/api/community/groups/${id}/toggle`, { method: "POST" });
      const data = await res.json();
      setGroups((prev) =>
        prev?.map((g) =>
          g.id === id
            ? { ...g, isJoined: data.isJoined, memberCount: g.memberCount + (data.isJoined ? 1 : -1) }
            : g
        ) ?? null
      );
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="المجموعات" subtitle="مجموعات تعلم حسب اهتمامك" backHref="/community" />
      <div className="p-4 flex flex-col gap-2">
        <div className="bg-muted/40 border border-border rounded-xl p-2.5 text-[11px] text-muted-foreground text-center mb-1">
          المجموعات تجريبية لعرض شكل الميزة — انضمامك/مغادرتك يُحفظ فعلياً لحسابك
        </div>
        {!groups ? (
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
        ) : (
          groups.map((g) => (
            <div key={g.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-card-border">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground block truncate">{g.name}</span>
                <span className="text-[11px] text-muted-foreground block truncate">{g.topic}</span>
                <span className="text-[10px] text-muted-foreground">{g.memberCount} عضو</span>
              </div>
              <button
                onClick={() => toggle(g.id)}
                disabled={pending === g.id}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors disabled:opacity-50 ${
                  g.isJoined ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                }`}
              >
                {g.isJoined ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                {g.isJoined ? "مغادرة" : "انضمام"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
