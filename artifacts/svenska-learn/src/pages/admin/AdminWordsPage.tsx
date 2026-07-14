import { useEffect, useState } from "react";
import { BookMarked } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminWordsPage() {
  const [data, setData] = useState<{ words: any[], dictionary: any[] }>({ words: [], dictionary: [] });
  const [tab, setTab] = useState<"words" | "dictionary">("words");

  useEffect(() => {
    fetch(BASE + "/api/admin/words").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const list = tab === "words" ? data.words : data.dictionary;

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <BookMarked className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">إدارة الكلمات والقاموس</h1>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex bg-muted p-1 rounded-xl">
          <button
            onClick={() => setTab("words")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === "words" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            الكلمات اليومية
          </button>
          <button
            onClick={() => setTab("dictionary")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === "dictionary" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            القاموس
          </button>
        </div>

        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-3 font-semibold text-muted-foreground">الكلمة السويدية</th>
                  <th className="p-3 font-semibold text-muted-foreground">الترجمة</th>
                  <th className="p-3 font-semibold text-muted-foreground">المستوى / التصنيف</th>
                </tr>
              </thead>
              <tbody>
                {(!list || list.length === 0) ? (
                  <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">لا توجد بيانات</td></tr>
                ) : (
                  list.map((w, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="p-3 font-medium text-primary" dir="ltr">{w.swedish || w.word}</td>
                      <td className="p-3">{w.arabic || w.translation}</td>
                      <td className="p-3">{w.level || w.category || "-"}</td>
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
