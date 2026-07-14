import { Link } from "wouter";
import { Languages } from "lucide-react";
import { translatorTools } from "@/components/AppSidebar";

const DESCRIPTIONS: Record<string, string> = {
  "ترجمة نصية": "اكتب أو الصق نصاً وترجمه فوراً بين أكثر من 130 لغة",
  "صوت لصوت": "تحدث بلغتك واستمع للترجمة بصوت اللغة الأخرى",
  "الكاميرا والصور": "صوّر أو اختر صورة تحتوي نصاً وترجمه فوراً",
  "محادثة مباشرة": "محادثة ثنائية اللغة مباشرة بين شخصين",
};

export default function TranslatorHubPage() {
  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Languages className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">المترجم الفوري</h1>
          <p className="text-xs text-muted-foreground mt-0.5">ترجم نصاً أو صوتاً أو صورة بأكثر من 130 لغة</p>
        </div>
      </header>

      <div className="p-4 grid grid-cols-2 gap-3">
        {translatorTools.map((tool) => {
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

      <div className="px-4">
        <div className="bg-muted/40 border border-border rounded-2xl p-3 text-[11px] text-muted-foreground leading-relaxed">
          الترجمة النصية والصوتية تعمل بدون اتصال بالذكاء الاصطناعي. لتفعيل ترجمة أدق ومحادثة أكثر ذكاءً يمكنك إضافة مفتاح OpenAI من صفحة{" "}
          <Link href="/settings" className="text-primary underline">الإعدادات</Link>.
        </div>
      </div>
    </div>
  );
}
