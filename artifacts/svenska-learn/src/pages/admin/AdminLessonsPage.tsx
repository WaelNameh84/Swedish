import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    fetch(BASE + "/api/admin/lessons").then(r => r.json()).then(setLessons).catch(() => {});
  }, []);

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <GameHeader title="إدارة الدروس" backHref="/admin" />

      <div className="p-4">
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-3 font-semibold text-muted-foreground">المعرف</th>
                  <th className="p-3 font-semibold text-muted-foreground">العنوان</th>
                  <th className="p-3 font-semibold text-muted-foreground">المستوى</th>
                  <th className="p-3 font-semibold text-muted-foreground">المهارة</th>
                  <th className="p-3 font-semibold text-muted-foreground">الصعوبة</th>
                </tr>
              </thead>
              <tbody>
                {lessons.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">لا توجد دروس</td></tr>
                ) : (
                  lessons.map((l, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="p-3 text-muted-foreground">{l.id}</td>
                      <td className="p-3 font-medium">{l.title}</td>
                      <td className="p-3">{l.level}</td>
                      <td className="p-3">{l.skill}</td>
                      <td className="p-3">{l.difficulty}</td>
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
