import { useState } from "react";
import { ArrowLeftRight, Volume2, Copy, Loader2 } from "lucide-react";
import GameHeader from "@/components/GameHeader";
import LanguagePicker from "@/components/LanguagePicker";
import { translateText, toSpeechLang } from "@/lib/translate";
import { speakAny } from "@/lib/speech";

export default function TextTranslatePage() {
  const [source, setSource] = useState("auto");
  const [target, setTarget] = useState("ar");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [detected, setDetected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await translateText(input.trim(), target, source);
      setOutput(res.translation);
      setDetected(res.detectedSource);
    } catch (e: any) {
      setError(e.message || "حدث خطأ أثناء الترجمة");
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    if (source === "auto") return;
    setSource(target);
    setTarget(source);
    setInput(output);
    setOutput(input);
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="ترجمة نصية" subtitle="أكثر من 130 لغة" backHref="/translator" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <LanguagePicker value={source} onChange={setSource} />
          <button onClick={swap} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <LanguagePicker value={target} onChange={setTarget} excludeAuto />
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب النص هنا..."
            rows={4}
            className="w-full bg-transparent resize-none text-sm focus:outline-none"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <button onClick={() => speakAny(input, toSpeechLang(source === "auto" ? detected || "en" : source))} className="text-muted-foreground hover:text-primary">
              <Volume2 className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-muted-foreground">{input.length}/2000</span>
          </div>
        </div>

        <button
          onClick={run}
          disabled={loading || !input.trim()}
          className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-black text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          ترجم
        </button>

        {error && <p className="text-sm text-rose-600 text-center">{error}</p>}

        {output && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <p className="text-base font-semibold text-foreground leading-relaxed">{output}</p>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-primary/10">
              <div className="flex items-center gap-3">
                <button onClick={() => speakAny(output, toSpeechLang(target))} className="text-primary">
                  <Volume2 className="w-4 h-4" />
                </button>
                <button onClick={() => navigator.clipboard.writeText(output)} className="text-muted-foreground hover:text-primary">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {source === "auto" && detected && (
                <span className="text-[10px] text-muted-foreground">اللغة المكتشفة: {detected}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
