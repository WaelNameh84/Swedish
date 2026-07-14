import { Link } from "wouter";
import { Headphones, ChevronRight } from "lucide-react";
import { audioLearningTools } from "@/components/AppSidebar";

const DESCRIPTIONS: Record<string, string> = {
  "راديو اللغة": "استماع مستمر لكلمات وجمل سويدية تلقائياً",
  "تشغيل أثناء النوم": "مؤقّت صوتي هادئ يساعدك على التعلم قبل النوم",
  "تكرار الكلمات": "كرّر الكلمة عدة مرات لتثبيتها في ذهنك",
  "سرعة الصوت": "تحكم بسرعة نطق الكلمات في كل التطبيق",
  "ترجمة تلقائية": "استمع للترجمة العربية بعد كل جملة سويدية",
  "تشغيل بالخلفية": "تحكم بالتشغيل أثناء استخدام تطبيقات أخرى",
  "تنزيل للاستماع بدون إنترنت": "خزّن حزمة كلمات لتستخدمها بدون اتصال",
};

export default function AudioLearningHubPage() {
  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
          <ChevronRight className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Headphones className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">تعلم بالصوت</h1>
          <p className="text-xs text-muted-foreground mt-0.5">استمع وتعلّم السويدية في أي وقت</p>
        </div>
      </header>

      <div className="p-4 grid grid-cols-2 gap-3">
        {audioLearningTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href + tool.label}
              href={tool.href}
              className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-card border border-card-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground leading-snug">{tool.label}</span>
              <span className="text-[11px] text-muted-foreground leading-snug -mt-1">
                {DESCRIPTIONS[tool.label]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
