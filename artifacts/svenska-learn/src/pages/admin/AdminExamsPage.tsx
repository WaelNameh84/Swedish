import { useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    fetch(BASE + "/api/admin/exams").then(r => r.json()).then(setExams).catch(() => {});
  }, []);

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <GameHeader title="سجل الاختبارات" backHref="/admin" />

      <div className="p-4">
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-3 font-semibold text-muted-foreground">المعرف</th>
                  <th className="p-3 font-semibold text-muted-foreground">نوع الاختبار</th>
                  <th className="p-3 font-semibold text-muted-foreground">الدرجة</th>
                  <th className="p-3 font-semibold text-muted-foreground">النسبة</th>
                  <th className="p-3 font-semibold text-muted-foreground">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {exams.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">لا توجد محاولات</td></tr>
                ) : (
                  exams.map((e, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="p-3 text-muted-foreground">{e.id}</td>
                      <td className="p-3 font-medium">{e.examType}</td>
                      <td className="p-3">{e.score} / {e.totalQuestions}</td>
                      <td className="p-3 font-bold text-primary">{e.percentage}%</td>
                      <td className="p-3" dir="ltr">{new Date(e.completedAt || Date.now()).toLocaleDateString("en-GB")}</td>
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
