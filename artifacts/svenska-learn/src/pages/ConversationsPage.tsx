import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Volume2, ChevronRight, ChevronLeft,
  BookOpen, Lightbulb, Globe, Mic, Play, Pause,
  Star, MessageCircle, GraduationCap, List, ClipboardCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCQuiz } from "@/components/MCQuiz";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ConvLine {
  id: number; orderIndex: number;
  speaker: string; speakerName: string; speakerRole: string | null;
  textSv: string; textAr: string; phonetic: string | null; noteAr: string | null;
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

const CATEGORY_COLORS: Record<string, string> = {
  "سفر":    "bg-sky-100 text-sky-700",
  "صحة":    "bg-rose-100 text-rose-700",
  "تعليم":  "bg-violet-100 text-violet-700",
  "عمل":    "bg-blue-100 text-blue-700",
  "طعام":   "bg-orange-100 text-orange-700",
  "تسوق":   "bg-teal-100 text-teal-700",
  "رسمي":   "bg-slate-100 text-slate-700",
  "طوارئ":  "bg-red-100 text-red-700",
  "يومي":   "bg-green-100 text-green-700",
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function speak(text: string, rate = 0.85) {
  if (!window.speechSynthesis || !text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "sv-SE"; u.rate = rate;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ConversationsPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selected, setSelected] = useState<Conversation | null>(null);

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

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AnimatePresence mode="wait">
        {selected ? (
          <ConversationDetail
            key="detail"
            conv={selected}
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
                    <p className="text-xs text-muted-foreground mt-0.5">24 محادثة من الحياة الحقيقية</p>
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
                    <ConvCard key={conv.id} conv={conv} index={i} onClick={() => setSelected(conv)} />
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
  const catColor = CATEGORY_COLORS[conv.category] ?? "bg-muted text-muted-foreground";

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
        {conv.imageUrl ? (
          <img src={conv.imageUrl} alt={conv.titleAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Emoji */}
        <div className="absolute top-2 right-2 text-3xl drop-shadow-lg">{conv.emoji}</div>
        {/* Difficulty */}
        <div className="absolute bottom-2 left-2">
          <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md", diff.color)}>{diff.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3">
        <h3 className="text-sm font-black text-foreground leading-tight mb-1">{conv.titleAr}</h3>
        <p className="text-[10px] text-muted-foreground font-medium mb-2" dir="ltr">{conv.title}</p>
        <div className="flex items-center justify-between">
          <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md", catColor)}>{conv.category}</span>
          <span className="text-[9px] text-muted-foreground">{conv.durationMinutes} دقيقة</span>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Conversation Detail ───────────────────────────────────────────────────────
type Tab = "dialogue" | "vocab" | "grammar" | "phrases" | "quiz";

function ConversationDetail({ conv, onBack }: { conv: Conversation; onBack: () => void }) {
  const [full, setFull] = useState<Conversation | null>(null);
  const [tab, setTab] = useState<Tab>("dialogue");
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const playRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const data = full ?? conv;

  // Load full conversation
  useEffect(() => {
    fetch(`${BASE}/api/conversations/${conv.id}`)
      .then(r => r.json()).then(setFull).catch(() => {});
    return () => { window.speechSynthesis?.cancel(); if (playRef.current) clearTimeout(playRef.current); };
  }, [conv.id]);

  // Sequential playback
  const playAll = () => {
    if (!data.lines?.length) return;
    setPlaying(true);
    setTab("dialogue");
    let i = 0;
    const playNext = () => {
      if (i >= (data.lines?.length ?? 0)) { setPlaying(false); setCurrentLine(-1); return; }
      const line = data.lines![i];
      setCurrentLine(i);
      const u = new SpeechSynthesisUtterance(line.textSv);
      u.lang = "sv-SE"; u.rate = 0.8;
      u.onend = () => { i++; playRef.current = setTimeout(playNext, 600); };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    };
    playNext();
  };

  const stopAll = () => {
    window.speechSynthesis?.cancel();
    if (playRef.current) clearTimeout(playRef.current);
    setPlaying(false); setCurrentLine(-1);
  };

  const diff = DIFF_META[conv.difficulty] ?? DIFF_META.beginner;

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "dialogue", label: "المحادثة", icon: MessageCircle },
    { key: "vocab",    label: "المفردات", icon: BookOpen },
    { key: "grammar",  label: "القواعد",  icon: GraduationCap },
    { key: "phrases",  label: "عبارات",   icon: List },
    { key: "quiz",     label: "اختبار",   icon: ClipboardCheck },
  ];

  return (
    <motion.div
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-30 bg-background flex flex-col"
      dir="rtl"
    >
      {/* Hero */}
      <div className="relative h-48 shrink-0">
        {conv.imageUrl ? (
          <img src={conv.imageUrl} alt={conv.titleAr} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-7xl">{conv.emoji}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />

        {/* Back */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Play all */}
        <button
          onClick={playing ? stopAll : playAll}
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-black/60 transition-colors"
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {playing ? "إيقاف" : "استمع للكل"}
        </button>

        {/* Title */}
        <div className="absolute bottom-0 right-0 left-0 px-4 pb-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h1 className="text-xl font-black text-white drop-shadow-sm">{conv.titleAr}</h1>
              <p className="text-xs text-white/80 font-medium" dir="ltr">{conv.title}</p>
            </div>
            <div className="flex gap-1.5 shrink-0 mb-0.5">
              <span className={cn("text-[9px] font-black px-2 py-1 rounded-lg", diff.color)}>{diff.label}</span>
              <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-white/20 text-white">{conv.durationMinutes} دقيقة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 border-b border-border bg-background">
        <div className="flex px-3 pt-2 gap-0.5 overflow-x-auto scrollbar-hide">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-t-xl whitespace-nowrap transition-all border-b-2",
                tab === key
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === "dialogue" && (
            <DialogueTab key="dialogue" lines={data.lines ?? []} currentLine={currentLine} />
          )}
          {tab === "vocab" && (
            <VocabTab key="vocab" items={data.vocabList} />
          )}
          {tab === "grammar" && (
            <GrammarTab key="grammar" tips={data.grammarTips} culturalNotes={data.culturalNotes} />
          )}
          {tab === "phrases" && (
            <PhrasesTab key="phrases" phrases={data.usefulPhrases} />
          )}
          {tab === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 py-5 pb-10">
              <MCQuiz questions={data.quiz ?? []} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Dialogue Tab ─────────────────────────────────────────────────────────────
function DialogueTab({ lines, currentLine }: { lines: ConvLine[]; currentLine: number }) {
  // Map speakers to colors
  const speakers = [...new Set(lines.map(l => l.speaker))];
  const speakerColors: Record<string, { bubble: string; avatar: string; align: string }> = {
    [speakers[0]]: {
      bubble: "bg-primary text-primary-foreground shadow-primary/15",
      avatar: "bg-primary text-primary-foreground",
      align: "self-end flex-row-reverse",
    },
    [speakers[1]]: {
      bubble: "bg-card border border-card-border",
      avatar: "bg-muted text-foreground",
      align: "self-start",
    },
    [speakers[2] ?? "C"]: {
      bubble: "bg-emerald-50 border border-emerald-200 text-emerald-900",
      avatar: "bg-emerald-500 text-white",
      align: "self-start",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="px-4 py-5 space-y-4 pb-10"
    >
      {lines.map((line, idx) => {
        const style = speakerColors[line.speaker] ?? speakerColors[speakers[0]];
        const isActive = currentLine === idx;
        const isRight = line.speaker === speakers[0];

        return (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={cn("flex gap-2.5 max-w-[90%]", style.align, isActive && "scale-[1.01]")}
          >
            {/* Avatar */}
            <div className="shrink-0 flex flex-col items-center gap-1 mt-1">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm", style.avatar)}>
                {line.speakerName[0]}
              </div>
            </div>

            {/* Bubble */}
            <div
              className={cn(
                "flex flex-col rounded-2xl overflow-hidden transition-all duration-300 shadow-sm",
                style.bubble,
                isRight ? "rounded-tr-sm" : "rounded-tl-sm",
                isActive && "ring-2 ring-primary/40 shadow-lg"
              )}
            >
              {/* Speaker name + role */}
              <div className={cn("px-3 pt-2.5 pb-1 flex items-center gap-1.5")}>
                <span className="text-[10px] font-black opacity-70">{line.speakerName}</span>
                {line.speakerRole && (
                  <span className="text-[9px] opacity-50 font-semibold">· {line.speakerRole}</span>
                )}
              </div>

              <div className="px-3 pb-2.5 space-y-2">
                {/* Swedish text + speaker button */}
                <div className="flex items-start gap-2" dir="ltr">
                  <button
                    onClick={() => speak(line.textSv)}
                    className="shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <p className="text-sm font-bold leading-snug">{line.textSv}</p>
                    {line.phonetic && (
                      <p className="text-[10px] opacity-60 font-mono mt-0.5">/{line.phonetic}/</p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full opacity-10 bg-current" />

                {/* Arabic translation */}
                <p className="text-xs leading-relaxed opacity-80" dir="rtl">{line.textAr}</p>

                {/* Grammar note */}
                {line.noteAr && (
                  <div className="flex items-start gap-1.5 mt-1 bg-black/5 rounded-xl px-2 py-1.5">
                    <Lightbulb className="w-3 h-3 shrink-0 mt-0.5 opacity-60" />
                    <p className="text-[10px] leading-relaxed opacity-70" dir="rtl">{line.noteAr}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
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
            onClick={() => speak(item.sv)}
            className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-primary" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2" dir="ltr">
              <span className="font-black text-foreground">{item.sv}</span>
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
              <button
                onClick={() => speak(tip.example)}
                className="flex items-start gap-2 w-full text-right"
              >
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

      {/* Cultural notes */}
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
  const [copied, setCopied] = useState<number | null>(null);

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
          onClick={() => speak(phrase.sv)}
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
