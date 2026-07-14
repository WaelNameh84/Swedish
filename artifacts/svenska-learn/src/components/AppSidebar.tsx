import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  Home,
  BookOpen,
  BookMarked,
  Languages,
  MessageCircle,
  Bot,
  Sparkles,
  ChevronDown,
  PlusCircle,
  MessageSquarePlus,
  SpellCheck,
  GraduationCap,
  ListChecks,
  Mic,
  ClipboardList,
  MessagesSquare,
  CalendarClock,
  Headphones,
  Radio,
  Moon,
  Repeat,
  Gauge,
  Languages as TranslateIcon,
  Cast,
  DownloadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const mainLinks = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/lessons", label: "الدروس", icon: BookOpen },
  { href: "/dictionary", label: "القاموس", icon: BookMarked },
  { href: "/verbs", label: "الأفعال", icon: Languages },
  { href: "/conversations", label: "المحادثات", icon: MessageCircle },
  { href: "/chat", label: "تدرب", icon: Bot },
];

export const aiTeacherTools = [
  { href: "/ai-teacher/words", label: "إنشاء كلمات جديدة", icon: PlusCircle },
  { href: "/ai-teacher/conversations", label: "إنشاء محادثات", icon: MessageSquarePlus },
  { href: "/ai-teacher/corrections", label: "تصحيح الأخطاء", icon: SpellCheck },
  { href: "/ai-teacher/grammar", label: "شرح القواعد", icon: GraduationCap },
  { href: "/ai-teacher/quiz", label: "اختبار المستخدم", icon: ListChecks },
  { href: "/ai-teacher/pronunciation", label: "تقييم النطق", icon: Mic },
  { href: "/ai-teacher/homework", label: "إنشاء واجبات", icon: ClipboardList },
  { href: "/chat", label: "دردشة مع AI", icon: MessagesSquare },
  { href: "/ai-teacher/plan", label: "خطة تعلم تلقائية", icon: CalendarClock },
];

export const audioLearningTools = [
  { href: "/audio-learning/radio", label: "راديو اللغة", icon: Radio },
  { href: "/audio-learning/sleep", label: "تشغيل أثناء النوم", icon: Moon },
  { href: "/audio-learning/repeat", label: "تكرار الكلمات", icon: Repeat },
  { href: "/audio-learning/speed", label: "سرعة الصوت", icon: Gauge },
  { href: "/audio-learning/translate", label: "ترجمة تلقائية", icon: TranslateIcon },
  { href: "/audio-learning/background", label: "تشغيل بالخلفية", icon: Cast },
  { href: "/audio-learning/offline", label: "تنزيل للاستماع بدون إنترنت", icon: DownloadCloud },
];

export default function AppSidebar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(location.startsWith("/ai-teacher"));
  const [audioOpen, setAudioOpen] = useState(location.startsWith("/audio-learning"));

  const isActive = (href: string) =>
    location === href || (href !== "/" && location.startsWith(href));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="القائمة"
          className="fixed top-3 right-3 z-[70] w-10 h-10 rounded-full bg-background/95 backdrop-blur-md border border-border shadow-sm flex items-center justify-center text-foreground active:scale-95 transition-transform"
        >
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border text-right">
          <SheetTitle className="flex items-center gap-2 justify-end text-lg">
            <span>Svenska — تعلم السويدية</span>
            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {mainLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={() => setAiOpen((v) => !v)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors mt-2",
              location.startsWith("/ai-teacher")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <Bot className="w-[18px] h-[18px]" />
            <span className="flex-1 text-right">الذكاء الاصطناعي</span>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", aiOpen && "rotate-180")}
            />
          </button>

          {aiOpen && (
            <div className="flex flex-col gap-1 pr-4 border-r-2 border-primary/15 mr-[19px] mt-1">
              {aiTeacherTools.map((tool) => {
                const Icon = tool.icon;
                const active = location === tool.href;
                return (
                  <Link
                    key={tool.href + tool.label}
                    href={tool.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {tool.label}
                  </Link>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setAudioOpen((v) => !v)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors mt-1",
              location.startsWith("/audio-learning")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <Headphones className="w-[18px] h-[18px]" />
            <span className="flex-1 text-right">تعلم بالصوت</span>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", audioOpen && "rotate-180")}
            />
          </button>

          {audioOpen && (
            <div className="flex flex-col gap-1 pr-4 border-r-2 border-primary/15 mr-[19px] mt-1">
              {audioLearningTools.map((tool) => {
                const Icon = tool.icon;
                const active = location === tool.href;
                return (
                  <Link
                    key={tool.href + tool.label}
                    href={tool.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {tool.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
