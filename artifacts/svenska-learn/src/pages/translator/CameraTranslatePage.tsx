import { useRef, useState } from "react";
import { Camera, ImagePlus, Volume2, Loader2, X } from "lucide-react";
import GameHeader from "@/components/GameHeader";
import LanguagePicker from "@/components/LanguagePicker";
import { translateText, toSpeechLang } from "@/lib/translate";
import { speakAny } from "@/lib/speech";

export default function CameraTranslatePage() {
  const [target, setTarget] = useState("ar");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [translated, setTranslated] = useState("");
  const [error, setError] = useState("");
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError("");
    setExtractedText("");
    setTranslated("");
    setImagePreview(URL.createObjectURL(file));
    setExtracting(true);
    setProgress(0);
    try {
      // Client-side OCR (WASM) — no server or API key needed.
      const Tesseract = await import("tesseract.js");
      const { data } = await Tesseract.recognize(file, "eng+swe", {
        logger: (m: any) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      const text = data.text.trim();
      setExtractedText(text);
      if (text) {
        const res = await translateText(text, target, "auto");
        setTranslated(res.translation);
      } else {
        setError("لم يتم العثور على نص واضح في الصورة");
      }
    } catch (e: any) {
      setError("تعذّر استخراج النص من الصورة");
    } finally {
      setExtracting(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setExtractedText("");
    setTranslated("");
    setError("");
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="الكاميرا والصور" subtitle="استخرج النص من صورة وترجمه" backHref="/translator" />
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">ترجم إلى</span>
          <LanguagePicker value={target} onChange={setTarget} excludeAuto />
        </div>

        {!imagePreview ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40"
            >
              <Camera className="w-7 h-7 text-primary" />
              <span className="text-sm font-bold">التقاط صورة</span>
            </button>
            <button
              onClick={() => uploadInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/40"
            >
              <ImagePlus className="w-7 h-7 text-primary" />
              <span className="text-sm font-bold">اختيار من المعرض</span>
            </button>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-card-border">
            <img src={imagePreview} alt="" className="w-full max-h-64 object-contain bg-muted" />
            <button onClick={reset} className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        />
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        />

        {extracting && (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground">جاري استخراج النص... {progress}%</p>
          </div>
        )}

        {error && <p className="text-sm text-rose-600 text-center">{error}</p>}

        {extractedText && (
          <div className="bg-card border border-card-border rounded-2xl p-4">
            <p className="text-[10px] text-muted-foreground mb-1">النص المستخرج</p>
            <p className="text-sm font-semibold text-foreground whitespace-pre-line">{extractedText}</p>
          </div>
        )}

        {translated && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <p className="text-[10px] text-muted-foreground mb-1">الترجمة</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-base font-bold text-foreground whitespace-pre-line">{translated}</p>
              <button onClick={() => speakAny(translated, toSpeechLang(target))} className="text-primary shrink-0">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          استخراج النص يعمل بالكامل على جهازك (بدون إنترنت أو ذكاء اصطناعي)، وقد يستغرق بضع ثوانٍ.
        </p>
      </div>
    </div>
  );
}
