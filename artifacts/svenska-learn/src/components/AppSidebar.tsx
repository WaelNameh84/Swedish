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
  Users2,
  UserCircle2,
  UserPlus,
  Swords,
  Trophy,
  Share2,
  CheckCircle2,
  LayoutDashboard,
  BarChart2,
  HardDrive,
  Globe,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = { href: string; label: string; icon: LucideIcon };

// Everyday content — always visible, no need to open a menu to reach these.
const mainLinks: NavItem[] = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/lessons", label: "الدروس", icon: BookOpen },
  { href: "/dictionary", label: "القاموس", icon: BookMarked },
  { href: "/verbs", label: "الأفعال", icon: Languages },
  { href: "/conversations", label: "المحادثات", icon: MessageCircle },
];

// Tool lists below are also rendered as full hubs by their own hub pages
// (e.g. AiTeacherHubPage) — keep exported and keep every entry, only the
// sidebar's grouping/order changes here.
export const adminTools: NavItem[] = [
  { href: "/admin/users", label: "المستخدمون", icon: Users2 },
  { href: "/admin/languages", label: "اللغات", icon: Globe },
  { href: "/admin/lessons", label: "الدروس", icon: BookOpen },
  { href: "/admin/words", label: "الكلمات", icon: BookMarked },
  { href: "/admin/conversations", label: "المحادثات", icon: MessageCircle },
  { href: "/admin/exams", label: "الاختبارات", icon: ClipboardCheck },
  { href: "/admin/ai", label: "الذكاء الاصطناعي", icon: Bot },
  { href: "/admin/ai-keys", label: "مفاتيح الذكاء الاصطناعي", icon: KeyRound },
  { href: "/admin/reports", label: "التقارير", icon: BarChart2 },
  { href: "/statistics", label: "الإحصائيات", icon: BarChart3 },
  { href: "/admin/backup", label: "النسخ الاحتياطي", icon: HardDrive },
  { href: "/admin/settings", label: "الإعدادات", icon: SettingsIcon },
];

export const communityTools: NavItem[] = [
  { href: "/community/friends", label: "الأصدقاء", icon: UserPlus },
  { href: "/community/competitions", label: "المنافسات", icon: Swords },
  { href: "/community/leaderboard", label: "الترتيب العالمي", icon: Trophy },
  { href: "/community/groups", label: "المجموعات", icon: Users2 },
  { href: "/community/challenges", label: "التحديات", icon: CheckCircle2 },
  { href: "/community/share", label: "مشاركة الإنجازات", icon: Share2 },
];

export const gamesTools: NavItem[] = [
  { href: "/games/word-order", label: "ترتيب الكلمات", icon: Shuffle },
  { href: "/games/multiple-choice", label: "اختيار من متعدد", icon: ListTree },
  { href: "/games/flashcards", label: "البطاقات التعليمية", icon: Layers },
  { href: "/games/missing-word", label: "الكلمة الناقصة", icon: PenLine },
  { href: "/games/speed-challenge", label: "تحدي السرعة", icon: Timer },
  { href: "/games/picture-game", label: "لعبة الصور", icon: ImageIcon },
  { href: "/games/listening-game", label: "لعبة الاستماع", icon: Ear },
];

export const examsTools: NavItem[] = [
  { href: "/exams/run/daily", label: "الاختبار اليومي", icon: CalendarDays },
  { href: "/exams/run/weekly", label: "الاختبار الأسبوعي", icon: CalendarRange },
  { href: "/exams/run/monthly", label: "الاختبار الشهري", icon: CalendarClock },
  { href: "/exams/run/level", label: "اختبار المستوى", icon: GraduationCap },
  { href: "/exams/certificate", label: "الشهادة", icon: Award },
  { href: "/exams/report", label: "تقرير الأداء", icon: BarChart3 },
];

export const translatorTools: NavItem[] = [
  { href: "/translator/text", label: "ترجمة نصية", icon: Type },
  { href: "/translator/voice", label: "صوت لصوت", icon: Mic2 },
  { href: "/translator/camera", label: "الكاميرا والصور", icon: Camera },
  { href: "/translator/conversation", label: "محادثة مباشرة", icon: MessagesSquare },
];

export const aiTeacherTools: NavItem[] = [
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

export const audioLearningTools: NavItem[] = [
  { href: "/audio-learning/radio", label: "راديو اللغة", icon: Radio },
  { href: "/audio-learning/sleep", label: "تشغيل أثناء النوم", icon: Moon },
  { href: "/audio-learning/repeat", label: "تكرار الكلمات", icon: Repeat },
  { href: "/audio-learning/speed", label: "سرعة الصوت", icon: Gauge },
  { href: "/audio-learning/translate", label: "ترجمة تلقائية", icon: TranslateIcon },
  { href: "/audio-learning/background", label: "تشغيل بالخلفية", icon: Cast },
  { href: "/audio-learning/offline", label: "تنزيل للاستماع بدون إنترنت", icon: DownloadCloud },
];

export const pronunciationTools: NavItem[] = [
  { href: "/pronunciation/record", label: "تسجيل صوتك", icon: Mic2 },
  { href: "/pronunciation/compare", label: "مقارنة النطق", icon: GitCompare },
  { href: "/pronunciation/ai-evaluation", label: "تقييم AI", icon: BadgeCheck },
  { href: "/pronunciation/errors", label: "تصحيح الأخطاء", icon: AlertTriangle },
  { href: "/pronunciation/articulation", label: "مخارج الحروف", icon: Waves },
  { href: "/pronunciation/exercises", label: "تمارين النطق", icon: Dumbbell },
];

// Groups are organized by what the learner is trying to do, in the order
// most people reach for them: practice with AI, then audio, then
// pronunciation, then games/exams, then translator/community, then admin.
// Every route from the old flat menu is still here — only the grouping and
// order changed, nothing was removed.
type NavGroup = {
  key: string;
  label: string;
  icon: LucideIcon;
  basePath: string;
  hubHref?: string;
  hubLabel?: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    key: "ai",
    label: "تدرّب مع الذكاء الاصطناعي",
    icon: Bot,
    basePath: "/ai-teacher",
    hubHref: "/ai-teacher",
    hubLabel: "كل أدوات المعلّم الذكي",
    items: aiTeacherTools,
  },
  {
    key: "audio",
    label: "تعلم بالصوت",
    icon: Headphones,
    basePath: "/audio-learning",
    hubHref: "/audio-learning",
    hubLabel: "كل أدوات الصوت",
    items: audioLearningTools,
  },
  {
    key: "pronunciation",
    label: "النطق",
    icon: AudioLines,
    basePath: "/pronunciation",
    hubHref: "/pronunciation",
    hubLabel: "كل أدوات النطق",
    items: pronunciationTools,
  },
  {
    key: "games",
    label: "الألعاب",
    icon: Gamepad2,
    basePath: "/games",
    hubHref: "/games",
    hubLabel: "كل الألعاب",
    items: gamesTools,
  },
  {
    key: "exams",
    label: "الاختبارات",
    icon: ClipboardCheck,
    basePath: "/exams",
    hubHref: "/exams",
    hubLabel: "كل الاختبارات",
    items: examsTools,
  },
  {
    key: "translator",
    label: "المترجم الفوري",
    icon: TranslateIcon,
    basePath: "/translator",
    hubHref: "/translator",
    hubLabel: "كل أدوات الترجمة",
    items: translatorTools,
  },
  {
    key: "community",
    label: "المجتمع",
    icon: Users2,
    basePath: "/community",
    hubHref: "/community",
    hubLabel: "كل ميزات المجتمع",
    items: communityTools,
  },
];

// Personal/account links — grouped visually at the bottom since they're
// about the learner's own account, not learning content.
const accountLinks: NavItem[] = [
  { href: "/statistics", label: "الإحصائيات", icon: BarChart3 },
  { href: "/profile", label: "الملف الشخصي", icon: UserCircle2 },
  { href: "/settings", label: "الإعدادات", icon: SettingsIcon },
];

const adminGroup: NavGroup = {
  key: "admin",
  label: "لوحة الإدارة",
  icon: LayoutDashboard,
  basePath: "/admin",
  hubHref: "/admin",
  hubLabel: "لوحة الإدارة",
  items: adminTools,
};

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="px-3 pt-3 pb-1 text-[11px] font-semibold text-muted-foreground/70 text-right tracking-wide">
      {children}
    </div>
  );
}

function MainLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors",
        active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
      )}
    >
      <Icon className="w-[18px] h-[18px]" />
      {item.label}
    </Link>
  );
}

function GroupSection({
  group,
  open,
  onToggle,
  location,
  onNavigate,
}: {
  group: NavGroup;
  open: boolean;
  onToggle: () => void;
  location: string;
  onNavigate: () => void;
}) {
  const Icon = group.icon;
  const isGroupActive = location.startsWith(group.basePath);

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors",
          isGroupActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
        )}
      >
        <Icon className="w-[18px] h-[18px]" />
        <span className="flex-1 text-right">{group.label}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="flex flex-col gap-1 pr-4 border-r-2 border-primary/15 mr-[19px] mt-1">
          {group.hubHref && (
            <Link
              href={group.hubHref}
              onClick={onNavigate}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {group.hubLabel}
            </Link>
          )}
          {group.items.map((tool) => {
            const ItemIcon = tool.icon;
            const active = location === tool.href;
            return (
              <Link
                key={tool.href + tool.label}
                href={tool.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <ItemIcon className="w-4 h-4 shrink-0" />
                {tool.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AppSidebar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [openGroupKey, setOpenGroupKey] = useState<string | null>(() => {
    const active = navGroups.find((g) => location.startsWith(g.basePath));
    if (active) return active.key;
    return location.startsWith(adminGroup.basePath) ? adminGroup.key : null;
  });

  const isActive = (href: string) =>
    location === href || (href !== "/" && location.startsWith(href));

  const closeSheet = () => setOpen(false);

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
          {/* التعلّم الأساسي — أقرب المحتوى استخدامًا */}
          {mainLinks.map((item) => (
            <MainLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onClick={closeSheet}
            />
          ))}

          <SectionLabel>أدوات التعلّم والتدريب</SectionLabel>
          {navGroups.map((group) => (
            <GroupSection
              key={group.key}
              group={group}
              open={openGroupKey === group.key}
              onToggle={() => setOpenGroupKey((k) => (k === group.key ? null : group.key))}
              location={location}
              onNavigate={closeSheet}
            />
          ))}

          <SectionLabel>حسابي</SectionLabel>
          {accountLinks.map((item) => (
            <MainLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onClick={closeSheet}
            />
          ))}

          <SectionLabel>الإدارة</SectionLabel>
          <GroupSection
            group={adminGroup}
            open={openGroupKey === adminGroup.key}
            onToggle={() => setOpenGroupKey((k) => (k === adminGroup.key ? null : adminGroup.key))}
            location={location}
            onNavigate={closeSheet}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
