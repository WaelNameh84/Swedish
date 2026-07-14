import { HardDrive, Download } from "lucide-react";
import { useState } from "react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AdminBackupPage() {
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE + "/api/admin/backup");
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `svenska-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <GameHeader title="النسخ الاحتياطي" backHref="/admin" />

      <div className="p-4">
        <div className="bg-card border border-card-border rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">تصدير بيانات التطبيق</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            قم بتنزيل نسخة احتياطية من جميع بيانات التطبيق بصيغة JSON، بما في ذلك الدروس، الكلمات، المستخدمين، والاختبارات.
          </p>
          <button
            onClick={handleBackup}
            disabled={loading}
            className="mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <HardDrive className="w-5 h-5" />
            {loading ? "جاري التصدير..." : "تصدير النسخة الاحتياطية"}
          </button>
        </div>
      </div>
    </div>
  );
}
