import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Star, Clock, Volume2, BookOpen, Layers,
  ArrowLeftRight, List, Image as ImageIcon, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DictionaryWord } from "@/pages/DictionaryPage";

// ─── Labels ───────────────────────────────────────────────────────────────────
const POS_LABELS: Record<string, string> = {
  substantiv: "اسم", verb: "فعل", adjektiv: "صفة", adverb: "ظرف",
  preposition: "حرف جر", pronomen: "ضمير", interjektion: "تعجب",
};

const POS_COLORS: Record<string, string> = {
  substantiv: "bg-blue-100 text-blue-700",
  verb: "bg-emerald-100 text-emerald-700",
  adjektiv: "bg-purple-100 text-purple-700",
  adverb: "bg-orange-100 text-orange-700",
  preposition: "bg-rose-100 text-rose-700",
  pronomen: "bg-sky-100 text-sky-700",
  interjektion: "bg-yellow-100 text-yellow-700",
};

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-green-100 text-green-700", A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",   B2: "bg-indigo-100 text-indigo-700",
  C1: "bg-purple-100 text-purple-700", C2: "bg-rose-100 text-rose-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  familj: "العائلة", mat: "الطعام", natur: "الطبيعة", stad: "المدينة",
  arbete: "العمل", kropp: "الجسم", hälsa: "الصحة", transport: "المواصلات",
  hem: "المنزل", tid: "الوقت", handel: "التسوق", skola: "المدرسة",
  känslor: "المشاعر", nyckelverb: "أفعال أساسية", kultur: "الثقافة",
};

// ─── Pronunciation ────────────────────────────────────────────────────────────
function speak(text: string) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "sv-SE";
  utter.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  word: DictionaryWord | null;
  onClose: () => void;
  isFavorite: boolean;
  isReview: boolean;
  onToggleFavorite: () => void;
  onToggleReview: () => void;
}

export default function WordDetailSheet({ word, onClose, isFavorite, isReview, onToggleFavorite, onToggleReview }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (word) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [word]);

  return (
    <AnimatePresence>
      {word && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdrop}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
        >
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 340 }}
            className="w-full max-w-2xl bg-background rounded-t-3xl overflow-hidden max-h-[92dvh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1">

              {/* Hero Image */}
              {word.imageUrl && (
                <div className="relative w-full h-44">
                  <img
                    src={word.imageUrl}
                    alt={word.word}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>
              )}

              <div className="px-5 pb-8 space-y-5" dir="rtl">

                {/* Header: Word + Actions */}
                <div className="flex items-start justify-between gap-3 pt-2">
                  <div className="flex-1">
                    {/* Word */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-4xl font-black text-foreground tracking-tight" dir="ltr">{word.word}</span>
                      {word.gender && (
                        <span className="text-sm font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-lg self-end mb-1" dir="ltr">{word.gender}</span>
                      )}
                    </div>

                    {/* Phonetic + Speaker */}
                    <button
                      onClick={() => speak(word.word)}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
                      dir="ltr"
                    >
                      <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{word.phonetic}</span>
                    </button>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className={cn("text-xs font-bold px-2.5 py-1 rounded-xl", POS_COLORS[word.partOfSpeech] ?? "bg-muted text-muted-foreground")}>
                        {POS_LABELS[word.partOfSpeech] ?? word.partOfSpeech}
                      </span>
                      <span className={cn("text-xs font-bold px-2.5 py-1 rounded-xl", LEVEL_COLORS[word.level] ?? "bg-muted")}>
                        {word.level}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-muted text-muted-foreground">
                        {CATEGORY_LABELS[word.category] ?? word.category}
                      </span>
                    </div>
                  </div>

                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center hover:bg-muted/80 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* ─── Translation ─────────────────────────────────────── */}
                <Section icon={BookOpen} title="الترجمة">
                  <div className="bg-muted/50 rounded-2xl p-4">
                    <p className="text-2xl font-black text-foreground">{word.translation}</p>
                    {word.plural && (
                      <p className="text-sm text-muted-foreground mt-1">
                        جمع: <span className="font-bold text-foreground" dir="ltr">{word.plural}</span>
                      </p>
                    )}
                  </div>
                </Section>

                {/* ─── Examples ────────────────────────────────────────── */}
                {word.examples.length > 0 && (
                  <Section icon={List} title="أمثلة">
                    <div className="space-y-2">
                      {word.examples.map((ex, i) => (
                        <div key={i} className="bg-muted/40 rounded-2xl p-3.5">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => speak(ex.sv)}
                              className="text-primary hover:scale-110 transition-transform shrink-0 mt-0.5"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-foreground" dir="ltr">{ex.sv}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">{ex.ar}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* ─── Conjugations ────────────────────────────────────── */}
                {word.conjugations && Object.keys(word.conjugations).length > 0 && (
                  <Section icon={Layers} title={word.partOfSpeech === "verb" ? "تصريف الفعل" : word.partOfSpeech === "adjektiv" ? "تصريف الصفة" : "التصريفات"}>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(word.conjugations).map(([form, value]) => (
                        <div key={form} className="bg-muted/40 rounded-xl p-3">
                          <p className="text-[10px] text-muted-foreground font-semibold mb-1">{form}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-black text-foreground" dir="ltr">{value}</p>
                            <button onClick={() => speak(value)} className="text-muted-foreground hover:text-primary transition-colors">
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* ─── Synonyms & Antonyms ─────────────────────────────── */}
                {(word.synonyms.length > 0 || word.antonyms.length > 0) && (
                  <Section icon={ArrowLeftRight} title="المترادفات والأضداد">
                    <div className="space-y-3">
                      {word.synonyms.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-2">مترادفات</p>
                          <div className="flex flex-wrap gap-1.5">
                            {word.synonyms.map(s => (
                              <button
                                key={s}
                                onClick={() => speak(s)}
                                className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors"
                                dir="ltr"
                              >
                                <Volume2 className="w-3 h-3 opacity-60" />
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {word.antonyms.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-2">أضداد</p>
                          <div className="flex flex-wrap gap-1.5">
                            {word.antonyms.map(a => (
                              <button
                                key={a}
                                onClick={() => speak(a)}
                                className="flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-rose-100 transition-colors"
                                dir="ltr"
                              >
                                <Volume2 className="w-3 h-3 opacity-60" />
                                {a}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Section>
                )}

                {/* ─── Actions: Favorite + Review ──────────────────────── */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={onToggleFavorite}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all",
                      isFavorite
                        ? "bg-yellow-400 text-white shadow-md shadow-yellow-200"
                        : "bg-muted text-foreground hover:bg-yellow-50 hover:text-yellow-600"
                    )}
                  >
                    <Star className={cn("w-4 h-4", isFavorite && "fill-white")} />
                    {isFavorite ? "محفوظة ✓" : "حفظ بالمفضلة"}
                  </button>
                  <button
                    onClick={onToggleReview}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all",
                      isReview
                        ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                        : "bg-muted text-foreground hover:bg-blue-50 hover:text-blue-600"
                    )}
                  >
                    <Clock className={cn("w-4 h-4", isReview && "stroke-white")} />
                    {isReview ? "للمراجعة ✓" : "مراجعة لاحقاً"}
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Section helper ───────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-sm font-black text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}
