import { Router, type IRouter } from "express";
import multer from "multer";
import { getOpenAI, AI_NOT_CONFIGURED_MESSAGE } from "../lib/openai";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

const MODEL = "gpt-5.4";

/**
 * AI-based pronunciation scoring for a single word/phrase from the
 * "Pronunciation" (النطق) hub — used by AIEvaluationPage and, optionally,
 * PronunciationExercisesPage.
 */
router.post("/pronunciation/evaluate", upload.single("audio"), async (req, res) => {
  try {
    const { targetText } = (req.body ?? {}) as { targetText?: string };
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "لم يتم إرسال أي تسجيل صوتي" });
    }
    if (!targetText?.trim()) {
      return res.status(400).json({ error: "الرجاء تحديد الكلمة أو الجملة المطلوب نطقها" });
    }

    const openai = getOpenAI();
    if (!openai) {
      return res.status(503).json({ error: AI_NOT_CONFIGURED_MESSAGE, aiDisabled: true });
    }

    const audioFile = new File([new Uint8Array(file.buffer)], "recording.webm", { type: file.mimetype || "audio/webm" });
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-mini-transcribe",
      language: "sv",
    });
    const heard = transcription.text?.trim() ?? "";

    const completion = await openai.chat.completions.create({
      model: MODEL,
      max_completion_tokens: 500,
      messages: [
        {
          role: "system",
          content: `أنت مدرّب نطق للغة السويدية للناطقين بالعربية. لديك الكلمة أو الجملة المطلوب نطقها، وما سمعه نظام تحويل الصوت لنص فعلياً من نطق المتعلم. قيّم دقة النطق من 100 (بناءً على تطابق الكلمات والصوتيات، ليس التطابق الحرفي فقط)، واذكر نصيحة نطق واحدة قصيرة ومحددة. أعد فقط JSON صالح بالشكل: {"score":0-100,"feedback":"..."} بدون أي نص إضافي.`,
        },
        {
          role: "user",
          content: `الكلمة/الجملة المطلوبة: "${targetText.trim()}"\nما سمعه النظام من نطق المتعلم: "${heard}"`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.trim().replace(/^```json\s*|```$/g, "");
    const parsed = JSON.parse(cleaned);
    res.json({ ...parsed, heardText: heard });
  } catch (err) {
    req.log.error({ err }, "Pronunciation evaluation failed");
    res.status(500).json({ error: "حدث خطأ أثناء تقييم النطق" });
  }
});

/**
 * Detailed, word-level pronunciation error breakdown — used by
 * ErrorCorrectionPage. Distinct from /ai-teacher/corrections, which corrects
 * written text; this analyzes spoken pronunciation.
 */
router.post("/pronunciation/errors", upload.single("audio"), async (req, res) => {
  try {
    const { targetText } = (req.body ?? {}) as { targetText?: string };
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "لم يتم إرسال أي تسجيل صوتي" });
    }
    if (!targetText?.trim()) {
      return res.status(400).json({ error: "الرجاء تحديد الكلمة أو الجملة المطلوب نطقها" });
    }

    const openai = getOpenAI();
    if (!openai) {
      return res.status(503).json({ error: AI_NOT_CONFIGURED_MESSAGE, aiDisabled: true });
    }

    const audioFile = new File([new Uint8Array(file.buffer)], "recording.webm", { type: file.mimetype || "audio/webm" });
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-mini-transcribe",
      language: "sv",
    });
    const heard = transcription.text?.trim() ?? "";

    const completion = await openai.chat.completions.create({
      model: MODEL,
      max_completion_tokens: 600,
      messages: [
        {
          role: "system",
          content: `أنت مدرّب نطق سويدي متخصص في تحليل أخطاء المتعلمين الناطقين بالعربية. لديك الجملة أو الكلمة المطلوبة، وما سمعه نظام تحويل الصوت لنص من نطق المتعلم. حدد كل كلمة بدت غير دقيقة النطق (بناءً على الفرق بين النص المطلوب والمسموع)، ولكل كلمة اذكر نوع الخطأ المحتمل بجملة قصيرة بالعربية (مثل: صوت غير موجود بالعربية، تشديد خاطئ، حذف حرف، استبدال صوت). إذا لم تجد أخطاء واضحة أعد قائمة فارغة وامدح النطق. أضف نصيحة نطق واحدة قصيرة وعملية. أعد فقط JSON صالح بالشكل: {"errors":[{"word":"...","issue":"..."}],"tip":"..."} بدون أي نص إضافي.`,
        },
        {
          role: "user",
          content: `الجملة/الكلمة المطلوبة: "${targetText.trim()}"\nما سمعه النظام من نطق المتعلم: "${heard}"`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.trim().replace(/^```json\s*|```$/g, "");
    const parsed = JSON.parse(cleaned);
    res.json({ ...parsed, heardText: heard });
  } catch (err) {
    req.log.error({ err }, "Pronunciation error analysis failed");
    res.status(500).json({ error: "حدث خطأ أثناء تحليل أخطاء النطق" });
  }
});

export default router;
