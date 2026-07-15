import { db, conversationsTable, conversationLinesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

// High-quality realistic Pexels/Unsplash photos — each scene gets its own image
const P = {
  // Morning routine
  alarm:       "https://images.pexels.com/photos/1028741/pexels-photo-1028741.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  wakeup:      "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  bathroom:    "https://images.pexels.com/photos/6621374/pexels-photo-6621374.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  brushteeth:  "https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  shower:      "https://images.pexels.com/photos/4046459/pexels-photo-4046459.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  getdressed:  "https://images.pexels.com/photos/5693889/pexels-photo-5693889.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  breakfast:   "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  coffee:      "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  leavehome:   "https://images.pexels.com/photos/5935755/pexels-photo-5935755.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  // Gym
  gymoutside:  "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  gymrecept:   "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  gymlocker:   "https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  gymweight:   "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  gymrun:      "https://images.pexels.com/photos/6455904/pexels-photo-6455904.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  gymstretch:  "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  gymwater:    "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  gymleave:    "https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  // Weather
  sunnypark:   "https://images.pexels.com/photos/1125848/pexels-photo-1125848.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  jacketcold:  "https://images.pexels.com/photos/5935238/pexels-photo-5935238.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  rainumbr:    "https://images.pexels.com/photos/459451/pexels-photo-459451.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  snowsweden:  "https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  checkweather:"https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  cloudyday:   "https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  // Grocery
  grocentr:    "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  grocart:     "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  grocvegs:    "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  grocmeat:    "https://images.pexels.com/photos/1927377/pexels-photo-1927377.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  groccash:    "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  grocbag:     "https://images.pexels.com/photos/6996168/pexels-photo-6996168.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  // Park / daily walk
  parkwalk:    "https://images.pexels.com/photos/1488318/pexels-photo-1488318.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  parkbench:   "https://images.pexels.com/photos/933964/pexels-photo-933964.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  parkduck:    "https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  parkjog:     "https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  parkfeed:    "https://images.pexels.com/photos/1088800/pexels-photo-1088800.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  parktalk:    "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  // School pickup
  schoolgate:  "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  schoolhug:   "https://images.pexels.com/photos/8613060/pexels-photo-8613060.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  schoolbag:   "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  schoolwalk:  "https://images.pexels.com/photos/8613025/pexels-photo-8613025.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  schoolsnack: "https://images.pexels.com/photos/3661346/pexels-photo-3661346.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  schoolhomewk:"https://images.pexels.com/photos/5905918/pexels-photo-5905918.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  // Evening / dinner
  cooking:     "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  dinnertable: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  dishwash:    "https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  tvsofa:      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  reading:     "https://images.pexels.com/photos/762687/pexels-photo-762687.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  bedtime:     "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  // Bus / commute
  busstop:     "https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  businside:   "https://images.pexels.com/photos/1426799/pexels-photo-1426799.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  busticket:   "https://images.pexels.com/photos/5472307/pexels-photo-5472307.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  buswindow:   "https://images.pexels.com/photos/4606430/pexels-photo-4606430.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  busdoor:     "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  // Café / fika
  cafewalk:    "https://images.pexels.com/photos/1309779/pexels-photo-1309779.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  cafeorder:   "https://images.pexels.com/photos/6347/coffee-cup-mug-cafe.jpg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  cafecake:    "https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  cafechat:    "https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  cafepay:     "https://images.pexels.com/photos/3068073/pexels-photo-3068073.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
  cafeleave:   "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1",
};

const DAILY_CONVERSATIONS = [

  // ── 1. صباح مثالي ──────────────────────────────────────────────────────────
  {
    title: "En perfekt morgon", titleAr: "صباح مثالي",
    scenario: "morning", category: "يومي", difficulty: "beginner", emoji: "🌅",
    imageUrl: P.breakfast, durationMinutes: 8,
    vocabList: [
      { sv: "vaknar", ar: "يستيقظ", phonetic: "/ˈvɑːknar/" },
      { sv: "duschar", ar: "يستحم", phonetic: "/ˈdɵɧar/" },
      { sv: "frukost", ar: "الفطور", phonetic: "/ˈfrɵkɔst/" },
      { sv: "kaffe", ar: "قهوة", phonetic: "/ˈkafːə/" },
      { sv: "bröd", ar: "خبز", phonetic: "/brøːd/" },
      { sv: "hinner", ar: "يلحق (يكون لديه وقت)", phonetic: "/ˈhɪnːər/" },
    ],
    grammarTips: [
      { title: "الأفعال الانعكاسية: klär sig", explanation: "'sig' تعني نفسه/نفسها — klär sig = يرتدي ملابسه", example: "Han klär sig snabbt.", exampleAr: "هو يرتدي ملابسه بسرعة." },
    ],
    culturalNotes: "السويديون يعشقون القهوة! كوب القهوة الصباحي (morgonkaffe) تقليد راسخ. الفطور السويدي يشمل عادةً خبزاً بالزبدة والجبن والبيض.",
    usefulPhrases: [
      { sv: "God morgon!", ar: "صباح الخير!" },
      { sv: "Jag är sen!", ar: "أنا متأخر!" },
      { sv: "Vad äter vi till frukost?", ar: "ماذا نأكل على الفطور؟" },
      { sv: "Klockan är sju.", ar: "الساعة السابعة." },
    ],
    quiz: [
      { question: "ماذا تعني كلمة 'frukost'؟", options: ["الغداء", "الفطور", "العشاء", "الشاي"], correct: 1 },
      { question: "ما معنى 'Jag är sen'؟", options: ["أنا مبكر", "أنا متأخر", "أنا منتظر", "أنا مريض"], correct: 1 },
    ],
    lines: [
      { speaker: "A", speakerName: "أحمد", speakerRole: null, textSv: "Ringde väckarklockan redan?", textAr: "رن المنبه بالفعل؟", phonetic: "", noteAr: null, sceneImageUrl: P.alarm },
      { speaker: "B", speakerName: "سارة", speakerRole: null, textSv: "Ja! Klockan är sex och trettio. Dags att stiga upp!", textAr: "نعم! الساعة السادسة والنصف. حان وقت الاستيقاظ!", phonetic: "", noteAr: "'Dags att' = حان وقت", sceneImageUrl: P.wakeup },
      { speaker: "A", speakerName: "أحمد", speakerRole: null, textSv: "Fem minuter till...", textAr: "خمس دقائق أخرى...", phonetic: "", noteAr: null, sceneImageUrl: P.wakeup },
      { speaker: "B", speakerName: "سارة", speakerRole: null, textSv: "Nej! Du måste duscha och klä på dig!", textAr: "لا! يجب أن تستحم وترتدي ملابسك!", phonetic: "", noteAr: "'klä på dig' = ارتدِ ملابسك", sceneImageUrl: P.shower },
      { speaker: "A", speakerName: "أحمد", speakerRole: null, textSv: "Okej, okej... Jag är i duschen nu.", textAr: "حسناً، حسناً... أنا في الحمام الآن.", phonetic: "", noteAr: null, sceneImageUrl: P.shower },
      { speaker: "B", speakerName: "سارة", speakerRole: null, textSv: "Jag gör frukost medans. Vill du ha kaffe?", textAr: "سأجهّز الفطور في أثناء ذلك. هل تريد قهوة؟", phonetic: "", noteAr: "'medans' = في الأثناء", sceneImageUrl: P.breakfast },
      { speaker: "A", speakerName: "أحمد", speakerRole: null, textSv: "Ja tack! Och lite bröd med smör.", textAr: "نعم شكراً! وقليل من الخبز بالزبدة.", phonetic: "", noteAr: null, sceneImageUrl: P.coffee },
      { speaker: "B", speakerName: "سارة", speakerRole: null, textSv: "Klart! Skynda dig, bussen går om tjugo minuter.", textAr: "جاهز! أسرع، الحافلة تغادر بعد عشرين دقيقة.", phonetic: "", noteAr: "'Skynda dig' = أسرع!", sceneImageUrl: P.leavehome },
      { speaker: "A", speakerName: "أحمد", speakerRole: null, textSv: "Jag hinner! Tack för kaffet. Ha en bra dag!", textAr: "سألحق! شكراً على القهوة. أتمنى لك يوماً جيداً!", phonetic: "", noteAr: "'Ha en bra dag' = أتمنى لك يوماً جيداً", sceneImageUrl: P.leavehome },
    ],
  },

  // ── 2. في الصالة الرياضية ───────────────────────────────────────────────────
  {
    title: "På gymmet", titleAr: "في الصالة الرياضية",
    scenario: "gym2", category: "يومي", difficulty: "beginner", emoji: "💪",
    imageUrl: P.gymweight, durationMinutes: 10,
    vocabList: [
      { sv: "gymmet", ar: "الصالة الرياضية", phonetic: "/ˈdʒɪmːɛt/" },
      { sv: "tränar", ar: "يتمرن", phonetic: "/ˈtrɛːnar/" },
      { sv: "musklerna", ar: "العضلات", phonetic: "" },
      { sv: "hantel", ar: "دمبل", phonetic: "/ˈhantɛl/" },
      { sv: "löpbandet", ar: "جهاز الجري", phonetic: "" },
      { sv: "stretcha", ar: "يتمدد", phonetic: "" },
      { sv: "trött", ar: "متعب", phonetic: "/trøːt/" },
      { sv: "vatten", ar: "ماء", phonetic: "/ˈvatːɛn/" },
    ],
    grammarTips: [
      { title: "الاسم المحدد: -et/-en", explanation: "gymmet = الصالة (neutrum)، bandet = الحزام (neutrum)", example: "Jag gillar gymmet här.", exampleAr: "أحب هذه الصالة." },
    ],
    culturalNotes: "السويديون من أكثر الشعوب نشاطاً — بيتا (BITA) والعيش الصحي ثقافة منتشرة. معظم الشركات تشجع الموظفين على ممارسة الرياضة وتدفع جزءاً من رسوم النادي.",
    usefulPhrases: [
      { sv: "Jag vill börja träna.", ar: "أريد أن أبدأ التمرن." },
      { sv: "Hur länge tränar du?", ar: "كم من الوقت تتمرن؟" },
      { sv: "Kan du hjälpa mig?", ar: "هل يمكنك مساعدتي؟" },
      { sv: "Jag är väldigt trött idag.", ar: "أنا متعب جداً اليوم." },
    ],
    quiz: [
      { question: "ماذا يعني 'tränar'؟", options: ["يأكل", "يتمرن", "ينام", "يشرب"], correct: 1 },
      { question: "ما هو 'löpbandet'؟", options: ["الدمبل", "المرآة", "جهاز الجري", "الكرة"], correct: 2 },
    ],
    lines: [
      { speaker: "A", speakerName: "كريم", speakerRole: "عضو جديد", textSv: "Hej! Jag är ny här på gymmet.", textAr: "مرحباً! أنا عضو جديد هنا في الصالة.", phonetic: "", noteAr: null, sceneImageUrl: P.gymrecept },
      { speaker: "B", speakerName: "يوهان", speakerRole: "مدرب", textSv: "Välkommen! Jag heter Johan, jag är tränaren här.", textAr: "أهلاً بك! اسمي يوهان، أنا المدرب هنا.", phonetic: "", noteAr: null, sceneImageUrl: P.gymrecept },
      { speaker: "A", speakerName: "كريم", speakerRole: "عضو جديد", textSv: "Var är omklädningsrummet?", textAr: "أين غرفة تبديل الملابس؟", phonetic: "", noteAr: "'omklädningsrummet' = غرفة تبديل الملابس", sceneImageUrl: P.gymlocker },
      { speaker: "B", speakerName: "يوهان", speakerRole: "مدرب", textSv: "Rakt fram och sedan till vänster.", textAr: "مباشرة للأمام ثم إلى اليسار.", phonetic: "", noteAr: null, sceneImageUrl: P.gymlocker },
      { speaker: "A", speakerName: "كريم", speakerRole: "عضو جديد", textSv: "Tack. Jag har bestämt mig för att börja träna igen.", textAr: "شكراً. لقد قررت أن أبدأ التمرن مجدداً.", phonetic: "", noteAr: "'bestämt sig för att' = قرر أن", sceneImageUrl: P.gymweight },
      { speaker: "B", speakerName: "يوهان", speakerRole: "مدرب", textSv: "Bra! Börja med lite löpband för att värma upp.", textAr: "ممتاز! ابدأ بجهاز الجري قليلاً للإحماء.", phonetic: "", noteAr: "'värma upp' = الإحماء", sceneImageUrl: P.gymrun },
      { speaker: "A", speakerName: "كريم", speakerRole: "عضو جديد", textSv: "Hur lång tid ska jag springa?", textAr: "كم من الوقت يجب أن أجري؟", phonetic: "", noteAr: null, sceneImageUrl: P.gymrun },
      { speaker: "B", speakerName: "يوهان", speakerRole: "مدرب", textSv: "Tio minuter räcker för en nybörjare. Kom ihåg att stretcha efteråt!", textAr: "عشر دقائق تكفي للمبتدئين. لا تنسَ التمدد بعد ذلك!", phonetic: "", noteAr: "'Kom ihåg' = تذكر", sceneImageUrl: P.gymstretch },
      { speaker: "A", speakerName: "كريم", speakerRole: "عضو جديد", textSv: "Självklart. Kan jag ta lite vatten?", textAr: "بالطبع. هل أستطيع أخذ قليل من الماء؟", phonetic: "", noteAr: null, sceneImageUrl: P.gymwater },
      { speaker: "B", speakerName: "يوهان", speakerRole: "مدرب", textSv: "Ja, vattenautomaten är däröver. Bra träning!", textAr: "نعم، جهاز الماء هناك. أتمنى تمريناً ممتعاً!", phonetic: "", noteAr: "'Bra träning!' = تمريناً ممتعاً!", sceneImageUrl: P.gymleave },
    ],
  },

  // ── 3. الطقس ───────────────────────────────────────────────────────────────
  {
    title: "Vad är vädret idag?", titleAr: "كيف الطقس اليوم؟",
    scenario: "weather2", category: "يومي", difficulty: "beginner", emoji: "🌤️",
    imageUrl: P.sunnypark, durationMinutes: 7,
    vocabList: [
      { sv: "solen", ar: "الشمس", phonetic: "/ˈsuːlɛn/" },
      { sv: "kallt", ar: "بارد", phonetic: "/kalːt/" },
      { sv: "varmt", ar: "دافئ", phonetic: "/varːmt/" },
      { sv: "regnar", ar: "يمطر", phonetic: "/ˈrɛɡnar/" },
      { sv: "snöar", ar: "يثلج", phonetic: "/ˈsnøːar/" },
      { sv: "jacka", ar: "سترة / جاكيت", phonetic: "/ˈjakːa/" },
      { sv: "paraply", ar: "مظلة", phonetic: "/ˌparaˈplyː/" },
      { sv: "grader", ar: "درجات (حرارة)", phonetic: "/ˈɡrɑːdɛr/" },
    ],
    grammarTips: [
      { title: "التعبير عن الطقس", explanation: "في السويدية نستخدم 'det' + فعل للتعبير عن الطقس", example: "Det regnar. Det snöar. Det är soligt.", exampleAr: "يمطر. يثلج. الجو مشمس." },
    ],
    culturalNotes: "الطقس موضوع محادثة ثقافي مهم جداً في السويد! السويديون يتحدثون عن الطقس كثيراً. درجة الصفر في السويد تعني موسم التزلج وليس الخوف من البرد.",
    usefulPhrases: [
      { sv: "Vilket väder!", ar: "يا لهذا الطقس!" },
      { sv: "Ta på dig en jacka.", ar: "ارتدِ سترة." },
      { sv: "Det är minus fem grader.", ar: "الحرارة خمسة تحت الصفر." },
      { sv: "Ska det regna imorgon?", ar: "هل سيمطر غداً؟" },
    ],
    quiz: [
      { question: "ماذا تعني كلمة 'kallt'؟", options: ["دافئ", "ممطر", "بارد", "مشمس"], correct: 2 },
      { question: "كيف تقول 'يمطر' بالسويدية؟", options: ["Det snöar", "Det blåser", "Det regnar", "Det är soligt"], correct: 2 },
    ],
    lines: [
      { speaker: "A", speakerName: "ليلى", speakerRole: null, textSv: "Titta! Solen skiner idag.", textAr: "انظر! الشمس تشرق اليوم.", phonetic: "", noteAr: null, sceneImageUrl: P.sunnypark },
      { speaker: "B", speakerName: "ماركوس", speakerRole: null, textSv: "Ja, men det är ganska kallt ändå. Ta på dig en jacka.", textAr: "نعم، لكن الجو بارد نوعاً ما. ارتدِ جاكيت.", phonetic: "", noteAr: "'ändå' = على أي حال / مع ذلك", sceneImageUrl: P.jacketcold },
      { speaker: "A", speakerName: "ليلى", speakerRole: null, textSv: "Hur många grader är det?", textAr: "كم درجة الحرارة؟", phonetic: "", noteAr: null, sceneImageUrl: P.checkweather },
      { speaker: "B", speakerName: "ماركوس", speakerRole: null, textSv: "Fyra grader plus. Men det känns som noll grader i vinden.", textAr: "أربع درجات فوق الصفر. لكنها تبدو كالصفر بسبب الريح.", phonetic: "", noteAr: "'det känns som' = تبدو/تبدو وكأنها", sceneImageUrl: P.checkweather },
      { speaker: "A", speakerName: "ليلى", speakerRole: null, textSv: "Det sägs att det ska regna imorgon.", textAr: "يُقال إنه سيمطر غداً.", phonetic: "", noteAr: "'Det sägs att' = يُقال إن", sceneImageUrl: P.cloudyday },
      { speaker: "B", speakerName: "ماركوس", speakerRole: null, textSv: "Typiskt Sverige! Glöm inte paraplyet.", textAr: "نموذجي السويد! لا تنسَ المظلة.", phonetic: "", noteAr: "'Typiskt!' = نموذجي!", sceneImageUrl: P.rainumbr },
      { speaker: "A", speakerName: "ليلى", speakerRole: null, textSv: "Och nästa vecka? Snö kanske?", textAr: "وماذا عن الأسبوع القادم؟ ثلج ربما؟", phonetic: "", noteAr: null, sceneImageUrl: P.snowsweden },
      { speaker: "B", speakerName: "ماركوس", speakerRole: null, textSv: "Det är möjligt! November är oförutsägbar i Sverige.", textAr: "هذا ممكن! نوفمبر لا يمكن التنبؤ به في السويد.", phonetic: "", noteAr: "'oförutsägbar' = لا يمكن التنبؤ به", sceneImageUrl: P.snowsweden },
    ],
  },

  // ── 4. في السوبر ماركت ─────────────────────────────────────────────────────
  {
    title: "På mataffären", titleAr: "في محل البقالة",
    scenario: "grocery", category: "تسوق", difficulty: "beginner", emoji: "🛒",
    imageUrl: P.grocart, durationMinutes: 9,
    vocabList: [
      { sv: "handlar", ar: "يتسوق", phonetic: "/ˈhandlar/" },
      { sv: "kassan", ar: "الصندوق / الكاشير", phonetic: "/ˈkasːan/" },
      { sv: "grönsaker", ar: "خضروات", phonetic: "" },
      { sv: "frukt", ar: "فاكهة", phonetic: "/frɵkt/" },
      { sv: "kilo", ar: "كيلو", phonetic: "/ˈʃiːlɔ/" },
      { sv: "erbjudande", ar: "عرض / تخفيض", phonetic: "" },
      { sv: "kvitto", ar: "إيصال / فاتورة", phonetic: "/ˈkvɪtːɔ/" },
      { sv: "påsen", ar: "الكيس", phonetic: "" },
    ],
    grammarTips: [
      { title: "الكميات", explanation: "ett kilo = كيلو، ett paket = علبة، en liter = لتر", example: "Jag vill ha ett kilo tomater.", exampleAr: "أريد كيلو طماطم." },
    ],
    culturalNotes: "في السويد ستدفع مقابل الأكياس البلاستيكية — دائماً أحضر حقيبة معك! وبطاقة المكافآت (lojalitetskort) تعطيك خصومات في سلاسل مثل ICA وCOOP.",
    usefulPhrases: [
      { sv: "Var finns mjölken?", ar: "أين يوجد الحليب؟" },
      { sv: "Hur mycket kostar det?", ar: "كم يكلف هذا؟" },
      { sv: "Jag betalar med kort.", ar: "سأدفع ببطاقة." },
      { sv: "Har ni ekologisk mjölk?", ar: "هل لديكم حليب عضوي؟" },
    ],
    quiz: [
      { question: "ما معنى 'kassan'؟", options: ["الخضار", "الكاشير", "المدخل", "الكيس"], correct: 1 },
      { question: "كيف تقول 'أريد أن أدفع ببطاقة'؟", options: ["Jag betalar kontant", "Jag betalar med kort", "Jag vill ha kvitto", "Kan jag byta?"], correct: 1 },
    ],
    lines: [
      { speaker: "A", speakerName: "نورة", speakerRole: "زبونة", textSv: "Ursäkta, var finns grönsaksavdelningen?", textAr: "عذراً، أين قسم الخضروات؟", phonetic: "", noteAr: "'grönsaksavdelningen' = قسم الخضروات", sceneImageUrl: P.grocentr },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف المتجر", textSv: "Det är rakt fram, bredvid frukterna.", textAr: "مباشرة للأمام، بجانب الفاكهة.", phonetic: "", noteAr: null, sceneImageUrl: P.grocentr },
      { speaker: "A", speakerName: "نورة", speakerRole: "زبونة", textSv: "Tack! Jag behöver tomater och gurka.", textAr: "شكراً! أحتاج طماطم وخيار.", phonetic: "", noteAr: null, sceneImageUrl: P.grocvegs },
      { speaker: "A", speakerName: "نورة", speakerRole: "زبونة", textSv: "Och ett kilo lök. Det är på erbjudande idag.", textAr: "وكيلو بصل. إنه معروض بتخفيض اليوم.", phonetic: "", noteAr: "'erbjudande' = عرض خاص", sceneImageUrl: P.grocvegs },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف المتجر", textSv: "Ja, ICA har bra erbjudanden på fredagar.", textAr: "نعم، ICA لديها عروض رائعة أيام الجمعة.", phonetic: "", noteAr: null, sceneImageUrl: P.grocmeat },
      { speaker: "A", speakerName: "نورة", speakerRole: "زبونة", textSv: "Perfekt. Jag tar också lite kyckling.", textAr: "ممتاز. سآخذ أيضاً بعض الدجاج.", phonetic: "", noteAr: null, sceneImageUrl: P.grocmeat },
      { speaker: "A", speakerName: "نورة", speakerRole: "زبونة", textSv: "Kan jag betala med Swish?", textAr: "هل يمكنني الدفع بـ Swish؟", phonetic: "", noteAr: "Swish = تطبيق دفع سويدي شائع جداً", sceneImageUrl: P.groccash },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف المتجر", textSv: "Självklart! Vill du ha kvitto?", textAr: "بالطبع! هل تريدين إيصالاً؟", phonetic: "", noteAr: null, sceneImageUrl: P.groccash },
      { speaker: "A", speakerName: "نورة", speakerRole: "زبونة", textSv: "Ja tack. Och en påse, snälla.", textAr: "نعم شكراً. وكيس من فضلك.", phonetic: "", noteAr: null, sceneImageUrl: P.grocbag },
    ],
  },

  // ── 5. نزهة في الحديقة ─────────────────────────────────────────────────────
  {
    title: "En promenad i parken", titleAr: "نزهة في الحديقة",
    scenario: "park2", category: "يومي", difficulty: "beginner", emoji: "🌿",
    imageUrl: P.parkwalk, durationMinutes: 8,
    vocabList: [
      { sv: "promenad", ar: "نزهة / مشية", phonetic: "/prɔmɛˈnɑːd/" },
      { sv: "trädet", ar: "الشجرة", phonetic: "" },
      { sv: "sjön", ar: "البحيرة", phonetic: "/ɧøːn/" },
      { sv: "fåglarna", ar: "الطيور", phonetic: "" },
      { sv: "matar", ar: "يُطعم", phonetic: "" },
      { sv: "fräsch luft", ar: "هواء نقي", phonetic: "" },
      { sv: "bänken", ar: "المقعد / الكرسي", phonetic: "" },
    ],
    grammarTips: [
      { title: "الجمع في السويدية", explanation: "fågel (طائر) → fåglar (طيور). كثير من الكلمات تُجمع بإضافة -ar", example: "Jag ser tre fåglar.", exampleAr: "أرى ثلاثة طيور." },
    ],
    culturalNotes: "السويديون يعشقون الطبيعة وفلسفة 'allemansrätten' (حق الجميع في الطبيعة) تعني أن لك الحق في المشي في أي أرض حتى لو كانت خاصة.",
    usefulPhrases: [
      { sv: "Vad vacker naturen är!", ar: "ما أجمل الطبيعة!" },
      { sv: "Ska vi sätta oss på bänken?", ar: "هل نجلس على المقعد؟" },
      { sv: "Det luktar blommor.", ar: "هناك رائحة الزهور." },
      { sv: "Hur långt är det dit?", ar: "كم المسافة إلى هناك؟" },
    ],
    quiz: [
      { question: "ما معنى 'promenad'؟", options: ["سباحة", "نزهة مشياً", "رحلة بالسيارة", "رياضة"], correct: 1 },
      { question: "ما هو 'sjön'؟", options: ["الجبل", "الغابة", "البحيرة", "الحديقة"], correct: 2 },
    ],
    lines: [
      { speaker: "A", speakerName: "لينا", speakerRole: null, textSv: "Vad fin dag för en promenad!", textAr: "يا له من يوم جميل للنزهة!", phonetic: "", noteAr: "'Vad fin dag' = يا له من يوم جميل", sceneImageUrl: P.parkwalk },
      { speaker: "B", speakerName: "أريك", speakerRole: null, textSv: "Ja! Luften är fräsch och solen skiner.", textAr: "نعم! الهواء نقي والشمس تشرق.", phonetic: "", noteAr: null, sceneImageUrl: P.parkwalk },
      { speaker: "A", speakerName: "لينا", speakerRole: null, textSv: "Ska vi gå mot sjön?", textAr: "هل نمشي نحو البحيرة؟", phonetic: "", noteAr: "'mot' = نحو", sceneImageUrl: P.parkwalk },
      { speaker: "B", speakerName: "أريك", speakerRole: null, textSv: "Gärna! Jag tar med lite bröd till fåglarna.", textAr: "بكل سرور! سآخذ معي بعض الخبز للطيور.", phonetic: "", noteAr: "'Gärna' = بكل سرور", sceneImageUrl: P.parkfeed },
      { speaker: "A", speakerName: "لينا", speakerRole: null, textSv: "Titta! Ankorna är tillbaka vid bryggan.", textAr: "انظر! البط عاد عند الرصيف.", phonetic: "", noteAr: "'ankorna' = البط (جمع)", sceneImageUrl: P.parkduck },
      { speaker: "B", speakerName: "أريك", speakerRole: null, textSv: "Kom! Vi matar dem.", textAr: "تعال! لنطعمهم.", phonetic: "", noteAr: null, sceneImageUrl: P.parkduck },
      { speaker: "A", speakerName: "لينا", speakerRole: null, textSv: "Ska vi vila lite på bänken efter det?", textAr: "هل نستريح قليلاً على المقعد بعد ذلك؟", phonetic: "", noteAr: null, sceneImageUrl: P.parkbench },
      { speaker: "B", speakerName: "أريك", speakerRole: null, textSv: "Absolut. Det är skönt att bara sitta och njuta av naturen.", textAr: "بالتأكيد. من الجميل مجرد الجلوس والتمتع بالطبيعة.", phonetic: "", noteAr: "'njuta av' = يتمتع بـ", sceneImageUrl: P.parkbench },
    ],
  },

  // ── 6. استقبال الطفل من المدرسة ────────────────────────────────────────────
  {
    title: "Hämta barnen från skolan", titleAr: "استقبال الأطفال من المدرسة",
    scenario: "schoolpickup", category: "يومي", difficulty: "beginner", emoji: "🎒",
    imageUrl: P.schoolgate, durationMinutes: 8,
    vocabList: [
      { sv: "hämtar", ar: "يستقبل / يأخذ", phonetic: "/ˈhɛmtar/" },
      { sv: "skolväskan", ar: "حقيبة المدرسة", phonetic: "" },
      { sv: "dagens", ar: "اليوم (ملحق)", phonetic: "" },
      { sv: "läxor", ar: "واجبات", phonetic: "/ˈlɛːksɔr/" },
      { sv: "mellanmål", ar: "وجبة خفيفة", phonetic: "/ˈmɛlːanˌmoːl/" },
      { sv: "tröttare", ar: "أكثر تعباً", phonetic: "" },
    ],
    grammarTips: [
      { title: "الأسئلة عن اليوم الدراسي", explanation: "استخدم 'Hur var...' للسؤال عن كيفية مضي شيء", example: "Hur var dagen? Hur var maten?", exampleAr: "كيف كان يومك؟ كيف كان الطعام؟" },
    ],
    culturalNotes: "في السويد يذهب الأطفال إلى المدرسة من سن السادسة. المدرسة مجانية تماماً والطعام المدرسي مجاني أيضاً. أوقات المدرسة عادةً من 8 صباحاً حتى 3 مساءً.",
    usefulPhrases: [
      { sv: "Hur var skolan idag?", ar: "كيف كانت المدرسة اليوم؟" },
      { sv: "Är du hungrig?", ar: "هل أنت جائع؟" },
      { sv: "Dags att göra läxorna.", ar: "حان وقت حل الواجبات." },
      { sv: "Kom, vi går hem.", ar: "هيا، لنذهب إلى البيت." },
    ],
    quiz: [
      { question: "ما معنى 'läxor'؟", options: ["الكتب", "الواجبات", "الامتحانات", "الأصدقاء"], correct: 1 },
      { question: "كيف تقول 'وجبة خفيفة' بالسويدية؟", options: ["frukost", "lunch", "mellanmål", "middag"], correct: 2 },
    ],
    lines: [
      { speaker: "A", speakerName: "الأم", speakerRole: null, textSv: "Hej hjärtat! Hur var skolan idag?", textAr: "أهلاً حبيبي! كيف كانت المدرسة اليوم؟", phonetic: "", noteAr: "'hjärtat' = قلبي / حبيبي (مُدلّل)", sceneImageUrl: P.schoolhug },
      { speaker: "B", speakerName: "آدم", speakerRole: "الطفل", textSv: "Bra! Vi hade idrott och det var jättekul!", textAr: "كانت ممتازة! كان لدينا رياضة وكانت ممتعة جداً!", phonetic: "", noteAr: "'jättekul' = ممتعة جداً", sceneImageUrl: P.schoolgate },
      { speaker: "A", speakerName: "الأم", speakerRole: null, textSv: "Vad roligt! Ät du ordentligt till lunch?", textAr: "رائع! هل أكلت جيداً في الغداء؟", phonetic: "", noteAr: "'ordentligt' = بشكل لائق / جيداً", sceneImageUrl: P.schoolgate },
      { speaker: "B", speakerName: "آدم", speakerRole: "الطفل", textSv: "Ja, det var köttbullar med potatismos. Min favorit!", textAr: "نعم، كانت كفتة بالبطاطا المهروسة. المفضلة عندي!", phonetic: "", noteAr: "'köttbullar' = الكفتة السويدية الشهيرة", sceneImageUrl: P.schoolgate },
      { speaker: "A", speakerName: "الأم", speakerRole: null, textSv: "Kom, ta din skolväska. Är du hungrig nu?", textAr: "تعال، خذ حقيبتك. هل أنت جائع الآن؟", phonetic: "", noteAr: null, sceneImageUrl: P.schoolbag },
      { speaker: "B", speakerName: "آدم", speakerRole: "الطفل", textSv: "Lite. Kan jag ha ett mellanmål?", textAr: "قليلاً. هل يمكنني تناول وجبة خفيفة؟", phonetic: "", noteAr: null, sceneImageUrl: P.schoolsnack },
      { speaker: "A", speakerName: "الأم", speakerRole: null, textSv: "Självklart. Hemma har vi frukt och yoghurt.", textAr: "بالطبع. في البيت لدينا فواكه وزبادي.", phonetic: "", noteAr: null, sceneImageUrl: P.schoolsnack },
      { speaker: "B", speakerName: "آدم", speakerRole: "الطفل", textSv: "Och sedan läxorna?", textAr: "وبعد ذلك الواجبات؟", phonetic: "", noteAr: null, sceneImageUrl: P.schoolhomewk },
      { speaker: "A", speakerName: "الأم", speakerRole: null, textSv: "Ja, läxorna först. Sedan TV.", textAr: "نعم، الواجبات أولاً. ثم التلفاز.", phonetic: "", noteAr: null, sceneImageUrl: P.schoolhomewk },
    ],
  },

  // ── 7. العشاء المنزلي ───────────────────────────────────────────────────────
  {
    title: "Middagen hemma", titleAr: "العشاء في البيت",
    scenario: "dinner", category: "يومي", difficulty: "beginner", emoji: "🍽️",
    imageUrl: P.dinnertable, durationMinutes: 8,
    vocabList: [
      { sv: "lagar mat", ar: "يطبخ", phonetic: "" },
      { sv: "middagen", ar: "العشاء", phonetic: "/ˈmɪdːaɡɛn/" },
      { sv: "doftar", ar: "يفوح / تفوح منه رائحة", phonetic: "" },
      { sv: "bordet", ar: "الطاولة", phonetic: "" },
      { sv: "sätter sig", ar: "يجلس", phonetic: "" },
      { sv: "diskar", ar: "يغسل الأطباق", phonetic: "" },
      { sv: "smakade", ar: "كان طعمه / الطعم كان", phonetic: "" },
    ],
    grammarTips: [
      { title: "تعبيرات المائدة", explanation: "'Smakade det bra?' للسؤال عن المذاق. 'Det smakar gott' = الطعم لذيذ", example: "Det smakar jättegott!", exampleAr: "الطعم لذيذ جداً!" },
    ],
    culturalNotes: "العشاء في السويد (middag) يكون عادةً بين 5 و7 مساءً. تقليد التجمع العائلي على مائدة العشاء مهم جداً في الثقافة السويدية.",
    usefulPhrases: [
      { sv: "Middagen är klar!", ar: "العشاء جاهز!" },
      { sv: "Det luktar gott!", ar: "تفوح رائحة طيبة!" },
      { sv: "Kan du duka bordet?", ar: "هل يمكنك تجهيز الطاولة؟" },
      { sv: "Smakade det?", ar: "كيف كان الطعم؟" },
    ],
    quiz: [
      { question: "ما معنى 'lagar mat'؟", options: ["يأكل", "يطبخ", "يشتري", "يقرأ"], correct: 1 },
      { question: "كيف تقول 'العشاء جاهز'؟", options: ["Middagen sover", "Middagen är klar", "Middagen är dyr", "Middagen är kall"], correct: 1 },
    ],
    lines: [
      { speaker: "A", speakerName: "بابا", speakerRole: null, textSv: "Jag lagar mat ikväll. Pasta med tomatsås.", textAr: "سأطبخ الليلة. معكرونة بصلصة الطماطم.", phonetic: "", noteAr: null, sceneImageUrl: P.cooking },
      { speaker: "B", speakerName: "ماما", speakerRole: null, textSv: "Det doftar redan gott! Kan jag hjälpa till?", textAr: "تفوح رائحة طيبة بالفعل! هل يمكنني المساعدة؟", phonetic: "", noteAr: "'hjälpa till' = المساعدة", sceneImageUrl: P.cooking },
      { speaker: "A", speakerName: "بابا", speakerRole: null, textSv: "Ja! Kan du duka bordet och kalla på barnen?", textAr: "نعم! هل يمكنك تجهيز الطاولة ومناداة الأطفال؟", phonetic: "", noteAr: "'kalla på' = ينادي", sceneImageUrl: P.dinnertable },
      { speaker: "B", speakerName: "ماما", speakerRole: null, textSv: "Självklart. Barn! Middagen är klar!", textAr: "بالطبع. يا أطفال! العشاء جاهز!", phonetic: "", noteAr: null, sceneImageUrl: P.dinnertable },
      { speaker: "A", speakerName: "بابا", speakerRole: null, textSv: "Smakade det?", textAr: "كيف كان الطعم؟", phonetic: "", noteAr: null, sceneImageUrl: P.dinnertable },
      { speaker: "B", speakerName: "ماما", speakerRole: null, textSv: "Det smakade jättegott! Du är en bra kock.", textAr: "كان لذيذاً جداً! أنت طباخ ممتاز.", phonetic: "", noteAr: "'kock' = طباخ / شيف", sceneImageUrl: P.dinnertable },
      { speaker: "A", speakerName: "بابا", speakerRole: null, textSv: "Tack! Nu diskar vi tillsammans.", textAr: "شكراً! الآن سنغسل الأطباق معاً.", phonetic: "", noteAr: null, sceneImageUrl: P.dishwash },
      { speaker: "B", speakerName: "ماما", speakerRole: null, textSv: "Och sedan sätter vi oss i soffan och kollar på TV.", textAr: "وبعد ذلك سنجلس في الأريكة ونشاهد التلفاز.", phonetic: "", noteAr: "'soffan' = الأريكة", sceneImageUrl: P.tvsofa },
    ],
  },

  // ── 8. في الحافلة ──────────────────────────────────────────────────────────
  {
    title: "På bussen", titleAr: "في الحافلة",
    scenario: "bus", category: "يومي", difficulty: "beginner", emoji: "🚌",
    imageUrl: P.busstop, durationMinutes: 7,
    vocabList: [
      { sv: "bussen", ar: "الحافلة", phonetic: "/ˈbɵsːɛn/" },
      { sv: "hållplatsen", ar: "محطة الحافلة", phonetic: "" },
      { sv: "biljetten", ar: "التذكرة", phonetic: "" },
      { sv: "nästa", ar: "التالي / القادم", phonetic: "/ˈnɛsta/" },
      { sv: "stannar", ar: "يتوقف", phonetic: "" },
      { sv: "linjen", ar: "الخط", phonetic: "" },
      { sv: "stiger av", ar: "ينزل (من الحافلة)", phonetic: "" },
    ],
    grammarTips: [
      { title: "الاتجاهات في المواصلات", explanation: "stiga på = يركب، stiga av = ينزل من المركبة", example: "Jag stiger av vid nästa hållplats.", exampleAr: "سأنزل في المحطة القادمة." },
    ],
    culturalNotes: "السويد لديها نظام مواصلات ممتاز. في ستوكهولم SL وفي يوتبوري Västtrafik. يمكن الدفع بالبطاقة أو التطبيق. التذكرة ساعة أو أكثر تتيح التنقل بين الخطوط.",
    usefulPhrases: [
      { sv: "Stannar bussen här?", ar: "هل تقف الحافلة هنا؟" },
      { sv: "Vilken linje går till centrum?", ar: "أي خط يذهب إلى المركز؟" },
      { sv: "Jag vill stiga av här.", ar: "أريد النزول هنا." },
      { sv: "Hur lång tid tar det?", ar: "كم يستغرق ذلك؟" },
    ],
    quiz: [
      { question: "ماذا تعني 'stiger av'؟", options: ["يركب", "ينزل من المركبة", "يدفع", "ينتظر"], correct: 1 },
      { question: "ما هو 'hållplatsen'؟", options: ["القطار", "محطة الحافلة", "السيارة", "الأوتوبيس"], correct: 1 },
    ],
    lines: [
      { speaker: "A", speakerName: "سامي", speakerRole: "راكب", textSv: "Stannar bussen nummer 4 här?", textAr: "هل تقف الحافلة رقم 4 هنا؟", phonetic: "", noteAr: null, sceneImageUrl: P.busstop },
      { speaker: "B", speakerName: "فريدة", speakerRole: "راكبة", textSv: "Ja, den kommer om tre minuter.", textAr: "نعم، ستصل بعد ثلاث دقائق.", phonetic: "", noteAr: null, sceneImageUrl: P.busstop },
      { speaker: "A", speakerName: "سامي", speakerRole: "راكب", textSv: "Tack! Går den till Centralstationen?", textAr: "شكراً! هل تذهب إلى المحطة المركزية؟", phonetic: "", noteAr: "'Centralstationen' = المحطة المركزية", sceneImageUrl: P.busstop },
      { speaker: "B", speakerName: "فريدة", speakerRole: "راكبة", textSv: "Ja, men du behöver byta vid Sergels Torg.", textAr: "نعم، لكنك ستحتاج للتغيير عند ساحة سيرجلز.", phonetic: "", noteAr: "'byta' = التحويل / تغيير المركبة", sceneImageUrl: P.busstop },
      { speaker: "A", speakerName: "سامي", speakerRole: "راكب", textSv: "Okej. Hur betalar man — med kort?", textAr: "حسناً. كيف يدفع المرء — ببطاقة؟", phonetic: "", noteAr: null, sceneImageUrl: P.busticket },
      { speaker: "B", speakerName: "فريدة", speakerRole: "راكبة", textSv: "Ja, eller med SL-appen. Kontanter accepteras inte längre.", textAr: "نعم، أو بتطبيق SL. لم تعد النقود مقبولة.", phonetic: "", noteAr: "معظم الحافلات في السويد لا تقبل الكاش", sceneImageUrl: P.busticket },
      { speaker: "A", speakerName: "سامي", speakerRole: "راكب", textSv: "Bra att veta! Bussen kommer nu.", textAr: "معلومة مفيدة! الحافلة تأتي الآن.", phonetic: "", noteAr: null, sceneImageUrl: P.businside },
      { speaker: "B", speakerName: "فريدة", speakerRole: "راكبة", textSv: "Ha en trevlig resa!", textAr: "أتمنى لك رحلة ممتعة!", phonetic: "", noteAr: null, sceneImageUrl: P.busdoor },
    ],
  },

  // ── 9. فيكا في المقهى ──────────────────────────────────────────────────────
  {
    title: "Fika med en kompis", titleAr: "فيكا مع صديق",
    scenario: "fika2", category: "يومي", difficulty: "beginner", emoji: "☕",
    imageUrl: P.cafechat, durationMinutes: 9,
    vocabList: [
      { sv: "fika", ar: "استراحة القهوة (تقليد سويدي)", phonetic: "/ˈfiːka/" },
      { sv: "kanelbullen", ar: "كعكة القرفة", phonetic: "" },
      { sv: "beställer", ar: "يطلب", phonetic: "" },
      { sv: "socker", ar: "سكر", phonetic: "/ˈsɔkːər/" },
      { sv: "mjölk", ar: "حليب", phonetic: "/mjølkː/" },
      { sv: "läget", ar: "الحال / الأحوال", phonetic: "" },
      { sv: "betala", ar: "يدفع", phonetic: "" },
    ],
    grammarTips: [
      { title: "'Hur läget?' — سؤال غير رسمي", explanation: "'Hur läget?' = كيف حالك؟ (غير رسمي جداً). الجواب: 'Det är bra!' أو 'Lugnt!'", example: "— Hur läget? — Jättebra!", exampleAr: "— كيف حالك؟ — ممتاز جداً!" },
    ],
    culturalNotes: "الفيكا ليست مجرد قهوة — هي تقليد اجتماعي سويدي عميق! يجتمع الناس مرتين يومياً في العمل لشرب القهوة وتناول الكعك والتحدث. رفض الفيكا يُعتبر عدم تهذيب!",
    usefulPhrases: [
      { sv: "Ska vi ta en fika?", ar: "هل نأخذ استراحة قهوة؟" },
      { sv: "Vad tar du?", ar: "ماذا ستطلب؟" },
      { sv: "Det är jag som bjuder!", ar: "أنا من يدفع!" },
      { sv: "En kopp kaffe, tack.", ar: "فنجان قهوة، شكراً." },
    ],
    quiz: [
      { question: "ما هي 'fika' في السويد؟", options: ["وجبة الغداء", "استراحة القهوة الاجتماعية", "حفلة عيد ميلاد", "وجبة الإفطار"], correct: 1 },
      { question: "ما هي 'kanelbullen'؟", options: ["قهوة ساخنة", "كعكة القرفة", "كعكة الشوكولاتة", "خبز القمح"], correct: 1 },
    ],
    lines: [
      { speaker: "A", speakerName: "إيما", speakerRole: null, textSv: "Ska vi gå in på det kafét? Det ser mysigt ut.", textAr: "هل ندخل هذا المقهى؟ يبدو مريحاً.", phonetic: "", noteAr: "'mysigt' = مريح / دافئ / cozy", sceneImageUrl: P.cafewalk },
      { speaker: "B", speakerName: "علي", speakerRole: null, textSv: "Absolut! Jag behöver verkligen en fika.", textAr: "بالتأكيد! أنا حقاً بحاجة لاستراحة قهوة.", phonetic: "", noteAr: null, sceneImageUrl: P.cafewalk },
      { speaker: "A", speakerName: "إيما", speakerRole: null, textSv: "Vad tar du? Jag tar en cappuccino och en kanelbulle.", textAr: "ماذا ستطلب؟ سآخذ كابتشينو وكعكة قرفة.", phonetic: "", noteAr: null, sceneImageUrl: P.cafeorder },
      { speaker: "B", speakerName: "علي", speakerRole: null, textSv: "Jag tar en latte, tack. Utan socker.", textAr: "سآخذ لاتيه، شكراً. بدون سكر.", phonetic: "", noteAr: null, sceneImageUrl: P.cafeorder },
      { speaker: "A", speakerName: "إيما", speakerRole: null, textSv: "Det är jag som bjuder idag!", textAr: "أنا من يدفع اليوم!", phonetic: "", noteAr: "'Det är jag som bjuder' = أنا من يدفع", sceneImageUrl: P.cafepay },
      { speaker: "B", speakerName: "علي", speakerRole: null, textSv: "Är du säker? Tack så mycket!", textAr: "هل أنت متأكد؟ شكراً جزيلاً!", phonetic: "", noteAr: null, sceneImageUrl: P.cafepay },
      { speaker: "A", speakerName: "إيما", speakerRole: null, textSv: "Hur läget? Hur är jobbet?", textAr: "كيف حالك؟ كيف هو العمل؟", phonetic: "", noteAr: "'Hur läget' = كيف حالك (غير رسمي)", sceneImageUrl: P.cafechat },
      { speaker: "B", speakerName: "علي", speakerRole: null, textSv: "Det går bra! Jag trivs jättebra på kontoret.", textAr: "يسير بشكل جيد! أشعر بالراحة الكبيرة في المكتب.", phonetic: "", noteAr: "'trivs' = يشعر بالراحة والانسجام", sceneImageUrl: P.cafechat },
      { speaker: "A", speakerName: "إيما", speakerRole: null, textSv: "Kul! Vi ses snart igen.", textAr: "رائع! نتقابل قريباً مجدداً.", phonetic: "", noteAr: null, sceneImageUrl: P.cafeleave },
    ],
  },

  // ── 10. المساء والنوم ──────────────────────────────────────────────────────
  {
    title: "Kvällsrutinen", titleAr: "الروتين المسائي",
    scenario: "evening", category: "يومي", difficulty: "beginner", emoji: "🌙",
    imageUrl: P.tvsofa, durationMinutes: 7,
    vocabList: [
      { sv: "kvällen", ar: "المساء", phonetic: "/ˈkvɛlːɛn/" },
      { sv: "soffan", ar: "الأريكة", phonetic: "" },
      { sv: "programmet", ar: "البرنامج / العرض", phonetic: "" },
      { sv: "dags", ar: "حان وقت", phonetic: "/dɑːɡs/" },
      { sv: "borstar tänderna", ar: "يفرش أسنانه", phonetic: "" },
      { sv: "sover", ar: "ينام", phonetic: "/ˈsuːvɛr/" },
      { sv: "god natt", ar: "تصبح على خير", phonetic: "" },
    ],
    grammarTips: [
      { title: "'Dags att' — حان وقت", explanation: "'Dags att + infinitive' = حان وقت فعل شيء", example: "Dags att sova. Dags att äta.", exampleAr: "حان وقت النوم. حان وقت الأكل." },
    ],
    culturalNotes: "السويديون ينامون مبكراً عموماً. 'Netflix och chill' سويدياً يعني مشاهدة SVT (التلفاز السويدي العام) قبل النوم. أطفال السويد ينامون عادةً الساعة 8 مساءً.",
    usefulPhrases: [
      { sv: "God natt!", ar: "تصبح على خير!" },
      { sv: "Sov gott!", ar: "نوم هنيء!" },
      { sv: "Jag är trött.", ar: "أنا متعب." },
      { sv: "Det är dags att sova.", ar: "حان وقت النوم." },
    ],
    quiz: [
      { question: "ماذا تعني 'god natt'؟", options: ["صباح الخير", "مرحباً", "تصبح على خير", "مع السلامة"], correct: 2 },
      { question: "كيف تقول 'أنا متعب' بالسويدية؟", options: ["Jag är glad", "Jag är trött", "Jag är hungrig", "Jag är frisk"], correct: 1 },
    ],
    lines: [
      { speaker: "A", speakerName: "ليلى", speakerRole: null, textSv: "Vad kollar vi på ikväll?", textAr: "ماذا سنشاهد الليلة؟", phonetic: "", noteAr: "'kollar på' = يشاهد (تلفاز)", sceneImageUrl: P.tvsofa },
      { speaker: "B", speakerName: "أمين", speakerRole: null, textSv: "Det finns ett bra program på SVT. En dokumentär.", textAr: "هناك برنامج جيد على SVT. فيلم وثائقي.", phonetic: "", noteAr: "SVT = التلفاز العام السويدي المجاني", sceneImageUrl: P.tvsofa },
      { speaker: "A", speakerName: "ليلى", speakerRole: null, textSv: "Okej! Jag tar en kopp te. Vill du ha?", textAr: "حسناً! سآخذ كوب شاي. هل تريد؟", phonetic: "", noteAr: null, sceneImageUrl: P.tvsofa },
      { speaker: "B", speakerName: "أمين", speakerRole: null, textSv: "Ja tack! Och lite kex.", textAr: "نعم شكراً! وقليل من البسكويت.", phonetic: "", noteAr: "'kex' = بسكويت", sceneImageUrl: P.tvsofa },
      { speaker: "A", speakerName: "ليلى", speakerRole: null, textSv: "Jag läser lite sedan och sover tidigt.", textAr: "سأقرأ قليلاً بعد ذلك وأنام مبكراً.", phonetic: "", noteAr: null, sceneImageUrl: P.reading },
      { speaker: "B", speakerName: "أمين", speakerRole: null, textSv: "Bra idé. Jag är också lite trött.", textAr: "فكرة جيدة. أنا أيضاً متعب قليلاً.", phonetic: "", noteAr: null, sceneImageUrl: P.reading },
      { speaker: "A", speakerName: "ليلى", speakerRole: null, textSv: "Dags att borsta tänderna och gå och lägga sig.", textAr: "حان وقت فرش الأسنان والنوم.", phonetic: "", noteAr: "'gå och lägga sig' = يذهب للنوم", sceneImageUrl: P.brushteeth },
      { speaker: "B", speakerName: "أمين", speakerRole: null, textSv: "God natt! Sov gott.", textAr: "تصبح على خير! نوم هنيء.", phonetic: "", noteAr: null, sceneImageUrl: P.bedtime },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding daily conversations with per-scene images...");

  for (const conv of DAILY_CONVERSATIONS) {
    const { lines, ...convData } = conv;

    // Check if already exists
    const existing = await db
      .select({ id: conversationsTable.id })
      .from(conversationsTable)
      .where(and(
        eq(conversationsTable.title, convData.title),
        eq(conversationsTable.scenario, convData.scenario)
      ));

    if (existing.length > 0) {
      console.log(`  ⏭ Skipping "${convData.titleAr}" (already exists)`);
      continue;
    }

    const [inserted] = await db.insert(conversationsTable).values(convData).returning();
    console.log(`  ✅ Created: "${convData.titleAr}" (id=${inserted.id})`);

    if (lines?.length) {
      await db.insert(conversationLinesTable).values(
        lines.map((l, i) => ({
          conversationId: inserted.id,
          orderIndex: i,
          speaker: l.speaker,
          speakerName: l.speakerName,
          speakerRole: l.speakerRole ?? null,
          textSv: l.textSv,
          textAr: l.textAr,
          phonetic: l.phonetic ?? null,
          noteAr: l.noteAr ?? null,
          sceneImageUrl: l.sceneImageUrl ?? null,
        }))
      );
      console.log(`     + ${lines.length} scenes with unique images`);
    }
  }

  console.log("✅ Daily conversations seeded!");
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
