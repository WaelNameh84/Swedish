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
  clothes:   "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  sports:    "https://media.gettyimages.com/id/1346113310/photo/friends-playing-football-in-park.jpg?s=612x612&w=0&k=20&c=3tVp8fqHYlgGovlnKzNHEbMLvbTxwfL2t1y5wRhw6Bg=",
  animals:   "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  furniture: "https://media.gettyimages.com/id/1278673078/photo/empty-table-and-chair-against-window.jpg?s=612x612&w=0&k=20&c=ktE2JWrBuWhe6vmk18E1QsnswMPllZ0s3v96a5ivPlo=",
  tech:      "https://media.gettyimages.com/id/2198968434/photo/students-using-laptop-and-smartphone-in-malmo-sweden.jpg?s=612x612&w=0&k=20&c=CabGwvl3Hs5Mx7_rk0o7weZFg5t4KeAIzeUBNWIUED8=",
  holidays:  "https://adventures.com/media/209331/raising-of-a-midsummer-pole.jpg?anchor=center&mode=crop&width=970&height=645",
  numbers:   "https://static.vecteezy.com/system/resources/thumbnails/046/599/964/small/female-student-hands-testing-in-exercise.jpg",
};

const words: Array<{
  word: string; translation: string; phonetic: string;
  partOfSpeech: string; gender: string | null; plural: string | null;
  level: string; category: string; imageUrl: string;
  examples: { sv: string; ar: string }[];
  synonyms: string[]; antonyms: string[];
  conjugations: Record<string, string>;
}> = [
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

  // ── KLÄDER (Clothes) ──────────────────────────────────────────────
  {
    word: "skjorta", translation: "قميص", phonetic: "/ˈɧɔːrta/",
    partOfSpeech: "substantiv", gender: "en", plural: "skjortor",
    level: "A1", category: "kläder", imageUrl: IMG.clothes,
    examples: [
      { sv: "Han har en vit skjorta.", ar: "يرتدي قميصاً أبيض." },
      { sv: "Jag köpte en ny skjorta.", ar: "اشتريت قميصاً جديداً." },
    ],
    synonyms: ["blus"],
    antonyms: [],
    conjugations: { "obestämd singular": "skjorta", "bestämd singular": "skjortan", "obestämd plural": "skjortor", "bestämd plural": "skjortorna" },
  },
  {
    word: "byxor", translation: "بنطلون", phonetic: "/ˈbyːksɔr/",
    partOfSpeech: "substantiv", gender: "en", plural: "byxor",
    level: "A1", category: "kläder", imageUrl: IMG.clothes,
    examples: [
      { sv: "Jag har på mig svarta byxor.", ar: "أرتدي بنطلوناً أسود." },
      { sv: "Dessa byxor är för stora.", ar: "هذا البنطلون كبير جداً." },
    ],
    synonyms: ["jeans", "slacks"],
    antonyms: ["kjol"],
    conjugations: { "obestämd singular": "byxa", "bestämd singular": "byxan", "obestämd plural": "byxor", "bestämd plural": "byxorna" },
  },
  {
    word: "kjol", translation: "تنورة / جيبة", phonetic: "/ɕuːl/",
    partOfSpeech: "substantiv", gender: "en", plural: "kjolar",
    level: "A1", category: "kläder", imageUrl: IMG.clothes,
    examples: [
      { sv: "Hon bär en röd kjol.", ar: "تلبس تنورة حمراء." },
      { sv: "Kjolen är lång och fin.", ar: "التنورة طويلة وجميلة." },
    ],
    synonyms: [],
    antonyms: ["byxor"],
    conjugations: { "obestämd singular": "kjol", "bestämd singular": "kjolen", "obestämd plural": "kjolar", "bestämd plural": "kjolarna" },
  },
  {
    word: "jacka", translation: "جاكيت / معطف", phonetic: "/ˈjakːa/",
    partOfSpeech: "substantiv", gender: "en", plural: "jackor",
    level: "A1", category: "kläder", imageUrl: IMG.clothes,
    examples: [
      { sv: "Ta på dig jackan, det är kallt.", ar: "البس جاكيتك، الجو بارد." },
      { sv: "Jag glömde min jacka på bussen.", ar: "نسيت جاكيتي في الحافلة." },
    ],
    synonyms: ["kappa", "rock"],
    antonyms: [],
    conjugations: { "obestämd singular": "jacka", "bestämd singular": "jackan", "obestämd plural": "jackor", "bestämd plural": "jackorna" },
  },
  {
    word: "skor", translation: "أحذية", phonetic: "/skuːr/",
    partOfSpeech: "substantiv", gender: "en", plural: "skor",
    level: "A1", category: "kläder", imageUrl: IMG.clothes,
    examples: [
      { sv: "Jag behöver nya skor.", ar: "أحتاج إلى أحذية جديدة." },
      { sv: "Ta av dig skorna vid dörren.", ar: "اخلع حذاءك عند الباب." },
    ],
    synonyms: ["stövlar", "sandaler"],
    antonyms: [],
    conjugations: { "obestämd singular": "sko", "bestämd singular": "skon", "obestämd plural": "skor", "bestämd plural": "skorna" },
  },
  {
    word: "tröja", translation: "كنزة / بلوزة", phonetic: "/ˈtrøːja/",
    partOfSpeech: "substantiv", gender: "en", plural: "tröjor",
    level: "A1", category: "kläder", imageUrl: IMG.clothes,
    examples: [
      { sv: "Han har en grön tröja.", ar: "يرتدي كنزة خضراء." },
      { sv: "Tröjan är varm och bekväm.", ar: "الكنزة دافئة ومريحة." },
    ],
    synonyms: ["pullover", "sweatshirt"],
    antonyms: [],
    conjugations: { "obestämd singular": "tröja", "bestämd singular": "tröjan", "obestämd plural": "tröjor", "bestämd plural": "tröjorna" },
  },
  {
    word: "mössa", translation: "قبعة صوف / طاقية", phonetic: "/ˈmøsːa/",
    partOfSpeech: "substantiv", gender: "en", plural: "mössor",
    level: "A1", category: "kläder", imageUrl: IMG.clothes,
    examples: [
      { sv: "Ta på dig en mössa, det snöar.", ar: "البس طاقيتك، إنه يتساقط الثلج." },
      { sv: "Min mössa är blå.", ar: "طاقيتي زرقاء." },
    ],
    synonyms: ["hatt", "keps"],
    antonyms: [],
    conjugations: { "obestämd singular": "mössa", "bestämd singular": "mössan", "obestämd plural": "mössor", "bestämd plural": "mössorna" },
  },

  // ── YRKEN (Professions) ───────────────────────────────────────────
  {
    word: "ingenjör", translation: "مهندس", phonetic: "/ɪnɡɛˈɲøːr/",
    partOfSpeech: "substantiv", gender: "en", plural: "ingenjörer",
    level: "A2", category: "yrken", imageUrl: IMG.work,
    examples: [
      { sv: "Han är ingenjör på ett teknikföretag.", ar: "هو مهندس في شركة تكنولوجيا." },
      { sv: "Det finns många ingenjörer i Sverige.", ar: "هناك كثير من المهندسين في السويد." },
    ],
    synonyms: ["tekniker"],
    antonyms: [],
    conjugations: { "obestämd singular": "ingenjör", "bestämd singular": "ingenjören", "obestämd plural": "ingenjörer", "bestämd plural": "ingenjörerna" },
  },
  {
    word: "polis", translation: "شرطي", phonetic: "/puˈliːs/",
    partOfSpeech: "substantiv", gender: "en", plural: "poliser",
    level: "A1", category: "yrken", imageUrl: IMG.city,
    examples: [
      { sv: "Polisen kom snabbt till platsen.", ar: "وصل الشرطي بسرعة إلى المكان." },
      { sv: "Min farbror är polis.", ar: "عمي شرطي." },
    ],
    synonyms: ["ordningsvakt", "konstapel"],
    antonyms: [],
    conjugations: { "obestämd singular": "polis", "bestämd singular": "polisen", "obestämd plural": "poliser", "bestämd plural": "poliserna" },
  },
  {
    word: "sjuksköterska", translation: "ممرضة", phonetic: "/ˈɧɵːkˌɧøːtərska/",
    partOfSpeech: "substantiv", gender: "en", plural: "sjuksköterskor",
    level: "A2", category: "yrken", imageUrl: IMG.health,
    examples: [
      { sv: "Sjuksköterskan tar hand om patienterna.", ar: "الممرضة ترعى المرضى." },
      { sv: "Hon studerar till sjuksköterska.", ar: "هي تدرس لتصبح ممرضة." },
    ],
    synonyms: ["vårdare", "skötare"],
    antonyms: [],
    conjugations: { "obestämd singular": "sjuksköterska", "bestämd singular": "sjuksköterskan", "obestämd plural": "sjuksköterskor", "bestämd plural": "sjuksköterskorna" },
  },
  {
    word: "kock", translation: "طباخ / شيف", phonetic: "/kɔkː/",
    partOfSpeech: "substantiv", gender: "en", plural: "kockar",
    level: "A1", category: "yrken", imageUrl: IMG.food,
    examples: [
      { sv: "Kocken lagar god mat.", ar: "الطباخ يطبخ طعاماً لذيذاً." },
      { sv: "Jag vill bli kock.", ar: "أريد أن أصبح طباخاً." },
    ],
    synonyms: ["köksmästare", "chef"],
    antonyms: [],
    conjugations: { "obestämd singular": "kock", "bestämd singular": "kocken", "obestämd plural": "kockar", "bestämd plural": "kockarna" },
  },
  {
    word: "affärsman", translation: "رجل أعمال", phonetic: "/aˈfɛːrsˌman/",
    partOfSpeech: "substantiv", gender: "en", plural: "affärsmän",
    level: "B1", category: "yrken", imageUrl: IMG.work,
    examples: [
      { sv: "Han är en framgångsrik affärsman.", ar: "هو رجل أعمال ناجح." },
      { sv: "Affärsmannen reste mycket i jobbet.", ar: "رجل الأعمال سافر كثيراً بسبب العمل." },
    ],
    synonyms: ["företagare", "entreprenör"],
    antonyms: [],
    conjugations: { "obestämd singular": "affärsman", "bestämd singular": "affärsmannen", "obestämd plural": "affärsmän", "bestämd plural": "affärsmännen" },
  },
  {
    word: "arkitekt", translation: "مهندس معماري", phonetic: "/arkɪˈtɛkt/",
    partOfSpeech: "substantiv", gender: "en", plural: "arkitekter",
    level: "B1", category: "yrken", imageUrl: IMG.work,
    examples: [
      { sv: "Arkitekten ritade ett modernt hus.", ar: "المهندس المعماري رسم منزلاً حديثاً." },
      { sv: "Hon arbetar som arkitekt i Stockholm.", ar: "هي تعمل كمهندسة معمارية في ستوكهولم." },
    ],
    synonyms: ["byggnadsingenjör"],
    antonyms: [],
    conjugations: { "obestämd singular": "arkitekt", "bestämd singular": "arkitekten", "obestämd plural": "arkitekter", "bestämd plural": "arkitekterna" },
  },

  // ── KÄNSLOR EXTRA (More Emotions) ─────────────────────────────────
  {
    word: "rädd", translation: "خائف", phonetic: "/rɛdː/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "känslor", imageUrl: IMG.body,
    examples: [
      { sv: "Barnet är rädd för mörkret.", ar: "الطفل خائف من الظلام." },
      { sv: "Är du rädd för spindlar?", ar: "هل أنت خائف من العناكب؟" },
    ],
    synonyms: ["skrämd", "orolig"],
    antonyms: ["modig", "tapper"],
    conjugations: { "positiv": "rädd", "komparativ": "räddare", "superlativ": "räddast" },
  },
  {
    word: "arg", translation: "غاضب", phonetic: "/arɡ/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "känslor", imageUrl: IMG.body,
    examples: [
      { sv: "Han är arg på sin bror.", ar: "هو غاضب من أخيه." },
      { sv: "Varför är du så arg?", ar: "لماذا أنت غاضب هكذا؟" },
    ],
    synonyms: ["ilsken", "upprörd", "irriterad"],
    antonyms: ["lugn", "glad"],
    conjugations: { "positiv": "arg", "komparativ": "argare", "superlativ": "argast" },
  },
  {
    word: "trött", translation: "متعب / تعبان", phonetic: "/trøtː/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "känslor", imageUrl: IMG.body,
    examples: [
      { sv: "Jag är så trött idag.", ar: "أنا متعب جداً اليوم." },
      { sv: "Hon var trött efter jobbet.", ar: "كانت متعبة بعد العمل." },
    ],
    synonyms: ["utmattad", "sliten"],
    antonyms: ["pigg", "energisk"],
    conjugations: { "positiv": "trött", "komparativ": "tröttare", "superlativ": "tröttast" },
  },
  {
    word: "förvånad", translation: "مندهش / مفاجأ", phonetic: "/fœrˈvoːnad/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A2", category: "känslor", imageUrl: IMG.body,
    examples: [
      { sv: "Hon var förvånad över nyheten.", ar: "كانت مندهشة من الخبر." },
      { sv: "Jag är förvånad att du är här.", ar: "أنا مندهش أنك هنا." },
    ],
    synonyms: ["överraskad", "häpen"],
    antonyms: [],
    conjugations: { "positiv": "förvånad", "komparativ": "förvånadare", "superlativ": "förvånadast" },
  },

  // ── RÄKNEORD (Numbers) ────────────────────────────────────────────
  {
    word: "ett", translation: "واحد (١)", phonetic: "/ɛtː/",
    partOfSpeech: "räkneord", gender: null, plural: null,
    level: "A1", category: "räkneord", imageUrl: IMG.numbers,
    examples: [
      { sv: "Jag har ett äpple.", ar: "لدي تفاحة واحدة." },
      { sv: "Det finns ett problem.", ar: "هناك مشكلة واحدة." },
    ],
    synonyms: ["etta"],
    antonyms: [],
    conjugations: {},
  },
  {
    word: "två", translation: "اثنان (٢)", phonetic: "/tvoː/",
    partOfSpeech: "räkneord", gender: null, plural: null,
    level: "A1", category: "räkneord", imageUrl: IMG.numbers,
    examples: [
      { sv: "Jag har två katter.", ar: "لدي قطتان." },
      { sv: "Det tar två timmar.", ar: "يستغرق ساعتين." },
    ],
    synonyms: ["tvåan"],
    antonyms: [],
    conjugations: {},
  },
  {
    word: "tre", translation: "ثلاثة (٣)", phonetic: "/treː/",
    partOfSpeech: "räkneord", gender: null, plural: null,
    level: "A1", category: "räkneord", imageUrl: IMG.numbers,
    examples: [
      { sv: "Vi är tre personer.", ar: "نحن ثلاثة أشخاص." },
      { sv: "Hon har tre systrar.", ar: "لديها ثلاث أخوات." },
    ],
    synonyms: [],
    antonyms: [],
    conjugations: {},
  },
  {
    word: "tio", translation: "عشرة (١٠)", phonetic: "/tiːu/",
    partOfSpeech: "räkneord", gender: null, plural: null,
    level: "A1", category: "räkneord", imageUrl: IMG.numbers,
    examples: [
      { sv: "Det kostar tio kronor.", ar: "يكلف عشرة كرونات." },
      { sv: "Jag väntar i tio minuter.", ar: "أنتظر عشر دقائق." },
    ],
    synonyms: ["tian"],
    antonyms: [],
    conjugations: {},
  },
  {
    word: "hundra", translation: "مئة (١٠٠)", phonetic: "/ˈhɵnːdra/",
    partOfSpeech: "räkneord", gender: null, plural: null,
    level: "A1", category: "räkneord", imageUrl: IMG.numbers,
    examples: [
      { sv: "Det kostar hundra kronor.", ar: "يكلف مئة كرونة." },
      { sv: "Det var hundra personer på mötet.", ar: "كان هناك مئة شخص في الاجتماع." },
    ],
    synonyms: [],
    antonyms: [],
    conjugations: {},
  },

  // ── SPORT ─────────────────────────────────────────────────────────
  {
    word: "fotboll", translation: "كرة القدم", phonetic: "/ˈfuːtˌbɔlː/",
    partOfSpeech: "substantiv", gender: "en", plural: "fotbollar",
    level: "A1", category: "sport", imageUrl: IMG.sports,
    examples: [
      { sv: "Jag spelar fotboll på helgerna.", ar: "ألعب كرة القدم في عطلة نهاية الأسبوع." },
      { sv: "Fotboll är världens populäraste sport.", ar: "كرة القدم هي أشهر رياضة في العالم." },
    ],
    synonyms: ["soccer"],
    antonyms: [],
    conjugations: { "obestämd singular": "fotboll", "bestämd singular": "fotbollen", "obestämd plural": "fotbollar", "bestämd plural": "fotbollarna" },
  },
  {
    word: "simma", translation: "يسبح", phonetic: "/ˈsɪmːa/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "sport", imageUrl: IMG.sports,
    examples: [
      { sv: "Jag simmar varje morgon.", ar: "أسبح كل صباح." },
      { sv: "Kan du simma?", ar: "هل تستطيع السباحة؟" },
    ],
    synonyms: ["bada"],
    antonyms: [],
    conjugations: { "infinitiv": "simma", "presens": "simmar", "preteritum": "simmade", "supinum": "simmat", "imperativ": "simma" },
  },
  {
    word: "löpning", translation: "الجري / العدو", phonetic: "/ˈløːpnɪŋ/",
    partOfSpeech: "substantiv", gender: "en", plural: "löpningar",
    level: "A2", category: "sport", imageUrl: IMG.sports,
    examples: [
      { sv: "Löpning är bra för hälsan.", ar: "الجري مفيد للصحة." },
      { sv: "Hon tränar löpning tre gånger i veckan.", ar: "هي تتدرب على الجري ثلاث مرات في الأسبوع." },
    ],
    synonyms: ["jogging", "spring"],
    antonyms: [],
    conjugations: { "obestämd singular": "löpning", "bestämd singular": "löpningen", "obestämd plural": "löpningar", "bestämd plural": "löpningarna" },
  },
  {
    word: "cykel", translation: "دراجة هوائية", phonetic: "/ˈsʏːkəl/",
    partOfSpeech: "substantiv", gender: "en", plural: "cyklar",
    level: "A1", category: "sport", imageUrl: IMG.sports,
    examples: [
      { sv: "Jag åker cykel till skolan.", ar: "أركب الدراجة إلى المدرسة." },
      { sv: "Sverige är ett bra land för cykling.", ar: "السويد بلد رائع لركوب الدراجات." },
    ],
    synonyms: ["tvåhjuling"],
    antonyms: [],
    conjugations: { "obestämd singular": "cykel", "bestämd singular": "cykeln", "obestämd plural": "cyklar", "bestämd plural": "cyklarna" },
  },
  {
    word: "träna", translation: "يتدرب / يمارس الرياضة", phonetic: "/ˈtrɛːna/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "sport", imageUrl: IMG.sports,
    examples: [
      { sv: "Jag tränar på gymmet.", ar: "أتدرب في النادي الرياضي." },
      { sv: "Det är viktigt att träna regelbundet.", ar: "من المهم ممارسة الرياضة بانتظام." },
    ],
    synonyms: ["motionera", "öva"],
    antonyms: ["vila", "slöa"],
    conjugations: { "infinitiv": "träna", "presens": "tränar", "preteritum": "tränade", "supinum": "tränat", "imperativ": "träna" },
  },

  // ── TEKNIK (Technology) ───────────────────────────────────────────
  {
    word: "dator", translation: "حاسوب / كمبيوتر", phonetic: "/ˈdɑːtur/",
    partOfSpeech: "substantiv", gender: "en", plural: "datorer",
    level: "A1", category: "teknik", imageUrl: IMG.tech,
    examples: [
      { sv: "Jag arbetar på datorn hela dagen.", ar: "أعمل على الحاسوب طوال اليوم." },
      { sv: "Datorn är trasig.", ar: "الحاسوب معطّل." },
    ],
    synonyms: ["PC", "laptop"],
    antonyms: [],
    conjugations: { "obestämd singular": "dator", "bestämd singular": "datorn", "obestämd plural": "datorer", "bestämd plural": "datorerna" },
  },
  {
    word: "telefon", translation: "هاتف", phonetic: "/tɛlɛˈfoːn/",
    partOfSpeech: "substantiv", gender: "en", plural: "telefoner",
    level: "A1", category: "teknik", imageUrl: IMG.tech,
    examples: [
      { sv: "Kan jag låna din telefon?", ar: "هل يمكنني استعارة هاتفك؟" },
      { sv: "Min telefon är slut på batteri.", ar: "هاتفي نفدت بطاريته." },
    ],
    synonyms: ["mobiltelefon", "mobil", "smartphone"],
    antonyms: [],
    conjugations: { "obestämd singular": "telefon", "bestämd singular": "telefonen", "obestämd plural": "telefoner", "bestämd plural": "telefonerna" },
  },
  {
    word: "internet", translation: "الإنترنت", phonetic: "/ˈɪntərˌnɛt/",
    partOfSpeech: "substantiv", gender: "ett", plural: null,
    level: "A1", category: "teknik", imageUrl: IMG.tech,
    examples: [
      { sv: "Jag surfar på internet.", ar: "أتصفح الإنترنت." },
      { sv: "Har du tillgång till internet?", ar: "هل لديك وصول إلى الإنترنت؟" },
    ],
    synonyms: ["nätet", "webben"],
    antonyms: [],
    conjugations: { "obestämd singular": "internet", "bestämd singular": "internetet" },
  },
  {
    word: "app", translation: "تطبيق", phonetic: "/apː/",
    partOfSpeech: "substantiv", gender: "en", plural: "appar",
    level: "A2", category: "teknik", imageUrl: IMG.tech,
    examples: [
      { sv: "Ladda ner appen gratis.", ar: "حمّل التطبيق مجاناً." },
      { sv: "Den här appen hjälper dig att lära dig svenska.", ar: "هذا التطبيق يساعدك على تعلم السويدية." },
    ],
    synonyms: ["applikation", "program"],
    antonyms: [],
    conjugations: { "obestämd singular": "app", "bestämd singular": "appen", "obestämd plural": "appar", "bestämd plural": "apparna" },
  },
  {
    word: "lösenord", translation: "كلمة المرور", phonetic: "/ˈløːsənˌuːrd/",
    partOfSpeech: "substantiv", gender: "ett", plural: "lösenord",
    level: "A2", category: "teknik", imageUrl: IMG.tech,
    examples: [
      { sv: "Glöm inte ditt lösenord.", ar: "لا تنسَ كلمة مرورك." },
      { sv: "Lösenordet måste vara minst åtta tecken.", ar: "كلمة المرور يجب أن تكون على الأقل ثمانية أحرف." },
    ],
    synonyms: ["kod", "PIN"],
    antonyms: [],
    conjugations: { "obestämd singular": "lösenord", "bestämd singular": "lösenordet", "obestämd plural": "lösenord", "bestämd plural": "lösenorden" },
  },

  // ── DJUR (Animals) ────────────────────────────────────────────────
  {
    word: "hund", translation: "كلب", phonetic: "/hɵnːd/",
    partOfSpeech: "substantiv", gender: "en", plural: "hundar",
    level: "A1", category: "djur", imageUrl: IMG.animals,
    examples: [
      { sv: "Jag har en hund som heter Max.", ar: "لدي كلب اسمه ماكس." },
      { sv: "Hunden springer i parken.", ar: "الكلب يجري في الحديقة." },
    ],
    synonyms: ["vovve", "sällskapsdjur"],
    antonyms: ["katt"],
    conjugations: { "obestämd singular": "hund", "bestämd singular": "hunden", "obestämd plural": "hundar", "bestämd plural": "hundarna" },
  },
  {
    word: "katt", translation: "قطة", phonetic: "/katː/",
    partOfSpeech: "substantiv", gender: "en", plural: "katter",
    level: "A1", category: "djur", imageUrl: IMG.animals,
    examples: [
      { sv: "Katten sover på soffan.", ar: "القطة تنام على الأريكة." },
      { sv: "Vi har två katter hemma.", ar: "لدينا قطتان في المنزل." },
    ],
    synonyms: ["misse", "pus"],
    antonyms: ["hund"],
    conjugations: { "obestämd singular": "katt", "bestämd singular": "katten", "obestämd plural": "katter", "bestämd plural": "katterna" },
  },
  {
    word: "fågel", translation: "طائر", phonetic: "/ˈfoːɡəl/",
    partOfSpeech: "substantiv", gender: "en", plural: "fåglar",
    level: "A1", category: "djur", imageUrl: IMG.nature,
    examples: [
      { sv: "Fåglarna sjunger på morgonen.", ar: "الطيور تغني في الصباح." },
      { sv: "Jag såg en stor fågel i skogen.", ar: "رأيت طائراً كبيراً في الغابة." },
    ],
    synonyms: ["fågeldjur"],
    antonyms: [],
    conjugations: { "obestämd singular": "fågel", "bestämd singular": "fågeln", "obestämd plural": "fåglar", "bestämd plural": "fåglarna" },
  },
  {
    word: "häst", translation: "حصان", phonetic: "/hɛstː/",
    partOfSpeech: "substantiv", gender: "en", plural: "hästar",
    level: "A1", category: "djur", imageUrl: IMG.animals,
    examples: [
      { sv: "Hon rider häst varje helg.", ar: "هي تركب الحصان كل عطلة نهاية أسبوع." },
      { sv: "Hästen är ett vackert djur.", ar: "الحصان حيوان جميل." },
    ],
    synonyms: ["springare"],
    antonyms: [],
    conjugations: { "obestämd singular": "häst", "bestämd singular": "hästen", "obestämd plural": "hästar", "bestämd plural": "hästarna" },
  },
  {
    word: "björn", translation: "دب", phonetic: "/bjøːrn/",
    partOfSpeech: "substantiv", gender: "en", plural: "björnar",
    level: "A2", category: "djur", imageUrl: IMG.nature,
    examples: [
      { sv: "Det finns björnar i svenska skogar.", ar: "هناك دببة في الغابات السويدية." },
      { sv: "Björnen är Sveriges nationalsymbol.", ar: "الدب هو رمز السويد الوطني." },
    ],
    synonyms: ["björndjur"],
    antonyms: [],
    conjugations: { "obestämd singular": "björn", "bestämd singular": "björnen", "obestämd plural": "björnar", "bestämd plural": "björnarna" },
  },

  // ── MÖBLER (Furniture) ────────────────────────────────────────────
  {
    word: "stol", translation: "كرسي", phonetic: "/stuːl/",
    partOfSpeech: "substantiv", gender: "en", plural: "stolar",
    level: "A1", category: "möbler", imageUrl: IMG.furniture,
    examples: [
      { sv: "Sätt dig på stolen.", ar: "اجلس على الكرسي." },
      { sv: "Vi behöver fler stolar.", ar: "نحتاج إلى مزيد من الكراسي." },
    ],
    synonyms: ["sittplats", "fåtölj"],
    antonyms: [],
    conjugations: { "obestämd singular": "stol", "bestämd singular": "stolen", "obestämd plural": "stolar", "bestämd plural": "stolarna" },
  },
  {
    word: "bord", translation: "طاولة", phonetic: "/buːrd/",
    partOfSpeech: "substantiv", gender: "ett", plural: "bord",
    level: "A1", category: "möbler", imageUrl: IMG.furniture,
    examples: [
      { sv: "Sätt maten på bordet.", ar: "ضع الطعام على الطاولة." },
      { sv: "Vi behöver ett nytt bord till köket.", ar: "نحتاج إلى طاولة جديدة للمطبخ." },
    ],
    synonyms: ["skrivbord", "matbord"],
    antonyms: [],
    conjugations: { "obestämd singular": "bord", "bestämd singular": "bordet", "obestämd plural": "bord", "bestämd plural": "borden" },
  },
  {
    word: "soffa", translation: "أريكة", phonetic: "/ˈsɔfːa/",
    partOfSpeech: "substantiv", gender: "en", plural: "soffor",
    level: "A1", category: "möbler", imageUrl: IMG.furniture,
    examples: [
      { sv: "Jag sitter i soffan och ser på TV.", ar: "أجلس على الأريكة وأشاهد التلفاز." },
      { sv: "Vi köpte en ny soffa till vardagsrummet.", ar: "اشترينا أريكة جديدة لغرفة المعيشة." },
    ],
    synonyms: ["divé", "canapé"],
    antonyms: [],
    conjugations: { "obestämd singular": "soffa", "bestämd singular": "soffan", "obestämd plural": "soffor", "bestämd plural": "sofforna" },
  },
  {
    word: "säng", translation: "سرير", phonetic: "/sɛŋː/",
    partOfSpeech: "substantiv", gender: "en", plural: "sängar",
    level: "A1", category: "möbler", imageUrl: IMG.home,
    examples: [
      { sv: "Jag sover i en bekväm säng.", ar: "أنام في سرير مريح." },
      { sv: "Bädda sängen varje morgon.", ar: "ارتِّب سريرك كل صباح." },
    ],
    synonyms: ["bädd", "liggplats"],
    antonyms: [],
    conjugations: { "obestämd singular": "säng", "bestämd singular": "sängen", "obestämd plural": "sängar", "bestämd plural": "sängarna" },
  },
  {
    word: "hylla", translation: "رف", phonetic: "/ˈhʏlːa/",
    partOfSpeech: "substantiv", gender: "en", plural: "hyllor",
    level: "A2", category: "möbler", imageUrl: IMG.home,
    examples: [
      { sv: "Böckerna står på hyllan.", ar: "الكتب على الرف." },
      { sv: "Vi satte upp en ny hylla i köket.", ar: "وضعنا رفاً جديداً في المطبخ." },
    ],
    synonyms: ["bokhylla", "väggbord"],
    antonyms: [],
    conjugations: { "obestämd singular": "hylla", "bestämd singular": "hyllan", "obestämd plural": "hyllor", "bestämd plural": "hyllorna" },
  },

  // ── MAT EXTRA (More Food) ─────────────────────────────────────────
  {
    word: "äpple", translation: "تفاحة", phonetic: "/ˈɛpːlə/",
    partOfSpeech: "substantiv", gender: "ett", plural: "äpplen",
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Jag äter ett äpple varje dag.", ar: "آكل تفاحة كل يوم." },
      { sv: "Äpplen är nyttiga.", ar: "التفاح صحي." },
    ],
    synonyms: ["frukt"],
    antonyms: [],
    conjugations: { "obestämd singular": "äpple", "bestämd singular": "äpplet", "obestämd plural": "äpplen", "bestämd plural": "äpplena" },
  },
  {
    word: "mjölk", translation: "حليب", phonetic: "/mjølkː/",
    partOfSpeech: "substantiv", gender: "en", plural: null,
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Jag dricker ett glas mjölk varje kväll.", ar: "أشرب كوباً من الحليب كل مساء." },
      { sv: "Mjölk är bra för benen.", ar: "الحليب مفيد للعظام." },
    ],
    synonyms: ["komjölk"],
    antonyms: [],
    conjugations: { "obestämd singular": "mjölk", "bestämd singular": "mjölken" },
  },
  {
    word: "ost", translation: "جبن", phonetic: "/uːst/",
    partOfSpeech: "substantiv", gender: "en", plural: "ostar",
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Jag gillar ost på mackan.", ar: "أحب الجبن على الخبز." },
      { sv: "Sverige har många sorters ost.", ar: "السويد لديها أنواع كثيرة من الجبن." },
    ],
    synonyms: ["mjukost", "hårdost"],
    antonyms: [],
    conjugations: { "obestämd singular": "ost", "bestämd singular": "osten", "obestämd plural": "ostar", "bestämd plural": "ostarna" },
  },
  {
    word: "kyckling", translation: "دجاجة / دجاج", phonetic: "/ˈɕʏklɪŋ/",
    partOfSpeech: "substantiv", gender: "en", plural: "kycklingar",
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Vi åt stekt kyckling till middag.", ar: "أكلنا دجاجاً مقلياً على العشاء." },
      { sv: "Kyckling är ett populärt kött i Sverige.", ar: "الدجاج لحم شائع في السويد." },
    ],
    synonyms: ["höna"],
    antonyms: [],
    conjugations: { "obestämd singular": "kyckling", "bestämd singular": "kycklingen", "obestämd plural": "kycklingar", "bestämd plural": "kycklingarna" },
  },
  {
    word: "soppa", translation: "حساء / شوربة", phonetic: "/ˈsɔpːa/",
    partOfSpeech: "substantiv", gender: "en", plural: "soppor",
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "På torsdagar äter vi ärtsoppa.", ar: "أيام الخميس نأكل حساء البازلاء." },
      { sv: "Soppan är varm och god.", ar: "الشوربة دافئة ولذيذة." },
    ],
    synonyms: ["buljong", "potage"],
    antonyms: [],
    conjugations: { "obestämd singular": "soppa", "bestämd singular": "soppan", "obestämd plural": "soppor", "bestämd plural": "sopporna" },
  },
  {
    word: "grönsak", translation: "خضروات", phonetic: "/ˈɡrøːnˌsɑːk/",
    partOfSpeech: "substantiv", gender: "en", plural: "grönsaker",
    level: "A1", category: "mat", imageUrl: IMG.food,
    examples: [
      { sv: "Ät dina grönsaker!", ar: "كُل خضرواتك!" },
      { sv: "Färska grönsaker är nyttiga.", ar: "الخضروات الطازجة صحية." },
    ],
    synonyms: ["grönt", "råkost"],
    antonyms: [],
    conjugations: { "obestämd singular": "grönsak", "bestämd singular": "grönsaken", "obestämd plural": "grönsaker", "bestämd plural": "grönsakerna" },
  },

  // ── HÖGTIDER (Holidays/Traditions) ────────────────────────────────
  {
    word: "jul", translation: "عيد الميلاد / الكريسماس", phonetic: "/juːl/",
    partOfSpeech: "substantiv", gender: "en", plural: "jular",
    level: "A1", category: "högtider", imageUrl: IMG.holidays,
    examples: [
      { sv: "God jul och gott nytt år!", ar: "عيد ميلاد سعيد وسنة جديدة سعيدة!" },
      { sv: "Vi firar jul med familjen.", ar: "نحتفل بعيد الميلاد مع العائلة." },
    ],
    synonyms: ["julen", "julfirande"],
    antonyms: [],
    conjugations: { "obestämd singular": "jul", "bestämd singular": "julen", "obestämd plural": "jular", "bestämd plural": "jularna" },
  },
  {
    word: "påsk", translation: "عيد الفصح / الباسخا", phonetic: "/pɔskː/",
    partOfSpeech: "substantiv", gender: "en", plural: "påskar",
    level: "A2", category: "högtider", imageUrl: IMG.holidays,
    examples: [
      { sv: "Vi äter påskägg på påsk.", ar: "نأكل بيض الفصح في عيد الفصح." },
      { sv: "Påsk firas på våren.", ar: "عيد الفصح يُحتفل به في الربيع." },
    ],
    synonyms: ["påskfirande"],
    antonyms: [],
    conjugations: { "obestämd singular": "påsk", "bestämd singular": "påsken", "obestämd plural": "påskar", "bestämd plural": "påskarna" },
  },
  {
    word: "nyår", translation: "رأس السنة / السنة الجديدة", phonetic: "/ˈnyːˌoːr/",
    partOfSpeech: "substantiv", gender: "ett", plural: "nyår",
    level: "A1", category: "högtider", imageUrl: IMG.holidays,
    examples: [
      { sv: "Gott nytt år!", ar: "سنة جديدة سعيدة!" },
      { sv: "Vi ser fyrverkerier på nyår.", ar: "نشاهد الألعاب النارية في رأس السنة." },
    ],
    synonyms: ["nyårsfirande", "nyårsafton"],
    antonyms: [],
    conjugations: { "obestämd singular": "nyår", "bestämd singular": "nyåret", "obestämd plural": "nyår", "bestämd plural": "nyåren" },
  },
  {
    word: "valborg", translation: "عيد فالبورغ (أول مايو)", phonetic: "/ˈvalbɔrj/",
    partOfSpeech: "substantiv", gender: "en", plural: null,
    level: "B1", category: "högtider", imageUrl: IMG.holidays,
    examples: [
      { sv: "Valborg firas den 30 april.", ar: "يُحتفل بعيد فالبورغ في الثلاثين من أبريل." },
      { sv: "Vi tänder brasor på valborg.", ar: "نضرم النيران في احتفالية فالبورغ." },
    ],
    synonyms: ["valborgsafton", "walpurgisnatten"],
    antonyms: [],
    conjugations: { "obestämd singular": "valborg", "bestämd singular": "valborgen" },
  },
  {
    word: "semester", translation: "إجازة / عطلة", phonetic: "/sɛˈmɛstər/",
    partOfSpeech: "substantiv", gender: "en", plural: "semestrar",
    level: "A2", category: "högtider", imageUrl: IMG.culture,
    examples: [
      { sv: "Vi åker på semester i juli.", ar: "نسافر في إجازة في يوليو." },
      { sv: "Semestern varade i tre veckor.", ar: "الإجازة استمرت ثلاثة أسابيع." },
    ],
    synonyms: ["ledighet", "lov", "ferie"],
    antonyms: ["arbete", "jobb"],
    conjugations: { "obestämd singular": "semester", "bestämd singular": "semestern", "obestämd plural": "semestrar", "bestämd plural": "semestrarna" },
  },

  // ── EXTRA FAMILJ/KROPP/HEM ────────────────────────────────────────
  {
    word: "morfar", translation: "جد من جهة الأم", phonetic: "/ˈmuːrˌfɑːr/",
    partOfSpeech: "substantiv", gender: "en", plural: "morfäder",
    level: "A1", category: "familj", imageUrl: IMG.family,
    examples: [
      { sv: "Min morfar är åttio år gammal.", ar: "جدي من جهة أمي عمره ثمانون عاماً." },
      { sv: "Morfar berättar historier.", ar: "الجد يحكي القصص." },
    ],
    synonyms: ["morfader"],
    antonyms: ["mormor"],
    conjugations: { "obestämd singular": "morfar", "bestämd singular": "morfadern", "obestämd plural": "morfäder", "bestämd plural": "morfäderna" },
  },
  {
    word: "mormor", translation: "جدة من جهة الأم", phonetic: "/ˈmuːrˌmuːr/",
    partOfSpeech: "substantiv", gender: "en", plural: "mormödrar",
    level: "A1", category: "familj", imageUrl: IMG.family,
    examples: [
      { sv: "Mormor bakar kakor.", ar: "الجدة تخبز الكعك." },
      { sv: "Vi besöker mormor på söndagar.", ar: "نزور الجدة أيام الأحد." },
    ],
    synonyms: ["mormorsa"],
    antonyms: ["morfar"],
    conjugations: { "obestämd singular": "mormor", "bestämd singular": "mormodern", "obestämd plural": "mormödrar", "bestämd plural": "mormödrarna" },
  },
  {
    word: "öga", translation: "عين", phonetic: "/ˈøːɡa/",
    partOfSpeech: "substantiv", gender: "ett", plural: "ögon",
    level: "A1", category: "kropp", imageUrl: IMG.body,
    examples: [
      { sv: "Hon har blå ögon.", ar: "لديها عيون زرقاء." },
      { sv: "Jag har ont i ögat.", ar: "عندي ألم في العين." },
    ],
    synonyms: ["blick"],
    antonyms: [],
    conjugations: { "obestämd singular": "öga", "bestämd singular": "ögat", "obestämd plural": "ögon", "bestämd plural": "ögonen" },
  },
  {
    word: "mun", translation: "فم", phonetic: "/mɵːn/",
    partOfSpeech: "substantiv", gender: "en", plural: "munnar",
    level: "A1", category: "kropp", imageUrl: IMG.body,
    examples: [
      { sv: "Öppna munnen.", ar: "افتح فمك." },
      { sv: "Han har en stor mun.", ar: "لديه فم كبير." },
    ],
    synonyms: ["käft"],
    antonyms: [],
    conjugations: { "obestämd singular": "mun", "bestämd singular": "munnen", "obestämd plural": "munnar", "bestämd plural": "munnarna" },
  },
  {
    word: "fot", translation: "قدم", phonetic: "/fuːt/",
    partOfSpeech: "substantiv", gender: "en", plural: "fötter",
    level: "A1", category: "kropp", imageUrl: IMG.body,
    examples: [
      { sv: "Jag har ont i foten.", ar: "عندي ألم في قدمي." },
      { sv: "Han gick barfota.", ar: "مشى حافي القدمين." },
    ],
    synonyms: [],
    antonyms: [],
    conjugations: { "obestämd singular": "fot", "bestämd singular": "foten", "obestämd plural": "fötter", "bestämd plural": "fötterna" },
  },
  {
    word: "kök", translation: "مطبخ", phonetic: "/ɕøːk/",
    partOfSpeech: "substantiv", gender: "ett", plural: "kök",
    level: "A1", category: "hem", imageUrl: IMG.home,
    examples: [
      { sv: "Vi lagar mat i köket.", ar: "نطبخ في المطبخ." },
      { sv: "Köket är stort och ljust.", ar: "المطبخ كبير ومضيء." },
    ],
    synonyms: [],
    antonyms: [],
    conjugations: { "obestämd singular": "kök", "bestämd singular": "köket", "obestämd plural": "kök", "bestämd plural": "köken" },
  },
  {
    word: "badrum", translation: "حمام", phonetic: "/ˈbɑːdˌrɵːm/",
    partOfSpeech: "substantiv", gender: "ett", plural: "badrum",
    level: "A1", category: "hem", imageUrl: IMG.home,
    examples: [
      { sv: "Badrummet är på andra våningen.", ar: "الحمام في الطابق الثاني." },
      { sv: "Jag duschar i badrummet.", ar: "أستحم في الحمام." },
    ],
    synonyms: ["toalett", "WC"],
    antonyms: [],
    conjugations: { "obestämd singular": "badrum", "bestämd singular": "badrummet", "obestämd plural": "badrum", "bestämd plural": "badrummen" },
  },
  {
    word: "snabb", translation: "سريع", phonetic: "/snabː/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A2", category: "nyckelverb", imageUrl: IMG.time,
    examples: [
      { sv: "Tåget är snabbt.", ar: "القطار سريع." },
      { sv: "Hon är en snabb löpare.", ar: "هي عداءة سريعة." },
    ],
    synonyms: ["hastig", "kvick"],
    antonyms: ["långsam"],
    conjugations: { "positiv": "snabb", "komparativ": "snabbare", "superlativ": "snabbast" },
  },
  {
    word: "stor", translation: "كبير", phonetic: "/stuːr/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "nyckelverb", imageUrl: IMG.city,
    examples: [
      { sv: "Stockholm är en stor stad.", ar: "ستوكهولم مدينة كبيرة." },
      { sv: "Han har ett stort hus.", ar: "لديه بيت كبير." },
    ],
    synonyms: ["enorm", "gigantisk"],
    antonyms: ["liten", "litet"],
    conjugations: { "positiv": "stor", "komparativ": "större", "superlativ": "störst" },
  },
  {
    word: "liten", translation: "صغير", phonetic: "/ˈliːtən/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "nyckelverb", imageUrl: IMG.home,
    examples: [
      { sv: "Jag bor i en liten lägenhet.", ar: "أسكن في شقة صغيرة." },
      { sv: "Barnet är litet.", ar: "الطفل صغير." },
    ],
    synonyms: ["pytteliten", "minimal"],
    antonyms: ["stor", "stor"],
    conjugations: { "positiv": "liten", "komparativ": "mindre", "superlativ": "minst" },
  },
  {
    word: "vacker", translation: "جميل", phonetic: "/ˈvakːər/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "nyckelverb", imageUrl: IMG.nature,
    examples: [
      { sv: "Vilket vackert landskap!", ar: "يا له من منظر جميل!" },
      { sv: "Hon är väldigt vacker.", ar: "هي جميلة جداً." },
    ],
    synonyms: ["snygg", "fin", "stilig"],
    antonyms: ["ful"],
    conjugations: { "positiv": "vacker", "komparativ": "vackrare", "superlativ": "vackrast" },
  },
  {
    word: "gammal", translation: "قديم / كبير في السن", phonetic: "/ˈɡamːal/",
    partOfSpeech: "adjektiv", gender: null, plural: null,
    level: "A1", category: "nyckelverb", imageUrl: IMG.time,
    examples: [
      { sv: "Det är ett gammalt hus.", ar: "هذا بيت قديم." },
      { sv: "Min farfar är gammal.", ar: "جدي كبير في السن." },
    ],
    synonyms: ["åldrig", "antik"],
    antonyms: ["ung", "ny"],
    conjugations: { "positiv": "gammal", "komparativ": "äldre", "superlativ": "äldst" },
  },
  {
    word: "köpa", translation: "يشتري", phonetic: "/ˈɕøːpa/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "handel", imageUrl: IMG.shopping,
    examples: [
      { sv: "Jag vill köpa en ny telefon.", ar: "أريد شراء هاتف جديد." },
      { sv: "Var köpte du den?", ar: "من أين اشتريت هذا؟" },
    ],
    synonyms: ["inhandla", "skaffa"],
    antonyms: ["sälja"],
    conjugations: { "infinitiv": "köpa", "presens": "köper", "preteritum": "köpte", "supinum": "köpt", "imperativ": "köp" },
  },
  {
    word: "sälja", translation: "يبيع", phonetic: "/ˈsɛlja/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A2", category: "handel", imageUrl: IMG.shopping,
    examples: [
      { sv: "Jag säljer min gamla cykel.", ar: "أبيع دراجتي القديمة." },
      { sv: "De säljer svenska produkter.", ar: "يبيعون منتجات سويدية." },
    ],
    synonyms: ["avyttra", "handla"],
    antonyms: ["köpa"],
    conjugations: { "infinitiv": "sälja", "presens": "säljer", "preteritum": "sålde", "supinum": "sålt", "imperativ": "sälj" },
  },
  {
    word: "pris", translation: "سعر", phonetic: "/priːs/",
    partOfSpeech: "substantiv", gender: "ett", plural: "priser",
    level: "A1", category: "handel", imageUrl: IMG.shopping,
    examples: [
      { sv: "Vad är priset?", ar: "ما هو السعر؟" },
      { sv: "Priset är högt i Sverige.", ar: "الأسعار مرتفعة في السويد." },
    ],
    synonyms: ["kostnad", "avgift"],
    antonyms: [],
    conjugations: { "obestämd singular": "pris", "bestämd singular": "priset", "obestämd plural": "priser", "bestämd plural": "priserna" },
  },
  {
    word: "vår", translation: "ربيع", phonetic: "/voːr/",
    partOfSpeech: "substantiv", gender: "en", plural: "vårar",
    level: "A1", category: "natur", imageUrl: IMG.nature,
    examples: [
      { sv: "På våren blommar blommorna.", ar: "في الربيع تتفتح الزهور." },
      { sv: "Vår är min favoritårstid.", ar: "الربيع هو فصلي المفضل." },
    ],
    synonyms: ["vårens"],
    antonyms: ["höst"],
    conjugations: { "obestämd singular": "vår", "bestämd singular": "våren", "obestämd plural": "vårar", "bestämd plural": "vårarna" },
  },
  {
    word: "höst", translation: "خريف", phonetic: "/høstː/",
    partOfSpeech: "substantiv", gender: "en", plural: "höstar",
    level: "A1", category: "natur", imageUrl: IMG.nature,
    examples: [
      { sv: "På hösten faller löven.", ar: "في الخريف تتساقط الأوراق." },
      { sv: "Hösten i Sverige är vacker.", ar: "الخريف في السويد جميل." },
    ],
    synonyms: ["hösttid"],
    antonyms: ["vår"],
    conjugations: { "obestämd singular": "höst", "bestämd singular": "hösten", "obestämd plural": "höstar", "bestämd plural": "höstarna" },
  },
  {
    word: "snö", translation: "ثلج", phonetic: "/snøː/",
    partOfSpeech: "substantiv", gender: "en", plural: "snöar",
    level: "A1", category: "natur", imageUrl: IMG.weather,
    examples: [
      { sv: "Det faller snö utanför.", ar: "الثلج يتساقط في الخارج." },
      { sv: "Barnen leker i snön.", ar: "الأطفال يلعبون في الثلج." },
    ],
    synonyms: ["snöfall", "nysnö"],
    antonyms: [],
    conjugations: { "obestämd singular": "snö", "bestämd singular": "snön", "obestämd plural": "snöar", "bestämd plural": "snöarna" },
  },
  {
    word: "regn", translation: "مطر", phonetic: "/rɛŋːn/",
    partOfSpeech: "substantiv", gender: "ett", plural: "regn",
    level: "A1", category: "natur", imageUrl: IMG.weather,
    examples: [
      { sv: "Det är regn ute idag.", ar: "هناك مطر في الخارج اليوم." },
      { sv: "Jag gillar regnet.", ar: "أحب المطر." },
    ],
    synonyms: ["regnväder", "duggregn"],
    antonyms: ["sol", "solsken"],
    conjugations: { "obestämd singular": "regn", "bestämd singular": "regnet", "obestämd plural": "regn", "bestämd plural": "regnen" },
  },
  {
    word: "sol", translation: "شمس", phonetic: "/suːl/",
    partOfSpeech: "substantiv", gender: "en", plural: "solar",
    level: "A1", category: "natur", imageUrl: IMG.nature,
    examples: [
      { sv: "Solen skiner idag.", ar: "الشمس مشرقة اليوم." },
      { sv: "Jag älskar när solen är framme.", ar: "أحب عندما تخرج الشمس." },
    ],
    synonyms: ["solsken"],
    antonyms: ["regn", "moln"],
    conjugations: { "obestämd singular": "sol", "bestämd singular": "solen", "obestämd plural": "solar", "bestämd plural": "solarna" },
  },
  {
    word: "läsa", translation: "يقرأ", phonetic: "/ˈlɛːsa/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "skola", imageUrl: IMG.school,
    examples: [
      { sv: "Jag läser en bok.", ar: "أنا أقرأ كتاباً." },
      { sv: "Kan du läsa det för mig?", ar: "هل يمكنك قراءة هذا لي؟" },
    ],
    synonyms: ["plugga", "studera"],
    antonyms: ["skriva"],
    conjugations: { "infinitiv": "läsa", "presens": "läser", "preteritum": "läste", "supinum": "läst", "imperativ": "läs" },
  },
  {
    word: "skriva", translation: "يكتب", phonetic: "/ˈskriːva/",
    partOfSpeech: "verb", gender: null, plural: null,
    level: "A1", category: "skola", imageUrl: IMG.school,
    examples: [
      { sv: "Jag skriver ett brev.", ar: "أنا أكتب رسالة." },
      { sv: "Skriv ditt namn här.", ar: "اكتب اسمك هنا." },
    ],
    synonyms: ["anteckna", "formulera"],
    antonyms: ["läsa"],
    conjugations: { "infinitiv": "skriva", "presens": "skriver", "preteritum": "skrev", "supinum": "skrivit", "imperativ": "skriv" },
  },
  {
    word: "penna", translation: "قلم", phonetic: "/ˈpɛnːa/",
    partOfSpeech: "substantiv", gender: "en", plural: "pennor",
    level: "A1", category: "skola", imageUrl: IMG.school,
    examples: [
      { sv: "Har du en penna jag kan låna?", ar: "هل لديك قلم يمكنني استعارته؟" },
      { sv: "Skriv med pennan.", ar: "اكتب بالقلم." },
    ],
    synonyms: ["kulspetspenna", "blyertspenna"],
    antonyms: [],
    conjugations: { "obestämd singular": "penna", "bestämd singular": "pennan", "obestämd plural": "pennor", "bestämd plural": "pennorna" },
  },
  {
    word: "månad", translation: "شهر", phonetic: "/ˈmoːnad/",
    partOfSpeech: "substantiv", gender: "en", plural: "månader",
    level: "A1", category: "tid", imageUrl: IMG.time,
    examples: [
      { sv: "Det finns tolv månader på ett år.", ar: "في السنة اثنا عشر شهراً." },
      { sv: "Vi ses om en månad.", ar: "نتقابل بعد شهر." },
    ],
    synonyms: [],
    antonyms: [],
    conjugations: { "obestämd singular": "månad", "bestämd singular": "månaden", "obestämd plural": "månader", "bestämd plural": "månaderna" },
  },
  {
    word: "år", translation: "سنة / عام", phonetic: "/oːr/",
    partOfSpeech: "substantiv", gender: "ett", plural: "år",
    level: "A1", category: "tid", imageUrl: IMG.time,
    examples: [
      { sv: "Jag har bott i Sverige i tre år.", ar: "أنا أسكن في السويد منذ ثلاث سنوات." },
      { sv: "Hur gammalt är du i år?", ar: "كم عمرك هذا العام؟" },
    ],
    synonyms: ["årstal"],
    antonyms: [],
    conjugations: { "obestämd singular": "år", "bestämd singular": "året", "obestämd plural": "år", "bestämd plural": "åren" },
  },
  {
    word: "morgon", translation: "صباح", phonetic: "/ˈmɔrɡɔn/",
    partOfSpeech: "substantiv", gender: "en", plural: "morgnar",
    level: "A1", category: "tid", imageUrl: IMG.time,
    examples: [
      { sv: "God morgon!", ar: "صباح الخير!" },
      { sv: "Jag vaknar tidigt på morgonen.", ar: "أستيقظ مبكراً في الصباح." },
    ],
    synonyms: ["förmiddag"],
    antonyms: ["kväll", "natt"],
    conjugations: { "obestämd singular": "morgon", "bestämd singular": "morgonen", "obestämd plural": "morgnar", "bestämd plural": "morgnarna" },
  },
  {
    word: "kväll", translation: "مساء", phonetic: "/kvɛlː/",
    partOfSpeech: "substantiv", gender: "en", plural: "kvällar",
    level: "A1", category: "tid", imageUrl: IMG.time,
    examples: [
      { sv: "God kväll!", ar: "مساء الخير!" },
      { sv: "Vi äter middag på kvällen.", ar: "نأكل العشاء في المساء." },
    ],
    synonyms: ["afton"],
    antonyms: ["morgon"],
    conjugations: { "obestämd singular": "kväll", "bestämd singular": "kvällen", "obestämd plural": "kvällar", "bestämd plural": "kvällarna" },
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
