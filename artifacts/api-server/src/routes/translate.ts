import { Router } from "express";

const router = Router();

// A broad set of languages supported by the free translation endpoint below.
// Codes follow ISO 639-1 (with a few regional variants) as expected by Google Translate.
export const LANGUAGES: Array<{ code: string; name: string }> = [
  { code: "auto", name: "اكتشاف تلقائي" },
  { code: "sv", name: "السويدية" }, { code: "ar", name: "العربية" }, { code: "en", name: "الإنجليزية" },
  { code: "fr", name: "الفرنسية" }, { code: "de", name: "الألمانية" }, { code: "es", name: "الإسبانية" },
  { code: "it", name: "الإيطالية" }, { code: "pt", name: "البرتغالية" }, { code: "ru", name: "الروسية" },
  { code: "zh-CN", name: "الصينية (مبسطة)" }, { code: "zh-TW", name: "الصينية (تقليدية)" },
  { code: "ja", name: "اليابانية" }, { code: "ko", name: "الكورية" }, { code: "hi", name: "الهندية" },
  { code: "ur", name: "الأردية" }, { code: "fa", name: "الفارسية" }, { code: "tr", name: "التركية" },
  { code: "nl", name: "الهولندية" }, { code: "pl", name: "البولندية" }, { code: "uk", name: "الأوكرانية" },
  { code: "ro", name: "الرومانية" }, { code: "el", name: "اليونانية" }, { code: "he", name: "العبرية" },
  { code: "th", name: "التايلاندية" }, { code: "vi", name: "الفيتنامية" }, { code: "id", name: "الإندونيسية" },
  { code: "ms", name: "الماليزية" }, { code: "tl", name: "الفلبينية" }, { code: "bn", name: "البنغالية" },
  { code: "ta", name: "التاميلية" }, { code: "te", name: "التيلوغوية" }, { code: "mr", name: "الماراثية" },
  { code: "gu", name: "الغوجاراتية" }, { code: "pa", name: "البنجابية" }, { code: "no", name: "النرويجية" },
  { code: "da", name: "الدنماركية" }, { code: "fi", name: "الفنلندية" }, { code: "is", name: "الآيسلندية" },
  { code: "cs", name: "التشيكية" }, { code: "sk", name: "السلوفاكية" }, { code: "hu", name: "الهنغارية" },
  { code: "bg", name: "البلغارية" }, { code: "sr", name: "الصربية" }, { code: "hr", name: "الكرواتية" },
  { code: "sl", name: "السلوفينية" }, { code: "et", name: "الإستونية" }, { code: "lv", name: "اللاتفية" },
  { code: "lt", name: "الليتوانية" }, { code: "sq", name: "الألبانية" }, { code: "mk", name: "المقدونية" },
  { code: "bs", name: "البوسنية" }, { code: "ka", name: "الجورجية" }, { code: "hy", name: "الأرمنية" },
  { code: "az", name: "الأذربيجانية" }, { code: "kk", name: "الكازاخية" }, { code: "uz", name: "الأوزبكية" },
  { code: "mn", name: "المنغولية" }, { code: "km", name: "الخميرية" }, { code: "lo", name: "اللاوية" },
  { code: "my", name: "البورمية" }, { code: "ne", name: "النيبالية" }, { code: "si", name: "السنهالية" },
  { code: "am", name: "الأمهرية" }, { code: "sw", name: "السواحيلية" }, { code: "ha", name: "الهوسا" },
  { code: "yo", name: "اليوروبا" }, { code: "ig", name: "الإيبو" }, { code: "zu", name: "الزولو" },
  { code: "xh", name: "الخوسا" }, { code: "af", name: "الأفريكانية" }, { code: "so", name: "الصومالية" },
  { code: "ku", name: "الكردية" }, { code: "ps", name: "البشتو" }, { code: "sd", name: "السندية" },
  { code: "ml", name: "المالايالامية" }, { code: "kn", name: "الكانادية" }, { code: "or", name: "الأودية" },
  { code: "as", name: "الآسامية" }, { code: "mai", name: "الميثيلية" }, { code: "co", name: "الكورسيكية" },
  { code: "eu", name: "الباسكية" }, { code: "ca", name: "الكاتالانية" }, { code: "gl", name: "الغاليسية" },
  { code: "ga", name: "الأيرلندية" }, { code: "cy", name: "الويلزية" }, { code: "gd", name: "الغيلية الاسكتلندية" },
  { code: "mt", name: "المالطية" }, { code: "lb", name: "اللوكسمبورغية" }, { code: "fy", name: "الفريزية" },
  { code: "yi", name: "اليديشية" }, { code: "la", name: "اللاتينية" }, { code: "eo", name: "الإسبرانتو" },
  { code: "ht", name: "الهايتية" }, { code: "jw", name: "الجاوية" }, { code: "su", name: "السوندانية" },
  { code: "ny", name: "التشيوا" }, { code: "sn", name: "الشونا" }, { code: "st", name: "السوتو" },
  { code: "sm", name: "الصامو" }, { code: "mg", name: "المالغاشية" }, { code: "haw", name: "الهاوايية" },
  { code: "ceb", name: "السيبوانو" }, { code: "hmn", name: "الهمونغ" }, { code: "kok", name: "الكونكانية" },
  { code: "tg", name: "الطاجيكية" }, { code: "tk", name: "التركمانية" },
  { code: "ky", name: "القيرغيزية" }, { code: "dv", name: "الديفيهية" }, { code: "tt", name: "التتارية" },
  { code: "ug", name: "الأويغورية" }, { code: "om", name: "الأورومو" },
  { code: "ti", name: "التغرينية" }, { code: "rw", name: "الكينيارواندية" }, { code: "lg", name: "الغندية" },
  { code: "ak", name: "الأكانية" }, { code: "ee", name: "الإيوية" }, { code: "ff", name: "الفولانية" },
  { code: "wo", name: "الولوفية" }, { code: "ln", name: "اللينغالا" }, { code: "ts", name: "التسونغا" },
  { code: "tn", name: "التسوانا" }, { code: "ss", name: "السواتية" }, { code: "nso", name: "السوتو الشمالية" },
  { code: "bm", name: "البامبارا" }, { code: "qu", name: "الكيتشوا" }, { code: "ay", name: "الأيمارا" },
  { code: "gn", name: "الغوارانية" }, { code: "nn", name: "النرويجية (نينورسك)" },
];

// Removes duplicate codes (a couple of accidental repeats above) while keeping order.
const seen = new Set<string>();
export const UNIQUE_LANGUAGES = LANGUAGES.filter((l) => {
  if (seen.has(l.code)) return false;
  seen.add(l.code);
  return true;
});

router.get("/translate/languages", (_req, res) => {
  res.json(UNIQUE_LANGUAGES);
});

// POST /translate  { text, source?, target }
// Uses the free, keyless Google Translate "gtx" client endpoint server-side
// (avoids browser CORS issues) — no API key or AI model required.
router.post("/translate", async (req, res) => {
  try {
    const { text, source, target } = (req.body ?? {}) as {
      text?: string;
      source?: string;
      target?: string;
    };

    if (!text?.trim()) {
      return res.status(400).json({ error: "الرجاء إدخال نص للترجمة" });
    }
    if (!target) {
      return res.status(400).json({ error: "الرجاء تحديد اللغة الهدف" });
    }

    const sl = source && source !== "auto" ? source : "auto";
    const url =
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}` +
      `&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text.trim())}`;

    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Upstream translate failed: ${resp.status}`);
    }
    const data = (await resp.json()) as any;

    const translation = Array.isArray(data?.[0])
      ? data[0].map((seg: any[]) => seg[0]).join("")
      : "";
    const detectedSource = data?.[2] ?? sl;

    res.json({ translation, detectedSource, target });
  } catch (err) {
    req.log.error({ err }, "Translation failed");
    res.status(502).json({ error: "تعذّر الاتصال بخدمة الترجمة، حاول مرة أخرى" });
  }
});

export default router;
