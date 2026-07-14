import { useEffect, useState } from "react";
import { Users2 } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch(BASE + "/api/admin/users").then(r => r.json()).then(setUsers).catch(() => {});
  }, []);

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <GameHeader title="إدارة المستخدمين" backHref="/admin" />

      <div className="p-4">
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-3 font-semibold text-muted-foreground">الاسم</th>
                  <th className="p-3 font-semibold text-muted-foreground">المستوى</th>
                  <th className="p-3 font-semibold text-muted-foreground">النقاط (XP)</th>
                  <th className="p-3 font-semibold text-muted-foreground">الأيام المتتالية</th>
                  <th className="p-3 font-semibold text-muted-foreground">إجمالي الأيام</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">لا يوجد مستخدمين</td></tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="p-3 font-medium">{u.displayName || "مستخدم"}</td>
                      <td className="p-3">{u.levelName || `مستوى ${u.level}`}</td>
                      <td className="p-3">{u.xpPoints || 0}</td>
                      <td className="p-3 text-orange-500 font-semibold">{u.streakDays || 0}</td>
                      <td className="p-3 text-blue-500 font-semibold">{u.totalDaysLearned || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
