import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminLanguagesPage() {
  const [languages, setLanguages] = useState<any[]>([]);

  useEffect(() => {
    fetch(BASE + "/api/admin/languages").then(r => r.json()).then(setLanguages).catch(() => {});
  }, []);

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">إدارة اللغات</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-3 font-semibold text-muted-foreground">رمز اللغة</th>
                  <th className="p-3 font-semibold text-muted-foreground">الاسم</th>
                  <th className="p-3 font-semibold text-muted-foreground">الاسم المحلي</th>
                  <th className="p-3 font-semibold text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {languages.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">لا توجد لغات مدعومة</td></tr>
                ) : (
                  languages.map((l, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="p-3 font-bold text-primary" dir="ltr">{l.code}</td>
                      <td className="p-3">{l.name}</td>
                      <td className="p-3">{l.nativeName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${l.active ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                          {l.active ? "نشط" : "غير نشط"}
                        </span>
                      </td>
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
