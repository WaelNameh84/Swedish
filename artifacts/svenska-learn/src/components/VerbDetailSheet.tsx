import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Star, Clock, BookOpen, Layers, MessageCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Verb } from "@/pages/VerbsPage";

// ─── Labels ───────────────────────────────────────────────────────────────────
const GROUP_LABELS: Record<string, { label: string; ar: string; color: string }> = {
  "1":            { label: "Grupp 1", ar: "المجموعة 1 (-ar/-ade/-at)", color: "bg-blue-100 text-blue-700" },
  "2a":           { label: "Grupp 2a", ar: "المجموعة 2أ (-er/-de/-t)", color: "bg-teal-100 text-teal-700" },
  "2b":           { label: "Grupp 2b", ar: "المجموعة 2ب (-er/-te/-t)", color: "bg-cyan-100 text-cyan-700" },
  "3":            { label: "Grupp 3", ar: "المجموعة 3 (-r/-dde/-tt)", color: "bg-purple-100 text-purple-700" },
  "oregelbundet": { label: "Oregelbundet", ar: "فعل غير منتظم", color: "bg-rose-100 text-rose-700" },
};

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-green-100 text-green-700", A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",   B2: "bg-indigo-100 text-indigo-700",
  C1: "bg-purple-100 text-purple-700", C2: "bg-rose-100 text-rose-700",
};

// Full conjugation rows shown in the table
const CONJUGATION_ROWS: Array<{ key: keyof Verb; ar: string; latin: string; note?: string }> = [
  { key: "infinitiv",       ar: "المصدر",          latin: "Infinitiv",        note: "att + فعل" },
  { key: "presens",         ar: "المضارع",          latin: "Presens",          note: "الحال / المستمر" },
  { key: "preteritum",      ar: "الماضي",           latin: "Preteritum",       note: "ماضٍ بسيط" },
  { key: "supinum",         ar: "اسم المفعول",      latin: "Supinum",          note: "har + supinum" },
  { key: "imperativ",       ar: "الأمر",            latin: "Imperativ",        note: "أمر مباشر" },
  { key: "futurum",         ar: "المستقبل",         latin: "Futurum",          note: "ska / kommer att" },
  { key: "presensParticip", ar: "اسم الفاعل",       latin: "Presens particip", note: "صفة / حال" },
  { key: "perfektParticip", ar: "المفعول التام",     latin: "Perfekt particip", note: "مع vara/bli" },
  { key: "passivPresens",   ar: "المضارع المجهول",  latin: "Passiv presens",   note: "المبني للمجهول" },
  { key: "passivPreteritum",ar: "الماضي المجهول",   latin: "Passiv preteritum", note: "مجهول ماضٍ" },
];

function speak(text: string) {
  if (!window.speechSynthesis || !text || text === "–") return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "sv-SE"; u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  verb: Verb | null;
  onClose: () => void;
  isFavorite: boolean;
  isReview: boolean;
  onToggleFavorite: () => void;
  onToggleReview: () => void;
}

export default function VerbDetailSheet({ verb, onClose, isFavorite, isReview, onToggleFavorite, onToggleReview }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (verb) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [verb]);

  const group = verb ? GROUP_LABELS[verb.group] : null;

  return (
    <AnimatePresence>
      {verb && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 340 }}
            className="w-full max-w-2xl bg-background rounded-t-3xl overflow-hidden max-h-[94dvh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
            </div>

            <div className="overflow-y-auto flex-1">
              {/* Hero image */}
              {verb.imageUrl && (
                <div className="relative w-full h-40">
                  <img src={verb.imageUrl} alt={verb.infinitiv} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>
              )}

              <div className="px-5 pb-8 space-y-6" dir="rtl">

                {/* ── Header ─────────────────────────────────────────── */}
                <div className="flex items-start justify-between gap-3 pt-2">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-sm text-muted-foreground font-bold" dir="ltr">att</span>
                      <span className="text-4xl font-black text-foreground tracking-tight" dir="ltr">{verb.infinitiv}</span>
                    </div>
                    {/* Phonetic + speaker */}
                    <button
                      onClick={() => speak(verb.infinitiv)}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group mb-2"
                      dir="ltr"
                    >
                      <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">{verb.phonetic}</span>
                    </button>
                    <p className="text-xl font-bold text-foreground/80">{verb.translation}</p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className={cn("text-xs font-bold px-2.5 py-1 rounded-xl", group?.color ?? "bg-muted text-muted-foreground")}>
                        {group?.ar ?? verb.group}
                      </span>
                      <span className={cn("text-xs font-bold px-2.5 py-1 rounded-xl", LEVEL_COLORS[verb.level] ?? "bg-muted")}>
                        {verb.level}
                      </span>
                    </div>
                  </div>
                  <button onClick={onClose} className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* ── Conjugation Table ───────────────────────────────── */}
                <Section icon={Layers} title="جدول التصريف الكامل">
                  <div className="rounded-2xl border border-border overflow-hidden">
                    {CONJUGATION_ROWS.map(({ key, ar, latin, note }, i) => {
                      const value = (verb as any)[key];
                      if (!value) return null;
                      return (
                        <div key={key} className={cn(
                          "flex items-center gap-3 px-4 py-3",
                          i % 2 === 0 ? "bg-muted/30" : "bg-background"
                        )}>
                          {/* Arabic label */}
                          <div className="w-28 shrink-0">
                            <p className="text-xs font-black text-foreground">{ar}</p>
                            <p className="text-[9px] text-muted-foreground">{note}</p>
                          </div>

                          {/* Latin label */}
                          <div className="w-20 shrink-0 hidden sm:block">
                            <p className="text-[10px] text-muted-foreground font-semibold" dir="ltr">{latin}</p>
                          </div>

                          {/* Value + speaker */}
                          <div className="flex-1 flex items-center justify-between gap-2" dir="ltr">
                            <span className="text-sm font-black text-foreground">{value}</span>
                            <button
                              onClick={() => speak(value)}
                              className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>

                {/* ── Grammar note ────────────────────────────────────── */}
                {verb.notes && (
                  <Section icon={Info} title="ملاحظة نحوية">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <p className="text-sm text-amber-900 leading-relaxed">{verb.notes}</p>
                    </div>
                  </Section>
                )}

                {/* ── Examples ────────────────────────────────────────── */}
                {verb.examples.length > 0 && (
                  <Section icon={MessageCircle} title="أمثلة">
                    <div className="space-y-2">
                      {verb.examples.map((ex, i) => (
                        <div key={i} className="bg-muted/40 rounded-2xl p-3.5">
                          <div className="flex items-start gap-2">
                            <button onClick={() => speak(ex.sv)} className="text-primary hover:scale-110 transition-transform shrink-0 mt-0.5">
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <div>
                              <p className="text-sm font-bold text-foreground" dir="ltr">{ex.sv}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">{ex.ar}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* ── Quick conjugation cheat ──────────────────────────── */}
                <Section icon={BookOpen} title="الصيغ الأساسية دفعة واحدة">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { ar: "المصدر", sv: `att ${verb.infinitiv}`, note: "البداية" },
                      { ar: "المضارع", sv: verb.presens, note: "الآن" },
                      { ar: "الماضي", sv: verb.preteritum, note: "الأمس" },
                      { ar: "المستقبل", sv: verb.futurum, note: "غداً" },
                      { ar: "الأمر", sv: verb.imperativ, note: "أمر" },
                      { ar: "اسم الفاعل", sv: verb.presensParticip, note: "وصف" },
                    ].map(item => (
                      <button
                        key={item.ar}
                        onClick={() => speak(item.sv)}
                        className="bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary/30 rounded-2xl p-3 text-right transition-all group"
                      >
                        <p className="text-[10px] text-muted-foreground font-bold mb-0.5">{item.ar} — {item.note}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-foreground" dir="ltr">{item.sv}</p>
                          <Volume2 className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </Section>

                {/* ── Actions ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={onToggleFavorite}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all",
                      isFavorite ? "bg-yellow-400 text-white shadow-md shadow-yellow-200" : "bg-muted text-foreground hover:bg-yellow-50 hover:text-yellow-600"
                    )}
                  >
                    <Star className={cn("w-4 h-4", isFavorite && "fill-white")} />
                    {isFavorite ? "محفوظ ✓" : "حفظ بالمفضلة"}
                  </button>
                  <button
                    onClick={onToggleReview}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all",
                      isReview ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "bg-muted text-foreground hover:bg-blue-50 hover:text-blue-600"
                    )}
                  >
                    <Clock className="w-4 h-4" />
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
