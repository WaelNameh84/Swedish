import { useState } from "react";
import { useParams } from "wouter";
import { Bot, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

type ToolConfig = {
  title: string;
  description: string;
  placeholder: string;
  cta: string;
};

const TOOL_CONFIG: Record<string, ToolConfig> = {
  words: {
    title: "إنشاء كلمات جديدة",
    description: "اكتب موضوعاً أو مستوى (مثال: كلمات عن الطبخ، مستوى مبتدئ) وسيولّد لك المعلم الذكي مفردات سويدية جديدة.",
    placeholder: "مثال: أعطني كلمات عن الطقس",
    cta: "أنشئ الكلمات",
  },
  conversations: {
    title: "إنشاء محادثات",
    description: "صف موقفاً أو مكاناً، وسيكتب لك المعلم الذكي محادثة سويدية-عربية جديدة.",
    placeholder: "مثال: محادثة في محل حلاقة",
    cta: "أنشئ المحادثة",
  },
  corrections: {
    title: "تصحيح الأخطاء",
    description: "اكتب جملة أو نصاً بالسويدية وسيصحح لك المعلم الذكي الأخطاء ويشرحها.",
    placeholder: "اكتب نصك بالسويدية هنا...",
    cta: "صحّح النص",
  },
  grammar: {
    title: "شرح القواعد",
    description: "اسأل عن أي قاعدة نحوية سويدية وسيشرحها لك المعلم الذكي مع أمثلة وتمرين.",
    placeholder: "مثال: اشرح لي استخدام en و ett",
    cta: "اشرح القاعدة",
  },
  quiz: {
    title: "اختبار المستخدم",
    description: "اذكر موضوعاً أو مستوى وسيصمم لك المعلم الذكي اختباراً قصيراً من 5 أسئلة.",
    placeholder: "مثال: اختبار في المفردات اليومية",
    cta: "أنشئ الاختبار",
  },
  homework: {
    title: "إنشاء واجبات",
    description: "اذكر موضوعاً أو مستوى وسيصمم لك المعلم الذكي واجباً منزلياً متكاملاً.",
    placeholder: "مثال: واجب عن الأفعال في الماضي",
    cta: "أنشئ الواجب",
  },
  plan: {
    title: "خطة تعلم تلقائية",
    description: "صف مستواك الحالي وهدفك والوقت المتاح، وسيصمم لك المعلم الذكي خطة أسبوعية.",
    placeholder: "مثال: مستوى مبتدئ، أريد التحضير لمقابلة عمل، لدي 20 دقيقة يومياً",
    cta: "أنشئ الخطة",
  },
};

export default function AiToolPage() {
  const params = useParams<{ tool: string }>();
  const tool = params.tool;
  const config = TOOL_CONFIG[tool];

  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiDisabled, setAiDisabled] = useState(false);

  if (!config) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Link href="/ai-teacher" className="text-primary underline">عودة إلى الذكاء الاصطناعي</Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setOutput(null);
    setAiDisabled(false);
    try {
      const res = await fetch(`${BASE_URL}/api/ai-teacher/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, input: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
        if (data.aiDisabled) setAiDisabled(true);
        return;
      }
      setOutput(data.output);
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-28">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/ai-teacher" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">{config.title}</h1>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{config.description}</p>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={config.placeholder}
          className="min-h-[100px] text-[15px] bg-card"
        />

        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || loading}
          className="w-full h-12 rounded-xl text-[15px] gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {config.cta}
        </Button>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
            {aiDisabled && (
              <p className="mt-1 text-muted-foreground">
                سيتم تفعيل هذه الميزة بعد ربط مفتاح OpenAI بالمشروع.
              </p>
            )}
          </div>
        )}

        {output && (
          <div className="p-4 rounded-2xl bg-card border border-card-border shadow-sm whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
