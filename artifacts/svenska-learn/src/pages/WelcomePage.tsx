import { Link } from "wouter";
import { Sparkles, BookOpen, Mic, Trophy, Fingerprint } from "lucide-react";

// Public landing page shown to signed-out visitors at "/". Signed-in users
// see the real Home dashboard instead (see HomeGate in App.tsx).
export default function WelcomePage() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 py-16 text-center gap-8" dir="rtl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="text-4xl">🇸🇪</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Svenska
          <span className="block text-lg font-semibold text-muted-foreground mt-1">تعلّم السويدية بذكاء</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          دروس، تمارين نطق، محادثات بالذكاء الاصطناعي، واختبارات — كل ذلك في حساب واحد يحفظ تقدمك.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-card-border">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="text-[11px] font-semibold text-muted-foreground">دروس</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-card-border">
          <Mic className="w-5 h-5 text-primary" />
          <span className="text-[11px] font-semibold text-muted-foreground">نطق</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-card-border">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="text-[11px] font-semibold text-muted-foreground">إنجازات</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/sign-up"
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm active:scale-[0.98] transition-transform shadow-lg shadow-primary/25"
        >
          إنشاء حساب جديد
        </Link>
        <Link
          href="/sign-in"
          className="w-full py-3.5 rounded-2xl bg-card border border-card-border text-foreground font-bold text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Fingerprint className="w-4 h-4 text-primary" />
          تسجيل الدخول
        </Link>
      </div>

      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        يدعم الدخول بالبصمة (Face ID / Touch ID) بعد تفعيله من الإعدادات
      </p>
    </div>
  );
}
