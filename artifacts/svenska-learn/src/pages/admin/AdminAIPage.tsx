import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminAIPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch(BASE + "/api/admin/ai-history").then(r => r.json()).then(setHistory).catch(() => {});
  }, []);

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">سجل تفاعلات الذكاء الاصطناعي</h1>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-4">
        {history.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-card border border-card-border rounded-2xl">لا يوجد سجل تفاعلات</div>
        ) : (
          history.map((h, i) => (
            <div key={i} className="bg-card border border-card-border rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-1">
                <span className="font-semibold text-primary">{h.toolName}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{h.model || "Gemini / OpenAI"}</span>
              </div>
              <div className="text-sm">
                <span className="font-bold text-foreground block mb-1">الطلب (Prompt):</span>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{h.prompt}</p>
              </div>
              <div className="text-sm mt-2 pt-2 border-t border-border border-dashed">
                <span className="font-bold text-foreground block mb-1">الرد (Response):</span>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{h.response}</p>
              </div>
              <div className="text-left mt-2">
                <span className="text-[10px] text-muted-foreground" dir="ltr">{new Date(h.createdAt || Date.now()).toLocaleString("en-GB")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
