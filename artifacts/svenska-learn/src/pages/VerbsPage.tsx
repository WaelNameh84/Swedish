import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Volume2, Star, Clock, ChevronRight,
  Zap, BookOpen, FlaskConical, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import VerbDetailSheet from "@/components/VerbDetailSheet";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Verb {
  id: number;
  infinitiv: string;
  presens: string;
  preteritum: string;
  supinum: string;
  imperativ: string;
  futurum: string;
  presensParticip: string;
  perfektParticip: string;
  passivPresens: string | null;
  passivPreteritum: string | null;
  translation: string;
  phonetic: string;
  group: string;
  level: string;
  category: string;
  imageUrl: string | null;
  notes: string | null;
  examples: Array<{ sv: string; ar: string }>;
  quizSentences: Array<{ form: string; sentence: string; answer: string; translation: string }>;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const GROUP_LABELS: Record<string, { label: string; ar: string; color: string }> = {
  "1":            { label: "Grupp 1", ar: "المجموعة 1 (-ar)", color: "bg-blue-100 text-blue-700" },
  "2a":           { label: "Grupp 2a", ar: "المجموعة 2أ (-de)", color: "bg-teal-100 text-teal-700" },
  "2b":           { label: "Grupp 2b", ar: "المجموعة 2ب (-te)", color: "bg-cyan-100 text-cyan-700" },
  "3":            { label: "Grupp 3", ar: "المجموعة 3 (-dde)", color: "bg-purple-100 text-purple-700" },
  "oregelbundet": { label: "Oregelbundet", ar: "غير منتظم", color: "bg-rose-100 text-rose-700" },
};

const CATEGORY_LABELS: Record<string, string> = {
  kommunikation: "التواصل", arbete: "العمل", handel: "التسوق",
  rörelse: "الحركة", mat: "الطعام", skola: "المدرسة",
  sinnen: "الحواس", tanke: "التفكير", känsla: "المشاعر",
  vardag: "اليومي", hem: "المنزل", kärnverb: "أفعال أساسية",
};

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-green-100 text-green-700", A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",   B2: "bg-indigo-100 text-indigo-700",
  C1: "bg-purple-100 text-purple-700", C2: "bg-rose-100 text-rose-700",
};

// Forms displayed on card
const CARD_FORMS = [
  { key: "infinitiv",   ar: "المصدر" },
  { key: "presens",     ar: "المضارع" },
  { key: "preteritum",  ar: "الماضي" },
  { key: "supinum",     ar: "اسم المفعول" },
];

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ─── Component ────────────────────────────────────────────────────────────────
export default function VerbsPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [quizMode, setQuizMode] = useState(false);

  // Favorites & review (localStorage)
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("verb_favorites") || "[]")); }
    catch { return new Set(); }
  });
  const [reviewLater, setReviewLater] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("verb_review") || "[]")); }
    catch { return new Set(); }
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("verb_favorites", JSON.stringify([...next]));
      return next;
    });
  };
  const toggleReview = (id: number) => {
    setReviewLater(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("verb_review", JSON.stringify([...next]));
      return next;
    });
  };

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (selectedLevel) params.set("level", selectedLevel);
    if (selectedGroup) params.set("group", selectedGroup);
    params.set("limit", "60");

    setLoading(true);
    fetch(`${BASE}/api/verbs/search?${params}`)
      .then(r => r.json())
      .then(d => { setVerbs(d.verbs || []); setTotal(d.total || 0); })
      .catch(() => setVerbs([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery, selectedLevel, selectedGroup]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">الأفعال</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{total} فعل سويدي مع التصريف الكامل</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuizMode(true)}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-primary/90 transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                اختبر نفسك
              </button>
              <div className="w-9 h-9 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-emerald-700" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث بالسويدية أو العربية..."
              className="w-full bg-muted/50 border border-border rounded-2xl py-3 pr-10 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-2xl mx-auto px-4 pb-3 space-y-2">
          {/* Level pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            <FilterPill active={!selectedLevel} onClick={() => setSelectedLevel("")}>الكل</FilterPill>
            {LEVELS.map(l => (
              <FilterPill key={l} active={selectedLevel === l} onClick={() => setSelectedLevel(l === selectedLevel ? "" : l)}>
                {l}
              </FilterPill>
            ))}
          </div>
          {/* Group pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            <FilterPill active={!selectedGroup} onClick={() => setSelectedGroup("")} dark>كل المجموعات</FilterPill>
            {Object.entries(GROUP_LABELS).map(([g, meta]) => (
              <FilterPill key={g} active={selectedGroup === g} onClick={() => setSelectedGroup(g === selectedGroup ? "" : g)} dark>
                {meta.ar}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Verb List ─── */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-2.5">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-28 bg-muted animate-pulse rounded-2xl" />
              ))}
            </motion.div>
          ) : verbs.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-bold text-foreground">لا نتائج</p>
              <p className="text-sm text-muted-foreground">جرب بحثاً مختلفاً أو غيّر الفلاتر</p>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
              {verbs.map((verb, i) => (
                <VerbCard
                  key={verb.id}
                  verb={verb}
                  index={i}
                  isFavorite={favorites.has(verb.id)}
                  isReview={reviewLater.has(verb.id)}
                  onToggleFavorite={() => toggleFavorite(verb.id)}
                  onToggleReview={() => toggleReview(verb.id)}
                  onClick={() => setSelectedVerb(verb)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Detail Sheet ─── */}
      <VerbDetailSheet
        verb={selectedVerb}
        onClose={() => setSelectedVerb(null)}
        isFavorite={selectedVerb ? favorites.has(selectedVerb.id) : false}
        isReview={selectedVerb ? reviewLater.has(selectedVerb.id) : false}
        onToggleFavorite={() => selectedVerb && toggleFavorite(selectedVerb.id)}
        onToggleReview={() => selectedVerb && toggleReview(selectedVerb.id)}
      />

      {/* ─── Quiz Modal ─── */}
      {quizMode && (
        <VerbQuizModal
          level={selectedLevel}
          onClose={() => setQuizMode(false)}
          baseUrl={BASE}
        />
      )}
    </div>
  );
}

// ─── Filter Pill ──────────────────────────────────────────────────────────────
function FilterPill({ active, onClick, dark, children }: {
  active: boolean; onClick: () => void; dark?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-all",
        dark
          ? active ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
          : active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"
      )}
    >{children}</button>
  );
}

// ─── Verb Card ────────────────────────────────────────────────────────────────
function VerbCard({ verb, index, isFavorite, isReview, onToggleFavorite, onToggleReview, onClick }: {
  verb: Verb; index: number;
  isFavorite: boolean; isReview: boolean;
  onToggleFavorite: () => void; onToggleReview: () => void;
  onClick: () => void;
}) {
  const group = GROUP_LABELS[verb.group];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.25) }}
      onClick={onClick}
      className="group bg-card border border-card-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-sm active:scale-[0.99] transition-all"
    >
      {/* Top: image strip + main info */}
      <div className="flex items-stretch">
        {/* Image column */}
        {verb.imageUrl ? (
          <div className="w-20 relative shrink-0">
            <img
              src={verb.imageUrl}
              alt={verb.infinitiv}
              className="w-full h-full object-cover"
              onError={e => {
                const el = (e.target as HTMLImageElement).parentElement!;
                el.className = "w-20 bg-primary/10 flex items-center justify-center shrink-0";
                el.innerHTML = `<span class="text-3xl font-black text-primary">${verb.infinitiv[0].toUpperCase()}</span>`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
          </div>
        ) : (
          <div className="w-20 bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-3xl font-black text-primary">{verb.infinitiv[0].toUpperCase()}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-3.5 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-foreground" dir="ltr">att {verb.infinitiv}</span>
              </div>
              <span className="text-sm font-bold text-muted-foreground">{verb.translation}</span>
            </div>

            {/* Quick actions */}
            <div className="flex gap-1 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
                className={cn("w-7 h-7 rounded-xl flex items-center justify-center transition-all",
                  isFavorite ? "bg-yellow-100 text-yellow-500" : "bg-muted text-muted-foreground hover:text-yellow-500")}
              ><Star className={cn("w-3.5 h-3.5", isFavorite && "fill-yellow-500")} /></button>
              <button
                onClick={e => { e.stopPropagation(); onToggleReview(); }}
                className={cn("w-7 h-7 rounded-xl flex items-center justify-center transition-all",
                  isReview ? "bg-blue-100 text-blue-500" : "bg-muted text-muted-foreground hover:text-blue-500")}
              ><Clock className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md", group?.color ?? "bg-muted text-muted-foreground")}>
              {group?.ar ?? verb.group}
            </span>
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md", LEVEL_COLORS[verb.level] ?? "bg-muted")}>
              {verb.level}
            </span>
            {verb.category in CATEGORY_LABELS && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                {CATEGORY_LABELS[verb.category]}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center pl-2 pr-3">
          <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
        </div>
      </div>

      {/* Bottom: conjugation strip */}
      <div className="grid grid-cols-4 divide-x divide-border border-t border-border" dir="ltr">
        {CARD_FORMS.map(({ key, ar }) => (
          <div key={key} className="px-2 py-2 text-center">
            <p className="text-[9px] text-muted-foreground font-semibold mb-0.5" dir="rtl">{ar}</p>
            <button
              onClick={e => { e.stopPropagation(); speak((verb as any)[key]); }}
              className="text-xs font-bold text-foreground hover:text-primary transition-colors flex items-center justify-center gap-0.5 mx-auto"
            >
              {(verb as any)[key]}
              <Volume2 className="w-2.5 h-2.5 opacity-40 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Quiz Modal ───────────────────────────────────────────────────────────────
interface QuizQuestion {
  verbId: number; infinitiv: string; translation: string;
  form: string; sentence: string; answer: string; sentenceTranslation: string;
}

const FORM_LABELS: Record<string, string> = {
  presens: "المضارع", preteritum: "الماضي", supinum: "اسم المفعول",
  imperativ: "الأمر", futurum: "المستقبل",
  "presens (3sg)": "المضارع (مفرد)", infinitiv: "المصدر",
};

function VerbQuizModal({ level, onClose, baseUrl }: { level: string; onClose: () => void; baseUrl: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams({ count: "10" });
    if (level) params.set("level", level);
    fetch(`${baseUrl}/api/verbs/quiz?${params}`)
      .then(r => r.json())
      .then(d => { setQuestions(Array.isArray(d) ? d : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && inputRef.current) inputRef.current.focus();
  }, [loading, current]);

  const q = questions[current];

  const submit = () => {
    if (!q || result) return;
    const correct = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
    setResult(correct ? "correct" : "wrong");
    if (correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setUserAnswer("");
    setResult(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-background rounded-3xl overflow-hidden shadow-2xl"
      >
        {loading ? (
          <div className="p-10 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">جاري تحضير الأسئلة...</p>
          </div>
        ) : done || questions.length === 0 ? (
          // Result screen
          <div className="p-8 text-center" dir="rtl">
            <div className="text-6xl mb-4">{score >= questions.length * 0.7 ? "🏆" : score >= questions.length * 0.4 ? "💪" : "📚"}</div>
            <h2 className="text-2xl font-black mb-1">انتهى الاختبار!</h2>
            <p className="text-muted-foreground mb-6">نتيجتك: <span className="font-black text-primary text-xl">{score}</span> / {questions.length}</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 bg-muted text-foreground py-3 rounded-2xl font-bold hover:bg-muted/80">إغلاق</button>
              <button onClick={() => { setCurrent(0); setUserAnswer(""); setResult(null); setScore(0); setDone(false); }} className="flex-1 bg-primary text-primary-foreground py-3 rounded-2xl font-bold hover:bg-primary/90">مرة أخرى</button>
            </div>
          </div>
        ) : q ? (
          // Question screen
          <div dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">السؤال {current + 1} / {questions.length}</p>
                <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden w-48">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question */}
            <div className="px-5 py-5">
              <div className="bg-muted/50 rounded-2xl p-4 mb-4">
                <p className="text-xs font-bold text-muted-foreground mb-1">
                  الفعل: <span dir="ltr" className="text-foreground font-black">att {q.infinitiv}</span> — {q.translation}
                </p>
                <p className="text-sm font-semibold text-muted-foreground">
                  أكمل الجملة بصيغة <span className="text-primary font-black">{FORM_LABELS[q.form] ?? q.form}</span>:
                </p>
                <p className="text-lg font-bold text-foreground mt-2" dir="ltr">{q.sentence}</p>
                <p className="text-sm text-muted-foreground mt-1">{q.sentenceTranslation}</p>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") result ? next() : submit(); }}
                disabled={!!result}
                placeholder="اكتب الإجابة هنا..."
                dir="ltr"
                className={cn(
                  "w-full border-2 rounded-2xl py-3 px-4 text-base font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all text-center",
                  result === "correct" ? "border-emerald-400 bg-emerald-50 text-emerald-700" :
                  result === "wrong"   ? "border-rose-400 bg-rose-50 text-rose-700" :
                                        "border-border bg-background focus:border-primary"
                )}
              />

              {/* Feedback */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={cn("mt-3 rounded-2xl p-3.5 text-center", result === "correct" ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200")}
                  >
                    <p className={cn("font-black text-sm", result === "correct" ? "text-emerald-700" : "text-rose-700")}>
                      {result === "correct" ? "✓ إجابة صحيحة!" : "✗ إجابة خاطئة"}
                    </p>
                    {result === "wrong" && (
                      <p className="text-sm text-muted-foreground mt-1">
                        الإجابة الصحيحة: <span className="font-black text-foreground" dir="ltr">{q.answer}</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action button */}
            <div className="px-5 pb-5">
              <button
                onClick={result ? next : submit}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-black text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                {result ? (current + 1 >= questions.length ? "النتيجة النهائية" : "السؤال التالي →") : "تحقق من الإجابة"}
              </button>
            </div>
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

// ─── TTS helper ───────────────────────────────────────────────────────────────
function speak(text: string) {
  if (!window.speechSynthesis || !text || text === "–") return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "sv-SE"; u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
