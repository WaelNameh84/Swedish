import { Link } from "wouter";
import { Users2 } from "lucide-react";
import { communityTools } from "@/components/AppSidebar";

const DESCRIPTIONS: Record<string, string> = {
  "الأصدقاء": "تابع تقدّم متعلمين آخرين وأضفهم كأصدقاء",
  "المنافسات": "شارك في تحديات أسبوعية وشهرية جماعية",
  "الترتيب العالمي": "شاهد ترتيبك بين المتعلمين حسب نقاط الخبرة",
  "المجموعات": "انضم لمجموعات تعلم حسب اهتمامك",
  "التحديات": "أكمل تحديات يومية حقيقية تُحتسب لنقاطك",
  "مشاركة الإنجازات": "شارك إنجازاتك وشهاداتك الحقيقية مع الآخرين",
};

export default function CommunityHubPage() {
  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Users2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">المجتمع</h1>
          <p className="text-xs text-muted-foreground mt-0.5">تعلّم مع الآخرين وشارك إنجازاتك</p>
        </div>
      </header>

      <div className="p-4 grid grid-cols-2 gap-3">
        {communityTools.map((tool) => {
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
              <span className="text-[11px] text-muted-foreground leading-snug -mt-1">{DESCRIPTIONS[tool.label]}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-4">
        <div className="bg-muted/40 border border-border rounded-2xl p-3 text-[11px] text-muted-foreground leading-relaxed">
          الأصدقاء والترتيب العالمي والمجموعات والمنافسات تعرض حالياً بيانات توضيحية لعرض شكل الميزة، بينما التحديات اليومية ومشاركة الإنجازات تعتمد على بياناتك الحقيقية. يمكن ربط هذه الميزات بحسابات مستخدمين حقيقية لاحقاً.
        </div>
      </div>
    </div>
  );
}
