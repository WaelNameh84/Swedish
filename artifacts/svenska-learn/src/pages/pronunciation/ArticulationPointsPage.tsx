import { Link } from "wouter";
import { ArrowRight, Waves, Volume2 } from "lucide-react";
import { speak } from "@/lib/speech";

interface ArticulationEntry {
  sound: string;
  example: string;
  description: string;
}

const ARTICULATION_POINTS: ArticulationEntry[] = [
  {
    sound: "sj-ljud (sj, skj, stj)",
    example: "sjö",
    description:
      "صوت احتكاكي يخرج من الجزء الخلفي من الفم أو الحلق، أرقّ من الخاء العربية. الشفتان مبسوطتان قليلاً واللسان لا يلمس سقف الفم.",
  },
  {
    sound: "tj-ljud (tj, kj)",
    example: "tjej",
    description:
      "يشبه صوت 'ش' لكنه يخرج من مقدمة الحنك، مقدمة اللسان تقترب من سقف الفم دون أن تلمسه تماماً.",
  },
  {
    sound: "u السويدية",
    example: "hus",
    description:
      "الشفتان مقوّستان للأمام بشدة أكبر من 'و' العربية، واللسان مرتفع في الخلف. صوت مستدير وضيق جداً.",
  },
  {
    sound: "y",
    example: "syster",
    description:
      "صوت أمامي مرتفع، الشفتان مستديرتان مع تقدّم اللسان للأمام — كأنك تنطق 'ي' لكن بشفتين مستديرتين كصفارة.",
  },
  {
    sound: "å",
    example: "gå",
    description: "صوت خلفي مستدير طويل، أقرب إلى 'و' مفتوحة وطويلة، الفم مستدير والفكّ منخفض قليلاً.",
  },
  {
    sound: "ä",
    example: "läsa",
    description: "قريب من 'إ' مفتوحة، الفم يُفتح أكثر من الإي العربية المعتادة مع بقاء اللسان في المقدمة.",
  },
  {
    sound: "ö",
    example: "hör",
    description: "صوت أمامي مستدير لا يوجد مثله بالعربية، امزج بين وضع 'إي' للسان و'و' للشفتين في نفس الوقت.",
  },
  {
    sound: "r السويدية",
    example: "röd",
    description:
      "تُنطق من الحلق في جنوب السويد أو مدحرجة بطرف اللسان في شمالها، لكنها دائماً أخفّ وأقل تفخيماً من الراء العربية.",
  },
];

export default function ArticulationPointsPage() {
  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-28">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/pronunciation" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Waves className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground leading-tight">مخارج الحروف</h1>
      </header>

      <div className="p-4 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          أصوات سويدية لا تشبه العربية تماماً، مع شرح لمخرج كل صوت ومكان اللسان والشفتين.
        </p>

        {ARTICULATION_POINTS.map((entry) => (
          <div key={entry.sound} className="p-4 rounded-2xl bg-card border border-card-border shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground" dir="ltr">{entry.sound}</span>
              <button
                onClick={() => speak(entry.example, { lang: "sv-SE" })}
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                aria-label="استمع"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-muted-foreground" dir="ltr">مثال: {entry.example}</span>
            <p className="text-sm text-foreground leading-relaxed">{entry.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
