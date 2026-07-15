import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Search, X, Volume2, ChevronRight, ChevronLeft,
  BookOpen, Lightbulb, Globe, Mic, Play, Pause,
  Star, MessageCircle, GraduationCap, List, ClipboardCheck,
  ChevronDown, MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCQuiz } from "@/components/MCQuiz";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ConvLine {
  id: number; orderIndex: number;
  speaker: string; speakerName: string; speakerRole: string | null;
  textSv: string; textAr: string; phonetic: string | null; noteAr: string | null;
  sceneImageUrl: string | null;
}
interface Conversation {
  id: number; title: string; titleAr: string; scenario: string;
  category: string; difficulty: string; emoji: string;
  imageUrl: string | null; durationMinutes: number;
  vocabList: { sv: string; ar: string; phonetic?: string }[];
  grammarTips: { title: string; explanation: string; example: string; exampleAr: string }[];
  culturalNotes: string | null;
  usefulPhrases: { sv: string; ar: string; phonetic?: string }[];
  quiz?: { question: string; options: string[]; correct: number; explanation?: string }[];
  lines?: ConvLine[];
}

// ─── Constants ─────────────────────────────────────────────────────────────
const DIFF_META: Record<string, { label: string; color: string }> = {
  beginner:     { label: "مبتدئ",  color: "bg-emerald-100 text-emerald-700" },
  intermediate: { label: "متوسط",  color: "bg-amber-100 text-amber-700" },
  advanced:     { label: "متقدم",  color: "bg-rose-100 text-rose-700" },
};

// Scenario → Unsplash photo keyword mapping for fallback images
const SCENARIO_IMAGES: Record<string, string> = {
  airport: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  hospital: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  school: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  shopping: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  work: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  home: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  park: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  transport: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
  pharmacy: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
  bank: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80",
  hotel: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
  cafe: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
  default: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&q=80",
};

function getSceneImage(conv: Conversation): string {
  if (conv.imageUrl) return conv.imageUrl;
  const key = conv.scenario?.toLowerCase();
  return SCENARIO_IMAGES[key] ?? SCENARIO_IMAGES.default;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function speakSv(text: string, rate = 0.85) {
  if (!window.speechSynthesis || !text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "sv-SE"; u.rate = rate;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ─── Highlight vocab words in Swedish text ───────────────────────────────────
function HighlightedSv({
  text, vocabList, className
}: { text: string; vocabList: { sv: string }[]; className?: string }) {
  if (!vocabList.length) return <span className={className}>{text}</span>;

  // Build sorted list of vocab words (longest first to handle substrings)
  const words = vocabList
    .map(v => v.sv.trim())
    .filter(w => w.length > 0)
    .sort((a, b) => b.length - a.length);

  const pattern = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isHighlight = words.some(w => w.toLowerCase() === part.toLowerCase());
        return isHighlight ? (
          <span key={i} className="text-[#0055A4] font-extrabold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ConversationsPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [detailMode, setDetailMode] = useState<"scenes" | "info">("scenes");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQ) params.set("q", debouncedQ);
    setLoading(true);
    fetch(`${BASE}/api/conversations?${params}`)
      .then(r => r.json()).then(setConvs).catch(() => setConvs([]))
      .finally(() => setLoading(false));
  }, [debouncedQ]);

  const handleSelect = (conv: Conversation) => {
    setSelected(conv);
    setDetailMode("scenes");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AnimatePresence mode="wait">
        {selected ? (
          <ConversationDetail
            key="detail"
            conv={selected}
            mode={detailMode}
            onModeChange={setDetailMode}
            onBack={() => setSelected(null)}
          />
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
              <div className="max-w-2xl mx-auto px-4 pt-5 pb-3">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-black text-foreground">المحادثات</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">محادثات من الحياة الحقيقية</p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="ابحث عن محادثة..."
                    className="w-full bg-muted/50 border border-border rounded-2xl py-3 pr-10 pl-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="max-w-2xl mx-auto px-4 py-4">
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(8)].map((_, i) => <div key={i} className="h-52 bg-muted animate-pulse rounded-2xl" />)}
                </div>
              ) : convs.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/40" />
                  <p className="font-bold text-foreground">لا توجد نتائج</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {convs.map((conv, i) => (
                    <ConvCard key={conv.id} conv={conv} index={i} onClick={() => handleSelect(conv)} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Conversation Card ────────────────────────────────────────────────────────
function ConvCard({ conv, index, onClick }: { conv: Conversation; index: number; onClick: () => void }) {
  const diff = DIFF_META[conv.difficulty] ?? DIFF_META.beginner;
  const img = getSceneImage(conv);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="relative group flex flex-col rounded-2xl overflow-hidden border border-card-border bg-card hover:border-primary/30 hover:shadow-md active:scale-[0.98] transition-all text-right"
    >
      {/* Image */}
      <div className="relative h-28 w-full overflow-hidden bg-muted">
        <img src={img} alt={conv.titleAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Play indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-gray-800 ml-0.5" />
          </div>
        </div>

        {/* Scene count */}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-0.5">
          <span className="text-[9px] text-white font-bold">🇸🇪 {conv.scenario}</span>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md", diff.color)}>{diff.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3">
        <h3 className="text-sm font-black text-foreground leading-tight mb-1">{conv.titleAr}</h3>
        <p className="text-[10px] text-muted-foreground font-medium mb-2" dir="ltr">{conv.title}</p>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground">{conv.durationMinutes} دقيقة</span>
          <span className="text-[9px] text-primary font-bold">▶ مشاهدة</span>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Conversation Detail (wrapper) ────────────────────────────────────────────
type InfoTab = "vocab" | "grammar" | "phrases" | "quiz";

function ConversationDetail({
  conv, mode, onModeChange, onBack
}: { conv: Conversation; mode: "scenes" | "info"; onModeChange: (m: "scenes" | "info") => void; onBack: () => void }) {
  const [full, setFull] = useState<Conversation | null>(null);
  const [infoTab, setInfoTab] = useState<InfoTab>("vocab");
  const data = full ?? conv;

  useEffect(() => {
    fetch(`${BASE}/api/conversations/${conv.id}`)
      .then(r => r.json()).then(setFull).catch(() => {});
    return () => { window.speechSynthesis?.cancel(); };
  }, [conv.id]);

  const INFO_TABS: { key: InfoTab; label: string; icon: React.ElementType }[] = [
    { key: "vocab",   label: "المفردات", icon: BookOpen },
    { key: "grammar", label: "القواعد",  icon: GraduationCap },
    { key: "phrases", label: "عبارات",   icon: Mic },
    { key: "quiz",    label: "اختبار",   icon: ClipboardCheck },
  ];

  return (
    <motion.div
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-30 bg-black flex flex-col"
      dir="rtl"
    >
      {mode === "scenes" ? (
        <SceneViewer
          conv={data}
          onBack={onBack}
          onOpenInfo={() => onModeChange("info")}
        />
      ) : (
        <div className="flex flex-col h-full bg-background">
          {/* Info header */}
          <div className="relative h-44 shrink-0">
            <img
              src={getSceneImage(conv)}
              alt={conv.titleAr}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
            <button
              onClick={() => onModeChange("scenes")}
              className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-0 right-0 left-0 px-4 pb-3">
              <h1 className="text-xl font-black text-white drop-shadow-sm">{conv.titleAr}</h1>
              <p className="text-xs text-white/70 font-medium" dir="ltr">{conv.title}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="shrink-0 border-b border-border bg-background">
            <div className="flex px-3 pt-2 gap-0.5 overflow-x-auto scrollbar-hide">
              {INFO_TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setInfoTab(key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-t-xl whitespace-nowrap transition-all border-b-2",
                    infoTab === key
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {infoTab === "vocab" && <VocabTab key="vocab" items={data.vocabList} />}
              {infoTab === "grammar" && <GrammarTab key="grammar" tips={data.grammarTips} culturalNotes={data.culturalNotes} />}
              {infoTab === "phrases" && <PhrasesTab key="phrases" phrases={data.usefulPhrases} />}
              {infoTab === "quiz" && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 py-5 pb-10">
                  <MCQuiz questions={data.quiz ?? []} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Scene Viewer (TikTok/Reels style) ───────────────────────────────────────
function SceneViewer({
  conv, onBack, onOpenInfo
}: { conv: Conversation; onBack: () => void; onOpenInfo: () => void }) {
  const lines = conv.lines ?? [];
  const [sceneIdx, setSceneIdx] = useState(0);
  const [showDone, setShowDone] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentLine = lines[sceneIdx];
  // Use per-scene image if available, fall back to conversation image
  const currentBgImage = currentLine?.sceneImageUrl || getSceneImage(conv);

  const goNext = useCallback(() => {
    if (sceneIdx < lines.length - 1) {
      setSceneIdx(i => i + 1);
    } else {
      setShowDone(true);
    }
  }, [sceneIdx, lines.length]);

  const goPrev = () => {
    if (sceneIdx > 0) setSceneIdx(i => i - 1);
    setShowDone(false);
  };

  // Auto-play: speak Swedish text then advance
  const startAutoPlay = () => {
    setAutoPlaying(true);
    setSceneIdx(0);
    setShowDone(false);
  };

  useEffect(() => {
    if (!autoPlaying || !lines.length) return;
    const line = lines[sceneIdx];
    if (!line) { setAutoPlaying(false); setShowDone(true); return; }

    const u = new SpeechSynthesisUtterance(line.textSv);
    u.lang = "sv-SE"; u.rate = 0.8;
    u.onend = () => {
      autoRef.current = setTimeout(() => {
        if (sceneIdx < lines.length - 1) {
          setSceneIdx(i => i + 1);
        } else {
          setAutoPlaying(false);
          setShowDone(true);
        }
      }, 700);
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [autoPlaying, sceneIdx, lines]);

  const stopAutoPlay = () => {
    setAutoPlaying(false);
    window.speechSynthesis.cancel();
    if (autoRef.current) clearTimeout(autoRef.current);
  };

  // Swipe handling
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -60) goNext();
    else if (info.offset.x > 60) goPrev();
  };

  if (!lines.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white gap-4 bg-black">
        <div className="text-5xl animate-pulse">{conv.emoji}</div>
        <p className="text-sm text-white/60">جارٍ التحميل...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-black">

      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneIdx}
          initial={{ scale: 1.08, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {!imgError ? (
            <img
              src={currentBgImage}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <span className="text-8xl opacity-20">{conv.emoji}</span>
            </div>
          )}
          {/* Gradient overlay - stronger at bottom for bubbles */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-5 pb-2">
        {/* Back button */}
        <button
          onClick={onBack}
          className="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scene counter */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1.5">
          <span className="text-base">🇸🇪</span>
          <span className="text-white font-black text-sm">
            Scene {sceneIdx + 1}
          </span>
          <span className="text-white/50 text-xs font-medium">/ {lines.length}</span>
        </div>

        {/* More options */}
        <button
          onClick={onOpenInfo}
          className="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 mt-1">
        {lines.map((_, i) => (
          <button
            key={i}
            onClick={() => { setSceneIdx(i); setShowDone(false); }}
            className={cn(
              "rounded-full transition-all duration-300",
              i === sceneIdx
                ? "w-5 h-1.5 bg-white"
                : i < sceneIdx
                  ? "w-1.5 h-1.5 bg-white/60"
                  : "w-1.5 h-1.5 bg-white/25"
            )}
          />
        ))}
      </div>

      {/* Tap zones for navigation */}
      <motion.div
        className="absolute inset-0 z-10 flex"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        style={{ touchAction: "pan-y" }}
      >
        {/* Left = prev */}
        <div
          className="w-1/3 h-full cursor-pointer"
          onClick={goPrev}
        />
        {/* Center = do nothing (let bubbles be interactive) */}
        <div className="w-1/3 h-full" />
        {/* Right = next */}
        <div
          className="w-1/3 h-full cursor-pointer"
          onClick={goNext}
        />
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Speech bubbles */}
      <div className="relative z-20 px-4 pb-6 space-y-2.5 pointer-events-none">
        <AnimatePresence mode="wait">
          {!showDone && currentLine && (
            <motion.div
              key={`bubbles-${sceneIdx}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-2.5"
            >
              {/* Swedish bubble */}
              <div className="bg-white rounded-[20px] px-4 pt-3.5 pb-3 shadow-2xl pointer-events-auto">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-lg leading-none">🇸🇪</span>
                    <button
                      onClick={() => speakSv(currentLine.textSv)}
                      className="w-7 h-7 bg-[#0055A4]/10 rounded-full flex items-center justify-center hover:bg-[#0055A4]/20 active:scale-95 transition-all shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#0055A4]" />
                    </button>
                  </div>
                  <span className="text-xl leading-none">☀️</span>
                </div>
                <div className="mt-2 pr-0" dir="ltr">
                  <HighlightedSv
                    text={currentLine.textSv}
                    vocabList={conv.vocabList}
                    className="text-[18px] font-black text-gray-900 leading-snug"
                  />
                  {currentLine.phonetic && (
                    <p className="text-[11px] text-gray-400 font-mono mt-1">/{currentLine.phonetic}/</p>
                  )}
                </div>
              </div>

              {/* Arabic bubble */}
              <div className="bg-[#FFF8E1] rounded-[20px] px-4 pt-3.5 pb-3 shadow-2xl">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xl leading-none">☀️</span>
                  <div className="text-right flex-1">
                    <p className="text-[17px] font-bold text-gray-900 leading-snug" dir="rtl">
                      {currentLine.textAr}
                    </p>
                    {currentLine.noteAr && (
                      <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1 justify-end" dir="rtl">
                        <Lightbulb className="w-3 h-3 text-amber-500 shrink-0" />
                        {currentLine.noteAr}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Done screen */}
          {showDone && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="bg-white/95 backdrop-blur-md rounded-[24px] p-5 shadow-2xl pointer-events-auto"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-lg font-black text-gray-900">أتممت المحادثة!</h3>
                <p className="text-sm text-gray-500 mt-0.5" dir="ltr">{conv.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setSceneIdx(0); setShowDone(false); }}
                  className="flex flex-col items-center gap-1.5 bg-primary/10 rounded-2xl p-3 hover:bg-primary/20 active:scale-95 transition-all"
                >
                  <Play className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-primary">إعادة</span>
                </button>
                <button
                  onClick={() => { setSceneIdx(0); setShowDone(false); startAutoPlay(); }}
                  className="flex flex-col items-center gap-1.5 bg-emerald-50 rounded-2xl p-3 hover:bg-emerald-100 active:scale-95 transition-all"
                >
                  <Volume2 className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-700">استمع تلقائياً</span>
                </button>
                <button
                  onClick={onOpenInfo}
                  className="flex flex-col items-center gap-1.5 bg-violet-50 rounded-2xl p-3 hover:bg-violet-100 active:scale-95 transition-all"
                >
                  <BookOpen className="w-5 h-5 text-violet-700" />
                  <span className="text-xs font-bold text-violet-700">المفردات</span>
                </button>
                <button
                  onClick={onOpenInfo}
                  className="flex flex-col items-center gap-1.5 bg-amber-50 rounded-2xl p-3 hover:bg-amber-100 active:scale-95 transition-all"
                >
                  <ClipboardCheck className="w-5 h-5 text-amber-700" />
                  <span className="text-xs font-bold text-amber-700">اختبار</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auto-play controls */}
      <div className="relative z-20 px-4 pb-4">
        <div className="flex items-center justify-between">
          {/* Nav arrows */}
          <button
            onClick={goPrev}
            disabled={sceneIdx === 0}
            className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white disabled:opacity-20 hover:bg-black/60 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Auto play */}
          <button
            onClick={autoPlaying ? stopAutoPlay : startAutoPlay}
            className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-black/70 active:scale-95 transition-all"
          >
            {autoPlaying ? (
              <><Pause className="w-3.5 h-3.5" />إيقاف</>
            ) : (
              <><Play className="w-3.5 h-3.5" />تشغيل تلقائي</>
            )}
          </button>

          {/* Next arrow */}
          <button
            onClick={goNext}
            className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Vocabulary Tab ───────────────────────────────────────────────────────────
function VocabTab({ items }: { items: Conversation["vocabList"] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="px-4 py-5 space-y-2 pb-10"
    >
      <p className="text-xs text-muted-foreground font-semibold mb-3">{items.length} كلمة أساسية في هذه المحادثة</p>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-3 bg-card border border-card-border rounded-2xl p-3.5"
        >
          <button
            onClick={() => speakSv(item.sv)}
            className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-primary" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2" dir="ltr">
              <span className="font-black text-foreground text-[#0055A4]">{item.sv}</span>
              {item.phonetic && (
                <span className="text-[10px] text-muted-foreground font-mono">{item.phonetic}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-semibold mt-0.5">{item.ar}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Grammar Tab ──────────────────────────────────────────────────────────────
function GrammarTab({ tips, culturalNotes }: { tips: Conversation["grammarTips"]; culturalNotes: string | null }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="px-4 py-5 space-y-4 pb-10"
    >
      {tips.map((tip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-card border border-card-border rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 p-3.5 pb-2 border-b border-border bg-muted/30">
            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-black text-foreground">{tip.title}</h3>
          </div>
          <div className="p-3.5 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{tip.explanation}</p>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <button onClick={() => speakSv(tip.example)} className="flex items-start gap-2 w-full text-right">
                <Volume2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-foreground" dir="ltr">{tip.example}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tip.exampleAr}</p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
      {culturalNotes && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: tips.length * 0.08 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 p-3.5 pb-2 border-b border-amber-200/60">
            <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <h3 className="text-sm font-black text-amber-900">ملاحظة ثقافية</h3>
          </div>
          <div className="p-3.5">
            <p className="text-sm text-amber-800 leading-relaxed">{culturalNotes}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Phrases Tab ──────────────────────────────────────────────────────────────
function PhrasesTab({ phrases }: { phrases: Conversation["usefulPhrases"] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="px-4 py-5 space-y-2 pb-10"
    >
      <p className="text-xs text-muted-foreground font-semibold mb-3">عبارات مفيدة — اضغط للاستماع</p>
      {phrases.map((phrase, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => speakSv(phrase.sv)}
          className="w-full flex items-center gap-3 bg-card border border-card-border rounded-2xl p-3.5 text-right hover:border-primary/30 hover:bg-primary/5 active:scale-[0.99] transition-all group"
        >
          <div className="w-9 h-9 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center shrink-0 transition-colors">
            <Mic className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground" dir="ltr">{phrase.sv}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{phrase.ar}</p>
          </div>
          <Volume2 className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
        </motion.button>
      ))}
    </motion.div>
  );
}
