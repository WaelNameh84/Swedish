import { Settings } from "lucide-react";
import GameHeader from "@/components/GameHeader";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-[100dvh] w-full max-w-4xl mx-auto pb-24" dir="rtl">
      <GameHeader title="إعدادات النظام" backHref="/admin" />

      <div className="p-4 flex flex-col gap-4">
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="text-base font-bold mb-4">معلومات النسخة</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">الإصدار</span>
              <span className="font-semibold">v1.0.0</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">آخر تحديث</span>
              <span className="font-semibold" dir="ltr">{new Date().toLocaleDateString('en-GB')}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">البيئة</span>
              <span className="font-semibold text-emerald-500">Production</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-destructive/20 rounded-2xl p-5">
          <h2 className="text-base font-bold mb-2 text-destructive">منطقة الخطر</h2>
          <p className="text-sm text-muted-foreground mb-4">
            الإجراءات هنا لا يمكن التراجع عنها. يرجى توخي الحذر عند استخدام هذه الأدوات.
          </p>
          <button className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive font-semibold text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors">
            إعادة تعيين جميع البيانات
          </button>
        </div>
      </div>
    </div>
  );
}
