import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, DownloadCloud, CheckCircle2, Trash2 } from "lucide-react";

const STORAGE_KEY = "svenska_offline_words";

interface OfflinePackage {
  words: { word: string; translation: string; example?: { sv: string; ar: string } }[];
  savedAt: string;
}

export default function OfflineDownloadPage() {
  const [pkg, setPkg] = useState<OfflinePackage | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setPkg(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  async function download() {
    setDownloading(true);
    setError(false);
    try {
      const base = import.meta.env.BASE_URL;
      const res = await fetch(`${base}api/dictionary/search?limit=100`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      const words = (data.words ?? []).map((w: any) => ({
        word: w.word,
        translation: w.translation,
        example: w.examples?.[0],
      }));
      const newPkg: OfflinePackage = { words, savedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPkg));
      setPkg(newPkg);
    } catch {
      setError(true);
    } finally {
      setDownloading(false);
    }
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
    setPkg(null);
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/audio-learning" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <DownloadCloud className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">تنزيل للاستماع بدون إنترنت</h1>
          <p className="text-xs text-muted-foreground mt-0.5">حزمة كلمات تعمل حتى بدون اتصال</p>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {pkg ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-800">الحزمة جاهزة للاستخدام بدون إنترنت</p>
              <p className="text-xs text-emerald-700 mt-1">
                {pkg.words.length} كلمة · آخر تحديث {new Date(pkg.savedAt).toLocaleDateString("ar")}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 rounded-2xl p-4 text-sm text-muted-foreground">
            لا توجد حزمة محفوظة بعد. نزّل حزمة الآن بينما أنت متصل بالإنترنت لتستخدمها في راديو اللغة، النوم، والتكرار حتى بدون اتصال.
          </div>
        )}

        {error && (
          <p className="text-sm text-rose-600">تعذّر التنزيل، تحقق من الاتصال وحاول مجدداً.</p>
        )}

        <button
          onClick={download}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold disabled:opacity-60"
        >
          <DownloadCloud className="w-4 h-4" />
          {downloading ? "جارٍ التنزيل..." : pkg ? "تحديث الحزمة" : "تنزيل الحزمة الآن"}
        </button>

        {pkg && (
          <button
            onClick={clear}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-muted text-muted-foreground font-semibold"
          >
            <Trash2 className="w-4 h-4" /> حذف الحزمة المحفوظة
          </button>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed">
          ملاحظة: النطق الصوتي يستخدم محرك النطق المدمج في متصفحك، وهو يعمل بدون إنترنت على أغلب الأجهزة بعد أول استخدام.
          فتح التطبيق نفسه للمرة الأولى يحتاج اتصالاً بالإنترنت.
        </p>
      </div>
    </div>
  );
}
