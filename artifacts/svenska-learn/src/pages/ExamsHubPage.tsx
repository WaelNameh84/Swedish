import { Link } from "wouter";
import { ClipboardCheck, ChevronRight } from "lucide-react";
import { examsTools } from "@/components/AppSidebar";

const DESCRIPTIONS: Record<string, string> = {
  "الاختبار اليومي": "10 أسئلة سريعة لتقييم مستواك اليوم",
  "الاختبار الأسبوعي": "25 سؤال يغطي ما تعلمته هذا الأسبوع",
  "الاختبار الشهري": "50 سؤال شامل لمراجعة الشهر كاملاً",
  "اختبار المستوى": "اختبار معتمد لتحديد مستواك من A1 إلى C2",
  "الشهادة": "استعرض واحصل على شهاداتك حسب المستوى",
  "تقرير الأداء": "إحصائيات ونتائجك السابقة عبر الزمن",
};

export default function ExamsHubPage() {
  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
          <ChevronRight className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <ClipboardCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">الاختبارات</h1>
          <p className="text-xs text-muted-foreground mt-0.5">قيّم مستواك واحصل على شهادتك</p>
        </div>
      </header>

      <div className="p-4 grid grid-cols-2 gap-3">
        {examsTools.map((tool) => {
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
