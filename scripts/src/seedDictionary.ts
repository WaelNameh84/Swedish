import { db, dictionaryTable } from "@workspace/db";
import { sql } from "drizzle-orm";

// Real images per category
const IMG = {
  family:    "https://media.gettyimages.com/id/1300189216/photo/happy-family-eating-breakfast.jpg?s=612x612&w=0&k=20&c=tpaZ_wI_lBB7q4LN-GkHcQhkVleWUSO4qfb8_IxLeyE=",
  food:      "https://media.gettyimages.com/id/2215023550/photo/traditional-swedish-meatballs.jpg?s=612x612&w=0&k=20&c=ZrzruuV67aiz_Eb-Howv1tBi1jw3yp-IvVGYl1MNzn0=",
  nature:    "https://images.pexels.com/photos/33077333/pexels-photo-33077333/free-photo-of-serene-swedish-forest-view-with-reflective-lake.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  city:      "https://i0.wp.com/atravelingfairy.com/wp-content/uploads/2022/11/DSC04547.jpg?w=1100&ssl=1",
  work:      "https://media.gettyimages.com/id/2198968434/photo/students-using-laptop-and-smartphone-in-malmo-sweden.jpg?s=612x612&w=0&k=20&c=CabGwvl3Hs5Mx7_rk0o7weZFg5t4KeAIzeUBNWIUED8=",
  body:      "https://media.gettyimages.com/id/1667940273/photo/portrait-of-smiling-female-student-with-friend-in-university.jpg?s=612x612&w=0&k=20&c=ePwPB-IfQ5SEUEQQMiN6LVIDDK6wTsAjHVH0b9Yy_5A=",
  transport: "https://media.gettyimages.com/id/505985703/photo/man-sitting-in-a-chair-on-the-porch-reading-todays-newspaper.jpg?s=612x612&w=0&k=20&c=tuj1RPsQDlZpBUcnRm8ztgXbFP7YIA7YQtypkyDIZPA=",
  home:      "https://media.gettyimages.com/id/1278673078/photo/empty-table-and-chair-against-window.jpg?s=612x612&w=0&k=20&c=ktE2JWrBuWhe6vmk18E1QsnswMPllZ0s3v96a5ivPlo=",
  time:      "https://static.vecteezy.com/system/resources/thumbnails/078/323/135/small/flatlay-of-sweden-flag-with-map-and-compass.jpg",
  colors:    "https://static.vecteezy.com/system/resources/thumbnails/046/599/964/small/female-student-hands-testing-in-exercise.jpg",
  shopping:  "https://thumbs.dreamstime.com/b/bright-interior-swedish-supermarket-food-products-discount-signs-shopping-carts-aisle-390370221.jpg",
  weather:   "https://images.pexels.com/photos/33077333/pexels-photo-33077333/free-photo-of-serene-swedish-forest-view-with-reflective-lake.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  school:    "https://media.gettyimages.com/id/1667940273/photo/portrait-of-smiling-female-student.jpg?s=612x612&w=0&k=20&c=ePwPB-IfQ5SEUEQQMiN6LVIDDK6wTsAjHVH0b9Yy_5A=",
  health:    "https://media.gettyimages.com/id/731741979/photo/doctor-walking-through-hospital-corridor.jpg?s=612x612&w=0&k=20&c=94a50kc59V322iYjCtqtAM2f6GmIW7T_hiDezvf5TsE=",
  culture:   "https://adventures.com/media/209331/raising-of-a-midsummer-pole.jpg?anchor=center&mode=crop&width=970&height=645",
};

const words = [
  // ── FAMILJ (Family) ──────────────────────────────────────────────
  {
    word: "familj", translation: "عائلة", phonetic: "/faˈmɪlj/",
    partOfSpeech: "substantiv", gender: "en", plural: "familjer",
    level: "A1", category: "familj", imageUrl: IMG.family,
    examples: [
      { sv: "Min familj bor i Stockholm.", ar: "عائلتي تسكن في ستوكهولم." },
      { sv: "Jag älskar min familj.", ar: "أنا أحب عائلتي." },
    ],
    synonyms: ["släkt", "hushåll"],
    antonyms: [],
    conjugations: { "obestämd singular": "familj", "bestämd singular": "familjen", "obestämd plural": "familjer", "bestämd plural": "familjerna" },
  },
  {
    word: "mamma", translation: "أم / ماما", phonetic: "/ˈmamːa/",
    partOfSpeech: "substantiv", gender: "en", plural: "mammor",
    level: "A1", category: "familj", imageUrl: IMG.family,
    examples: [
      { sv: "Min mamma heter Fatima.", ar: "اسم أمي فاطمة." },
      { sv: "Mamma lagar mat.", ar: "الأم تطبخ الطعام." },
    ],
    synonyms: ["mor", "morsa"],
    antonyms: ["pappa"],
    conjugations: { "obestämd singular": "mamma", "bestämd singular": "mamman", "obestämd plural": "mammor", "bestämd plural": "mammorna" },
  },
  {
    word: "pappa", translation: "أب / بابا", phonetic: "/ˈpapːa/",
    partOfSpeech: "substantiv", gender: "en", plural: "pappor",
    level: "A1", category: "familj", imageUrl: IMG.family,
    examples: [
      { sv: "Pappa arbetar på ett sjukhus.", ar: "الأب يعمل في مستشفى." },
      { sv: "Min pappa är snäll.", ar: "أبي طيب." },
    ],
    synonyms: ["far", "farsan"],
    antonyms: ["mamma"],
    conjugations: { "obestämd singular": "pappa", "bestämd singular": "pappan", "obestämd plural": "pappor", "bestämd plural": "papporna" },
  },
  {
    word: "barn", translation: "طفل / أطفال", phonetic: "/bɑːrn/",
    partOfSpeech: "substantiv", gender: "ett", plural: "barn",
    level: "A1", category: "familj", imageUrl: IMG.family,
    examples: [
      { sv: "Barnet leker i parken.", ar: "الطفل يلعب في الحديقة." },
      { sv: "De har tre barn.", ar: "لديهم ثلاثة أطفال." },
    ],
    synonyms: ["unge", "liten"],
    antonyms: ["vuxen"],
    conjugations: { "obestämd singular": "barn", "bestämd singular": "barnet", "obestämd plural": "barn", "bestämd plural": "barnen" },
  },
  {
    word: "bror", translation: "أخ", phonetic: "/bruːr/",
    partOfSpeech: "substantiv", gender: "en", plural: "bröder",
    level: "A1", category: "familj", imageUrl: IMG.family,
    examples: [
      { sv: "Min bror studerar medicin.", ar: "أخي يدرس الطب." },
      { sv: "Jag har två bröder.", ar: "لدي أخوان." },
    ],
    synonyms: [],
    antonyms: ["syster"],
    conjugations: { "obestämd singular": "bror", "bestämd singular": "brodern", "obestämd plural": "bröder", "bestämd plural": "bröderna" },
  },
  {
    word: "syster", translation: "أخت", phonetic: "/ˈsʏstər/",
    partOfSpeech: "substantiv", gender: "en", plural: "systrar",
    level: "A1", category: "familj", imageUrl: IMG.family,
    examples: [
      { sv: "Min syster är lärare.", ar: "أختي معلمة." },
      { sv: "Hon har en yngre syster.", ar: "لديها أخت أصغر." },
    ],
    synonyms: [],
    antonyms: ["bror"],
    conjugations: { "obestämd singular": "syster", "bestämd singular": "systern", "obestämd plural": "systrar", "bestämd plural": "systrarna" },
  },

  // ── MAT (Food) ────────────────────────────────────────────────────
  {
    word: "äta", translation: "يأكل", phonetic: "/ˈɛːta/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Jag äter frukost varje dag.", ar: "أنا آكل الفطور كل يوم." },
      { sv: "Vad vill du äta?", ar: "ماذا تريد أن تأكل؟" },
    ],
    synonyms: ["konsumera", "tugga"],
    antonyms: ["svälta"],
    conjugations: { "infinitiv": "äta", "presens": "äter", "preteritum": "åt", "supinum": "ätit", "imperativ": "ät" },
  },
  {
    word: "bröd", translation: "خبز", phonetic: "/brøːd/",
    partOfSpeech: "substantiv", gender: "ett", plural: "bröd",
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Jag äter bröd med smör.", ar: "أنا آكل الخبز مع الزبدة." },
      { sv: "Svenskt knäckebröd är gott.", ar: "الخبز السويدي المقرمش لذيذ." },
    ],
    synonyms: ["limpa", "franska"],
    antonyms: [],
    conjugations: { "obestämd singular": "bröd", "bestämd singular": "brödet", "obestämd plural": "bröd", "bestämd plural": "bröden" },
  },
  {
    word: "vatten", translation: "ماء", phonetic: "/ˈvatːən/",
    partOfSpeech: "substantiv", gender: "ett", plural: "vatten",
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Kan jag få ett glas vatten?", ar: "هل يمكنني الحصول على كوب ماء؟" },
      { sv: "Vatten är viktigt för hälsan.", ar: "الماء مهم للصحة." },
    ],
    synonyms: ["H₂O", "dricka"],
    antonyms: [],
    conjugations: { "obestämd singular": "vatten", "bestämd singular": "vattnet", "obestämd plural": "vatten", "bestämd plural": "vattnen" },
  },
  {
    word: "köttbullar", translation: "كرات اللحم السويدية", phonetic: "/ˈɕœtːˌbɵlːar/",
    partOfSpeech: "substantiv", gender: "en", plural: "köttbullar",
    level: "A2", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Köttbullar med lingonsylt är en klassisk rätt.", ar: "كرات اللحم مع مربى التوت البري طبق كلاسيكي." },
      { sv: "Mamma lagar köttbullar på söndagar.", ar: "الأم تطبخ كرات اللحم أيام الأحد." },
    ],
    synonyms: ["frikadeller"],
    antonyms: [],
    conjugations: { "obestämd singular": "köttbulle", "bestämd singular": "köttbullen", "obestämd plural": "köttbullar", "bestämd plural": "köttbullarna" },
  },
  {
    word: "kaffe", translation: "قهوة", phonetic: "/ˈkafːə/",
    partOfSpeech: "substantiv", gender: "ett", plural: null,
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Vill du ha kaffe?", ar: "هل تريد قهوة؟" },
      { sv: "Svenskar dricker mycket kaffe.", ar: "السويديون يشربون الكثير من القهوة." },
    ],
    synonyms: ["kaffedryck", "bryggkaffe"],
    antonyms: ["te"],
    conjugations: { "obestämd singular": "kaffe", "bestämd singular": "kaffet" },
  },
  {
    word: "fika", translation: "استراحة القهوة / فيكا", phonetic: "/ˈfiːka/",
    partOfSpeech: "substantiv", gender: "ett", plural: "fikor",
    level: "A2", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Vi tar en fika klockan tre.", ar: "نأخذ استراحة قهوة الساعة الثالثة." },
      { sv: "Fika är en viktig del av svensk kultur.", ar: "الفيكا جزء مهم من الثقافة السويدية." },
    ],
    synonyms: ["kafferast", "paus"],
    antonyms: [],
    conjugations: { "obestämd singular": "fika", "bestämd singular": "fikan", "obestämd plural": "fikor", "bestämd plural": "fikorna" },
  },

  // ── NATUR (Nature) ────────────────────────────────────────────────
  {
    word: "skog", translation: "غابة", phonetic: "/skuːɡ/",
    partOfSpeech: "substantiv", gender: "en", plural: "skogar",
    level: "A1", category: "natur", imageUrl: IMG.nature,
    examples: [
      { sv: "Sverige har många skogar.", ar: "السويد لديها غابات كثيرة." },
      { sv: "Vi går på promenad i skogen.", ar: "نذهب للمشي في الغابة." },
    ],
    synonyms: ["urskog", "lund"],
    antonyms: ["stad"],
    conjugations: { "obestämd singular": "skog", "bestämd singular": "skogen", "obestämd plural": "skogar", "bestämd plural": "skogarna" },
  },
  {
    word: "sjö", translation: "بحيرة", phonetic: "/ɧøː/",
    partOfSpeech: "substantiv", gender: "en", plural: "sjöar",
    level: "A1", category: "natur", imageUrl: IMG.nature,
    examples: [
      { sv: "Vänern är Sveriges största sjö.", ar: "فينيرن هي أكبر بحيرة في السويد." },
      { sv: "Vi badar i sjön på sommaren.", ar: "نسبح في البحيرة صيفاً." },
    ],
    synonyms: ["insjö", "vattensamling"],
    antonyms: ["hav", "öken"],
    conjugations: { "obestämd singular": "sjö", "bestämd singular": "sjön", "obestämd plural": "sjöar", "bestämd plural": "sjöarna" },
  },
  {
    word: "vinter", translation: "شتاء", phonetic: "/ˈvɪntər/",
    partOfSpeech: "substantiv", gender: "en", plural: "vintrar",
    level: "A1", category: "natur", imageUrl: IMG.nature,
    examples: [
      { sv: "Svenska vintrar är kalla.", ar: "فصول الشتاء السويدية باردة." },
      { sv: "Det snöar mycket på vintern.", ar: "يتساقط الثلج كثيراً في الشتاء." },
    ],
    synonyms: ["vintertid"],
    antonyms: ["sommar"],
    conjugations: { "obestämd singular": "vinter", "bestämd singular": "vintern", "obestämd plural": "vintrar", "bestämd plural": "vintrarna" },
  },
  {
    word: "sommar", translation: "صيف", phonetic: "/ˈsɔmːar/",
    partOfSpeech: "substantiv", gender: "en", plural: "somrar",
    level: "A1", category: "natur", imageUrl: IMG.nature,
    examples: [
      { sv: "På sommaren är det ljust länge.", ar: "في الصيف يكون النهار طويلاً." },
      { sv: "Midsommar firas på sommaren.", ar: "عيد منتصف الصيف يُحتفل به في فصل الصيف." },
    ],
    synonyms: ["sommartid", "högsommar"],
    antonyms: ["vinter"],
    conjugations: { "obestämd singular": "sommar", "bestämd singular": "sommaren", "obestämd plural": "somrar", "bestämd plural": "somrarna" },
  },

  // ── STAD (City) ───────────────────────────────────────────────────
  {
    word: "stad", translation: "مدينة", phonetic: "/stɑːd/",
    partOfSpeech: "substantiv", gender: "en", plural: "städer",
    level: "A1", category: "stad", imageUrl: IMG.city,
    examples: [
      { sv: "Stockholm är en stor stad.", ar: "ستوكهولم مدينة كبيرة." },
      { sv: "Jag bor i en liten stad.", ar: "أنا أسكن في مدينة صغيرة." },
    ],
    synonyms: ["tätort", "storstad"],
    antonyms: ["landsbygd", "by"],
    conjugations: { "obestämd singular": "stad", "bestämd singular": "staden", "obestämd plural": "städer", "bestämd plural": "städerna" },
  },
  {
    word: "gata", translation: "شارع", phonetic: "/ˈɡɑːta/",
    partOfSpeech: "substantiv", gender: "en", plural: "gator",
    level: "A1", category: "stad", imageUrl: IMG.city,
    examples: [
      { sv: "Vilken gata bor du på?", ar: "في أي شارع تسكن؟" },
      { sv: "Gatan är full av folk.", ar: "الشارع ممتلئ بالناس." },
    ],
    synonyms: ["väg", "allé"],
    antonyms: [],
    conjugations: { "obestämd singular": "gata", "bestämd singular": "gatan", "obestämd plural": "gator", "bestämd plural": "gatorna" },
  },
  {
    word: "bibliotek", translation: "مكتبة", phonetic: "/bɪblɪuˈteːk/",
    partOfSpeech: "substantiv", gender: "ett", plural: "bibliotek",
    level: "A2", category: "stad", imageUrl: IMG.school,
    examples: [
      { sv: "Jag lånar böcker på biblioteket.", ar: "أنا أستعير الكتب من المكتبة." },
      { sv: "Biblioteket stänger klockan åtta.", ar: "المكتبة تغلق الساعة الثامنة." },
    ],
    synonyms: ["boksal"],
    antonyms: [],
    conjugations: { "obestämd singular": "bibliotek", "bestämd singular": "biblioteket", "obestämd plural": "bibliotek", "bestämd plural": "biblioteken" },
  },

  // ── ARBETE (Work) ─────────────────────────────────────────────────
  {
    word: "arbeta", translation: "يعمل", phonetic: "/arˈbeːta/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "arbete", imageUrl: IMG.work,
    examples: [
      { sv: "Jag arbetar på ett kontor.", ar: "أنا أعمل في مكتب." },
      { sv: "Hon arbetar som läkare.", ar: "هي تعمل كطبيبة." },
    ],
    synonyms: ["jobba", "verka"],
    antonyms: ["vila", "semestra"],
    conjugations: { "infinitiv": "arbeta", "presens": "arbetar", "preteritum": "arbetade", "supinum": "arbetat", "imperativ": "arbeta" },
  },
  {
    word: "jobb", translation: "وظيفة / عمل", phonetic: "/jɔbː/",
    partOfSpeech: "substantiv", gender: "ett", plural: "jobb",
    level: "A1", category: "arbete", imageUrl: IMG.work,
    examples: [
      { sv: "Har du ett bra jobb?", ar: "هل لديك وظيفة جيدة؟" },
      { sv: "Jag söker jobb.", ar: "أنا أبحث عن عمل." },
    ],
    synonyms: ["arbete", "sysselsättning", "tjänst"],
    antonyms: ["arbetslöshet"],
    conjugations: { "obestämd singular": "jobb", "bestämd singular": "jobbet", "obestämd plural": "jobb", "bestämd plural": "jobben" },
  },
  {
    word: "möte", translation: "اجتماع", phonetic: "/ˈmøːtə/",
    partOfSpeech: "substantiv", gender: "ett", plural: "möten",
    level: "A2", category: "arbete", imageUrl: IMG.work,
    examples: [
      { sv: "Vi har ett möte klockan tio.", ar: "لدينا اجتماع الساعة العاشرة." },
      { sv: "Mötet varade i två timmar.", ar: "الاجتماع استمر ساعتين." },
    ],
    synonyms: ["konferens", "träff", "sammanträde"],
    antonyms: [],
    conjugations: { "obestämd singular": "möte", "bestämd singular": "mötet", "obestämd plural": "möten", "bestämd plural": "mötena" },
  },

  // ── KROPP (Body) ──────────────────────────────────────────────────
  {
    word: "huvud", translation: "رأس", phonetic: "/ˈhɵːvɵd/",
    partOfSpeech: "substantiv", gender: "ett", plural: "huvuden",
    level: "A1", category: "kropp", imageUrl: IMG.body,
    examples: [
      { sv: "Jag har ont i huvudet.", ar: "عندي ألم في الرأس." },
      { sv: "Han skakade på huvudet.", ar: "هو هز رأسه." },
    ],
    synonyms: ["skalle", "knopp"],
    antonyms: [],
    conjugations: { "obestämd singular": "huvud", "bestämd singular": "huvudet", "obestämd plural": "huvuden", "bestämd plural": "huvudena" },
  },
  {
    word: "hand", translation: "يد", phonetic: "/handː/",
    partOfSpeech: "substantiv", gender: "en", plural: "händer",
    level: "A1", category: "kropp", imageUrl: IMG.body,
    examples: [
      { sv: "Tvätta händerna!", ar: "اغسل يديك!" },
      { sv: "Han räckte ut handen.", ar: "مد يده." },
    ],
    synonyms: ["näve"],
    antonyms: [],
    conjugations: { "obestämd singular": "hand", "bestämd singular": "handen", "obestämd plural": "händer", "bestämd plural": "händerna" },
  },

  // ── HÄLSA (Health) ────────────────────────────────────────────────
  {
    word: "sjuk", translation: "مريض", phonetic: "/ɧɵːk/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "hälsa", imageUrl: IMG.health,
    examples: [
      { sv: "Jag är sjuk idag.", ar: "أنا مريض اليوم." },
      { sv: "Han var sjuk i en vecka.", ar: "كان مريضاً لمدة أسبوع." },
    ],
    synonyms: ["illamående", "krasslig"],
    antonyms: ["frisk", "hälsosam"],
    conjugations: { "positiv": "sjuk", "komparativ": "sjukare", "superlativ": "sjukast" },
  },
  {
    word: "läkare", translation: "طبيب", phonetic: "/ˈlɛːkarə/",
    partOfSpeech: "substantiv", gender: "en", plural: "läkare",
    level: "A1", category: "hälsa", imageUrl: IMG.health,
    examples: [
      { sv: "Jag behöver träffa en läkare.", ar: "أحتاج إلى مقابلة طبيب." },
      { sv: "Läkaren undersökte patienten.", ar: "الطبيب فحص المريض." },
    ],
    synonyms: ["doktor", "läkarinnan"],
    antonyms: ["patient"],
    conjugations: { "obestämd singular": "läkare", "bestämd singular": "läkaren", "obestämd plural": "läkare", "bestämd plural": "läkarna" },
  },
  {
    word: "sjukhus", translation: "مستشفى", phonetic: "/ˈɧɵːkhɵːs/",
    partOfSpeech: "substantiv", gender: "ett", plural: "sjukhus",
    level: "A2", category: "hälsa", imageUrl: IMG.health,
    examples: [
      { sv: "Han lades in på sjukhuset.", ar: "تم إدخاله إلى المستشفى." },
      { sv: "Sjukhuset är öppet dygnet runt.", ar: "المستشفى مفتوح على مدار الساعة." },
    ],
    synonyms: ["lasarett", "klinik"],
    antonyms: [],
    conjugations: { "obestämd singular": "sjukhus", "bestämd singular": "sjukhuset", "obestämd plural": "sjukhus", "bestämd plural": "sjukhusen" },
  },

  // ── TRANSPORT ─────────────────────────────────────────────────────
  {
    word: "tåg", translation: "قطار", phonetic: "/tɔːɡ/",
    partOfSpeech: "substantiv", gender: "ett", plural: "tåg",
    level: "A1", category: "transport", imageUrl: IMG.transport,
    examples: [
      { sv: "Jag tar tåget till Göteborg.", ar: "أركب القطار إلى يوتيبوري." },
      { sv: "Tåget avgår klockan åtta.", ar: "القطار يغادر الساعة الثامنة." },
    ],
    synonyms: ["järnvägståg", "expresståg"],
    antonyms: [],
    conjugations: { "obestämd singular": "tåg", "bestämd singular": "tåget", "obestämd plural": "tåg", "bestämd plural": "tågen" },
  },
  {
    word: "buss", translation: "حافلة", phonetic: "/bɵsː/",
    partOfSpeech: "substantiv", gender: "en", plural: "bussar",
    level: "A1", category: "transport", imageUrl: IMG.transport,
    examples: [
      { sv: "Jag åker buss till jobbet.", ar: "أركب الحافلة إلى العمل." },
      { sv: "Vilken buss går till centrum?", ar: "أي حافلة تذهب إلى المركز؟" },
    ],
    synonyms: ["turistbuss", "linjebus"],
    antonyms: [],
    conjugations: { "obestämd singular": "buss", "bestämd singular": "bussen", "obestämd plural": "bussar", "bestämd plural": "bussarna" },
  },

  // ── HEM (Home) ────────────────────────────────────────────────────
  {
    word: "hus", translation: "بيت / منزل", phonetic: "/hɵːs/",
    partOfSpeech: "substantiv", gender: "ett", plural: "hus",
    level: "A1", category: "hem", imageUrl: IMG.home,
    examples: [
      { sv: "Vi bor i ett stort hus.", ar: "نسكن في بيت كبير." },
      { sv: "Huset har fyra rum.", ar: "البيت له أربع غرف." },
    ],
    synonyms: ["hem", "bostad", "villa"],
    antonyms: [],
    conjugations: { "obestämd singular": "hus", "bestämd singular": "huset", "obestämd plural": "hus", "bestämd plural": "husen" },
  },
  {
    word: "rum", translation: "غرفة", phonetic: "/rɵːm/",
    partOfSpeech: "substantiv", gender: "ett", plural: "rum",
    level: "A1", category: "hem", imageUrl: IMG.home,
    examples: [
      { sv: "Mitt rum är litet men mysigt.", ar: "غرفتي صغيرة لكنها مريحة." },
      { sv: "Hur många rum har ni?", ar: "كم غرفة لديكم؟" },
    ],
    synonyms: ["kammare", "sal"],
    antonyms: [],
    conjugations: { "obestämd singular": "rum", "bestämd singular": "rummet", "obestämd plural": "rum", "bestämd plural": "rummen" },
  },

  // ── TID (Time) ────────────────────────────────────────────────────
  {
    word: "dag", translation: "يوم", phonetic: "/dɑːɡ/",
    partOfSpeech: "substantiv", gender: "en", plural: "dagar",
    level: "A1", category: "tid", imageUrl: IMG.time,
    examples: [
      { sv: "Idag är det måndag.", ar: "اليوم هو الاثنين." },
      { sv: "God dag!", ar: "صباح الخير / مرحباً!" },
    ],
    synonyms: ["dygn"],
    antonyms: ["natt"],
    conjugations: { "obestämd singular": "dag", "bestämd singular": "dagen", "obestämd plural": "dagar", "bestämd plural": "dagarna" },
  },
  {
    word: "vecka", translation: "أسبوع", phonetic: "/ˈvɛkːa/",
    partOfSpeech: "substantiv", gender: "en", plural: "veckor",
    level: "A1", category: "tid", imageUrl: IMG.time,
    examples: [
      { sv: "Det finns sju dagar i en vecka.", ar: "في الأسبوع سبعة أيام." },
      { sv: "Vi ses nästa vecka.", ar: "نتقابل الأسبوع القادم." },
    ],
    synonyms: ["sju dagar"],
    antonyms: [],
    conjugations: { "obestämd singular": "vecka", "bestämd singular": "veckan", "obestämd plural": "veckor", "bestämd plural": "veckorna" },
  },

  // ── HANDEL (Shopping) ─────────────────────────────────────────────
  {
    word: "affär", translation: "متجر / محل", phonetic: "/aˈfɛːr/",
    partOfSpeech: "substantiv", gender: "en", plural: "affärer",
    level: "A1", category: "handel", imageUrl: IMG.shopping,
    examples: [
      { sv: "Jag går till affären.", ar: "أنا ذاهب إلى المتجر." },
      { sv: "Affären stänger klockan nio.", ar: "المتجر يغلق الساعة التاسعة." },
    ],
    synonyms: ["butik", "handel", "shop"],
    antonyms: [],
    conjugations: { "obestämd singular": "affär", "bestämd singular": "affären", "obestämd plural": "affärer", "bestämd plural": "affärerna" },
  },
  {
    word: "billig", translation: "رخيص", phonetic: "/ˈbɪlːɪɡ/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A2", category: "handel", imageUrl: IMG.shopping,
    examples: [
      { sv: "Det är billigt i den butiken.", ar: "الأسعار رخيصة في ذلك المتجر." },
      { sv: "Jag vill ha något billigare.", ar: "أريد شيئاً أرخص." },
    ],
    synonyms: ["förmånlig", "prisvärd"],
    antonyms: ["dyr", "kostsam"],
    conjugations: { "positiv": "billig", "komparativ": "billigare", "superlativ": "billigast" },
  },
  {
    word: "dyr", translation: "غالي / مكلف", phonetic: "/dyːr/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A2", category: "handel", imageUrl: IMG.shopping,
    examples: [
      { sv: "Den här jackan är för dyr.", ar: "هذه الجاكيت غالية جداً." },
      { sv: "Mat är dyrt i Sverige.", ar: "الطعام مكلف في السويد." },
    ],
    synonyms: ["kostsam", "exklusiv"],
    antonyms: ["billig", "förmånlig"],
    conjugations: { "positiv": "dyr", "komparativ": "dyrare", "superlativ": "dyrast" },
  },

  // ── SKOLA (School) ────────────────────────────────────────────────
  {
    word: "lärare", translation: "معلم / مدرس", phonetic: "/ˈlɛːrarə/",
    partOfSpeech: "substantiv", gender: "en", plural: "lärare",
    level: "A1", category: "skola", imageUrl: IMG.school,
    examples: [
      { sv: "Min lärare heter Anna.", ar: "اسم معلمتي آنا." },
      { sv: "Läraren förklarar grammatiken.", ar: "المعلم يشرح القواعد." },
    ],
    synonyms: ["pedagog", "undervisare"],
    antonyms: ["elev", "student"],
    conjugations: { "obestämd singular": "lärare", "bestämd singular": "läraren", "obestämd plural": "lärare", "bestämd plural": "lärarna" },
  },
  {
    word: "studera", translation: "يدرس", phonetic: "/stɵˈdeːra/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "skola", imageUrl: IMG.school,
    examples: [
      { sv: "Jag studerar svenska.", ar: "أنا أدرس السويدية." },
      { sv: "Hon studerar på universitetet.", ar: "هي تدرس في الجامعة." },
    ],
    synonyms: ["läsa", "plugga"],
    antonyms: [],
    conjugations: { "infinitiv": "studera", "presens": "studerar", "preteritum": "studerade", "supinum": "studerat", "imperativ": "studera" },
  },
  {
    word: "bok", translation: "كتاب", phonetic: "/buːk/",
    partOfSpeech: "substantiv", gender: "en", plural: "böcker",
    level: "A1", category: "skola", imageUrl: IMG.school,
    examples: [
      { sv: "Jag läser en intressant bok.", ar: "أنا أقرأ كتاباً ممتعاً." },
      { sv: "Boken handlar om Sverige.", ar: "الكتاب يتحدث عن السويد." },
    ],
    synonyms: ["verk", "roman"],
    antonyms: [],
    conjugations: { "obestämd singular": "bok", "bestämd singular": "boken", "obestämd plural": "böcker", "bestämd plural": "böckerna" },
  },

  // ── KÄNSLOR (Emotions) ────────────────────────────────────────────
  {
    word: "glad", translation: "سعيد / مبسوط", phonetic: "/ɡlɑːd/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "känslor", imageUrl: IMG.body,
    examples: [
      { sv: "Jag är glad idag!", ar: "أنا سعيد اليوم!" },
      { sv: "Hon ser glad ut.", ar: "تبدو سعيدة." },
    ],
    synonyms: ["lycklig", "nöjd", "belåten"],
    antonyms: ["ledsen", "sur", "olycklig"],
    conjugations: { "positiv": "glad", "komparativ": "gladare", "superlativ": "gladast" },
  },
  {
    word: "ledsen", translation: "حزين", phonetic: "/ˈleːdsən/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "känslor", imageUrl: IMG.body,
    examples: [
      { sv: "Varför är du ledsen?", ar: "لماذا أنت حزين؟" },
      { sv: "Han blev ledsen när han hörde nyheten.", ar: "حزن عندما سمع الخبر." },
    ],
    synonyms: ["sorgsen", "bedrövad", "nedstämd"],
    antonyms: ["glad", "lycklig"],
    conjugations: { "positiv": "ledsen", "komparativ": "ledsnare", "superlativ": "ledsnast" },
  },
  {
    word: "älska", translation: "يحب / يعشق", phonetic: "/ˈɛlska/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "känslor", imageUrl: IMG.family,
    examples: [
      { sv: "Jag älskar dig.", ar: "أنا أحبك." },
      { sv: "Hon älskar att läsa böcker.", ar: "هي تعشق القراءة." },
    ],
    synonyms: ["tycka om", "beundra"],
    antonyms: ["hata", "avsky"],
    conjugations: { "infinitiv": "älska", "presens": "älskar", "preteritum": "älskade", "supinum": "älskat", "imperativ": "älska" },
  },

  // ── NYCKELVERB (Key Verbs) ─────────────────────────────────────────
  {
    word: "vara", translation: "يكون / يوجد", phonetic: "/ˈvɑːra/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "nyckelverb", imageUrl: IMG.time,
    examples: [
      { sv: "Jag är student.", ar: "أنا طالب." },
      { sv: "Det är kallt idag.", ar: "الجو بارد اليوم." },
    ],
    synonyms: ["existera", "finnas"],
    antonyms: [],
    conjugations: { "infinitiv": "vara", "presens": "är", "preteritum": "var", "supinum": "varit", "imperativ": "var" },
  },
  {
    word: "ha", translation: "يملك / لديه", phonetic: "/hɑː/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "nyckelverb", imageUrl: IMG.time,
    examples: [
      { sv: "Jag har en katt.", ar: "لدي قطة." },
      { sv: "Har du tid?", ar: "هل لديك وقت؟" },
    ],
    synonyms: ["äga", "besitta"],
    antonyms: ["sakna"],
    conjugations: { "infinitiv": "ha", "presens": "har", "preteritum": "hade", "supinum": "haft", "imperativ": "ha" },
  },
  {
    word: "gå", translation: "يمشي / يذهب", phonetic: "/ɡɔː/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "nyckelverb", imageUrl: IMG.city,
    examples: [
      { sv: "Jag går till affären.", ar: "أنا أمشي إلى المتجر." },
      { sv: "Kan vi gå hit?", ar: "هل يمكننا المجيء هنا؟" },
    ],
    synonyms: ["promenera", "vandra"],
    antonyms: ["stanna", "sitta"],
    conjugations: { "infinitiv": "gå", "presens": "går", "preteritum": "gick", "supinum": "gått", "imperativ": "gå" },
  },
  {
    word: "komma", translation: "يأتي / يصل", phonetic: "/ˈkɔmːa/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "nyckelverb", imageUrl: IMG.city,
    examples: [
      { sv: "Kom hit!", ar: "تعال إلى هنا!" },
      { sv: "När kommer du?", ar: "متى ستأتي؟" },
    ],
    synonyms: ["anlända", "infinna sig"],
    antonyms: ["gå", "lämna"],
    conjugations: { "infinitiv": "komma", "presens": "kommer", "preteritum": "kom", "supinum": "kommit", "imperativ": "kom" },
  },

  // ── KULTUR (Culture) ──────────────────────────────────────────────
  {
    word: "midsommar", translation: "منتصف الصيف (عيد سويدي)", phonetic: "/ˈmɪdˌsɔmːar/",
    partOfSpeech: "substantiv", gender: "en", plural: "midsomrar",
    level: "B1", category: "kultur", imageUrl: IMG.culture,
    examples: [
      { sv: "Midsommar firas i juni.", ar: "عيد منتصف الصيف يُحتفل به في يونيو." },
      { sv: "Vi dansar runt midsommarstången.", ar: "نرقص حول عمود منتصف الصيف." },
    ],
    synonyms: ["midsommarfirande"],
    antonyms: [],
    conjugations: { "obestämd singular": "midsommar", "bestämd singular": "midsommaren", "obestämd plural": "midsomrar", "bestämd plural": "midsomrarna" },
  },
  {
    word: "lagom", translation: "بالضبط / كفاية / معتدل", phonetic: "/ˈlɑːɡɔm/",
    partOfSpeech: "adverb", gender: null, plural: null,
    level: "B1", category: "kultur", imageUrl: IMG.culture,
    examples: [
      { sv: "Lagom är bäst.", ar: "القدر المعتدل هو الأفضل." },
      { sv: "Maten är lagom kryddad.", ar: "الطعام متبّل بالقدر المناسب." },
    ],
    synonyms: ["måttlig", "lagom mycket"],
    antonyms: ["för mycket", "för lite"],
    conjugations: {},
  },
];

async function seed() {
  console.log("🌱 Seeding dictionary...");
  await db.delete(dictionaryTable);
  console.log("🗑️  Cleared existing dictionary data");

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    await db.insert(dictionaryTable).values({
      word: w.word,
      translation: w.translation,
      phonetic: w.phonetic,
      partOfSpeech: w.partOfSpeech,
      gender: w.gender ?? null,
      plural: w.plural ?? null,
      level: w.level,
      category: w.category,
      imageUrl: w.imageUrl ?? null,
      audioUrl: null,
      examples: w.examples,
      synonyms: w.synonyms,
      antonyms: w.antonyms,
      conjugations: w.conjugations ?? null,
    });
    console.log(`✅ [${i + 1}/${words.length}] ${w.word} — ${w.translation}`);
  }

  console.log(`\n🎉 Seeded ${words.length} dictionary words!`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
