import { Router, type IRouter } from "express";
import multer from "multer";
import { getOpenAI, isAIAvailable, AI_NOT_CONFIGURED_MESSAGE } from "../lib/openai";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

const MODEL = "gpt-5.4";
const MINI_MODEL = "gpt-5.4-mini";

type ToolKey =
  | "words"
  | "conversations"
  | "corrections"
  | "grammar"
  | "quiz"
  | "homework"
  | "plan";

const TOOL_PROMPTS: Record<ToolKey, string> = {
  words: `أنت معلّم لغة سويدية للناطقين بالعربية. عندما يعطيك المستخدم موضوعاً أو مستوى، أنشئ قائمة من 8-10 كلمات سويدية جديدة ومفيدة مرتبطة بالطلب. لكل كلمة اعرض: الكلمة السويدية، الترجمة العربية، والنطق التقريبي بالعربية، وجملة مثال سويدية مع ترجمتها. رتب الإجابة بشكل واضح ومنسق بعناوين وفواصل، واكتب بالعربية مع إبراز الكلمات السويدية.`,
  conversations: `أنت كاتب سيناريوهات محادثة لتعليم السويدية للناطقين بالعربية. عندما يعطيك المستخدم موقفاً أو مكاناً، اكتب محادثة قصيرة واقعية (6-10 أسطر) بين شخصين بالسويدية مع ترجمة عربية لكل سطر، وأضف في النهاية 4-5 كلمات مفتاحية من المحادثة مع ترجمتها.`,
  corrections: `أنت مصحّح لغوي سويدي متمكن. سيعطيك المستخدم نصاً بالسويدية (قد يحتوي أخطاء). صحّح الأخطاء النحوية والإملائية، واعرض: (1) النص المصحح كاملاً، (2) قائمة نقطية بكل خطأ ولماذا هو خاطئ مع الشرح بالعربية، (3) نصيحة قواعدية عامة تتعلق بأكثر خطأ تكرر. إذا كان النص صحيحاً تماماً أخبر المستخدم بذلك وامدحه بإيجابية.`,
  grammar: `أنت معلّم قواعد اللغة السويدية للناطقين بالعربية. سيسألك المستخدم عن قاعدة نحوية سويدية (أو يذكر موضوعاً). اشرح القاعدة بالعربية بشكل مبسّط ومنظم بعناوين، مع 3-4 أمثلة سويدية مع ترجمتها العربية، وأضف في النهاية تمريناً قصيراً (سؤالين) لاختبار الفهم مع الحل.`,
  quiz: `أنت معلّم يبني اختبارات قصيرة لتعلم السويدية. سيعطيك المستخدم موضوعاً أو مستوى. أنشئ اختباراً من 5 أسئلة متنوعة (اختيار من متعدد، أو ترجمة، أو إكمال الفراغ) بالسويدية والعربية، رقّم الأسئلة بوضوح، وضع الإجابات الصحيحة في قسم منفصل في النهاية تحت عنوان "الإجابات".`,
  homework: `أنت معلّم يصمم واجبات منزلية لتعلم السويدية. سيعطيك المستخدم موضوعاً أو مستوى. صمم واجباً منزلياً متكاملاً يحتوي 4-5 تمارين متنوعة (كتابة جمل، ترجمة، إكمال، محادثة قصيرة) بالسويدية والعربية، مع تعليمات واضحة لكل تمرين، وأضف في النهاية معايير تقييم بسيطة (ما يجب أن يتضمنه الجواب الجيد).`,
  plan: `أنت مستشار تعليمي لتعلم اللغة السويدية. سيصف المستخدم مستواه الحالي وهدفه ووقته المتاح. صمم خطة تعلم أسبوعية مقسّمة على 7 أيام، كل يوم يحتوي نشاطاً محدداً وواضحاً (مفردات، قواعد، محادثة، استماع) مع مدة تقريبية بالدقائق، وابدأ الخطة بجملة تحفيزية قصيرة بالعربية.`,
};

router.post("/ai-teacher/generate", async (req, res) => {
  try {
    const { tool, input } = (req.body ?? {}) as { tool?: ToolKey; input?: string };

    if (!tool || !(tool in TOOL_PROMPTS)) {
      return res.status(400).json({ error: "أداة غير معروفة" });
    }
    if (!input?.trim()) {
      return res.status(400).json({ error: "الرجاء إدخال طلبك" });
    }

    const openai = await getOpenAI();
    if (!openai) {
      return res.status(503).json({ error: AI_NOT_CONFIGURED_MESSAGE, aiDisabled: true });
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      max_completion_tokens: 2048,
      messages: [
        { role: "system", content: TOOL_PROMPTS[tool] },
        { role: "user", content: input.trim() },
      ],
    });

    const output = completion.choices[0]?.message?.content ?? "";
    res.json({ output });
  } catch (err) {
    req.log.error({ err }, "AI teacher generate failed");
    res.status(500).json({ error: "حدث خطأ أثناء توليد المحتوى" });
  }
});

router.post("/ai-teacher/translate", async (req, res) => {
  try {
    const { text } = (req.body ?? {}) as { text?: string };
    if (!text?.trim()) {
      return res.status(400).json({ error: "الرجاء إدخال نص" });
    }

    const openai = await getOpenAI();
    if (!openai) {
      return res.status(503).json({ error: AI_NOT_CONFIGURED_MESSAGE, aiDisabled: true });
    }

    const completion = await openai.chat.completions.create({
      model: MINI_MODEL,
      max_completion_tokens: 500,
      messages: [
        {
          role: "system",
          content: `أنت مترجم فوري بين السويدية والعربية والإنكليزية. تستقبل جملة واحدة بأي من هذه اللغات الثلاث. اكتشف لغتها، وترجمها فوراً إلى اللغة الأخرى الأنسب للمحادثة (إذا كانت الجملة بالسويدية ترجمها للعربية، وإذا كانت بالعربية ترجمها للسويدية، وإذا كانت بالإنكليزية ترجمها للعربية). أعد فقط JSON صالح بالشكل: {"detectedLang":"sv|ar|en","targetLang":"sv|ar|en","translation":"..."} بدون أي نص إضافي.`,
        },
        { role: "user", content: text.trim() },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.trim().replace(/^```json\s*|```$/g, "");
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "AI translate failed");
    res.status(500).json({ error: "حدث خطأ أثناء الترجمة" });
  }
});

router.post("/ai-teacher/speak", async (req, res) => {
  try {
    const { text, lang } = (req.body ?? {}) as { text?: string; lang?: string };
    if (!text?.trim()) {
      return res.status(400).json({ error: "الرجاء إدخال نص" });
    }

    const openai = await getOpenAI();
    if (!openai) {
      return res.status(503).json({ error: AI_NOT_CONFIGURED_MESSAGE, aiDisabled: true });
    }

    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: lang === "ar" ? "alloy" : "nova",
      input: text.trim(),
      response_format: "mp3",
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "AI speak failed");
    res.status(500).json({ error: "حدث خطأ أثناء توليد الصوت" });
  }
});

router.post("/ai-teacher/pronunciation", upload.single("audio"), async (req, res) => {
  try {
    const { targetText } = (req.body ?? {}) as { targetText?: string };
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "لم يتم إرسال أي تسجيل صوتي" });
    }
    if (!targetText?.trim()) {
      return res.status(400).json({ error: "الرجاء تحديد الجملة المطلوب نطقها" });
    }

    const openai = await getOpenAI();
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
          content: `أنت مدرّب نطق للغة السويدية. لديك الجملة المطلوب نطقها، وما سمعه نظام تحويل الصوت لنص فعلياً من نطق المتعلم. قيّم دقة النطق من 100 (بناءً على تطابق الكلمات والصوتيات، ليس التطابق الحرفي فقط)، واذكر الكلمات التي بدت غير دقيقة إن وجدت، وأعط نصيحة نطق واحدة قصيرة ومحددة. أعد فقط JSON صالح بالشكل: {"score":0-100,"heardText":"...","feedback":"..."} بدون أي نص إضافي.`,
        },
        {
          role: "user",
          content: `الجملة المطلوبة: "${targetText.trim()}"\nما سمعه النظام من نطق المتعلم: "${heard}"`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.trim().replace(/^```json\s*|```$/g, "");
    const parsed = JSON.parse(cleaned);
    res.json({ ...parsed, heardText: heard });
  } catch (err) {
    req.log.error({ err }, "Pronunciation assessment failed");
    res.status(500).json({ error: "حدث خطأ أثناء تقييم النطق" });
  }
});

router.post("/ai-teacher/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "لم يتم إرسال أي تسجيل صوتي" });
    }

    const openai = await getOpenAI();
    if (!openai) {
      return res.status(503).json({ error: AI_NOT_CONFIGURED_MESSAGE, aiDisabled: true });
    }

    const audioFile = new File([new Uint8Array(file.buffer)], "recording.webm", { type: file.mimetype || "audio/webm" });
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-mini-transcribe",
    });

    res.json({ text: transcription.text ?? "" });
  } catch (err) {
    req.log.error({ err }, "Transcription failed");
    res.status(500).json({ error: "حدث خطأ أثناء تحويل الصوت إلى نص" });
  }
});

router.get("/ai-teacher/status", async (_req, res) => {
  res.json({ available: await isAIAvailable() });
});

export default router;
