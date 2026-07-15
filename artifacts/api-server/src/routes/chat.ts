import { Router } from "express";
import { db } from "@workspace/db";
import { chatMessagesTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { generateText } from "../lib/aiProvider";
import { requireAuth } from "../middlewares/auth";

const router = Router();
// Scoped to this router's own path prefix — see statistics.ts for why an
// unscoped router.use(requireAuth) would break other routers sharing the
// same mount point.
router.use("/chat", requireAuth);

const TUTOR_SYSTEM_PROMPT = `أنت "المعلم الذكي"، مساعد ودود لتعليم اللغة السويدية للناطقين بالعربية داخل تطبيق تعلم لغة. تحدّث بالعربية مع إبراز الكلمات والجمل السويدية بوضوح. إذا كتب المستخدم بالسويدية، صحّح أخطاءه بلطف وردّ عليه محادثةً، وإذا سأل بالعربية عن قاعدة أو كلمة اشرحها ببساطة مع أمثلة. اجعل ردودك قصيرة ومشجعة (3-5 أسطر) واستخدم رموزاً تعبيرية بشكل معتدل.`;

async function generateAITutorResponse(userMessage: string, history: { role: string; content: string }[]): Promise<string | null> {
  // Recent history folded into the prompt as plain text — generateText only
  // takes a single system+user turn (shared across OpenAI/Gemini), not a
  // full multi-turn messages array.
  const context = history
    .slice(-10)
    .map((m) => `${m.role === "assistant" ? "المعلم" : "المتعلم"}: ${m.content}`)
    .join("\n");
  const prompt = context ? `سياق المحادثة السابقة:\n${context}\n\nرسالة المتعلم الجديدة: ${userMessage}` : userMessage;

  const result = await generateText(TUTOR_SYSTEM_PROMPT, prompt, { model: "gpt-5.4", maxOutputTokens: 600 });
  return result?.text ?? null;
}

// Simple Swedish tutor response engine
function generateTutorResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  // Greetings
  if (/^(hej|hallå|tjena|god morgon|god kväll|god dag)/.test(msg)) {
    const replies = [
      "Hej! Välkommen till din svenska övning! Hur mår du idag? 😊",
      "Hej hej! Fantastisk att se dig! Ska vi öva svenska idag?",
      "God dag! Vad vill du öva på idag? Glosor, grammatik eller konversation?",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // How are you
  if (/(hur mår|hur är|hur går)/.test(msg)) {
    return "Jag mår bra, tack! Bra jobbat att du övar svenska! 🌟 Hur mår DU? (Försök svara på svenska!)";
  }

  // Numbers
  if (/(\d+|ett|två|tre|fyra|fem|sex|sju|åtta|nio|tio)/.test(msg)) {
    return "Bra! Du kan siffror! 🔢 Kan du räkna från ett till tio? (ett, två, tre, fyra, fem, sex, sju, åtta, nio, tio)";
  }

  // Thank you
  if (/(tack|tackar|tusen tack)/.test(msg)) {
    return "Varsågod! Det är kul att hjälpa dig lära dig svenska! Fortsätt så bra! 💪";
  }

  // Yes/No
  if (/^(ja|jo|nej|inte)/.test(msg)) {
    return "Ja eller nej - enkelt och viktigt! Bra! Kan du göra en mening med 'ja' eller 'nej'?";
  }

  // I want / I need
  if (/(jag vill|jag behöver|jag skulle vilja)/.test(msg)) {
    return "Utmärkt! Du kan uttrycka önskningar! 🎉 'Jag vill' = أريد, 'Jag behöver' = أحتاج. Vad vill du göra idag?";
  }

  // Question words
  if (/^(vad|var|när|hur|varför|vem|vilken)/.test(msg)) {
    return "Bra fråga! Frågeord är viktiga: Vad=ماذا, Var=أين, När=متى, Hur=كيف, Varför=لماذا, Vem=من. Fortsätt fråga! 🤔";
  }

  // Colors
  if (/(röd|blå|grön|gul|svart|vit|orange|lila|rosa|brun)/.test(msg)) {
    return "Fantastiskt! Du kan färger! 🎨 Kan du beskriva något i rummet med en färg på svenska?";
  }

  // Food
  if (/(mat|bröd|vatten|kaffe|te|äpple|smörgås|soppa|fisk|kött)/.test(msg)) {
    return "Mat-glosor! 🍽️ Bra! I Sverige är 'smörgås' (macka) väldigt populärt! Kan du säga vad du åt idag på svenska?";
  }

  // Time expressions
  if (/(idag|igår|imorgon|nu|sedan|förut|alltid|aldrig|ibland)/.test(msg)) {
    return "Tidsuttryck! ⏰ Bra! Idag=اليوم, Igår=أمس, Imorgon=غدًا. Kan du berätta vad du gör idag?";
  }

  // Apology / Excuse me
  if (/(förlåt|ursäkta|sorry)/.test(msg)) {
    return "Förlåt och Ursäkta - viktiga ord! 'Förlåt' = آسف و 'Ursäkta mig' = عذرًا. Bra att du lär dig arvlighet!";
  }

  // Help with translation (Arabic words mixed in)
  if (/[؀-ۿ]/.test(msg)) {
    return "Jag ser att du blandar arabiska och svenska - det är jättebra för inlärning! Försök formulera hela meningen på svenska nästa gång. Du klarar det! 💙";
  }

  // Short single words - ask them to make a sentence
  if (msg.split(" ").length === 1 && msg.length > 2) {
    return `"${userMessage}" - bra ord! Kan du göra en mening med det? Till exempel: "Jag ser en ${userMessage}" eller "Det finns ${userMessage} här".`;
  }

  // Default encouraging response with grammar tip
  const tips = [
    `Tack för din mening! 📝 Tips: På svenska är ordföljden SVP - Subjekt, Verb, Predikativ. Till exempel: "Jag (S) är (V) glad (P)."`,
    `Bra försök! 🌟 Kom ihåg: svenska substantiv har genus - en (utrum) eller ett (neutrum). Till exempel: en bok, ett hus.`,
    `Fortsätt så! 💪 Tips: Svenska verb böjs inte efter person. "Jag pratar, du pratar, han pratar" - alltid samma form!`,
    `Jättebra! 🎉 Vet du att svenska och arabiska har gemensamma lånord? Till exempel: "socker" kommer från arabiskans "سُكَّر" (sukkar)!`,
    `Utmärkt! 📚 Prova att använda fler adjektiv i din mening. Till exempel: stor, liten, snabb, långsam, vacker.`,
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

router.get("/chat/:sessionId/messages", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await db
      .select()
      .from(chatMessagesTable)
      .where(and(eq(chatMessagesTable.sessionId, sessionId), eq(chatMessagesTable.userId, req.userId!)))
      .orderBy(asc(chatMessagesTable.createdAt));

    res.json(
      messages.map((m) => ({
        id: m.id,
        sessionId: m.sessionId,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt!.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get chat messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/chat/:sessionId/messages", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content } = req.body as { content: string };

    if (!content?.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Save user message
    await db.insert(chatMessagesTable).values({
      userId: req.userId!,
      sessionId,
      role: "user",
      content: content.trim(),
    });

    // Generate reply: real AI if configured, else the built-in rule-based tutor
    const history = await db
      .select()
      .from(chatMessagesTable)
      .where(and(eq(chatMessagesTable.sessionId, sessionId), eq(chatMessagesTable.userId, req.userId!)))
      .orderBy(asc(chatMessagesTable.createdAt));

    const aiReply = await generateAITutorResponse(content.trim(), history).catch((err) => {
      req.log.error({ err }, "AI tutor call failed, falling back to rule-based tutor");
      return null;
    });
    const replyContent = aiReply ?? generateTutorResponse(content.trim());
    const [reply] = await db
      .insert(chatMessagesTable)
      .values({ userId: req.userId!, sessionId, role: "assistant", content: replyContent })
      .returning();

    res.status(201).json({
      id: reply.id,
      sessionId: reply.sessionId,
      role: reply.role,
      content: reply.content,
      createdAt: reply.createdAt!.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to send chat message");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
