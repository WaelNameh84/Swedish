import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, X, BookMarked, Clock, ChevronRight, Volume2,
  Star, BookOpen, Layers, Tag, Filter, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import WordDetailSheet from "@/components/WordDetailSheet";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DictionaryWord {
  id: number;
  word: string;
  translation: string;
  phonetic: string;
  partOfSpeech: string;
  gender: string | null;
  plural: string | null;
  level: string;
  category: string;
  imageUrl: string | null;
  audioUrl: string | null;
  examples: Array<{ sv: string; ar: string }>;
  synonyms: string[];
  antonyms: string[];
  conjugations: Record<string, string> | null;
}

interface SearchResult {
  words: DictionaryWord[];
  total: number;
  offset: number;
  limit: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const CATEGORY_LABELS: Record<string, string> = {
  familj: "العائلة",
  mat: "الطعام",
  natur: "الطبيعة",
  stad: "المدينة",
  arbete: "العمل",
  kropp: "الجسم",
  hälsa: "الصحة",
  transport: "المواصلات",
  hem: "المنزل",
  tid: "الوقت",
  handel: "التسوق",
  skola: "المدرسة",
  känslor: "المشاعر",
  nyckelverb: "أفعال أساسية",
  kultur: "الثقافة",
};

const POS_LABELS: Record<string, string> = {
  substantiv: "اسم",
  verb: "فعل",
  adjektiv: "صفة",
  adverb: "ظرف",
  preposition: "حرف جر",
  pronomen: "ضمير",
  interjektion: "تعجب",
};

const POS_COLORS: Record<string, string> = {
  substantiv: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  verb: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  adjektiv: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  adverb: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  preposition: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  pronomen: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  interjektion: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
};

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-green-100 text-green-700", A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",   B2: "bg-indigo-100 text-indigo-700",
  C1: "bg-purple-100 text-purple-700", C2: "bg-rose-100 text-rose-700",
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useLocalSet(key: string) {
  const [set, setSet] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch { return new Set(); }
  });
  const toggle = useCallback((id: number) => {
    setSet(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(key, JSON.stringify([...next]));
      return next;
    });
  }, [key]);
  return [set, toggle] as const;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<DictionaryWord | null>(null);
  const [randomWord, setRandomWord] = useState<DictionaryWord | null>(null);
  const [activeTab, setActiveTab] = useState<"search" | "favorites" | "review">("search");

  const [favorites, toggleFavorite] = useLocalSet("dict_favorites");
  const [reviewLater, toggleReview] = useLocalSet("dict_review");

  const searchRef = useRef<HTMLInputElement>(null);

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  // Load categories
  useEffect(() => {
    fetch(`${BASE}/api/dictionary/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Load random word of day
  useEffect(() => {
    fetch(`${BASE}/api/dictionary/random`)
      .then(r => r.json())
      .then(setRandomWord)
      .catch(() => {});
  }, []);

  // Search
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (selectedLevel) params.set("level", selectedLevel);
    if (selectedCategory) params.set("category", selectedCategory);
    params.set("limit", "40");

    setLoading(true);
    fetch(`${BASE}/api/dictionary/search?${params}`)
      .then(r => r.json())
      .then((data: SearchResult) => {
        setWords(data.words || []);
        setTotal(data.total || 0);
      })
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery, selectedLevel, selectedCategory]);

  // Filter for tabs
  const displayedWords = activeTab === "favorites"
    ? words.filter(w => favorites.has(w.id))
    : activeTab === "review"
      ? words.filter(w => reviewLater.has(w.id))
      : words;

  // All-words for favorites/review tab (load all if needed)
  const [allWords, setAllWords] = useState<DictionaryWord[]>([]);
  useEffect(() => {
    if (activeTab === "favorites" || activeTab === "review") {
      fetch(`${BASE}/api/dictionary/search?limit=200`)
        .then(r => r.json())
        .then((d: SearchResult) => setAllWords(d.words || []))
        .catch(() => {});
    }
  }, [activeTab]);

  const tabWords = activeTab === "favorites"
    ? allWords.filter(w => favorites.has(w.id))
    : activeTab === "review"
      ? allWords.filter(w => reviewLater.has(w.id))
      : words;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">القاموس</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{total} كلمة سويدية</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث عن كلمة بالسويدية أو العربية..."
              className="w-full bg-muted/50 border border-border rounded-2xl py-3 pr-10 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-1">
          {[
            { key: "search", label: "البحث", icon: Search },
            { key: "favorites", label: "المفضلة", icon: Star },
            { key: "review", label: "للمراجعة", icon: Clock },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "search" | "favorites" | "review")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.key === "favorites" && favorites.size > 0 && (
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold", isActive ? "bg-white/20" : "bg-primary/10 text-primary")}>
                    {favorites.size}
                  </span>
                )}
                {tab.key === "review" && reviewLater.size > 0 && (
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold", isActive ? "bg-white/20" : "bg-primary/10 text-primary")}>
                    {reviewLater.size}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

        {/* Filters (only on search tab) */}
        {activeTab === "search" && (
          <div className="space-y-2">
            {/* Level filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedLevel("")}
                className={cn(
                  "shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-all",
                  !selectedLevel ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >الكل</button>
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLevel(l === selectedLevel ? "" : l)}
                  className={cn(
                    "shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-all",
                    selectedLevel === l ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >{l}</button>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("")}
                className={cn(
                  "shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                  !selectedCategory ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >جميع الفئات</button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                  className={cn(
                    "shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                    selectedCategory === cat ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
                  )}
                >{CATEGORY_LABELS[cat] ?? cat}</button>
              ))}
            </div>
          </div>
        )}

        {/* Word of Day (only on search tab with no query/filters) */}
        {activeTab === "search" && !query && !selectedLevel && !selectedCategory && randomWord && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground cursor-pointer"
            onClick={() => setSelectedWord(randomWord)}
          >
            {randomWord.imageUrl && (
              <img
                src={randomWord.imageUrl}
                alt={randomWord.word}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <div className="relative p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 opacity-80" />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">كلمة اليوم</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black tracking-tight" dir="ltr">{randomWord.word}</p>
                  <p className="text-sm opacity-80 mt-0.5" dir="ltr">{randomWord.phonetic}</p>
                  <p className="text-base font-bold mt-1">{randomWord.translation}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{randomWord.level}</span>
                  <span className="text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded-full">{POS_LABELS[randomWord.partOfSpeech] ?? randomWord.partOfSpeech}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Word List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />
              ))}
            </motion.div>
          ) : tabWords.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-16 text-center"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                {activeTab === "favorites" ? <Star className="w-7 h-7 text-muted-foreground" /> :
                 activeTab === "review" ? <Clock className="w-7 h-7 text-muted-foreground" /> :
                 <Search className="w-7 h-7 text-muted-foreground" />}
              </div>
              <p className="font-bold text-foreground">
                {activeTab === "favorites" ? "لا توجد كلمات محفوظة بعد" :
                 activeTab === "review" ? "لا توجد كلمات للمراجعة" :
                 "لا نتائج"}
              </p>
              <p className="text-sm text-muted-foreground max-w-[220px]">
                {activeTab === "favorites" ? "اضغط على النجمة في تفاصيل الكلمة لحفظها" :
                 activeTab === "review" ? 'اضغط على "مراجعة لاحقاً" في تفاصيل الكلمة' :
                 "جرب كلمة أخرى أو غيّر الفلاتر"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {tabWords.map((word, idx) => (
                <WordCard
                  key={word.id}
                  word={word}
                  index={idx}
                  isFavorite={favorites.has(word.id)}
                  isReview={reviewLater.has(word.id)}
                  onToggleFavorite={() => toggleFavorite(word.id)}
                  onToggleReview={() => toggleReview(word.id)}
                  onClick={() => setSelectedWord(word)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Word Detail Sheet */}
      <WordDetailSheet
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
        isFavorite={selectedWord ? favorites.has(selectedWord.id) : false}
        isReview={selectedWord ? reviewLater.has(selectedWord.id) : false}
        onToggleFavorite={() => selectedWord && toggleFavorite(selectedWord.id)}
        onToggleReview={() => selectedWord && toggleReview(selectedWord.id)}
      />
    </div>
  );
}

// ─── Word Card ────────────────────────────────────────────────────────────────
function WordCard({
  word, index, isFavorite, isReview, onToggleFavorite, onToggleReview, onClick,
}: {
  word: DictionaryWord;
  index: number;
  isFavorite: boolean;
  isReview: boolean;
  onToggleFavorite: () => void;
  onToggleReview: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      onClick={onClick}
      className="group flex items-center gap-3 bg-card border border-card-border rounded-2xl p-3.5 cursor-pointer hover:border-primary/30 hover:shadow-sm active:scale-[0.99] transition-all"
    >
      {/* Image */}
      {word.imageUrl ? (
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
          <img
            src={word.imageUrl}
            alt={word.word}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full bg-primary/10 flex items-center justify-center"><span class="text-xl">${word.word[0]}</span></div>`; }}
          />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-2xl font-black text-primary">{word.word[0].toUpperCase()}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-black text-foreground text-base" dir="ltr">{word.word}</span>
          {word.gender && (
            <span className="text-[9px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md" dir="ltr">{word.gender}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground" dir="ltr">{word.phonetic}</p>
        <p className="text-sm font-semibold text-foreground/80 truncate mt-0.5">{word.translation}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md", POS_COLORS[word.partOfSpeech] ?? "bg-muted text-muted-foreground")}>
            {POS_LABELS[word.partOfSpeech] ?? word.partOfSpeech}
          </span>
          <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md", LEVEL_COLORS[word.level] ?? "bg-muted")}>
            {word.level}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
          className={cn(
            "w-7 h-7 rounded-xl flex items-center justify-center transition-all",
            isFavorite ? "bg-yellow-100 text-yellow-500" : "bg-muted text-muted-foreground hover:text-yellow-500"
          )}
        >
          <Star className={cn("w-3.5 h-3.5", isFavorite && "fill-yellow-500")} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onToggleReview(); }}
          className={cn(
            "w-7 h-7 rounded-xl flex items-center justify-center transition-all",
            isReview ? "bg-blue-100 text-blue-500" : "bg-muted text-muted-foreground hover:text-blue-500"
          )}
        >
          <Clock className={cn("w-3.5 h-3.5", isReview && "fill-blue-500/30 stroke-blue-500")} />
        </button>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
    </motion.div>
  );
}
