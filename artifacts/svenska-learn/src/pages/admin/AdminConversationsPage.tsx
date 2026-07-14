import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    fetch(BASE + "/api/admin/conversations").then(r => r.json()).then(setConversations).catch(() => {});
  }, []);

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <GameHeader title="المحادثات" backHref="/admin" />

      <div className="p-4">
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-3 font-semibold text-muted-foreground">العنوان</th>
                  <th className="p-3 font-semibold text-muted-foreground">المستوى</th>
                  <th className="p-3 font-semibold text-muted-foreground">الموضوع</th>
                </tr>
              </thead>
              <tbody>
                {conversations.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">لا توجد محادثات</td></tr>
                ) : (
                  conversations.map((c, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="p-3 font-medium">{c.title || "-"}</td>
                      <td className="p-3">{c.level || "-"}</td>
                      <td className="p-3">{c.topic || "-"}</td>
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
