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
  AudioLines,
  Mic2,
  GitCompare,
  BadgeCheck,
  AlertTriangle,
  Waves,
  Dumbbell,
  Gamepad2,
  Shuffle,
  ListTree,
  Layers,
  PenLine,
  Timer,
  ImageIcon,
  Ear,
  ClipboardCheck,
  CalendarDays,
  CalendarRange,
  Award,
  BarChart3,
  Type,
  Camera,
  Settings as SettingsIcon,
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
  { href: "/settings", label: "الإعدادات", icon: SettingsIcon },
];

export const gamesTools = [
  { href: "/games/word-order", label: "ترتيب الكلمات", icon: Shuffle },
  { href: "/games/multiple-choice", label: "اختيار من متعدد", icon: ListTree },
  { href: "/games/flashcards", label: "البطاقات التعليمية", icon: Layers },
  { href: "/games/missing-word", label: "الكلمة الناقصة", icon: PenLine },
  { href: "/games/speed-challenge", label: "تحدي السرعة", icon: Timer },
  { href: "/games/picture-game", label: "لعبة الصور", icon: ImageIcon },
  { href: "/games/listening-game", label: "لعبة الاستماع", icon: Ear },
];

export const examsTools = [
  { href: "/exams/run/daily", label: "الاختبار اليومي", icon: CalendarDays },
  { href: "/exams/run/weekly", label: "الاختبار الأسبوعي", icon: CalendarRange },
  { href: "/exams/run/monthly", label: "الاختبار الشهري", icon: CalendarClock },
  { href: "/exams/run/level", label: "اختبار المستوى", icon: GraduationCap },
  { href: "/exams/certificate", label: "الشهادة", icon: Award },
  { href: "/exams/report", label: "تقرير الأداء", icon: BarChart3 },
];

export const translatorTools = [
  { href: "/translator/text", label: "ترجمة نصية", icon: Type },
  { href: "/translator/voice", label: "صوت لصوت", icon: Mic2 },
  { href: "/translator/camera", label: "الكاميرا والصور", icon: Camera },
  { href: "/translator/conversation", label: "محادثة مباشرة", icon: MessagesSquare },
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

export const pronunciationTools = [
  { href: "/pronunciation/record", label: "تسجيل صوتك", icon: Mic2 },
  { href: "/pronunciation/compare", label: "مقارنة النطق", icon: GitCompare },
  { href: "/pronunciation/ai-evaluation", label: "تقييم AI", icon: BadgeCheck },
  { href: "/pronunciation/errors", label: "تصحيح الأخطاء", icon: AlertTriangle },
  { href: "/pronunciation/articulation", label: "مخارج الحروف", icon: Waves },
  { href: "/pronunciation/exercises", label: "تمارين النطق", icon: Dumbbell },
];

export default function AppSidebar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(location.startsWith("/ai-teacher"));
  const [audioOpen, setAudioOpen] = useState(location.startsWith("/audio-learning"));
  const [pronOpen, setPronOpen] = useState(location.startsWith("/pronunciation"));
  const [gamesOpen, setGamesOpen] = useState(location.startsWith("/games"));
  const [examsOpen, setExamsOpen] = useState(location.startsWith("/exams"));
  const [translatorOpen, setTranslatorOpen] = useState(location.startsWith("/translator"));

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

          <button
            onClick={() => setPronOpen((v) => !v)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors mt-1",
              location.startsWith("/pronunciation")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <AudioLines className="w-[18px] h-[18px]" />
            <span className="flex-1 text-right">النطق</span>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", pronOpen && "rotate-180")}
            />
          </button>

          {pronOpen && (
            <div className="flex flex-col gap-1 pr-4 border-r-2 border-primary/15 mr-[19px] mt-1">
              {pronunciationTools.map((tool) => {
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
            onClick={() => setGamesOpen((v) => !v)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors mt-1",
              location.startsWith("/games")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <Gamepad2 className="w-[18px] h-[18px]" />
            <span className="flex-1 text-right">الألعاب</span>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", gamesOpen && "rotate-180")}
            />
          </button>

          {gamesOpen && (
            <div className="flex flex-col gap-1 pr-4 border-r-2 border-primary/15 mr-[19px] mt-1">
              <Link
                href="/games"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Gamepad2 className="w-4 h-4 shrink-0" />
                كل الألعاب
              </Link>
              {gamesTools.map((tool) => {
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
            onClick={() => setExamsOpen((v) => !v)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors mt-1",
              location.startsWith("/exams")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <ClipboardCheck className="w-[18px] h-[18px]" />
            <span className="flex-1 text-right">الاختبارات</span>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", examsOpen && "rotate-180")}
            />
          </button>

          {examsOpen && (
            <div className="flex flex-col gap-1 pr-4 border-r-2 border-primary/15 mr-[19px] mt-1">
              <Link
                href="/exams"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <ClipboardCheck className="w-4 h-4 shrink-0" />
                كل الاختبارات
              </Link>
              {examsTools.map((tool) => {
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
            onClick={() => setTranslatorOpen((v) => !v)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors mt-1",
              location.startsWith("/translator")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <TranslateIcon className="w-[18px] h-[18px]" />
            <span className="flex-1 text-right">المترجم الفوري</span>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", translatorOpen && "rotate-180")}
            />
          </button>

          {translatorOpen && (
            <div className="flex flex-col gap-1 pr-4 border-r-2 border-primary/15 mr-[19px] mt-1">
              <Link
                href="/translator"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <TranslateIcon className="w-4 h-4 shrink-0" />
                كل أدوات الترجمة
              </Link>
              {translatorTools.map((tool) => {
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
