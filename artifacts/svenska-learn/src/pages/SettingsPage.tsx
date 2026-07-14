import { useState } from "react";
import { Settings as SettingsIcon, Sparkles, KeyRound, X } from "lucide-react";

export default function SettingsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <SettingsIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">الإعدادات</h1>
          <p className="text-xs text-muted-foreground mt-0.5">إدارة ميزات الذكاء الاصطناعي والتطبيق</p>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-3">
        <div className="bg-card border border-card-border rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-foreground">ميزات الذكاء الاصطناعي</h2>
              <p className="text-xs text-muted-foreground mt-0.5">تصحيح الأخطاء، شرح القواعد، تقييم النطق بالذكاء الاصطناعي، ودردشة تفاعلية</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-muted/40 rounded-xl px-3 py-2.5">
            <span className="text-xs font-medium text-foreground">الحالة الحالية</span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">
              غير مفعّلة
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            جميع ميزات الترجمة الفورية، الصوت، والتمارين التفاعلية تعمل حالياً بدون الحاجة لأي مفتاح ذكاء اصطناعي. لتفعيل ميزات إضافية (مثل التصحيح الذكي وتقييم النطق) يمكنك إضافة مفتاح OpenAI الخاص بك.
          </p>

          <button
            onClick={() => setOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            <KeyRound className="w-4 h-4" />
            تفعيل ميزات الذكاء الاصطناعي
          </button>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-1">عن التطبيق</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Svenska — تعلم السويدية. تطبيق شامل لتعلم اللغة السويدية باللغة العربية يشمل الدروس، القاموس، الألعاب، الاختبارات، والمترجم الفوري.
          </p>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card border border-card-border rounded-2xl w-full max-w-sm p-5 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">تفعيل الذكاء الاصطناعي</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              لتفعيل هذه الميزات، اطلب من المساعد (Replit Agent) في المحادثة تفعيل ميزات الذكاء الاصطناعي، وسيقوم بطلب مفتاح OpenAI الخاص بك بشكل آمن دون عرضه أو تخزينه في الكود.
            </p>
            <div className="bg-muted/40 rounded-xl px-3 py-2.5 text-xs text-muted-foreground">
              مثال: اكتب في المحادثة "فعّل ميزات الذكاء الاصطناعي" وسيرشدك المساعد خطوة بخطوة.
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 rounded-xl bg-secondary text-foreground font-semibold text-sm mt-1"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
