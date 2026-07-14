import { db, lessonsTable, lessonSectionsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

// ─── Real image URLs by topic ───────────────────────────────────────────────
const IMG = {
  alphabet: "https://cdn.innovativelanguage.com/sns/em/blog/19/13_number/infographic/Swedish_numbers.png",
  alphabetReal: "https://s3.us-west-2.amazonaws.com/cdn.classful.com/wp-content/uploads/2023/09/650f60dc778a5467283561695506651272-1.jpg",
  writing: "https://i0.wp.com/farm6.staticflickr.com/5834/23288970370_c8faaa7bda_k.jpg?resize=2048,1536&ssl=1",
  listening: "https://i0.wp.com/cms.babbel.news/wp-content/uploads/2018/02/SwedishPodcastHeader.png?resize=640,360",
  speaking: "https://www.tripsavvy.com/thmb/DVttYFkCp1z2QyOTNE4vmoauL4A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-683747793-b05182cacdd94fd793240cd4d6b4f9de.jpg",
  grammar: "https://m.media-amazon.com/images/I/51m4JyZpxdL.jpg",
  exam: "https://static.vecteezy.com/system/resources/thumbnails/046/599/964/small/female-student-hands-testing-in-exercise-and-taking-fill-in-exam-paper-sheet-with-pencil-at-school-test-photo.jpg",
  family: "https://media.gettyimages.com/id/1300189216/photo/happy-family-eating-breakfast-seen-through-doorway-of-kitchen-at-home.jpg?s=612x612&w=0&k=20&c=tpaZ_wI_lBB7q4LN-GkHcQhkVleWUSO4qfb8_IxLeyE=",
  shopping: "https://thumbs.dreamstime.com/b/bright-interior-swedish-supermarket-food-products-discount-signs-shopping-carts-aisle-bright-interior-swedish-390370221.jpg",
  stockholm: "https://i0.wp.com/atravelingfairy.com/wp-content/uploads/2022/11/DSC04547.jpg?w=1100&ssl=1",
  nature: "https://images.pexels.com/photos/33077333/pexels-photo-33077333/free-photo-of-serene-swedish-forest-view-with-reflective-lake.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  midsommar: "https://media.gettyimages.com/id/471593267/photo/swedish-midsummer-celebration.jpg?s=612x612&w=0&k=20&c=w6gGn813BegVGMlmicCT4P7G3XEsf4b0b21cgCw4hwc=",
  workplace: "https://media.gettyimages.com/id/2198968434/photo/students-using-laptop-and-smartphone-in-malmo-sweden.jpg?s=612x612&w=0&k=20&c=CabGwvl3Hs5Mx7_rk0o7weZFg5t4KeAIzeUBNWIUED8=",
  newspaper: "https://media.gettyimages.com/id/505985703/photo/man-sitting-in-a-chair-on-the-porch-reading-todays-newspaper.jpg?s=612x612&w=0&k=20&c=tuj1RPsQDlZpBUcnRm8ztgXbFP7YIA7YQtypkyDIZPA=",
  flag: "https://static.vecteezy.com/system/resources/thumbnails/078/323/135/small/flatlay-of-sweden-flag-with-map-and-compass-showcasing-swedish-culture-and-travel-themes-free-photo.jpg",
  food: "https://media.gettyimages.com/id/2215023550/photo/traditional-swedish-meatballs-with-mashed-potatoes-pickles-and-cranberry-sauce.jpg?s=612x612&w=0&k=20&c=ZrzruuV67aiz_Eb-Howv1tBi1jw3yp-IvVGYl1MNzn0=",
  student: "https://media.gettyimages.com/id/1667940273/photo/portrait-of-smiling-female-student-with-friend-in-university.jpg?s=612x612&w=0&k=20&c=ePwPB-IfQ5SEUEQQMiN6LVIDDK6wTsAjHVH0b9Yy_5A=",
  travel: "https://i.pinimg.com/originals/a3/29/57/a32957a7d0b9a7a08fedb93314f8f49c--sweden-tourism-sweden-travel.jpg",
  doctor: "https://media.gettyimages.com/id/731741979/photo/doctor-walking-through-hospital-corridor.jpg?s=612x612&w=0&k=20&c=94a50kc59V322iYjCtqtAM2f6GmIW7T_hiDezvf5TsE=",
  cafe: "https://urbanpixxels.com/wp-content/uploads/2015/08/Swedish-Cafe-London-Bageriet.jpg",
  numbers: "https://cdn.innovativelanguage.com/sns/em/blog/19/13_number/thumbnail/numbers_swedish.jpg",
  culture: "https://adventures.com/media/209331/raising-of-a-midsummer-pole-duringa-a-traditional-celebration-of-swedish-midsummer-in-the-small-town-of-skara.jpg?anchor=center&mode=crop&width=970&height=645&rnd=132893020920000000&format=jpg&quality=80",
  podcast: "https://preview.redd.it/hpzzalkolxb41.jpg?width=640&crop=smart&auto=webp&s=70772b103e9fd9f86eb25976fed1c79974ec5fd6",
  library: "https://media.gettyimages.com/id/1278673078/photo/empty-table-and-chair-against-window-at-new-workplace.jpg?s=612x612&w=0&k=20&c=ktE2JWrBuWhe6vmk18E1QsnswMPllZ0s3v96a5ivPlo=",
};

type SectionType = "intro" | "vocabulary" | "grammar" | "reading" | "listening" | "exercise" | "quiz";

interface Section {
  orderIndex: number;
  sectionType: SectionType;
  titleAr: string;
  content: Record<string, unknown>;
}

interface LessonData {
  title: string;
  titleSv: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  level: string;
  skill: string;
  durationMinutes: number;
  isLocked: boolean;
  completionPercentage: number;
  imageUrl: string;
  sections: Section[];
}

// ═══════════════════════════════════════════════════════════════════════════
// A1 – BEGINNER LESSONS
// ═══════════════════════════════════════════════════════════════════════════

const a1Lessons: LessonData[] = [
  // ── A1 READING ──
  {
    title: "الحروف السويدية – الأبجدية", titleSv: "Svenska alfabetet",
    description: "تعلم الحروف السويدية الـ29 وكيفية نطقها بشكل صحيح",
    category: "الأساسيات", difficulty: "beginner", level: "A1", skill: "reading",
    durationMinutes: 20, isLocked: false, completionPercentage: 0, imageUrl: IMG.alphabetReal,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "اللغة السويدية تستخدم الأبجدية اللاتينية مع إضافة 3 حروف خاصة: Å، Ä، Ö. هذه الحروف تمنح السويدية طابعها الفريد وتُستخدم في كلمات يومية مهمة.",
        imageUrl: IMG.alphabetReal,
        objectives: ["التعرف على الحروف الـ29", "نطق الحروف الخاصة Å Ä Ö", "قراءة كلمات بسيطة"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "الحروف الخاصة", content: {
        imageUrl: IMG.flag,
        words: [
          { sv: "Å å", ar: "صوت بين الألف والواو", phonetic: "aw", example: "Å är en bokstav" },
          { sv: "Ä ä", ar: "صوت الـ'ε' كما في 'آر'", phonetic: "eh", example: "Äpple – تفاحة" },
          { sv: "Ö ö", ar: "صوت بين الألف والميم", phonetic: "uh", example: "Öga – عين" },
          { sv: "A a", ar: "أ – كما في العربية", phonetic: "ah", example: "Apa – قرد" },
          { sv: "E e", ar: "إ – قصيرة", phonetic: "eh", example: "En – أداة التعريف" },
          { sv: "I i", ar: "إي – طويلة", phonetic: "ee", example: "Is – جليد" },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "قراءة الحروف", content: {
        imageUrl: IMG.student,
        passage: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z Å Ä Ö\n\nApa, Björn, Cykel, Dag, Elefant, Fisk, Glas, Hund, Is, Järn, Katt, Lampa, Man, Nu, Orm, Penna, Ros, Sol, Tre, Upp, Vinter, Xylofon, Yngel, Zoo, Åska, Äpple, Ört",
        translation: "قرد، دب، دراجة، يوم، فيل، سمكة، كوب، كلب، جليد، حديد، قطة، مصباح، رجل، الآن، ثعبان، قلم، وردة، شمس، ثلاثة، أعلى، شتاء، زيلوفون، سمكة صغيرة، حديقة حيوان، رعد، تفاحة، عشبة",
        questions: [
          { question: "كم عدد الحروف في الأبجدية السويدية؟", answer: "29 حرفاً" },
          { question: "ما هي الحروف الثلاثة الخاصة بالسويدية؟", answer: "Å Ä Ö" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الحروف", content: {
        questions: [
          { question: "كم عدد الحروف في الأبجدية السويدية؟", options: ["26", "27", "28", "29"], correct: 3 },
          { question: "ما معنى كلمة 'Äpple'؟", options: ["برتقال", "تفاحة", "موزة", "عنب"], correct: 1 },
          { question: "أي حرف يمثل الصوت 'aw'؟", options: ["Ä", "Ö", "Å", "A"], correct: 2 },
          { question: "ما معنى كلمة 'Sol'؟", options: ["قمر", "نجم", "شمس", "سماء"], correct: 2 }
        ]
      }}
    ]
  },
  {
    title: "قراءة كلمات يومية سويدية", titleSv: "Läsa vardagliga ord",
    description: "تدرب على قراءة الكلمات الشائعة في الحياة اليومية السويدية",
    category: "الأساسيات", difficulty: "beginner", level: "A1", skill: "reading",
    durationMinutes: 18, isLocked: false, completionPercentage: 0, imageUrl: IMG.newspaper,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "في هذا الدرس ستتعلم قراءة الكلمات اليومية الأكثر استخداماً في السويد. هذه الكلمات ستراها في المتاجر، الشوارع، والمطاعم.",
        imageUrl: IMG.stockholm,
        objectives: ["قراءة علامات الشوارع", "فهم لافتات المحلات", "قراءة القوائم البسيطة"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "كلمات في الشارع", content: {
        imageUrl: IMG.stockholm,
        words: [
          { sv: "Öppet", ar: "مفتوح", phonetic: "öp-pet", example: "Affären är öppet" },
          { sv: "Stängt", ar: "مغلق", phonetic: "steng-t", example: "Biblioteket är stängt" },
          { sv: "Ingång", ar: "مدخل", phonetic: "in-gong", example: "Ingång till höger" },
          { sv: "Utgång", ar: "مخرج", phonetic: "ut-gong", example: "Nödutgång – مخرج طوارئ" },
          { sv: "Toalett", ar: "مرحاض / دورة مياه", phonetic: "to-a-lett", example: "Var är toaletten?" },
          { sv: "Parkering", ar: "موقف سيارات", phonetic: "par-ke-ring", example: "Parkering förbjuden" },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "نص: في المدينة", content: {
        imageUrl: IMG.stockholm,
        passage: "Stockholm är en stor stad. Det finns många affärer och restauranger. Ingången är till vänster och utgången är till höger. Toaletten är på nedre plan.",
        translation: "ستوكهولم مدينة كبيرة. توجد فيها محلات ومطاعم كثيرة. المدخل على اليسار والمخرج على اليمين. دورة المياه في الطابق السفلي.",
        questions: [
          { question: "أين يقع المدخل؟", answer: "على اليسار" },
          { question: "أين توجد دورة المياه؟", answer: "في الطابق السفلي" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار القراءة", content: {
        questions: [
          { question: "ما معنى 'Öppet'؟", options: ["مغلق", "مفتوح", "مدخل", "مخرج"], correct: 1 },
          { question: "ما معنى 'Utgång'؟", options: ["مدخل", "مرحاض", "مخرج", "موقف"], correct: 2 },
          { question: "ما ترجمة 'Toalett'؟", options: ["مطعم", "متجر", "دورة مياه", "موقف سيارات"], correct: 2 }
        ]
      }}
    ]
  },
  {
    title: "قراءة الأرقام والتواريخ", titleSv: "Siffror och datum",
    description: "قراءة الأرقام من 1 إلى 100 وفهم التواريخ السويدية",
    category: "الأرقام", difficulty: "beginner", level: "A1", skill: "reading",
    durationMinutes: 22, isLocked: false, completionPercentage: 0, imageUrl: IMG.numbers,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "الأرقام ضرورية في الحياة اليومية: للتسوق، معرفة الوقت، وقراءة التواريخ. في هذا الدرس ستتعلم الأرقام السويدية من 1 إلى 100.",
        imageUrl: IMG.numbers,
        objectives: ["قراءة الأرقام 1-20", "فهم العشرات حتى 100", "قراءة تواريخ بسيطة"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "الأرقام الأساسية", content: {
        imageUrl: IMG.numbers,
        words: [
          { sv: "Noll – 0", ar: "صفر", phonetic: "noll", example: "Noll grader – صفر درجة" },
          { sv: "En/Ett – 1", ar: "واحد", phonetic: "en/ett", example: "En katt – قطة واحدة" },
          { sv: "Två – 2", ar: "اثنان", phonetic: "tvoh", example: "Två äpplen – تفاحتان" },
          { sv: "Tre – 3", ar: "ثلاثة", phonetic: "treh", example: "Tre barn – ثلاثة أطفال" },
          { sv: "Fyra – 4", ar: "أربعة", phonetic: "fyra", example: "Fyra rum – أربع غرف" },
          { sv: "Fem – 5", ar: "خمسة", phonetic: "fem", example: "Fem kronor – خمس كرونات" },
          { sv: "Sex – 6", ar: "ستة", phonetic: "sex", example: "Sex dagar – ستة أيام" },
          { sv: "Sju – 7", ar: "سبعة", phonetic: "shoo", example: "Sju veckor – سبعة أسابيع" },
          { sv: "Åtta – 8", ar: "ثمانية", phonetic: "ot-ta", example: "Åtta timmar – ثماني ساعات" },
          { sv: "Nio – 9", ar: "تسعة", phonetic: "nee-o", example: "Nio månader – تسعة أشهر" },
          { sv: "Tio – 10", ar: "عشرة", phonetic: "tee-o", example: "Tio år – عشر سنوات" },
          { sv: "Tjugo – 20", ar: "عشرون", phonetic: "choo-go", example: "Tjugo kronor – عشرون كرونة" },
          { sv: "Hundra – 100", ar: "مئة", phonetic: "hun-dra", example: "Hundra gram – مئة غرام" },
        ]
      }},
      { orderIndex: 2, sectionType: "exercise", titleAr: "تمرين: الأرقام", content: {
        imageUrl: IMG.numbers,
        items: [
          { type: "mcq", question: "ما هو رقم 'Sju'؟", options: ["5", "6", "7", "8"], answer: "7" },
          { type: "mcq", question: "كيف تكتب الرقم 10 بالسويدية؟", options: ["Nio", "Tio", "Elva", "Tolv"], answer: "Tio" },
          { type: "translate", question: "ثلاثة أطفال", answer: "Tre barn" },
          { type: "fill", question: "_____ kronor (خمس كرونات)", answer: "Fem" },
          { type: "mcq", question: "ما معنى 'Hundra'؟", options: ["ألف", "مئة", "عشرة", "مليون"], answer: "مئة" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الأرقام", content: {
        questions: [
          { question: "ما هو رقم 'Åtta'؟", options: ["6", "7", "8", "9"], correct: 2 },
          { question: "كيف تقول '20' بالسويدية؟", options: ["Tio", "Tolv", "Tjugo", "Trettio"], correct: 2 },
          { question: "ما معنى 'Noll'؟", options: ["واحد", "عشرة", "صفر", "مئة"], correct: 2 },
          { question: "كيف تقول '7' بالسويدية؟", options: ["Sex", "Sju", "Åtta", "Nio"], correct: 1 }
        ]
      }}
    ]
  },

  // ── A1 WRITING ──
  {
    title: "كتابة الحروف الأولى", titleSv: "Skriva bokstäver",
    description: "تدرب على كتابة الحروف والكلمات الأولى باللغة السويدية بشكل صحيح",
    category: "الكتابة", difficulty: "beginner", level: "A1", skill: "writing",
    durationMinutes: 25, isLocked: false, completionPercentage: 0, imageUrl: IMG.writing,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "الكتابة الصحيحة تبدأ بمعرفة قواعد الإملاء الأساسية. في السويدية، كل الجمل تبدأ بحرف كبير، والأسماء الخاصة تُكتب بحرف كبير دائماً.",
        imageUrl: IMG.writing,
        objectives: ["كتابة الحروف الكبيرة والصغيرة", "كتابة اسمك بالسويدية", "تكوين جمل قصيرة"]
      }},
      { orderIndex: 1, sectionType: "grammar", titleAr: "قواعد الكتابة الأساسية", content: {
        imageUrl: IMG.writing,
        rule: "في السويدية: الجملة تبدأ بحرف كبير، الأسماء الخاصة بحرف كبير، لكن أسماء الأشهر وأيام الأسبوع تُكتب بحرف صغير!",
        explanation: "على عكس الإنجليزية، أيام الأسبوع والأشهر في السويدية تُكتب بحرف صغير: måndag (الاثنين)، januari (يناير)",
        examples: [
          { sv: "Jag heter Ahmed.", ar: "اسمي أحمد." },
          { sv: "Jag bor i Stockholm.", ar: "أسكن في ستوكهولم." },
          { sv: "Idag är det måndag.", ar: "اليوم هو الاثنين." },
          { sv: "Det är januari.", ar: "إنه يناير." }
        ]
      }},
      { orderIndex: 2, sectionType: "exercise", titleAr: "تمرين الكتابة", content: {
        imageUrl: IMG.student,
        items: [
          { type: "translate", question: "اكتب 'اسمي محمد' بالسويدية", answer: "Jag heter Mohammed." },
          { type: "translate", question: "اكتب 'أسكن في مالمو' بالسويدية", answer: "Jag bor i Malmö." },
          { type: "fill", question: "Jag _____ i Sverige. (أسكن)", answer: "bor" },
          { type: "mcq", question: "أي كلمة مكتوبة بشكل صحيح؟", options: ["Stockholm", "stockholm", "STOCKHOLM", "STOCKholm"], answer: "Stockholm" },
          { type: "translate", question: "اكتب 'يناير' بالسويدية (بدون حرف كبير)", answer: "januari" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الكتابة", content: {
        questions: [
          { question: "كيف تُكتب أيام الأسبوع بالسويدية؟", options: ["بحرف كبير دائماً", "بحرف صغير دائماً", "كما في الإنجليزية", "لا فرق"], correct: 1 },
          { question: "أيهما صحيح؟", options: ["jag Heter Ahmed", "Jag heter Ahmed.", "Jag Heter ahmed.", "jag heter ahmed."], correct: 1 },
          { question: "كيف تكتب 'يناير' بالسويدية؟", options: ["Januari", "januari", "JANUARI", "JaNuArI"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "كتابة التحيات والمقدمات", titleSv: "Skriva hälsningar",
    description: "كيف تكتب رسالة تعريف بسيطة باللغة السويدية",
    category: "الكتابة", difficulty: "beginner", level: "A1", skill: "writing",
    durationMinutes: 20, isLocked: false, completionPercentage: 0, imageUrl: IMG.student,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "كتابة رسالة تعريف بالنفس هي أول خطوة في التواصل الكتابي. ستتعلم كيف تكتب نصاً قصيراً تُعرّف فيه بنفسك.",
        imageUrl: IMG.writing,
        objectives: ["كتابة جملة التعريف بالنفس", "ذكر البلد والمدينة", "الحديث عن الهوايات"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "كلمات المقدمة", content: {
        imageUrl: IMG.student,
        words: [
          { sv: "Heter", ar: "اسمه / اسمي", phonetic: "hee-ter", example: "Jag heter Sara." },
          { sv: "Bor", ar: "يسكن / أسكن", phonetic: "boor", example: "Jag bor i Göteborg." },
          { sv: "Är", ar: "هو / أنا", phonetic: "air", example: "Jag är student." },
          { sv: "Från", ar: "من (مكان)", phonetic: "frohn", example: "Jag är från Syrien." },
          { sv: "Gillar", ar: "يحب / أحب", phonetic: "yil-ar", example: "Jag gillar musik." },
          { sv: "År gammal", ar: "عمره / عمري", phonetic: "or ga-mal", example: "Jag är 25 år gammal." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "نص: تعريف بالنفس", content: {
        imageUrl: IMG.student,
        passage: "Hej! Jag heter Layla. Jag är 22 år gammal. Jag är från Egypten men jag bor i Stockholm. Jag är student. Jag gillar musik och böcker. Det är roligt att lära sig svenska!",
        translation: "مرحباً! اسمي ليلى. عمري 22 سنة. أنا من مصر لكنني أسكن في ستوكهولم. أنا طالبة. أحب الموسيقى والكتب. من الممتع تعلم السويدية!",
        questions: [
          { question: "من أين ليلى أصلاً؟", answer: "من مصر" },
          { question: "ما الذي تحبه ليلى؟", answer: "الموسيقى والكتب" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الكتابة", content: {
        questions: [
          { question: "كيف تقول 'أسكن في' بالسويدية؟", options: ["Jag heter", "Jag bor i", "Jag är från", "Jag gillar"], correct: 1 },
          { question: "ما معنى 'Jag gillar musik'؟", options: ["أنا أدرس الموسيقى", "أنا أحب الموسيقى", "أنا أكره الموسيقى", "أنا أعزف الموسيقى"], correct: 1 },
          { question: "كيف تقول 'عمري 25 سنة'؟", options: ["Jag är 25 år gammal.", "Jag heter 25.", "Jag bor 25 år.", "Jag gillar 25."], correct: 0 }
        ]
      }}
    ]
  },
  {
    title: "كتابة قوائم وملاحظات يومية", titleSv: "Listor och anteckningar",
    description: "تعلم كتابة قوائم التسوق والملاحظات اليومية بالسويدية",
    category: "الكتابة", difficulty: "beginner", level: "A1", skill: "writing",
    durationMinutes: 15, isLocked: false, completionPercentage: 0, imageUrl: IMG.shopping,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "الكتابة اليومية مثل قوائم التسوق والملاحظات تساعدك على تطبيق ما تعلمته في الحياة الحقيقية.",
        imageUrl: IMG.shopping,
        objectives: ["كتابة قائمة تسوق", "كتابة ملاحظة بسيطة", "استخدام الكلمات المفيدة"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مفردات التسوق", content: {
        imageUrl: IMG.shopping,
        words: [
          { sv: "Mjölk", ar: "حليب", phonetic: "myolk", example: "En liter mjölk" },
          { sv: "Bröd", ar: "خبز", phonetic: "bruhd", example: "Ett paket bröd" },
          { sv: "Ägg", ar: "بيض", phonetic: "egg", example: "Tio ägg" },
          { sv: "Smör", ar: "زبدة", phonetic: "smur", example: "Smör till mackan" },
          { sv: "Kaffe", ar: "قهوة", phonetic: "kaf-eh", example: "Starkt kaffe" },
          { sv: "Te", ar: "شاي", phonetic: "teh", example: "Grönt te" },
          { sv: "Socker", ar: "سكر", phonetic: "sok-ker", example: "Lite socker" },
          { sv: "Salt", ar: "ملح", phonetic: "salt", example: "Salt och peppar" },
        ]
      }},
      { orderIndex: 2, sectionType: "exercise", titleAr: "تمرين: اكتب القائمة", content: {
        imageUrl: IMG.shopping,
        items: [
          { type: "translate", question: "اكتب 'حليب' بالسويدية", answer: "Mjölk" },
          { type: "translate", question: "اكتب 'عشر بيضات' بالسويدية", answer: "Tio ägg" },
          { type: "mcq", question: "ما معنى 'Bröd'؟", options: ["حليب", "خبز", "زبدة", "سكر"], answer: "خبز" },
          { type: "fill", question: "En liter _____ (حليب بالسويدية)", answer: "mjölk" },
          { type: "translate", question: "اكتب 'قهوة قوية' بالسويدية", answer: "Starkt kaffe" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار المفردات", content: {
        questions: [
          { question: "ما معنى 'Mjölk'؟", options: ["ماء", "عصير", "حليب", "قهوة"], correct: 2 },
          { question: "كيف تقول 'خبز' بالسويدية؟", options: ["Smör", "Kaffe", "Bröd", "Ägg"], correct: 2 },
          { question: "ما معنى 'Socker'؟", options: ["ملح", "سكر", "فلفل", "خل"], correct: 1 },
          { question: "كيف تقول 'بيض'؟", options: ["Te", "Mjölk", "Bröd", "Ägg"], correct: 3 }
        ]
      }}
    ]
  },

  // ── A1 LISTENING ──
  {
    title: "أصوات السويدية – النطق الأساسي", titleSv: "Uttal och ljud",
    description: "تعرف على الأصوات الفريدة في اللغة السويدية وكيف تنطقها",
    category: "الأساسيات", difficulty: "beginner", level: "A1", skill: "listening",
    durationMinutes: 20, isLocked: false, completionPercentage: 0, imageUrl: IMG.listening,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "للغة السويدية أصوات خاصة لا توجد في العربية. أهمها: النبر الموسيقي (Pitch Accent) حيث يتغير معنى الكلمة بحسب النبرة، والحرف 'sj' الذي ينطق مثل الهاء الخفيفة.",
        imageUrl: IMG.listening,
        objectives: ["فهم نظام النبر الموسيقي", "نطق الأصوات الصعبة", "التمييز بين الأصوات المتشابهة"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "الأصوات الصعبة", content: {
        imageUrl: IMG.podcast,
        words: [
          { sv: "Sju – 7", ar: "سبعة (الـsj تنطق كـ'ش' خفيفة)", phonetic: "shoo", example: "Sju dagar i veckan" },
          { sv: "Kött", ar: "لحم (الـkj تنطق كـ'ش')", phonetic: "chutt", example: "Kött och fisk" },
          { sv: "Stjärna", ar: "نجمة (تنطق 'شيَرنا')", phonetic: "shair-na", example: "En vacker stjärna" },
          { sv: "Kung", ar: "ملك (الـg في النهاية صامتة)", phonetic: "kung", example: "Kung Carl" },
          { sv: "Hög", ar: "عالٍ / ارتفاع", phonetic: "huhg", example: "Ett högt hus" },
          { sv: "Ljus", ar: "ضوء / شمعة (الـlj تنطق 'ي')", phonetic: "yoos", example: "Ljuset är starkt" },
        ]
      }},
      { orderIndex: 2, sectionType: "listening", titleAr: "تمييز الأصوات", content: {
        imageUrl: IMG.listening,
        transcript: "Lyssna noga! Huset – البيت | Hästen – الحصان | Maten – الطعام | Anden – البطة أو الروح\n\nالنبر الموسيقي مهم جداً:\n- 'anden' مع نبرة واحدة = البطة\n- 'anden' مع نبرتين = الروح",
        questions: [
          { question: "لماذا النبر الموسيقي مهم في السويدية؟", answer: "لأن نفس الكلمة يمكن أن تعني شيئين مختلفين بحسب النبرة" },
          { question: "كيف ينطق حرف 'lj'؟", answer: "ينطق مثل الياء 'ي'" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الاستماع", content: {
        questions: [
          { question: "كيف ينطق 'Sju'؟", options: ["سجو", "شو", "سجو", "جو"], correct: 1 },
          { question: "ما معنى 'Ljus'؟", options: ["لجوس", "ضوء/شمعة", "صوت", "لون"], correct: 1 },
          { question: "ما معنى النبر الموسيقي في السويدية؟", options: ["لا معنى له", "يغير معنى الكلمة", "يجعل الكلمة أطول", "يجعل الكلمة أقصر"], correct: 1 },
          { question: "كيف ينطق 'Kött'؟", options: ["كوت", "شيت", "كيت", "جوت"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "استماع: التحيات والمحادثة اليومية", titleSv: "Lyssna – hälsningar",
    description: "تدرب على سماع وفهم التحيات والعبارات اليومية الأكثر شيوعاً",
    category: "التحيات", difficulty: "beginner", level: "A1", skill: "listening",
    durationMinutes: 18, isLocked: false, completionPercentage: 0, imageUrl: IMG.speaking,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "التحيات هي أول ما ستسمعه وتحتاج لفهمه في السويد. السويديون يستخدمون 'Hej' بكثرة وهي أكثر شيوعاً من 'God dag' الرسمية.",
        imageUrl: IMG.speaking,
        objectives: ["فهم التحيات الأساسية", "التمييز بين الرسمي وغير الرسمي", "فهم أسئلة الحال"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "التحيات الشائعة", content: {
        imageUrl: IMG.speaking,
        words: [
          { sv: "Hej!", ar: "مرحباً! (غير رسمي)", phonetic: "hay", example: "Hej! Hur mår du?" },
          { sv: "God dag!", ar: "صباح الخير / مساء الخير (رسمي)", phonetic: "good dahg", example: "God dag, herr Johansson." },
          { sv: "God morgon!", ar: "صباح الخير", phonetic: "good mo-ron", example: "God morgon! Sov du bra?" },
          { sv: "God kväll!", ar: "مساء الخير", phonetic: "good kvell", example: "God kväll allihopa!" },
          { sv: "Hej då!", ar: "وداعاً", phonetic: "hay doh", example: "Hej då! Vi ses!" },
          { sv: "Hur mår du?", ar: "كيف حالك؟", phonetic: "hoor mor doo", example: "Hur mår du idag?" },
          { sv: "Bra, tack!", ar: "بخير، شكراً!", phonetic: "bra tak", example: "Jag mår bra, tack!" },
          { sv: "Och du?", ar: "وأنت؟", phonetic: "ok doo", example: "Bra, tack! Och du?" },
        ]
      }},
      { orderIndex: 2, sectionType: "listening", titleAr: "حوار: اللقاء الأول", content: {
        imageUrl: IMG.speaking,
        transcript: "Emma: Hej! Jag heter Emma. Vad heter du?\nAhmed: Hej Emma! Jag heter Ahmed. Roligt att träffas!\nEmma: Roligt att träffas! Hur mår du?\nAhmed: Jag mår bra, tack! Och du?\nEmma: Jag mår också bra, tack. Varifrån kommer du?\nAhmed: Jag kommer från Syrien. Och du?\nEmma: Jag är svensk, jag är från Stockholm.",
        questions: [
          { question: "من أين جاء أحمد؟", answer: "من سوريا" },
          { question: "من أين إيما؟", answer: "من ستوكهولم، إنها سويدية" },
          { question: "ما معنى 'Roligt att träffas'؟", answer: "يسعدني لقاؤك" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الاستماع", content: {
        questions: [
          { question: "ما معنى 'Hej då'؟", options: ["مرحباً", "وداعاً", "كيف حالك", "شكراً"], correct: 1 },
          { question: "كيف تجيب على 'Hur mår du'؟", options: ["Hej!", "God morgon!", "Bra, tack!", "Hej då!"], correct: 2 },
          { question: "أي تحية رسمية؟", options: ["Hej!", "Hallå!", "God dag!", "Tjena!"], correct: 2 },
          { question: "ما معنى 'Och du'؟", options: ["أنا أيضاً", "وأنت؟", "شكراً", "مع السلامة"], correct: 1 }
        ]
      }}
    ]
  },

  // ── A1 SPEAKING ──
  {
    title: "مرحباً! التحيات والتعريف بالنفس", titleSv: "Hej och presentera sig",
    description: "تعلم كيف تقدم نفسك وتبدأ محادثة بسيطة بالسويدية",
    category: "التحيات", difficulty: "beginner", level: "A1", skill: "speaking",
    durationMinutes: 25, isLocked: false, completionPercentage: 0, imageUrl: IMG.speaking,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "المحادثة هي هدفنا الأساسي! في هذا الدرس ستتعلم كيف تبدأ محادثة حقيقية: تُعرّف بنفسك، تسأل عن الآخرين، وتتبادل المعلومات الأساسية.",
        imageUrl: IMG.speaking,
        objectives: ["تقديم النفس بطلاقة", "السؤال عن الآخرين", "المحادثة لمدة دقيقتين"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "عبارات المحادثة", content: {
        imageUrl: IMG.speaking,
        words: [
          { sv: "Vad heter du?", ar: "ما اسمك؟", phonetic: "va hee-ter doo", example: "Hej! Vad heter du?" },
          { sv: "Hur gammal är du?", ar: "كم عمرك؟", phonetic: "hoor ga-mal air doo", example: "Hur gammal är du? Jag är 25." },
          { sv: "Varifrån kommer du?", ar: "من أين أنت؟", phonetic: "va-ri-frohn ko-mer doo", example: "Varifrån kommer du?" },
          { sv: "Vad jobbar du med?", ar: "ما عملك؟", phonetic: "va yo-bar doo med", example: "Vad jobbar du med?" },
          { sv: "Talar du engelska?", ar: "هل تتكلم الإنجليزية؟", phonetic: "tah-lar doo eng-els-ka", example: "Talar du engelska eller arabiska?" },
          { sv: "Lite svenska!", ar: "قليلاً من السويدية!", phonetic: "lee-te sven-ska", example: "Jag talar lite svenska." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "حوار: تعارف", content: {
        imageUrl: IMG.speaking,
        passage: "Omar: Hej! Jag heter Omar. Vad heter du?\nLisa: Hej Omar! Jag heter Lisa. Kul att träffas!\nOmar: Kul att träffas! Varifrån kommer du, Lisa?\nLisa: Jag är från Göteborg. Och du, Omar?\nOmar: Jag är från Irak, men jag bor i Malmö nu. Hur gammal är du?\nLisa: Jag är tjugotre år. Och du?\nOmar: Jag är tjugo år gammal. Vad jobbar du med?\nLisa: Jag är student. Jag studerar medicin. Och du?\nOmar: Jag jobbar på ett café.",
        translation: "عمر: مرحباً! اسمي عمر. ما اسمك؟\nليزا: مرحباً عمر! اسمي ليزا. يسعدني لقاؤك!\nعمر: يسعدني لقاؤك! من أين أنت يا ليزا؟\nليزا: أنا من غوتنبرغ. وأنت يا عمر؟\nعمر: أنا من العراق لكنني أسكن في مالمو الآن. كم عمرك؟\nليزا: عمري 23 سنة. وأنت؟\nعمر: عمري 20 سنة. ماذا تعملين؟\nليزا: أنا طالبة. أدرس الطب. وأنت؟\nعمر: أعمل في مقهى.",
        questions: [
          { question: "أين يعيش عمر الآن؟", answer: "في مالمو" },
          { question: "ماذا تدرس ليزا؟", answer: "الطب" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار المحادثة", content: {
        questions: [
          { question: "كيف تسأل عن اسم شخص؟", options: ["Hur mår du?", "Vad heter du?", "Varifrån kommer du?", "Hur gammal är du?"], correct: 1 },
          { question: "كيف تقول 'أنا من مصر'؟", options: ["Jag heter Egypten.", "Jag bor Egypten.", "Jag kommer från Egypten.", "Jag är Egypten."], correct: 2 },
          { question: "ما معنى 'Kul att träffas'؟", options: ["وداعاً", "يسعدني لقاؤك", "كيف حالك؟", "من أين أنت؟"], correct: 1 },
          { question: "كيف تقول 'أنا طالب'؟", options: ["Jag jobbar.", "Jag studerar.", "Jag är student.", "Jag bor i skolan."], correct: 2 }
        ]
      }}
    ]
  },
  {
    title: "في المطعم – طلب الطعام", titleSv: "På restaurangen",
    description: "كيف تطلب الطعام والشراب في مطعم سويدي بثقة",
    category: "الطعام", difficulty: "beginner", level: "A1", skill: "speaking",
    durationMinutes: 22, isLocked: false, completionPercentage: 0, imageUrl: IMG.food,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "الذهاب إلى المطعم من أكثر المواقف شيوعاً في الحياة اليومية. ستتعلم كيف تطلب، تسأل عن القائمة، وتدفع الحساب بالسويدية.",
        imageUrl: IMG.food,
        objectives: ["طلب الطعام والشراب", "السؤال عن الأسعار", "دفع الحساب"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مفردات المطعم", content: {
        imageUrl: IMG.cafe,
        words: [
          { sv: "Kan jag få...", ar: "هل يمكنني الحصول على...", phonetic: "kan yag foh", example: "Kan jag få menyn, tack?" },
          { sv: "Vad rekommenderar du?", ar: "ماذا توصي؟", phonetic: "va re-ko-men-de-rar doo", example: "Vad rekommenderar du idag?" },
          { sv: "Notan, tack!", ar: "الحساب من فضلك!", phonetic: "no-tan tak", example: "Ursäkta, notan tack!" },
          { sv: "Köttbullar", ar: "كرات اللحم (الطبق الوطني)", phonetic: "chutt-bul-ar", example: "Köttbullar med potatis" },
          { sv: "Vatten", ar: "ماء", phonetic: "va-ten", example: "Ett glas vatten, tack." },
          { sv: "Smaklig måltid!", ar: "بالهناء والشفاء!", phonetic: "smak-lig mohl-tid", example: "Smaklig måltid!" },
          { sv: "Allergisk mot", ar: "يعاني من حساسية تجاه", phonetic: "a-ler-yisk mot", example: "Jag är allergisk mot nötter." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "حوار: في المطعم", content: {
        imageUrl: IMG.cafe,
        passage: "Kypare: God kväll! Vad får det lov att vara?\nGäst: God kväll! Kan jag få menyn, tack?\nKypare: Självklart! Här är menyn. Vad vill du ha?\nGäst: Jag tar köttbullar med potatismos, tack. Och ett glas vatten.\nKypare: Utmärkt! Önskar du dessert?\nGäst: Nej tack. Bara notan, tack.\nKypare: Det blir 185 kronor. Smaklig måltid!",
        translation: "النادل: مساء الخير! بماذا أخدمك؟\nالضيف: مساء الخير! هل يمكنني الحصول على القائمة؟\nالنادل: بالتأكيد! هنا القائمة. ماذا تريد؟\nالضيف: سآخذ كرات اللحم مع البطاطا المهروسة. وكوب ماء.\nالنادل: ممتاز! هل تريد حلوى؟\nالضيف: لا شكراً. فقط الحساب.\nالنادل: المبلغ 185 كرونة. بالهناء!",
        questions: [
          { question: "ما الطعام الذي طلبه الضيف؟", answer: "كرات اللحم مع البطاطا المهروسة" },
          { question: "كم تكلف الوجبة؟", answer: "185 كرونة" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار المطعم", content: {
        questions: [
          { question: "كيف تطلب القائمة؟", options: ["Notan tack!", "Kan jag få menyn?", "Smaklig måltid!", "Vatten tack!"], correct: 1 },
          { question: "ما معنى 'Notan, tack'؟", options: ["القائمة من فضلك", "الحساب من فضلك", "الماء من فضلك", "المزيد من فضلك"], correct: 1 },
          { question: "ما هو 'Köttbullar'؟", options: ["سمك", "دجاج", "كرات اللحم", "سلطة"], correct: 2 },
          { question: "ما معنى 'Smaklig måltid'؟", options: ["وصلت الفاتورة", "بالهناء والشفاء", "هل تريد المزيد؟", "شكراً لك"], correct: 1 }
        ]
      }}
    ]
  },

  // ── A1 GRAMMAR ──
  {
    title: "فعل att vara – أنا، أنتَ، هو", titleSv: "Att vara – grundläggande",
    description: "تعلم الفعل الأكثر استخداماً في السويدية وكيف يتصرف في الجمل البسيطة",
    category: "القواعد", difficulty: "beginner", level: "A1", skill: "grammar",
    durationMinutes: 25, isLocked: false, completionPercentage: 0, imageUrl: IMG.grammar,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "فعل 'att vara' يعني 'يكون / كان'. وهو أهم فعل في السويدية لأنك تستخدمه في كل جملة تقريباً. الجيد أن السويدية لا تصرّف الأفعال حسب الضمائر - كلهم يأخذون نفس الصيغة!",
        imageUrl: IMG.grammar,
        objectives: ["حفظ تصريف 'är'", "بناء جمل وصفية", "فهم الاستخدامات المختلفة"]
      }},
      { orderIndex: 1, sectionType: "grammar", titleAr: "تصريف الفعل att vara", content: {
        imageUrl: IMG.student,
        rule: "في الزمن الحاضر: جميع الضمائر تأخذ 'är' – لا يتغير الفعل!",
        explanation: "على عكس العربية والفرنسية، في السويدية لا يتغير شكل الفعل حسب الضمير. سواء قلت أنا أو أنتَ أو هو، الفعل يبقى 'är'.",
        examples: [
          { sv: "Jag är student.", ar: "أنا طالب." },
          { sv: "Du är snäll.", ar: "أنت طيب." },
          { sv: "Han är lärare.", ar: "هو معلم." },
          { sv: "Hon är läkare.", ar: "هي طبيبة." },
          { sv: "Vi är vänner.", ar: "نحن أصدقاء." },
          { sv: "De är svenska.", ar: "هم سويديون." },
          { sv: "Det är kallt.", ar: "الجو بارد." },
        ]
      }},
      { orderIndex: 2, sectionType: "exercise", titleAr: "تمرين: فعل är", content: {
        imageUrl: IMG.grammar,
        items: [
          { type: "fill", question: "Jag _____ glad. (سعيد)", answer: "är" },
          { type: "fill", question: "Hon _____ läkare.", answer: "är" },
          { type: "translate", question: "نحن سويديون", answer: "Vi är svenska." },
          { type: "mcq", question: "أي جملة صحيحة؟", options: ["Jag suis étudiant.", "Jag är student.", "Jag am student.", "Jag be student."], answer: "Jag är student." },
          { type: "translate", question: "هو معلم", answer: "Han är lärare." },
          { type: "fill", question: "Du _____ hungrig. (جائع)", answer: "är" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار فعل att vara", content: {
        questions: [
          { question: "ما صيغة فعل 'vara' في الحاضر؟", options: ["var", "är", "vara", "vore"], correct: 1 },
          { question: "كيف تقول 'هي طبيبة'؟", options: ["Han är läkare.", "Hon är läkare.", "De är läkare.", "Jag är läkare."], correct: 1 },
          { question: "أي جملة صحيحة؟", options: ["Vi är glad.", "Vi ärs glada.", "Vi är glada.", "Vi äre glada."], correct: 2 },
          { question: "ما معنى 'Det är kallt'؟", options: ["أنا بارد", "الجو بارد", "هو بارد", "الطعام بارد"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "أداتا التعريف – en و ett", titleSv: "Artiklar – en och ett",
    description: "فهم نظام الأجناس في السويدية: المذكر والمحايد وكيف تختار الأداة الصحيحة",
    category: "القواعد", difficulty: "beginner", level: "A1", skill: "grammar",
    durationMinutes: 28, isLocked: false, completionPercentage: 0, imageUrl: IMG.library,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "في السويدية، كل اسم له جنس: إما 'utrum' (مشترك) ويأخذ 'en'، أو 'neutrum' (محايد) ويأخذ 'ett'. ثلثا الأسماء تأخذ 'en' والثلث الباقي يأخذ 'ett'. للأسف لا توجد قاعدة ثابتة - يجب الحفظ!",
        imageUrl: IMG.library,
        objectives: ["فهم أجناس الأسماء", "استخدام en و ett صحيحاً", "بناء جمل بسيطة بالأسماء"]
      }},
      { orderIndex: 1, sectionType: "grammar", titleAr: "en و ett", content: {
        imageUrl: IMG.grammar,
        rule: "en = للجنس المشترك (utrum) - حوالي 75% من الكلمات\nett = للجنس المحايد (neutrum) - حوالي 25% من الكلمات",
        explanation: "التعريف في السويدية يُضاف في نهاية الكلمة كلاحقة، وليس قبلها كما في العربية!\n- كلمة 'en': en katt (قطة) → katten (القطة)\n- كلمة 'ett': ett hus (بيت) → huset (البيت)",
        examples: [
          { sv: "en katt → katten", ar: "قطة → القطة" },
          { sv: "en hund → hunden", ar: "كلب → الكلب" },
          { sv: "en bok → boken", ar: "كتاب → الكتاب" },
          { sv: "ett hus → huset", ar: "بيت → البيت" },
          { sv: "ett barn → barnet", ar: "طفل → الطفل" },
          { sv: "ett äpple → äpplet", ar: "تفاحة → التفاحة" },
        ]
      }},
      { orderIndex: 2, sectionType: "exercise", titleAr: "تمرين: en أم ett؟", content: {
        imageUrl: IMG.library,
        items: [
          { type: "mcq", question: "_____ stol (كرسي)", options: ["en", "ett"], answer: "en" },
          { type: "mcq", question: "_____ bord (طاولة)", options: ["en", "ett"], answer: "ett" },
          { type: "mcq", question: "_____ bil (سيارة)", options: ["en", "ett"], answer: "en" },
          { type: "fill", question: "_____ äpple → äpplet", answer: "ett" },
          { type: "fill", question: "_____ bok → boken", answer: "en" },
          { type: "translate", question: "الكتاب (مع أداة التعريف اللاحقة)", answer: "boken" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار en و ett", content: {
        questions: [
          { question: "كلمة 'hus' (بيت) تأخذ:", options: ["en", "ett", "de", "det"], correct: 1 },
          { question: "كيف تقول 'القطة' بالسويدية؟", options: ["en katt", "ett katt", "katten", "kattes"], correct: 2 },
          { question: "كلمة 'barn' (طفل) معرّفة تصبح:", options: ["barnen", "barne", "barnet", "barnett"], correct: 2 },
          { question: "ما نسبة الكلمات التي تأخذ 'en'؟", options: ["25%", "50%", "75%", "100%"], correct: 2 }
        ]
      }}
    ]
  },
  {
    title: "الضمائر الشخصية والأفعال الأساسية", titleSv: "Personliga pronomen och verb",
    description: "تعلم الضمائر السويدية وكيف تبني جملاً صحيحة",
    category: "القواعد", difficulty: "beginner", level: "A1", skill: "grammar",
    durationMinutes: 30, isLocked: false, completionPercentage: 0, imageUrl: IMG.grammar,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "الضمائر الشخصية هي حجر الأساس للجملة السويدية. السويدية تستخدم ضمير المفرد لكل الضمائر في الفعل - الأمر الذي يجعل التصريف سهلاً جداً!",
        imageUrl: IMG.student,
        objectives: ["حفظ جميع الضمائر الشخصية", "تصريف الأفعال الشائعة", "بناء جمل مفيدة"]
      }},
      { orderIndex: 1, sectionType: "grammar", titleAr: "الضمائر الشخصية", content: {
        imageUrl: IMG.grammar,
        rule: "الضمائر: Jag (أنا), Du (أنت), Han (هو), Hon (هي), Vi (نحن), Ni (أنتم), De (هم), Det/Den (هذا/هذه)",
        explanation: "ميزة رائعة: في السويدية جميع الأفعال تأخذ نفس الصيغة مع كل الضمائر في المضارع! أضف '-r' لجذر الفعل في المضارع.",
        examples: [
          { sv: "Jag talar svenska.", ar: "أنا أتكلم السويدية." },
          { sv: "Du talar arabiska.", ar: "أنت تتكلم العربية." },
          { sv: "Han/Hon talar engelska.", ar: "هو/هي يتكلم الإنجليزية." },
          { sv: "Vi talar lite finska.", ar: "نحن نتكلم قليلاً من الفنلندية." },
          { sv: "De talar tyska.", ar: "هم يتكلمون الألمانية." },
        ]
      }},
      { orderIndex: 2, sectionType: "exercise", titleAr: "تمرين: الضمائر والأفعال", content: {
        imageUrl: IMG.grammar,
        items: [
          { type: "mcq", question: "ما ضمير 'هي' بالسويدية؟", options: ["Han", "Hon", "Den", "Det"], answer: "Hon" },
          { type: "fill", question: "_____ talar arabiska. (أنا)", answer: "Jag" },
          { type: "fill", question: "Vi _____ svenska. (نتكلم)", answer: "talar" },
          { type: "translate", question: "هم يتكلمون الإنجليزية", answer: "De talar engelska." },
          { type: "mcq", question: "ما ضمير 'أنتم'؟", options: ["De", "Vi", "Ni", "Du"], answer: "Ni" },
          { type: "translate", question: "أنت تتكلم السويدية", answer: "Du talar svenska." }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الضمائر", content: {
        questions: [
          { question: "ما معنى 'Hon'؟", options: ["هو", "هي", "هم", "أنت"], correct: 1 },
          { question: "كيف تقول 'نحن'؟", options: ["De", "Ni", "Vi", "Du"], correct: 2 },
          { question: "أي جملة صحيحة؟", options: ["Jag talar svenska.", "Jag talas svenska.", "Jag talare svenska.", "Jag talks svenska."], correct: 0 },
          { question: "ما ضمير 'هم'؟", options: ["Han", "Hon", "Vi", "De"], correct: 3 }
        ]
      }}
    ]
  },

  // ── A1 TESTS ──
  {
    title: "اختبار شامل – المستوى A1", titleSv: "Prov – nivå A1",
    description: "اختبر جميع معلوماتك في المستوى الأول: الأبجدية، الأرقام، التحيات، والقواعد الأساسية",
    category: "الاختبارات", difficulty: "beginner", level: "A1", skill: "tests",
    durationMinutes: 35, isLocked: false, completionPercentage: 0, imageUrl: IMG.exam,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "تعليمات الاختبار", content: {
        arabicIntro: "هذا الاختبار الشامل يغطي جميع ما تعلمته في المستوى A1. يتضمن أسئلة حول الأبجدية، الأرقام، التحيات، القواعد، والمفردات الأساسية.",
        imageUrl: IMG.exam,
        objectives: ["تقييم مستواك في A1", "تحديد نقاط القوة والضعف", "الاستعداد للمستوى A2"]
      }},
      { orderIndex: 1, sectionType: "quiz", titleAr: "القسم الأول: المفردات", content: {
        questions: [
          { question: "ما معنى 'Hej'؟", options: ["وداعاً", "مرحباً", "شكراً", "من فضلك"], correct: 1 },
          { question: "كيف تقول '7' بالسويدية؟", options: ["Sex", "Sju", "Åtta", "Nio"], correct: 1 },
          { question: "ما معنى 'Mjölk'؟", options: ["ماء", "عصير", "حليب", "قهوة"], correct: 2 },
          { question: "ما ترجمة 'Öppet'؟", options: ["مغلق", "مفتوح", "مدخل", "مخرج"], correct: 1 }
        ]
      }},
      { orderIndex: 2, sectionType: "quiz", titleAr: "القسم الثاني: القواعد", content: {
        questions: [
          { question: "ما صيغة فعل vara في المضارع؟", options: ["var", "är", "vara", "vore"], correct: 1 },
          { question: "كلمة 'hus' (بيت) تأخذ أداة:", options: ["en", "ett", "de", "la"], correct: 1 },
          { question: "أيام الأسبوع في السويدية تُكتب:", options: ["بحرف كبير", "بحرف صغير", "بأحرف كبيرة كلها", "لا فرق"], correct: 1 },
          { question: "ما ضمير 'هم'؟", options: ["Han", "Hon", "Vi", "De"], correct: 3 }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "القسم الثالث: الجمل", content: {
        questions: [
          { question: "كيف تقول 'اسمي سارة'؟", options: ["Jag bor Sara.", "Jag heter Sara.", "Jag är från Sara.", "Jag gillar Sara."], correct: 1 },
          { question: "ما معنى 'Notan, tack'؟", options: ["القائمة من فضلك", "الحساب من فضلك", "الماء من فضلك", "المزيد من فضلك"], correct: 1 },
          { question: "كيف تقول 'أنا من المغرب'؟", options: ["Jag heter Marocko.", "Jag bor Marocko.", "Jag kommer från Marocko.", "Jag är Marocko."], correct: 2 },
          { question: "ما معنى 'Bra, tack'؟", options: ["من فضلك", "شكراً", "بخير، شكراً", "جيد جداً"], correct: 2 }
        ]
      }}
    ]
  },
  {
    title: "اختبار: المفردات اليومية A1", titleSv: "Ordförråd – A1 prov",
    description: "اختبر مفرداتك في موضوعات الطعام، الأسرة، والحياة اليومية",
    category: "الاختبارات", difficulty: "beginner", level: "A1", skill: "tests",
    durationMinutes: 25, isLocked: false, completionPercentage: 0, imageUrl: IMG.exam,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "تعليمات الاختبار", content: {
        arabicIntro: "اختبار المفردات يشمل: الطعام والشراب، الأرقام والألوان، الأسرة، وكلمات الشارع والمدينة. تحقق من معرفتك!",
        imageUrl: IMG.exam,
        objectives: ["اختبار مفردات الطعام", "اختبار مفردات الأسرة", "اختبار مفردات المدينة"]
      }},
      { orderIndex: 1, sectionType: "exercise", titleAr: "ترجمة وملء الفراغات", content: {
        imageUrl: IMG.student,
        items: [
          { type: "translate", question: "اكتب 'القهوة' بالسويدية", answer: "Kaffe" },
          { type: "translate", question: "اكتب 'موقف سيارات' بالسويدية", answer: "Parkering" },
          { type: "fill", question: "Jag är _____ år gammal. (اكتب رقم 25 بالسويدية)", answer: "tjugofem" },
          { type: "mcq", question: "كيف تقول 'عصير برتقال'؟", options: ["Apelsinjuice", "Mjölk", "Vatten", "Kaffe"], answer: "Apelsinjuice" }
        ]
      }},
      { orderIndex: 2, sectionType: "quiz", titleAr: "اختبار المفردات", content: {
        questions: [
          { question: "ما معنى 'Ägg'؟", options: ["لحم", "خبز", "بيض", "جبن"], correct: 2 },
          { question: "كيف تقول 'مرحاض' بالسويدية؟", options: ["Ingång", "Utgång", "Toalett", "Parkering"], correct: 2 },
          { question: "ما ترجمة 'Smör'؟", options: ["زيت", "زبدة", "جبن", "حليب"], correct: 1 },
          { question: "ما معنى 'Stängt'؟", options: ["مفتوح", "مغلق", "جديد", "قديم"], correct: 1 },
          { question: "كيف تقول 'ثمانية'؟", options: ["Sju", "Åtta", "Nio", "Tio"], correct: 1 }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الجمل الكاملة", content: {
        questions: [
          { question: "أي جملة تعني 'أنا أحب القهوة'؟", options: ["Jag heter kaffe.", "Jag gillar kaffe.", "Jag bor i kaffe.", "Jag är kaffe."], correct: 1 },
          { question: "كيف تطلب كوب ماء في المطعم؟", options: ["Notan, tack!", "Kan jag få ett glas vatten?", "Smaklig måltid!", "Vad rekommenderar du?"], correct: 1 },
          { question: "أي جملة تعني 'أنا سعيد'؟", options: ["Jag är trött.", "Jag är glad.", "Jag är ledsen.", "Jag är hungrig."], correct: 1 }
        ]
      }}
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// A2 – ELEMENTARY LESSONS
// ═══════════════════════════════════════════════════════════════════════════
const a2Lessons: LessonData[] = [
  // ── A2 READING ──
  {
    title: "قراءة: وصف الأسرة والمنزل", titleSv: "Familj och hem – läsning",
    description: "قراءة نصوص حول وصف الأسرة ومنزلها في السويد",
    category: "الأسرة", difficulty: "beginner", level: "A2", skill: "reading",
    durationMinutes: 22, isLocked: false, completionPercentage: 0, imageUrl: IMG.family,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "في هذا الدرس ستتعلم كيف تقرأ نصوصاً تصف الأسرة السويدية ومنزلها. الأسرة السويدية عادةً ما تعيش في شقق أو منازل صغيرة مريحة.",
        imageUrl: IMG.family,
        objectives: ["قراءة نصوص الأسرة", "فهم وصف المنزل", "التعرف على علاقات القرابة"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "أفراد الأسرة", content: {
        imageUrl: IMG.family,
        words: [
          { sv: "Mamma", ar: "أم", phonetic: "mam-ma", example: "Min mamma heter Fatima." },
          { sv: "Pappa", ar: "أب", phonetic: "pap-pa", example: "Min pappa jobbar som lärare." },
          { sv: "Syskon", ar: "الإخوة والأخوات", phonetic: "sys-kon", example: "Jag har tre syskon." },
          { sv: "Bror", ar: "أخ", phonetic: "broor", example: "Min bror är student." },
          { sv: "Syster", ar: "أخت", phonetic: "sys-ter", example: "Min syster bor i Göteborg." },
          { sv: "Farfar/Morfar", ar: "جد (من جهة الأب/الأم)", phonetic: "far-far/mor-far", example: "Min farfar är 75 år." },
          { sv: "Farmor/Mormor", ar: "جدة (من جهة الأب/الأم)", phonetic: "far-mor/mor-mor", example: "Min mormor lagar god mat." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "نص: عائلة يوهانسون", content: {
        imageUrl: IMG.family,
        passage: "Jag heter Erik Johansson och jag är 35 år gammal. Jag bor i en lägenhet i Örebro med min fru Anna och våra två barn. Vår son heter Lukas och är 8 år. Vår dotter heter Maja och är 5 år. Mina föräldrar bor i Dalarna. Min pappa är pensionär och min mamma jobbar som sjuksköterska. Vi träffas varje jul och midsommar.",
        translation: "اسمي إيريك يوهانسون وعمري 35 سنة. أسكن في شقة في أوريبرو مع زوجتي آنا وطفلينا. ابننا اسمه لوكاس وعمره 8 سنوات. ابنتنا اسمها مايا وعمرها 5 سنوات. والداي يعيشان في دالارنا. أبي متقاعد وأمي تعمل ممرضة. نجتمع في كل عيد الميلاد وميدسومار.",
        questions: [
          { question: "أين يسكن إيريك؟", answer: "في شقة في أوريبرو" },
          { question: "كم عمر ابنته مايا؟", answer: "5 سنوات" },
          { question: "متى تجتمع الأسرة؟", answer: "في كل عيد الميلاد وميدسومار" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الأسرة", content: {
        questions: [
          { question: "ما معنى 'Syskon'؟", options: ["الأبوين", "الإخوة والأخوات", "الأجداد", "الأعمام"], correct: 1 },
          { question: "كيف تقول 'جدة من جهة الأم'؟", options: ["Farmor", "Mormor", "Morfa", "Farfar"], correct: 1 },
          { question: "ما معنى 'Föräldrar'؟", options: ["الأطفال", "الأجداد", "الوالدان", "الإخوة"], correct: 2 }
        ]
      }}
    ]
  },

  // ── A2 WRITING ──
  {
    title: "كتابة رسالة بسيطة إلى صديق", titleSv: "Skriva ett brev",
    description: "تعلم كيف تكتب رسالة غير رسمية لصديق سويدي بالأسلوب الصحيح",
    category: "الكتابة", difficulty: "beginner", level: "A2", skill: "writing",
    durationMinutes: 28, isLocked: false, completionPercentage: 0, imageUrl: IMG.writing,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "الرسائل غير الرسمية في السويدية تبدأ بـ 'Hej' أو 'Hejsan' وتنتهي بـ 'Hälsningar' أو 'Kram'. ستتعلم هنا بنية الرسالة الكاملة.",
        imageUrl: IMG.writing,
        objectives: ["كتابة افتتاحية الرسالة", "وصف ما تفعله", "إنهاء الرسالة بشكل صحيح"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "عبارات الرسائل", content: {
        imageUrl: IMG.student,
        words: [
          { sv: "Hej/Hejsan", ar: "مرحباً (افتتاحية)", phonetic: "hay/hay-san", example: "Hej Sara!" },
          { sv: "Hur mår du?", ar: "كيف حالك؟", phonetic: "hoor mor doo", example: "Hur mår du och familjen?" },
          { sv: "Jag skriver för att", ar: "أكتب لأن...", phonetic: "yag skree-ver fur at", example: "Jag skriver för att berätta..." },
          { sv: "Hälsningar", ar: "مع التحيات (ختام)", phonetic: "hel-sning-ar", example: "Hälsningar, Ahmed" },
          { sv: "Kram", ar: "بالأحضان (ختام لطيف)", phonetic: "kram", example: "Stor kram! / Kramar" },
          { sv: "Längtar efter att se dig", ar: "أشتاق لرؤيتك", phonetic: "leng-tar ef-ter at seh day", example: "Jag längtar efter att se dig!" },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "مثال: رسالة إلى صديق", content: {
        imageUrl: IMG.writing,
        passage: "Hej Karin!\n\nHur mår du? Jag mår bra! Jag skriver för att berätta om min nya lägenhet i Malmö. Den är liten men mysig. Jag har ett sovrum, ett kök och ett badrum.\n\nI helgen ska vi ha fest hemma hos mig. Kan du komma? Vi börjar klockan sjuton.\n\nSkriv snart!\nKramar, Yasmin",
        translation: "مرحباً كارين!\n\nكيف حالك؟ أنا بخير! أكتب لأخبرك عن شقتي الجديدة في مالمو. إنها صغيرة لكن مريحة. عندي غرفة نوم ومطبخ وحمام.\n\nفي عطلة نهاية الأسبوع سنقيم حفلة في منزلي. هل يمكنك الحضور؟ نبدأ الساعة الخامسة.\n\nاكتبي قريباً!\nبالأحضان، ياسمين",
        questions: [
          { question: "لماذا تكتب ياسمين؟", answer: "لتخبر كارين عن شقتها الجديدة وتدعوها للحفلة" },
          { question: "في أي ساعة تبدأ الحفلة؟", answer: "الساعة الخامسة" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار كتابة الرسائل", content: {
        questions: [
          { question: "كيف تختم رسالة غير رسمية؟", options: ["Med vänlig hälsning", "Kram", "God dag", "Tack så mycket"], correct: 1 },
          { question: "ما معنى 'Kram'؟", options: ["مع التحيات", "بالأحضان", "يسعدني", "مع السلامة"], correct: 1 },
          { question: "كيف تبدأ رسالة غير رسمية؟", options: ["Med vänlig hälsning", "God dag herr/fru", "Hej/Hejsan", "Till whom it may concern"], correct: 2 }
        ]
      }}
    ]
  },

  // ── A2 LISTENING ──
  {
    title: "استماع: في المحطة والمواصلات", titleSv: "På stationen",
    description: "تدرب على فهم الإعلانات والمحادثات في المحطات والحافلات السويدية",
    category: "المواصلات", difficulty: "beginner", level: "A2", skill: "listening",
    durationMinutes: 22, isLocked: false, completionPercentage: 0, imageUrl: IMG.travel,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "نظام النقل في السويد ممتاز. الحافلات، القطارات، والمترو تعمل بانتظام. ستتعلم كيف تفهم الإعلانات وتطلب تذاكر وتسأل عن المسارات.",
        imageUrl: IMG.travel,
        objectives: ["فهم إعلانات المحطة", "شراء التذاكر", "السؤال عن المسار"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مفردات المواصلات", content: {
        imageUrl: IMG.stockholm,
        words: [
          { sv: "Tåg", ar: "قطار", phonetic: "tohg", example: "Tåget avgår klockan tio." },
          { sv: "Buss", ar: "حافلة", phonetic: "buss", example: "Buss nummer 3 till centrum." },
          { sv: "Tunnelbana", ar: "مترو / قطار تحت الأرض", phonetic: "tun-el-ba-na", example: "Tunnelbanan i Stockholm." },
          { sv: "Hållplats", ar: "محطة توقف", phonetic: "hol-plats", example: "Nästa hållplats är Centralen." },
          { sv: "Enkelbiljett", ar: "تذكرة ذهاب فقط", phonetic: "en-kel-bil-yet", example: "En enkelbiljett, tack." },
          { sv: "Avgår", ar: "يغادر / ميعاد المغادرة", phonetic: "av-gor", example: "Tåget avgår om fem minuter." },
          { sv: "Försenat", ar: "متأخر", phonetic: "fur-sey-nat", example: "Tåget är försenat med 10 minuter." },
        ]
      }},
      { orderIndex: 2, sectionType: "listening", titleAr: "إعلانات المحطة", content: {
        imageUrl: IMG.travel,
        transcript: "إعلان 1:\n'Uppmärksamhet! Tåget till Göteborg avgår från spår 3 om tio minuter. Tåget är försenat med fem minuter. Vi ber om ursäkt för olägenheterna.'\n\nإعلان 2:\n'Nästa station är Centralen. Dörrar öppnas till vänster. Tänk på att ta med era effekter.'\n\nحوار:\nKund: Förlåt, när avgår nästa buss till Malmö?\nPersonal: Bussen avgår klockan 14:30 från hållplats 5.",
        questions: [
          { question: "من أي رصيف يغادر القطار إلى غوتنبرغ؟", answer: "الرصيف 3" },
          { question: "كم دقيقة القطار متأخر؟", answer: "5 دقائق" },
          { question: "إلى أين يذهب العميل؟", answer: "إلى مالمو" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار المواصلات", content: {
        questions: [
          { question: "ما معنى 'Försenat'؟", options: ["سريع", "متأخر", "مبكر", "ملغى"], correct: 1 },
          { question: "ما هو 'Tunnelbana'؟", options: ["حافلة", "قطار", "مترو", "سيارة أجرة"], correct: 2 },
          { question: "ما معنى 'Enkelbiljett'؟", options: ["تذكرة شهرية", "تذكرة عائلية", "تذكرة ذهاب فقط", "تذكرة عودة"], correct: 2 }
        ]
      }}
    ]
  },

  // ── A2 SPEAKING ──
  {
    title: "التسوق وطلب المساعدة", titleSv: "Att handla – shopping",
    description: "تعلم كيف تتسوق وتطلب المساعدة في المحلات السويدية",
    category: "التسوق", difficulty: "beginner", level: "A2", skill: "speaking",
    durationMinutes: 25, isLocked: false, completionPercentage: 0, imageUrl: IMG.shopping,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "التسوق في السويد يتطلب بعض العبارات الخاصة. معظم المحلات تقبل الدفع الإلكتروني فقط (Swish أو بطاقة)، ونادراً ما تقبل النقد.",
        imageUrl: IMG.shopping,
        objectives: ["طلب المساعدة في المحل", "السؤال عن الأسعار والأحجام", "الدفع والعودة"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مفردات التسوق", content: {
        imageUrl: IMG.shopping,
        words: [
          { sv: "Kan du hjälpa mig?", ar: "هل يمكنك مساعدتي؟", phonetic: "kan doo yel-pa may", example: "Ursäkta, kan du hjälpa mig?" },
          { sv: "Hur mycket kostar det?", ar: "بكم هذا؟", phonetic: "hoor myck-et kos-tar de", example: "Hur mycket kostar den här jackan?" },
          { sv: "Har ni...?", ar: "هل عندكم...؟", phonetic: "har nee", example: "Har ni det i en annan storlek?" },
          { sv: "Storlek", ar: "مقاس / حجم", phonetic: "stor-lek", example: "Vilket är din storlek?" },
          { sv: "Prova", ar: "يجرب / يقيس", phonetic: "proo-va", example: "Får jag prova den?" },
          { sv: "Kassa", ar: "صندوق الدفع", phonetic: "kas-sa", example: "Var är kassan?" },
          { sv: "Kvitto", ar: "إيصال / وصل", phonetic: "kvit-o", example: "Kan jag få ett kvitto?" },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "حوار: في المحل", content: {
        imageUrl: IMG.shopping,
        passage: "Kund: Ursäkta! Kan du hjälpa mig?\nExpedit: Ja, självklart! Vad kan jag hjälpa dig med?\nKund: Jag letar efter en vinterrock. Har ni det i storlek medium?\nExpedit: Ja, vi har den i svart och blå. Vill du prova?\nKund: Ja, tack! Hur mycket kostar den?\nExpedit: Den kostar 899 kronor.\nKund: Det är lite dyrt. Har ni rea nu?\nExpedit: Ja! Vi har 20% rabatt på alla jackor den här veckan.",
        translation: "عميل: عفواً! هل يمكنك مساعدتي؟\nبائع: نعم، بالتأكيد! بماذا أستطيع مساعدتك؟\nعميل: أبحث عن معطف شتوي. هل عندكم مقاس وسط؟\nبائع: نعم، عندنا باللون الأسود والأزرق. هل تريد التجربة؟\nعميل: نعم شكراً! بكم هو؟\nبائع: يكلف 899 كرونة.\nعميل: هذا غالٍ نوعاً ما. هل عندكم تخفيضات؟\nبائع: نعم! عندنا خصم 20% على جميع الجاكيتات هذا الأسبوع.",
        questions: [
          { question: "ماذا يبحث العميل عن شرائه؟", answer: "معطف شتوي" },
          { question: "كم يبلغ الخصم؟", answer: "20%" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار التسوق", content: {
        questions: [
          { question: "كيف تسأل عن الثمن؟", options: ["Var är kassan?", "Hur mycket kostar det?", "Kan du hjälpa mig?", "Har ni rea?"], correct: 1 },
          { question: "ما معنى 'Kvitto'؟", options: ["ثمن", "تخفيض", "إيصال", "مقاس"], correct: 2 },
          { question: "ما معنى 'Storlek'؟", options: ["لون", "مقاس", "شكل", "سعر"], correct: 1 }
        ]
      }}
    ]
  },

  // ── A2 GRAMMAR ──
  {
    title: "الماضي البسيط – الأفعال المنتظمة", titleSv: "Preteritum – regelbundna verb",
    description: "تعلم كيف تتحدث عن الماضي في السويدية بالأفعال المنتظمة",
    category: "القواعد", difficulty: "beginner", level: "A2", skill: "grammar",
    durationMinutes: 30, isLocked: false, completionPercentage: 0, imageUrl: IMG.grammar,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "لكي تحكي عن ما حدث بالأمس أو الأسبوع الماضي، تحتاج للماضي البسيط (Preteritum). الأفعال السويدية المنتظمة تتبع قواعد ثابتة تجعل تعلمها سهلاً.",
        imageUrl: IMG.library,
        objectives: ["فهم مجموعات الأفعال", "تصريف الأفعال في الماضي", "حكاية أحداث ماضية"]
      }},
      { orderIndex: 1, sectionType: "grammar", titleAr: "قواعد الماضي البسيط", content: {
        imageUrl: IMG.grammar,
        rule: "المجموعة 1: -ar في المضارع → -ade في الماضي\nالمجموعة 2: -er في المضارع → -de في الماضي\nالمجموعة 3: -r في المضارع (قصيرة) → -dde في الماضي",
        explanation: "معظم الأفعال السويدية منتظمة. المجموعة الأولى هي الأكثر شيوعاً وتشمل معظم الأفعال المشتقة من أسماء.",
        examples: [
          { sv: "jobba → jobbade", ar: "يعمل → عمل" },
          { sv: "lyssna → lyssnade", ar: "يستمع → استمع" },
          { sv: "prata → pratade", ar: "يتكلم → تكلم" },
          { sv: "köpa → köpte", ar: "يشتري → اشترى" },
          { sv: "läsa → läste", ar: "يقرأ → قرأ" },
          { sv: "bo → bodde", ar: "يسكن → سكن" },
        ]
      }},
      { orderIndex: 2, sectionType: "exercise", titleAr: "تمرين: الماضي", content: {
        imageUrl: IMG.grammar,
        items: [
          { type: "fill", question: "Igår _____ jag i parken. (promenerade/promenera)", answer: "promenerade" },
          { type: "fill", question: "Vi _____ pizza i fredags. (äta → åt)", answer: "åt" },
          { type: "translate", question: "اشتريت كتاباً أمس", answer: "Jag köpte en bok igår." },
          { type: "mcq", question: "ما صيغة الماضي للفعل 'jobba'؟", options: ["jobbade", "jobbede", "jobbare", "jobbat"], answer: "jobbade" },
          { type: "translate", question: "قرأت في المساء", answer: "Jag läste på kvällen." }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الماضي", content: {
        questions: [
          { question: "ما صيغة الماضي للفعل 'prata'؟", options: ["pratade", "pratede", "pratat", "pratate"], correct: 0 },
          { question: "كيف تقول 'استمعت للموسيقى'؟", options: ["Jag lyssnar på musik.", "Jag lyssnade på musik.", "Jag lyssnade musik.", "Jag lyssna musik."], correct: 1 },
          { question: "ما معنى 'Jag bodde i Stockholm'؟", options: ["أسكن في ستوكهولم", "سأسكن في ستوكهولم", "سكنت في ستوكهولم", "أريد السكن في ستوكهولم"], correct: 2 }
        ]
      }}
    ]
  },

  // ── A2 TESTS ──
  {
    title: "اختبار شامل – المستوى A2", titleSv: "Prov – nivå A2",
    description: "اختبار شامل لجميع محتوى المستوى A2: الأسرة، التسوق، المواصلات، والقواعد",
    category: "الاختبارات", difficulty: "beginner", level: "A2", skill: "tests",
    durationMinutes: 40, isLocked: false, completionPercentage: 0, imageUrl: IMG.exam,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "تعليمات الاختبار", content: {
        arabicIntro: "اختبار المستوى A2 يغطي الأسرة والعلاقات، التسوق والأسواق، المواصلات، والأفعال في الماضي. يتضمن نصاً للقراءة وأسئلة متعددة التخصصات.",
        imageUrl: IMG.exam,
        objectives: ["قياس مستوى A2 كاملاً", "الجاهزية للانتقال إلى B1"]
      }},
      { orderIndex: 1, sectionType: "reading", titleAr: "نص الاختبار: يوم في حياة ليندا", content: {
        imageUrl: IMG.family,
        passage: "Linda vaknade klockan sju på morgonen. Hon drack en kopp kaffe och åt frukost. Sedan tog hon tunnelbanan till jobbet. På vägen hem handlade hon i mataffären. Hon köpte mjölk, ägg och grönsaker. På kvällen lagade hon middag och ringde sin mamma. De pratade i en timme om familjen och sommarsemestern.",
        translation: "استيقظت ليندا الساعة السابعة صباحاً. شربت فنجان قهوة وتناولت الإفطار. ثم أخذت المترو إلى العمل. في طريق العودة، تسوقت في محل البقالة. اشترت حليباً وبيضاً وخضروات. في المساء، طبخت العشاء واتصلت بأمها. تحدثتا لمدة ساعة عن الأسرة وإجازة الصيف.",
        questions: [
          { question: "في أي ساعة استيقظت ليندا؟", answer: "الساعة السابعة" },
          { question: "ماذا اشترت من المتجر؟", answer: "حليب وبيض وخضروات" },
          { question: "كم مدة المكالمة مع أمها؟", answer: "ساعة واحدة" }
        ]
      }},
      { orderIndex: 2, sectionType: "quiz", titleAr: "أسئلة الاختبار", content: {
        questions: [
          { question: "ما صيغة الماضي للفعل 'köpa'؟", options: ["köpade", "köpte", "köpt", "köpede"], correct: 1 },
          { question: "كيف تقول 'بكم هذا؟'", options: ["Kan du hjälpa mig?", "Var är kassan?", "Hur mycket kostar det?", "Har ni det?"], correct: 2 },
          { question: "ما معنى 'Försenat'؟", options: ["سريع", "مبكر", "متأخر", "ملغى"], correct: 2 },
          { question: "ما معنى 'Syskon'؟", options: ["الوالدان", "الإخوة والأخوات", "الأجداد", "الأعمام"], correct: 1 },
          { question: "كيف تختم رسالة غير رسمية؟", options: ["Med vänlig hälsning", "Kram", "Till herr/fru", "God dag"], correct: 1 }
        ]
      }},
      { orderIndex: 3, sectionType: "exercise", titleAr: "تمرين التعبير الكتابي", content: {
        imageUrl: IMG.writing,
        items: [
          { type: "translate", question: "اشتريت ثياباً أمس", answer: "Jag köpte kläder igår." },
          { type: "translate", question: "القطار متأخر 10 دقائق", answer: "Tåget är försenat med 10 minuter." },
          { type: "fill", question: "Kan jag _____ den? (أجرب/تجربة)", answer: "prova" },
          { type: "mcq", question: "ما معنى 'Kvitto'؟", options: ["تخفيض", "إيصال", "مقاس", "كاشير"], answer: "إيصال" }
        ]
      }}
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// B1 – INTERMEDIATE LESSONS
// ═══════════════════════════════════════════════════════════════════════════
const b1Lessons: LessonData[] = [
  {
    title: "قراءة: أخبار السويد اليومية", titleSv: "Läsa nyheter",
    description: "تدرب على قراءة وفهم عناوين الأخبار والمقالات السويدية البسيطة",
    category: "الأخبار", difficulty: "intermediate", level: "B1", skill: "reading",
    durationMinutes: 30, isLocked: false, completionPercentage: 0, imageUrl: IMG.newspaper,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "قراءة الأخبار بالسويدية تطور مفرداتك بشكل كبير وتجعلك على اطلاع بالمجتمع السويدي. سوف نقرأ مقالات مبسطة من Klartext - النسخة المبسطة من أخبار SVT.",
        imageUrl: IMG.newspaper,
        objectives: ["فهم عناوين الأخبار", "قراءة مقالات مبسطة", "استخراج المعلومات الرئيسية"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مفردات الأخبار", content: {
        imageUrl: IMG.newspaper,
        words: [
          { sv: "Enligt", ar: "وفقاً لـ / حسب", phonetic: "en-ligt", example: "Enligt SVT nyheter..." },
          { sv: "Händelse", ar: "حدث / واقعة", phonetic: "hen-del-se", example: "En stor händelse i Stockholm." },
          { sv: "Beslut", ar: "قرار", phonetic: "bes-lut", example: "Regeringen tog ett beslut." },
          { sv: "Riksdag", ar: "البرلمان السويدي", phonetic: "riks-dahg", example: "Riksdagen röstade ja." },
          { sv: "Undersökning", ar: "دراسة / بحث", phonetic: "un-der-suk-ning", example: "En ny undersökning visar..." },
          { sv: "Miljö", ar: "بيئة", phonetic: "mil-yuh", example: "Klimat och miljö är viktigt." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "مقال: الطقس في السويد", content: {
        imageUrl: IMG.nature,
        passage: "Sverige är känt för sina fyra tydliga årstider. På vintern kan temperaturen sjunka till minus trettio grader i norr, medan södra Sverige har mildare vintrar. Sommaren är kort men ljus – i norra Sverige lyser solen nästan hela dygnet under midsommar, ett fenomen som kallas 'midnattssol'.\n\nKlimatförändringarna påverkar Sverige. Enligt SMHI, den svenska vädertjänsten, har medeltemperaturen ökat med nästan två grader sedan 1800-talet. Det påverkar ekosystem, djurliv och jordbruk.",
        translation: "السويد مشهورة بفصولها الأربعة الواضحة. في الشتاء، قد تنخفض درجة الحرارة إلى ثلاثين درجة تحت الصفر في الشمال، بينما تكون الشتاء أكثر اعتدالاً في الجنوب. الصيف قصير لكن مضيء - في شمال السويد تسطع الشمس لتقريباً 24 ساعة خلال ميدسومار، وهي ظاهرة تسمى 'شمس منتصف الليل'.\n\nتغير المناخ يؤثر على السويد. وفقاً لـ SMHI، خدمة الطقس السويدية، ارتفع متوسط الحرارة بقرابة درجتين منذ القرن التاسع عشر. هذا يؤثر على النظم البيئية والحياة البرية والزراعة.",
        questions: [
          { question: "ماذا يحدث لدرجة الحرارة في شمال السويد شتاءً؟", answer: "قد تنخفض إلى 30 درجة تحت الصفر" },
          { question: "ما هي 'المدنتصف'؟", answer: "ظاهرة بقاء الشمس مضيئة 24 ساعة في شمال السويد صيفاً" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار القراءة", content: {
        questions: [
          { question: "ما معنى 'Enligt'؟", options: ["ضد", "وفقاً لـ", "رغم", "بسبب"], correct: 1 },
          { question: "ما هو 'Riksdag'؟", options: ["الحكومة", "البرلمان", "المحكمة", "وزارة المالية"], correct: 1 },
          { question: "ما معنى 'Klimatförändring'؟", options: ["تغير الطقس", "تغير المناخ", "تلوث الهواء", "تغير الموسم"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "القواعد: الجمل الشرطية والمضاف إليه", titleSv: "Genitiv och bisatser",
    description: "إتقان صياغة الجمل المركبة والملكية في اللغة السويدية",
    category: "القواعد", difficulty: "intermediate", level: "B1", skill: "grammar",
    durationMinutes: 35, isLocked: false, completionPercentage: 0, imageUrl: IMG.grammar,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "في هذا الدرس ستتعلم كيف تعبر عن الملكية في السويدية بإضافة 's' وكيف تبني جملاً شرطية مركبة.",
        imageUrl: IMG.library,
        objectives: ["استخدام المضاف إليه بالـ's'", "بناء جمل الشرط", "تكوين جمل معقدة"]
      }},
      { orderIndex: 1, sectionType: "grammar", titleAr: "الجينيتيف والشرط", content: {
        imageUrl: IMG.grammar,
        rule: "المضاف إليه: أضف 's' في نهاية الاسم (لا يوجد فاصلة قبل 's' كما في الإنجليزية)\nالجمل الشرطية: Om + جملة بالمضارع، + جملة رئيسية",
        explanation: "الفرق بين السويدية والإنجليزية: في السويدية لا تكتب apostrophe's بل فقط 's'.",
        examples: [
          { sv: "Eriksson hus → Erikssons hus", ar: "بيت إيريكسون" },
          { sv: "Om du studerar hårt, klarar du provet.", ar: "إذا درست بجد، ستنجح في الامتحان." },
          { sv: "Om det regnar, stannar vi hemma.", ar: "إذا أمطرت، سنبقى في البيت." },
          { sv: "Stockholms stad", ar: "مدينة ستوكهولم" },
        ]
      }},
      { orderIndex: 2, sectionType: "exercise", titleAr: "تمرين: المضاف إليه والشرط", content: {
        imageUrl: IMG.student,
        items: [
          { type: "fill", question: "Maria_____ bok är röd. (كتاب ماريا)", answer: "Marias" },
          { type: "translate", question: "إذا جاء بيتر، سنأكل", answer: "Om Peter kommer, äter vi." },
          { type: "mcq", question: "أي جملة صحيحة؟", options: ["Erik's cykel", "Eriks cykel", "Eriks' cykel", "Erik cykel"], answer: "Eriks cykel" },
          { type: "fill", question: "Om du är trött, _____ du. (يجب عليك أن تنام)", answer: "ska du sova" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار القواعد", content: {
        questions: [
          { question: "كيف تقول 'بيت سارة' بالسويدية؟", options: ["Sara's hus", "Saras hus", "Saras' hus", "Sara hus"], correct: 1 },
          { question: "أكمل: 'Om det snöar, _____ vi skida.'", options: ["kan", "kunde", "kunder", "kunna"], correct: 0 },
          { question: "ما معنى 'Om du studerar hårt'؟", options: ["لأنك تدرس بجد", "إذا درست بجد", "عندما تدرس بجد", "رغم دراستك بجد"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "محادثة: في العمل والمهنة", titleSv: "På jobbet",
    description: "تدرب على المحادثات المهنية والتعبير عن آرائك في بيئة العمل السويدية",
    category: "العمل", difficulty: "intermediate", level: "B1", skill: "speaking",
    durationMinutes: 30, isLocked: false, completionPercentage: 0, imageUrl: IMG.workplace,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "بيئة العمل السويدية لها ثقافة خاصة: المساواة بين الموظفين، اتخاذ القرارات بالتشاور (الـ'lage'), ومناداة الجميع بالاسم الأول حتى المدير.",
        imageUrl: IMG.workplace,
        objectives: ["التواصل المهني باللغة السويدية", "التعبير عن الرأي باحترام", "فهم ثقافة العمل السويدية"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مفردات بيئة العمل", content: {
        imageUrl: IMG.workplace,
        words: [
          { sv: "Möte", ar: "اجتماع", phonetic: "muh-te", example: "Vi har möte klockan tio." },
          { sv: "Kollega", ar: "زميل عمل", phonetic: "kol-le-ga", example: "Mina kollegor är trevliga." },
          { sv: "Rapport", ar: "تقرير", phonetic: "rap-port", example: "Jag skriver en rapport." },
          { sv: "Deadline", ar: "آخر موعد", phonetic: "ded-line", example: "Deadlinen är på fredag." },
          { sv: "Lön", ar: "راتب", phonetic: "luhn", example: "Min lön är bra." },
          { sv: "Semester", ar: "إجازة / عطلة", phonetic: "se-mes-ter", example: "Jag tar semester i juli." },
          { sv: "Sjukskriva sig", ar: "أخذ إجازة مرضية", phonetic: "shook-skree-va say", example: "Jag är sjukskriven den här veckan." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "حوار: اجتماع العمل", content: {
        imageUrl: IMG.workplace,
        passage: "Chef: God morgon allihopa! Ska vi börja med mötet?\nAnna: Ja, visst! Jag har förberett en presentation om projektet.\nMaria: Bra! Jag har några frågor om deadlinen.\nChef: Naturligtvis. Anna, kan du visa oss din presentation?\nAnna: Ja. Projektet går bra men vi behöver en extra vecka för att slutföra testerna.\nMaria: Jag tycker att det är rimligt. Vad tycker du, David?\nDavid: Jag håller med. En vecka till borde räcka.",
        translation: "مدير: صباح الخير للجميع! هل نبدأ الاجتماع؟\nآنا: نعم بالتأكيد! لقد أعددت عرضاً تقديمياً عن المشروع.\nماريا: رائع! عندي بعض الأسئلة عن الموعد النهائي.\nمدير: بالطبع. آنا، هل يمكنك أن تريينا عرضك؟\nآنا: نعم. المشروع يسير بشكل جيد لكننا نحتاج أسبوعاً إضافياً لإتمام الاختبارات.\nماريا: أعتقد أن هذا معقول. ما رأيك يا دافيد؟\nدافيد: أوافق. أسبوع إضافي يجب أن يكفي.",
        questions: [
          { question: "ماذا أعدت آنا للاجتماع؟", answer: "عرضاً تقديمياً عن المشروع" },
          { question: "ماذا طلب الفريق؟", answer: "أسبوع إضافي لإتمام الاختبارات" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار العمل", content: {
        questions: [
          { question: "ما معنى 'Lön'؟", options: ["إجازة", "راتب", "اجتماع", "مشروع"], correct: 1 },
          { question: "كيف تقول 'أوافق' بالسويدية؟", options: ["Jag förstår.", "Jag håller med.", "Jag tror det.", "Jag vet inte."], correct: 1 },
          { question: "ما معنى 'Kollega'؟", options: ["مدير", "عميل", "زميل عمل", "موظف جديد"], correct: 2 }
        ]
      }}
    ]
  },
  {
    title: "استماع: برامج الراديو السويدية", titleSv: "Lyssna på radio",
    description: "تدرب على الاستماع لبرامج راديو سويدية ومقابلات قصيرة",
    category: "الأخبار", difficulty: "intermediate", level: "B1", skill: "listening",
    durationMinutes: 28, isLocked: false, completionPercentage: 0, imageUrl: IMG.podcast,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "الاستماع للراديو السويدي من أفضل الطرق لتطوير مهارة الاستماع. راديو السويد (Sveriges Radio - SR) لديه برامج لمتعلمي اللغة السويدية.",
        imageUrl: IMG.podcast,
        objectives: ["فهم مقابلات الراديو", "التعرف على موضوعات البرامج", "ممارسة الاستماع الفعلي"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مفردات الراديو والإعلام", content: {
        imageUrl: IMG.podcast,
        words: [
          { sv: "Intervju", ar: "مقابلة / لقاء", phonetic: "in-ter-vyoo", example: "En intervju med statsministern." },
          { sv: "Program", ar: "برنامج", phonetic: "proo-gram", example: "Det här programmet handlar om..." },
          { sv: "Sändning", ar: "بث / إذاعة", phonetic: "send-ning", example: "Live-sändning klockan åtta." },
          { sv: "Nyheter", ar: "أخبار", phonetic: "nyh-he-ter", example: "Sex-nyheterna på SR." },
          { sv: "Reporter", ar: "مراسل / صحفي", phonetic: "re-por-ter", example: "Reportern är i Stockholm." },
          { sv: "Krönika", ar: "عمود / مقالة رأي", phonetic: "kruh-ni-ka", example: "En krönika om klimat." },
        ]
      }},
      { orderIndex: 2, sectionType: "listening", titleAr: "مقابلة: موسيقى السويد", content: {
        imageUrl: IMG.podcast,
        transcript: "Program: Musikprogrammet P4\nPresentatör: Välkommen till Musikprogrammet! Idag har vi en spännande gäst – den unga artisten Klara Svensson. Klara, välkommen!\nKlara: Tack! Det är kul att vara här.\nPresentatör: Berätta lite om din musik. Vad inspirerar dig?\nKlara: Jag växte upp med jazz och klassisk musik hemma. Men nu experimenterar jag med elektronisk musik och folk. Jag vill hitta mitt eget sound.\nPresentatör: Ditt senaste album 'Norrsken' har blivit väldigt populärt. Vad handlar det om?\nKlara: Det handlar om natur och frihet. Jag hämtade inspiration från naturen i Lappland.\nPresentatör: Underbart! Ska vi lyssna på en av låtarna?",
        questions: [
          { question: "ما اسم الفنانة في المقابلة؟", answer: "كلارا سفنسون" },
          { question: "ما اسم ألبومها الأخير؟", answer: "نورسكن (الشفق القطبي)" },
          { question: "من أين استوحت إلهامها للألبوم؟", answer: "من طبيعة لابلاند" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الاستماع", content: {
        questions: [
          { question: "ما معنى 'Intervju'؟", options: ["برنامج", "مقابلة", "موسيقى", "نشرة أخبار"], correct: 1 },
          { question: "ما معنى 'Nyheter'؟", options: ["برنامج", "مقابلة", "أخبار", "تقرير"], correct: 2 },
          { question: "ما هو 'Sveriges Radio'؟", options: ["تلفزيون سويدي", "راديو سويدي", "جريدة سويدية", "موقع سويدي"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "كتابة: رسالة رسمية وطلب عمل", titleSv: "Formellt brev och jobbansökan",
    description: "تعلم كتابة رسائل رسمية وطلبات التوظيف باللغة السويدية الاحترافية",
    category: "الكتابة المهنية", difficulty: "intermediate", level: "B1", skill: "writing",
    durationMinutes: 35, isLocked: false, completionPercentage: 0, imageUrl: IMG.writing,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "الرسائل الرسمية في السويد لها بنية محددة. طلبات العمل عادةً تحتوي على personligt brev (خطاب شخصي) وCV. السويد تفضل الرسائل المختصرة والواضحة.",
        imageUrl: IMG.workplace,
        objectives: ["كتابة رسالة رسمية بالشكل الصحيح", "صياغة طلب وظيفة متكامل", "استخدام اللغة الرسمية"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مفردات الكتابة الرسمية", content: {
        imageUrl: IMG.writing,
        words: [
          { sv: "Med vänlig hälsning", ar: "مع التحيات (ختام رسمي)", phonetic: "med ven-lig hel-sning", example: "Med vänlig hälsning, Ahmed" },
          { sv: "Med anledning av", ar: "بخصوص / فيما يتعلق بـ", phonetic: "med an-led-ning av", example: "Med anledning av er annons..." },
          { sv: "Ansöker om", ar: "يتقدم بطلب لـ", phonetic: "an-suh-ker om", example: "Jag ansöker om tjänsten som..." },
          { sv: "Bifogat finner ni", ar: "مرفق بهذه الرسالة", phonetic: "bee-fo-gat fin-er nee", example: "Bifogat finner ni mitt CV." },
          { sv: "Erfarenhet", ar: "خبرة / تجربة", phonetic: "er-fa-ren-het", example: "Jag har fem års erfarenhet." },
          { sv: "Kvalifikationer", ar: "مؤهلات", phonetic: "kva-li-fi-ka-shoo-ner", example: "Mina kvalifikationer inkluderar..." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "مثال: طلب وظيفة", content: {
        imageUrl: IMG.writing,
        passage: "Karin Lindgren\nStorgatan 15, 111 22 Stockholm\nkarin.lindgren@email.se\n\n2026-01-15\n\nHR-avdelningen\nInnova AB\nBirger Jarlsgatan 10\n113 56 Stockholm\n\nAnsökan om tjänst som projektledare\n\nMed anledning av er annons på Arbetsförmedlingen ansöker jag om tjänsten som projektledare.\n\nJag har fem års erfarenhet av projektledning inom IT-branschen. Under min tid på Tech AB ledde jag framgångsrikt ett team på tolv personer och levererade tre stora projekt i tid och inom budget.\n\nBifogat finner ni mitt CV och mina betyg. Jag ser fram emot att höra från er.\n\nMed vänlig hälsning,\nKarin Lindgren",
        translation: "كارين ليندغرن\n[عنوان - ستوكهولم]\n\n15/01/2026\n\nقسم الموارد البشرية\nInnova AB\n\nطلب وظيفة: مدير مشروع\n\nبخصوص إعلانكم على موقع Arbetsförmedlingen، أتقدم بطلبي لشغل وظيفة مدير مشروع.\n\nلدي خمس سنوات من الخبرة في إدارة المشاريع في قطاع تقنية المعلومات. خلال عملي في Tech AB، قدت بنجاح فريقاً من 12 شخصاً وأنجزت ثلاثة مشاريع كبيرة في الوقت المحدد وضمن الميزانية.\n\nمرفق طيه سيرتي الذاتية وشهاداتي. أتطلع لسماعكم.\n\nمع التحيات،\nكارين ليندغرن",
        questions: [
          { question: "لأي وظيفة تتقدم كارين؟", answer: "مدير مشروع" },
          { question: "كم سنة خبرتها؟", answer: "خمس سنوات" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الكتابة الرسمية", content: {
        questions: [
          { question: "كيف تختم رسالة رسمية؟", options: ["Kram", "Hej då", "Med vänlig hälsning", "Hälsningar"], correct: 2 },
          { question: "ما معنى 'Erfarenhet'؟", options: ["تعليم", "خبرة", "مهارة", "شهادة"], correct: 1 },
          { question: "ما معنى 'Bifogat finner ni'؟", options: ["يرجى الرد", "مرفق بهذه الرسالة", "في انتظار ردكم", "تفضلوا بالاطلاع"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "اختبار شامل – المستوى B1", titleSv: "Prov – nivå B1",
    description: "اختبار مستوى B1 يقيس فهمك للأخبار والعمل والقواعد المتوسطة",
    category: "الاختبارات", difficulty: "intermediate", level: "B1", skill: "tests",
    durationMinutes: 45, isLocked: false, completionPercentage: 0, imageUrl: IMG.exam,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "تعليمات اختبار B1", content: {
        arabicIntro: "اختبار B1 يغطي: قراءة نصوص أطول، استيعاب محادثات مهنية، الأفعال الشاذة في الماضي، الجمل المركبة، والكتابة الرسمية. استعد جيداً!",
        imageUrl: IMG.exam,
        objectives: ["تقييم مستوى B1 الكامل", "الاستعداد للانتقال لـ B2"]
      }},
      { orderIndex: 1, sectionType: "reading", titleAr: "نص الاختبار: الصحة في السويد", content: {
        imageUrl: IMG.doctor,
        passage: "Sverige har ett av världens bästa sjukvårdssystem. Alla medborgare har rätt till sjukvård oavsett ekonomisk situation. Det kallas 'universell sjukvård'.\n\nNär man är sjuk ringer man sin vårdcentral och bokar en tid. I akuta fall kan man ringa 1177, som är sjukvårdsupplysningen. Vid livshotande situationer ringer man 112.\n\nSverige lägger ungefär elva procent av BNP på sjukvård. Det är ett av de högsta i världen. Forskning och innovation är viktiga delar av det svenska sjukvårdssystemet.",
        translation: "تمتلك السويد واحداً من أفضل أنظمة الرعاية الصحية في العالم. لجميع المواطنين حق في الرعاية الصحية بغض النظر عن وضعهم الاقتصادي. يُسمى ذلك 'الرعاية الصحية الشاملة'.\n\nعندما يكون المرء مريضاً، يتصل بمركز الرعاية الصحية ويحجز موعداً. في الحالات الطارئة يمكن الاتصال بـ 1177، وهي خدمة المعلومات الطبية. في حالات تهديد الحياة يتصل بـ 112.\n\nتُنفق السويد حوالي 11% من ناتجها المحلي الإجمالي على الرعاية الصحية. وهو من أعلى المعدلات في العالم.",
        questions: [
          { question: "ما رقم الطوارئ الطبية في السويد؟", answer: "112" },
          { question: "ما نسبة الإنفاق على الصحة من الناتج المحلي؟", answer: "حوالي 11%" }
        ]
      }},
      { orderIndex: 2, sectionType: "quiz", titleAr: "أسئلة B1", content: {
        questions: [
          { question: "ما معنى 'Enligt'؟", options: ["ضد", "وفقاً لـ", "رغم", "بدلاً من"], correct: 1 },
          { question: "كيف تقول 'أوافق' في سياق العمل؟", options: ["Jag förstår.", "Jag håller med.", "Jag tror det.", "Jag vet inte."], correct: 1 },
          { question: "ما معنى 'Erfarenhet'؟", options: ["تعليم", "مؤهل", "خبرة", "مهارة"], correct: 2 },
          { question: "كيف تختم رسالة رسمية؟", options: ["Kram", "Hälsningar", "Med vänlig hälsning", "Hej då"], correct: 2 },
          { question: "ما معنى 'Semester'؟", options: ["فصل دراسي", "إجازة", "اجتماع", "مشروع"], correct: 1 }
        ]
      }},
      { orderIndex: 3, sectionType: "exercise", titleAr: "التعبير الكتابي", content: {
        imageUrl: IMG.writing,
        items: [
          { type: "translate", question: "اكتب 'لديّ خمس سنوات خبرة' بالسويدية", answer: "Jag har fem års erfarenhet." },
          { type: "translate", question: "اكتب 'الاجتماع الساعة العاشرة' بالسويدية", answer: "Mötet är klockan tio." },
          { type: "fill", question: "Om du _____ hårt, klarar du provet. (تدرس)", answer: "studerar" },
          { type: "mcq", question: "أي جملة تعني 'يتقدم لوظيفة'؟", options: ["Han ansöker om tjänsten.", "Han jobbar med tjänsten.", "Han ger tjänsten.", "Han tar tjänsten."], answer: "Han ansöker om tjänsten." }
        ]
      }}
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// B2 – UPPER INTERMEDIATE LESSONS
// ═══════════════════════════════════════════════════════════════════════════
const b2Lessons: LessonData[] = [
  {
    title: "قراءة: الأدب السويدي المعاصر", titleSv: "Svensk litteratur – läsning",
    description: "استكشاف روايات ستيغ لارسون وهنينغ مانكل مع مناقشة أدبية",
    category: "الأدب", difficulty: "intermediate", level: "B2", skill: "reading",
    durationMinutes: 35, isLocked: false, completionPercentage: 0, imageUrl: IMG.library,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "السويد لديها تراث أدبي غني. من أشهر الكتّاب السويديين المعاصرين: ستيغ لارسون (رواية 'الفتاة ذات الوشم التنيني')، هنينغ مانكل (سلسلة كورت فالاندر)، وأستريد ليندغرن (بيبي غاولنغ).",
        imageUrl: IMG.library,
        objectives: ["قراءة مقتطفات من روايات سويدية", "فهم الأسلوب الأدبي", "المناقشة الأدبية بالسويدية"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مفردات أدبية", content: {
        imageUrl: IMG.library,
        words: [
          { sv: "Berättare", ar: "راوٍ / سارد", phonetic: "be-ret-ta-re", example: "Berättaren är allvetande." },
          { sv: "Handling", ar: "حبكة / أحداث", phonetic: "hand-ling", example: "Handlingen utspelar sig i Sverige." },
          { sv: "Karaktär", ar: "شخصية (أدبية)", phonetic: "ka-rak-tair", example: "Huvudkaraktären heter Mikael." },
          { sv: "Symbolik", ar: "رمزية", phonetic: "sym-bo-lik", example: "Det finns stark symbolik i romanen." },
          { sv: "Samhällskritik", ar: "نقد اجتماعي", phonetic: "sam-hells-kri-tik", example: "Boken innehåller samhällskritik." },
          { sv: "Spänning", ar: "توتر / إثارة", phonetic: "spen-ning", example: "Romanen är full av spänning." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "مقتطف ومناقشة", content: {
        imageUrl: IMG.newspaper,
        passage: "Henning Mankell (1948-2015) var en av Sveriges mest lästa och mest älskade kriminalförfattare. Hans detektivserie om Kurt Wallander såldes i över 40 miljoner exemplar och översattes till 40 språk.\n\nWallander är en ovanlig detektiv. Han är melankolisk, lider av diabetes och har svårt med relationer. Men hans envishet och empatiska förmåga gör honom till en framgångsrik brottsutredare.\n\nMankells böcker kritiserar inte bara brottslingar utan hela det svenska samhället. Han ställer frågor om rasism, korruption och den mörka sidan av det svenska välfärdssamhället.",
        translation: "هينينغ مانكل (1948-2015) كان من أكثر الكتّاب السويديين قراءةً وحبّاً. بيعت سلسلة المحقق كورت فالاندر بأكثر من 40 مليون نسخة وتُرجمت إلى 40 لغة.\n\nفالاندر محقق غير عادي. إنه مثئوس، يعاني من مرض السكري ولديه صعوبات في العلاقات. لكن عناده وتعاطفه يجعلانه محققاً ناجحاً.\n\nكتب مانكل لا تنتقد المجرمين فحسب، بل المجتمع السويدي بأكمله. إنه يطرح أسئلة حول العنصرية والفساد والجانب المظلم من دولة الرفاهية السويدية.",
        questions: [
          { question: "كم نسخة بيعت من سلسلة فالاندر؟", answer: "أكثر من 40 مليون نسخة" },
          { question: "ما أبرز صفات شخصية فالاندر؟", answer: "مثئوس، يعاني من السكري، لكن عنيد ومتعاطف" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار الأدب", content: {
        questions: [
          { question: "ما معنى 'Handling' في السياق الأدبي؟", options: ["شخصية", "حبكة الرواية", "الراوي", "الرمزية"], correct: 1 },
          { question: "إلى كم لغة ترجمت روايات مانكل؟", options: ["20", "30", "40", "50"], correct: 2 },
          { question: "ما معنى 'Samhällskritik'؟", options: ["نقد سياسي", "نقد اجتماعي", "نقد أدبي", "نقد فني"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "المحادثة: مناقشة الأحداث الراهنة", titleSv: "Diskutera aktualiteter",
    description: "تعلم التعبير عن آراء معقدة ومناقشة القضايا الاجتماعية بالسويدية",
    category: "المناقشات", difficulty: "intermediate", level: "B2", skill: "speaking",
    durationMinutes: 35, isLocked: false, completionPercentage: 0, imageUrl: IMG.speaking,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "في هذا المستوى ستتعلم كيف تعبر عن آراء معقدة، تعترض بأدب، وتقدم حججاً منطقية باللغة السويدية في مناقشات جدية.",
        imageUrl: IMG.speaking,
        objectives: ["تقديم الرأي بأسلوب راقٍ", "الاعتراض بأدب", "دعم الحجة بالأدلة"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "عبارات المناقشة", content: {
        imageUrl: IMG.speaking,
        words: [
          { sv: "Å ena sidan... å andra sidan", ar: "من ناحية... ومن ناحية أخرى", phonetic: "oh eh-na see-dan... oh an-dra", example: "Å ena sidan är det bra, å andra sidan..." },
          { sv: "Jag är av den åsikten att", ar: "أنا من الرأي أن...", phonetic: "yag air av den oh-sik-ten at", example: "Jag är av den åsikten att klimatfrågan är avgörande." },
          { sv: "Det stämmer visserligen men", ar: "هذا صحيح، لكن", phonetic: "de stem-mer vis-er-li-gen men", example: "Det stämmer visserligen men det finns en annan aspekt." },
          { sv: "Forskning visar att", ar: "الأبحاث تُظهر أن", phonetic: "fors-kring vee-sar at", example: "Forskning visar att..." },
          { sv: "I motsats till", ar: "على النقيض من", phonetic: "ee mot-sats til", example: "I motsats till vad många tror..." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "نقاش: العمل من المنزل", content: {
        imageUrl: IMG.workplace,
        passage: "Per: Jag tycker att distansarbete är framtiden. Man sparar tid på pendling och kan fokusera bättre hemma.\nEva: Det stämmer visserligen, men jag är av den åsikten att kontoret är viktigt för teamkänslan. Forskning visar att kreativitet och samarbete ökar när folk är på plats.\nPer: Å ena sidan har du rätt om kreativitet, å andra sidan visar ny forskning att produktiviteten faktiskt ökar med distansarbete.\nEva: I motsats till vad du säger visar Microsofts rapport att distansarbete kan leda till isolering, särskilt för unga anställda.\nPer: Det är ett giltigt argument. Kanske behöver vi en hybrid-modell?",
        translation: "بير: أعتقد أن العمل عن بُعد هو مستقبل العمل. يوفر وقت التنقل ويمكن التركيز بشكل أفضل في المنزل.\nإيفا: هذا صحيح، لكنني من رأي أن المكتب مهم للروح الجماعية. الأبحاث تظهر أن الإبداع والتعاون يزداد عندما يكون الناس حاضرين.\nبير: من ناحية أنت محقة في الإبداع، لكن من ناحية أخرى تظهر أبحاث جديدة أن الإنتاجية في الحقيقة تزداد مع العمل عن بُعد.\nإيفا: على النقيض مما تقول، يظهر تقرير مايكروسوفت أن العمل عن بُعد قد يؤدي للعزلة، خاصةً للموظفين الشباب.\nبير: هذا حجة وجيهة. ربما نحتاج نموذجاً هجيناً؟",
        questions: [
          { question: "ما موقف بير من العمل عن بُعد؟", answer: "يرى أنه مستقبل العمل ويزيد الإنتاجية" },
          { question: "ما المشكلة التي يشير إليها تقرير مايكروسوفت؟", answer: "العمل عن بُعد قد يؤدي للعزلة خاصة للشباب" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار المناقشة", content: {
        questions: [
          { question: "كيف تعترض بأدب؟", options: ["Det är fel!", "Det stämmer visserligen men...", "Nej, du har fel.", "Det är dumt."], correct: 1 },
          { question: "ما معنى 'Å ena sidan... å andra sidan'؟", options: ["أولاً وثانياً", "من ناحية... ومن ناحية أخرى", "لأن... نتيجةً لذلك", "رغم... بسبب"], correct: 1 },
          { question: "كيف تقدم دليلاً من بحث؟", options: ["Jag tror att...", "Forskning visar att...", "Min åsikt är...", "Det kanske är..."], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "قواعد متقدمة: صيغة المبني للمجهول والمصدر", titleSv: "Passivum och infinitiv",
    description: "إتقان صيغة المبني للمجهول والمصادر في السياقات المختلفة",
    category: "القواعد", difficulty: "intermediate", level: "B2", skill: "grammar",
    durationMinutes: 35, isLocked: false, completionPercentage: 0, imageUrl: IMG.grammar,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "صيغة المبني للمجهول في السويدية تتكون بإضافة 's' لنهاية الفعل أو باستخدام 'bli + past participle'. في النصوص الأكاديمية والإعلامية، هذه الصيغة شائعة جداً.",
        imageUrl: IMG.library,
        objectives: ["استخدام المبني للمجهول بـ s-passiv", "استخدام bli-passiv", "التمييز بين الحالتين"]
      }},
      { orderIndex: 1, sectionType: "grammar", titleAr: "المبني للمجهول في السويدية", content: {
        imageUrl: IMG.grammar,
        rule: "S-passiv: أضف 's' لنهاية الفعل في المضارع أو احذف 's' من المصدر واستبدلها بـ 'tes' في الماضي\nBli-passiv: bli/blev + past participle (مُستخدم للأحداث المتغيرة)",
        explanation: "s-passiv يُعبّر عن حالة ثابتة أو حقيقة عامة. bli-passiv يُعبّر عن عملية أو حدث.",
        examples: [
          { sv: "Boken läses av många. (s-passiv)", ar: "الكتاب يُقرأ من قِبل كثيرين." },
          { sv: "Boken skrevs 1998. (s-passiv ماضٍ)", ar: "الكتاب كُتب في 1998." },
          { sv: "Huset byggdes 1920.", ar: "البيت بُني سنة 1920." },
          { sv: "Brevet blev skickat igår. (bli-passiv)", ar: "الرسالة أُرسلت أمس." },
          { sv: "Dörren stängdes klockan sex.", ar: "أُغلق الباب الساعة السادسة." },
        ]
      }},
      { orderIndex: 2, sectionType: "exercise", titleAr: "تمرين: المبني للمجهول", content: {
        imageUrl: IMG.student,
        items: [
          { type: "fill", question: "Huset _____ 1950. (بُني - byggdes)", answer: "byggdes" },
          { type: "mcq", question: "أي جملة تستخدم S-passiv؟", options: ["Huset bli byggt.", "Huset byggdes.", "Huset är byggt.", "Huset byggs upp."], answer: "Huset byggdes." },
          { type: "translate", question: "الكتاب أُرسل أمس (bli-passiv)", answer: "Boken blev skickad igår." },
          { type: "fill", question: "Filmen _____ av Ingmar Bergman. (أُخرجت)", answer: "regisserades" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار المبني للمجهول", content: {
        questions: [
          { question: "كيف تشكل s-passiv للفعل 'köpa' في المضارع؟", options: ["köps", "köpas", "köptes", "köpt"], correct: 0 },
          { question: "أي جملة تستخدم bli-passiv صحيحاً؟", options: ["Maten lagas.", "Maten blev lagad.", "Maten lagades.", "Maten lagar sig."], correct: 1 },
          { question: "متى يفضل استخدام s-passiv؟", options: ["للأحداث المتغيرة", "للحالات الثابتة", "فقط في الماضي", "فقط في المستقبل"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "اختبار شامل – المستوى B2", titleSv: "Prov – nivå B2",
    description: "اختبار متقدم يقيس قدرتك على القراءة النقدية والكتابة الأكاديمية والمحادثة",
    category: "الاختبارات", difficulty: "intermediate", level: "B2", skill: "tests",
    durationMinutes: 50, isLocked: false, completionPercentage: 0, imageUrl: IMG.exam,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "تعليمات اختبار B2", content: {
        arabicIntro: "اختبار B2 يُركز على فهم نصوص أعمق، استخدام قواعد متقدمة، والتعبير الكتابي الاحترافي. مستوى B2 يعادل مستوى النجاح في TISUS.",
        imageUrl: IMG.exam,
        objectives: ["قياس الكفاءة في B2", "تحديد الجاهزية لـ C1"]
      }},
      { orderIndex: 1, sectionType: "reading", titleAr: "نص: الرفاهية السويدية", content: {
        imageUrl: IMG.midsommar,
        passage: "Den svenska välfärdsmodellen, ibland kallad 'den nordiska modellen', är ett system som kombinerar fri marknad med en stark offentlig sektor. Sverige har ett av världens mest generösa sociala skyddsnät, med subventionerad sjukvård, gratis utbildning och generösa föräldraledighetsregler.\n\nSystemet finansieras genom höga skatter – svenska inkomstskatter kan nå upp till 57 procent för höginkomsttagare. Trots detta rankas Sverige konsekvent bland de lyckligaste länderna i världen och har låg ekonomisk ojämlikhet jämfört med andra länder.",
        translation: "النموذج السويدي للرفاهية، الذي يُسمى أحياناً 'النموذج الإسكندنافي'، هو نظام يجمع بين السوق الحرة وقطاع عام قوي. تمتلك السويد واحدة من أكثر شبكات الأمان الاجتماعي كرماً في العالم، مع رعاية صحية مدعومة وتعليم مجاني وإجازة أبوية سخية.\n\nيموَّل النظام من خلال ضرائب مرتفعة - قد تصل ضرائب الدخل السويدية إلى 57% لأصحاب الدخول العالية. ومع ذلك، تحتل السويد باستمرار مرتبة من بين أسعد الدول في العالم وتتمتع بمساواة اقتصادية عالية مقارنةً بدول أخرى.",
        questions: [
          { question: "ما الحد الأعلى للضريبة على الدخل في السويد؟", answer: "57%" },
          { question: "ما المصطلح الآخر للنموذج السويدي؟", answer: "النموذج الإسكندنافي" }
        ]
      }},
      { orderIndex: 2, sectionType: "quiz", titleAr: "أسئلة B2", content: {
        questions: [
          { question: "كيف تشكل s-passiv من الفعل 'läsa'؟", options: ["läsas", "läses", "läss", "läst"], correct: 1 },
          { question: "ما معنى 'Samhällskritik'؟", options: ["نقد سياسي", "نقد اجتماعي", "نقد اقتصادي", "نقد ثقافي"], correct: 1 },
          { question: "كيف تعترض بأدب؟", options: ["Nej!", "Det stämmer visserligen men...", "Du har fel.", "Det är fel."], correct: 1 },
          { question: "ما معنى 'Symbolik'؟", options: ["حبكة", "شخصية", "رمزية", "راوٍ"], correct: 2 },
          { question: "ما الفرق بين s-passiv وbli-passiv؟", options: ["لا فرق", "s للحالات الثابتة، bli للأحداث المتغيرة", "s للماضي، bli للمستقبل", "s للمفرد، bli للجمع"], correct: 1 }
        ]
      }},
      { orderIndex: 3, sectionType: "exercise", titleAr: "التعبير الكتابي B2", content: {
        imageUrl: IMG.writing,
        items: [
          { type: "translate", question: "من رأيي أن التعليم المجاني مهم", answer: "Jag är av den åsikten att gratis utbildning är viktigt." },
          { type: "translate", question: "الكتاب كُتب في 1984 (s-passiv)", answer: "Boken skrevs 1984." },
          { type: "fill", question: "Å ena sidan är det bra, å _____ sidan är det dyrt.", answer: "andra" },
          { type: "mcq", question: "أي جملة تعني 'من ناحية أخرى'؟", options: ["Å ena sidan", "Å andra sidan", "I stället för", "Trots detta"], answer: "Å andra sidan" }
        ]
      }}
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// C1 – ADVANCED LESSONS
// ═══════════════════════════════════════════════════════════════════════════
const c1Lessons: LessonData[] = [
  {
    title: "قراءة أكاديمية: بحث علمي", titleSv: "Akademisk läsning",
    description: "قراءة وتحليل نصوص علمية وأكاديمية باللغة السويدية المتقدمة",
    category: "الأكاديمي", difficulty: "advanced", level: "C1", skill: "reading",
    durationMinutes: 40, isLocked: false, completionPercentage: 0, imageUrl: IMG.student,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "في المستوى C1 ستتعامل مع نصوص أكاديمية حقيقية: مقالات بحثية، تقارير علمية، ومراجعات نقدية. ستتعلم كيف تحلل الحجج وتفهم البنية المنطقية للنص.",
        imageUrl: IMG.library,
        objectives: ["تحليل النصوص الأكاديمية", "فهم الحجج المعقدة", "استخلاص الاستنتاجات"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "مصطلحات أكاديمية", content: {
        imageUrl: IMG.student,
        words: [
          { sv: "Hypotes", ar: "فرضية", phonetic: "hy-po-tes", example: "Studien bekräftar hypotesen." },
          { sv: "Metodik", ar: "منهجية", phonetic: "me-to-dik", example: "Metodiken är transparent." },
          { sv: "Slutsats", ar: "استنتاج / خلاصة", phonetic: "sloot-sats", example: "Slutsatsen är tydlig." },
          { sv: "Empirisk", ar: "تجريبي / إمبيريقي", phonetic: "em-pee-risk", example: "Empiriska data stöder teorin." },
          { sv: "Signifikant", ar: "ذو دلالة إحصائية", phonetic: "sig-ni-fi-kant", example: "Skillnaden är signifikant." },
          { sv: "Litteraturöversikt", ar: "مراجعة الأدب العلمي", phonetic: "lit-e-ra-toor-uv-er-sikt", example: "Litteraturöversikten täcker 50 studier." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "مستخلص بحثي: نوم المراهقين", content: {
        imageUrl: IMG.student,
        passage: "Titel: Sömnens påverkan på inlärning hos ungdomar i åldern 14-18 år\n\nSammanfattning:\nDenna studie undersöker sambandet mellan sömnvanor och akademiska prestationer hos svenska gymnasieelever. Med hjälp av en longitudinell enkätstudie (n=847) och objektiva sömnmätningar analyserades data från tre läsår.\n\nResultaten visar ett signifikant positivt samband (r=0.67, p<0.001) mellan genomsnittlig sömnduration och betyg. Elever som sov minst åtta timmar per natt presterade i genomsnitt 23% bättre på nationella prov jämfört med elever som sov sex timmar eller färre.\n\nSlutsats: Skolstarten bör senareläggas till efter klockan 09:00 för att optimera ungdomars inlärningsförmåga.",
        translation: "عنوان: تأثير النوم على التعلم لدى المراهقين في الفئة العمرية 14-18 سنة\n\nملخص:\nتبحث هذه الدراسة في العلاقة بين عادات النوم والأداء الأكاديمي لدى طلاب المدارس الثانوية السويدية. باستخدام دراسة استبيانية طولية (n=847) وقياسات نوم موضوعية، تم تحليل البيانات من ثلاثة أعوام دراسية.\n\nتُظهر النتائج ارتباطاً إيجابياً ذا دلالة إحصائية (r=0.67، p<0.001) بين متوسط مدة النوم والدرجات. الطلاب الذين ناموا ثماني ساعات على الأقل في الليلة حققوا أداءً أفضل بمتوسط 23% في الامتحانات الوطنية مقارنةً بالطلاب الذين ناموا ست ساعات أو أقل.\n\nالخلاصة: ينبغي تأجيل بدء المدرسة إلى ما بعد الساعة 9:00 لتحسين قدرة المراهقين على التعلم.",
        questions: [
          { question: "كم عدد المشاركين في الدراسة؟", answer: "847 طالباً" },
          { question: "كم حققت مجموعة النوم الجيد من أداء أفضل؟", answer: "23% أفضل في المتوسط" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار القراءة الأكاديمية", content: {
        questions: [
          { question: "ما معنى 'Signifikant'؟", options: ["مهم فقط", "ذو دلالة إحصائية", "كبير", "واضح"], correct: 1 },
          { question: "ما معنى 'Slutsats'؟", options: ["مقدمة", "فرضية", "استنتاج", "بيانات"], correct: 2 },
          { question: "ما معنى 'Longitudinell studie'؟", options: ["دراسة قصيرة", "دراسة طولية عبر الزمن", "دراسة مقطعية", "دراسة تجريبية"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "اختبار مستوى C1 – TISUS", titleSv: "TISUS-prov – C1",
    description: "محاكاة اختبار TISUS للحصول على قبول في الجامعات السويدية",
    category: "الاختبارات", difficulty: "advanced", level: "C1", skill: "tests",
    durationMinutes: 60, isLocked: false, completionPercentage: 0, imageUrl: IMG.exam,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "تعليمات اختبار TISUS", content: {
        arabicIntro: "اختبار TISUS (Test in Swedish for University Studies) مطلوب للالتحاق بالجامعات السويدية للناطقين بغير السويدية. يشمل: القراءة، الكتابة، والمحادثة. هذا محاكاة للجزء الكتابي.",
        imageUrl: IMG.student,
        objectives: ["اختبار مهارات C1 الكاملة", "التدرب على TISUS", "تقييم الجاهزية الأكاديمية"]
      }},
      { orderIndex: 1, sectionType: "reading", titleAr: "نص TISUS: العولمة الثقافية", content: {
        imageUrl: IMG.flag,
        passage: "Globaliseringen och den kulturella identiteten\n\nI en värld som allt mer präglas av globalisering uppstår frågan om kulturell identitet och bevarande av lokala traditioner. Globaliseringen erbjuder fantastiska möjligheter – fri rörlighet av idéer, varor och människor – men innebär också utmaningar för minoritetskulturer och regionala språk.\n\nI Sverige är situationen komplex. Å ena sidan har Sverige aktivt välkomnat immigration och kulturell mångfald, å andra sidan pågår en debatt om integrationsutmaningar och cultural cohesion. Det samiska folket, Sveriges ursprungsbefolkning, kämpar för att bevara sitt språk och sina traditioner mot bakgrunden av ökad assimilering.\n\nFrågan är inte om vi ska ha globalisering – den är redan ett faktum – utan hur vi hanterar dess konsekvenser på ett sätt som respekterar både mångfald och sammanhållning.",
        translation: "العولمة والهوية الثقافية\n\nفي عالم يتشكل بشكل متزايد بالعولمة، تطرح نفسها أسئلة حول الهوية الثقافية والحفاظ على التقاليد المحلية. العولمة تقدم فرصاً رائعة - حرية حركة الأفكار والبضائع والناس - لكنها تمثل أيضاً تحديات للثقافات الأقلية واللغات الإقليمية.\n\nفي السويد، الوضع معقد. من ناحية، رحبت السويد بنشاط بالهجرة والتنوع الثقافي، ومن ناحية أخرى، تدور نقاشات حول تحديات الاندماج وتماسك المجتمع. يكافح الشعب السامي، السكان الأصليون للسويد، للحفاظ على لغتهم وتقاليدهم في مواجهة زيادة الاندماج.\n\nالسؤال ليس ما إذا كنا سنعاني العولمة - فهي حقيقة بالفعل - بل كيف نتعامل مع عواقبها بطريقة تحترم كلاً من التنوع والتماسك.",
        questions: [
          { question: "ما التحدي الذي يواجهه الشعب السامي؟", answer: "الحفاظ على لغتهم وتقاليدهم ضد الاندماج المتزايد" },
          { question: "ما السؤال الرئيسي الذي يطرحه الكاتب؟", answer: "ليس هل نعيش العولمة بل كيف نتعامل مع عواقبها" }
        ]
      }},
      { orderIndex: 2, sectionType: "quiz", titleAr: "أسئلة C1", content: {
        questions: [
          { question: "ما معنى 'Sammanhållning'؟", options: ["تنوع", "تماسك اجتماعي", "هجرة", "ثقافة"], correct: 1 },
          { question: "ما معنى 'Ursprungsbefolkning'؟", options: ["أقلية ثقافية", "مهاجرون", "السكان الأصليون", "الأغلبية"], correct: 2 },
          { question: "ما معنى 'Empirisk'؟", options: ["نظري", "تجريبي", "تاريخي", "اجتماعي"], correct: 1 },
          { question: "ما معنى 'Metodik'؟", options: ["نتائج", "فرضية", "منهجية", "استنتاج"], correct: 2 }
        ]
      }},
      { orderIndex: 3, sectionType: "exercise", titleAr: "التعبير الكتابي C1", content: {
        imageUrl: IMG.writing,
        items: [
          { type: "translate", question: "الفرضية تم تأكيدها من قِبل الدراسة", answer: "Hypotesen bekräftades av studien." },
          { type: "translate", question: "الاستنتاج واضح ومقنع", answer: "Slutsatsen är tydlig och övertygande." },
          { type: "fill", question: "Studien baseras på _____ data. (تجريبية)", answer: "empiriska" },
          { type: "mcq", question: "أيهما صحيح في السياق الأكاديمي؟", options: ["Jag tror att...", "Forskning visar att...", "Det kanske...", "Jag gillar att..."], answer: "Forskning visar att..." }
        ]
      }}
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// C2 – MASTERY LESSONS
// ═══════════════════════════════════════════════════════════════════════════
const c2Lessons: LessonData[] = [
  {
    title: "الأمثال والتعابير الاصطلاحية السويدية", titleSv: "Idiom och ordspråk",
    description: "إتقان التعابير الاصطلاحية والأمثال التي يستخدمها الناطقون الأصليون",
    category: "الإتقان", difficulty: "advanced", level: "C2", skill: "reading",
    durationMinutes: 40, isLocked: false, completionPercentage: 0, imageUrl: IMG.culture,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "مقدمة الدرس", content: {
        arabicIntro: "إتقان لغة ما يعني فهم أمثالها وتعابيرها الاصطلاحية. هذه التعابير لا يمكن ترجمتها حرفياً وهي مفتاح الفهم الكامل للناطقين الأصليين.",
        imageUrl: IMG.midsommar,
        objectives: ["تعلم أشهر 20 مثلاً سويدياً", "فهم السياق الثقافي", "استخدام التعابير بشكل طبيعي"]
      }},
      { orderIndex: 1, sectionType: "vocabulary", titleAr: "أمثال وتعابير سويدية", content: {
        imageUrl: IMG.culture,
        words: [
          { sv: "Det är ingen ko på isen", ar: "لا داعي للقلق (حرفياً: لا توجد بقرة على الجليد)", phonetic: "de air ing-en koo po ee-sen", example: "Lugna ner dig! Det är ingen ko på isen." },
          { sv: "Ju förr desto bättre", ar: "كلما أسرعت كان أفضل", phonetic: "yoo fur des-to bet-re", example: "Låt oss börja! Ju förr desto bättre." },
          { sv: "Inte för allt smör i Småland", ar: "لا بأي ثمن (حرفياً: ليس مقابل كل الزبدة في سمولاند)", phonetic: "in-te fur alt smur ee smoh-land", example: "Jag vill inte göra det, inte för allt smör i Småland!" },
          { sv: "Räkna med", ar: "يحسب حساب / يتوقع", phonetic: "rek-na med", example: "Räkna med att det tar tid." },
          { sv: "Ta det lugnt", ar: "هدّئ نفسك / خذها بهدوء", phonetic: "ta de lugnt", example: "Ta det lugnt! Det ordnar sig." },
          { sv: "Bita i det sura äpplet", ar: "يتجرع المرّ (حرفياً: يعض التفاحة الحامضة)", phonetic: "bee-ta ee de soo-ra ep-let", example: "Nu måste vi bita i det sura äpplet." },
        ]
      }},
      { orderIndex: 2, sectionType: "reading", titleAr: "نص: ثقافة السويديين", content: {
        imageUrl: IMG.midsommar,
        passage: "Svenska folkets karaktär präglas ofta av det som kallas 'jantelagen', ett fenomen som beskrivs av den dansk-norske författaren Aksel Sandemose. Jantelagen handlar om att ingen ska tro att de är bättre än andra.\n\nI praktiken innebär det att svenska kultur traditionellt sett varken uppmuntrar skryt eller prononcerat statusbeteende. 'Ta det lugnt' och 'Lagom är bäst' är mer än ord – de är livsprinciper.\n\nMen Sverige är ett land av kontraster: å ena sidan jantelagens återhållsamhet, å andra sidan en stark innovationskultur och en internationellt erkänd musikscen. Kanske är det just spänningen mellan dessa poler som gör Sverige fascinerande.",
        translation: "شخصية الشعب السويدي كثيراً ما تتشكل بما يُعرف بـ'قانون يانتيه'، ظاهرة وصفها الكاتب الدنماركي النرويجي أكسل ساندموسي. قانون يانتيه يتعلق بعدم اعتقاد أحد أنه أفضل من الآخرين.\n\nعملياً يعني ذلك أن الثقافة السويدية تقليدياً لا تشجع على التباهي أو سلوك التميز الصريح. 'خذها بهدوء' و'الاعتدال هو الأفضل' ليسا مجرد كلمات - بل مبادئ حياة.\n\nلكن السويد بلد التناقضات: من ناحية تحفظ قانون يانتيه، ومن ناحية أخرى ثقافة ابتكار قوية وساحة موسيقية معترف بها دولياً. ربما هذا التوتر بين هذين القطبين هو ما يجعل السويد رائعة.",
        questions: [
          { question: "ما قانون 'يانتيه'؟", answer: "المبدأ الذي يقول أن لا أحد يجب أن يعتقد أنه أفضل من الآخرين" },
          { question: "ما المتناقضان اللذان يذكرهما الكاتب عن السويد؟", answer: "تحفظ يانتيه من ناحية، وثقافة ابتكار وموسيقى دولية من ناحية أخرى" }
        ]
      }},
      { orderIndex: 3, sectionType: "quiz", titleAr: "اختبار التعابير والثقافة", content: {
        questions: [
          { question: "ما معنى 'Det är ingen ko på isen'؟", options: ["الجو بارد", "لا داعي للقلق", "المشكلة صعبة", "الحل بسيط"], correct: 1 },
          { question: "ما هو 'Lagom'؟", options: ["الكثير", "القليل", "الاعتدال", "لا شيء"], correct: 2 },
          { question: "ما معنى 'Jantelagen'؟", options: ["قانون الجمال", "قانون عدم التميز", "قانون العمل", "قانون الطبيعة"], correct: 1 }
        ]
      }}
    ]
  },
  {
    title: "اختبار الإتقان C2 – مستوى الناطق الأصلي", titleSv: "C2 Prov – nativnivå",
    description: "اختبار يقيس مستوى إتقانك للغة السويدية على مستوى الناطق الأصلي",
    category: "الاختبارات", difficulty: "advanced", level: "C2", skill: "tests",
    durationMinutes: 60, isLocked: false, completionPercentage: 0, imageUrl: IMG.exam,
    sections: [
      { orderIndex: 0, sectionType: "intro", titleAr: "تعليمات اختبار C2", content: {
        arabicIntro: "المستوى C2 يعادل إتقان اللغة على مستوى الناطق الأصلي. هذا الاختبار يشمل: فهم النصوص المعقدة جداً، استخدام التعابير الاصطلاحية، والكتابة بأسلوب راقٍ.",
        imageUrl: IMG.exam,
        objectives: ["إثبات إتقان اللغة", "اختبار الفروق الدقيقة", "التحقق من الجاهزية الكاملة"]
      }},
      { orderIndex: 1, sectionType: "reading", titleAr: "نص C2: فلسفة اللغة", content: {
        imageUrl: IMG.library,
        passage: "Wittgensteins berömda mening 'Gränserna för mitt språk är gränserna för min värld' rymmer en djup sanning om språkets roll i mänskligt tänkande. Språket är inte bara ett kommunikationsverktyg – det formar vår verklighetsuppfattning, våra kategoriseringar och vår förmåga att tänka om abstrakta begrepp.\n\nDetta bekräftas av det lingvistiska relativitetsteorin, även känd som Sapir-Whorf-hypotesen, som hävdar att det språk vi talar påverkar hur vi tänker och uppfattar världen. Forskning har visat att användare av språk med rikare färgvokabulär uppfattar fler nyanser av färg, och att talare av språk med spatiotemporala termer tänker annorlunda om tid och rum.\n\nFör en andraspråkstalare innebär detta att varje nytt språk inte bara är ett nytt kommunikationsmedel – det är en ny lins att se världen genom, en kognitiv expansion som berikar och fördjupar förståelsen av den mänskliga erfarenheten.",
        translation: "الجملة الشهيرة لفتغنشتاين 'حدود لغتي هي حدود عالمي' تتضمن حقيقة عميقة حول دور اللغة في التفكير البشري. اللغة ليست مجرد أداة تواصل - بل إنها تشكّل إدراكنا للواقع وتصنيفاتنا وقدرتنا على التفكير في المفاهيم المجردة.\n\nهذا ما تؤكده نظرية النسبية اللغوية، المعروفة أيضاً بفرضية سابير-وورف، التي تدّعي أن اللغة التي نتكلمها تؤثر على كيفية تفكيرنا وإدراكنا للعالم. أظهرت الأبحاث أن مستخدمي اللغات ذات المفردات اللونية الأغنى يدركون فروقاً دقيقة أكثر في الألوان، وأن متكلمي اللغات ذات المصطلحات الفضائية الزمنية يفكرون بشكل مختلف حول الوقت والمكان.\n\nبالنسبة لمتحدث اللغة الثانية، يعني هذا أن كل لغة جديدة ليست مجرد وسيلة تواصل جديدة - إنها عدسة جديدة لرؤية العالم، توسعٌ إدراكي يُثري ويُعمّق فهم التجربة الإنسانية.",
        questions: [
          { question: "من قال 'حدود لغتي هي حدود عالمي'؟", answer: "فتغنشتاين" },
          { question: "ماذا تدّعي فرضية سابير-وورف؟", answer: "أن اللغة التي نتكلمها تؤثر على كيفية تفكيرنا وإدراكنا للعالم" }
        ]
      }},
      { orderIndex: 2, sectionType: "quiz", titleAr: "أسئلة C2 المتقدمة", content: {
        questions: [
          { question: "ما معنى 'Verklighetsuppfattning'؟", options: ["إدراك الواقع", "تغيير الواقع", "رفض الواقع", "قبول الواقع"], correct: 0 },
          { question: "ما معنى 'Inte för allt smör i Småland'؟", options: ["لشراء الطعام", "لا بأي ثمن", "في كل الأماكن", "بسعر رخيص"], correct: 1 },
          { question: "ما المقصود بـ'Lagom'؟", options: ["الإفراط", "التقصير", "الاعتدال", "التجاوز"], correct: 2 },
          { question: "ما معنى 'Ursprungsbefolkning'؟", options: ["الأقلية", "السكان الأصليون", "المهاجرون", "الغالبية"], correct: 1 },
          { question: "ما معنى 'Sammanhållning'؟", options: ["التنوع", "التماسك الاجتماعي", "الاختلاف", "الحرية"], correct: 1 }
        ]
      }},
      { orderIndex: 3, sectionType: "exercise", titleAr: "التعبير الكتابي C2", content: {
        imageUrl: IMG.writing,
        items: [
          { type: "translate", question: "الحدود اللغوية هي حدود معرفية", answer: "Språkliga gränser är kognitiva gränser." },
          { type: "translate", question: "لا داعي للقلق، الأمور ستسير بشكل جيد (استخدم مثلاً)", answer: "Ta det lugnt! Det ordnar sig. / Det är ingen ko på isen." },
          { type: "fill", question: "Forskning _____ att språket påverkar tänkandet. (visar)", answer: "visar" },
          { type: "mcq", question: "ما المثل المناسب لموقف 'يجب علينا قبول الأمر الصعب'؟", options: ["Ta det lugnt", "Bita i det sura äpplet", "Det är ingen ko på isen", "Ju förr desto bättre"], answer: "Bita i det sura äpplet" }
        ]
      }}
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

const allLessons: LessonData[] = [
  ...a1Lessons,
  ...a2Lessons,
  ...b1Lessons,
  ...b2Lessons,
  ...c1Lessons,
  ...c2Lessons,
];

async function seed() {
  console.log("🌱 Seeding lessons database...");

  const existing = await db.select().from(lessonsTable).limit(1);
  if (existing.length > 0) {
    console.log("⏭️  Lessons already seeded, skipping.");
    process.exit(0);
  }

  // Clear existing data
  await db.execute(sql`TRUNCATE lesson_sections, lessons RESTART IDENTITY CASCADE`);
  console.log("🗑️  Cleared existing data");

  let inserted = 0;
  for (const lesson of allLessons) {
    const { sections, ...lessonData } = lesson;

    const [row] = await db
      .insert(lessonsTable)
      .values({
        title: lessonData.title,
        titleSv: lessonData.titleSv,
        description: lessonData.description,
        category: lessonData.category,
        difficulty: lessonData.difficulty,
        level: lessonData.level,
        skill: lessonData.skill,
        durationMinutes: lessonData.durationMinutes,
        isLocked: lessonData.isLocked,
        completionPercentage: lessonData.completionPercentage,
        imageUrl: lessonData.imageUrl,
      } as any)
      .returning();

    for (const section of sections) {
      await db.insert(lessonSectionsTable).values({
        lessonId: row.id,
        orderIndex: section.orderIndex,
        sectionType: section.sectionType,
        titleAr: section.titleAr,
        content: section.content,
      });
    }

    inserted++;
    console.log(`✅ [${inserted}/${allLessons.length}] ${lesson.level} ${lesson.skill}: ${lesson.title}`);
  }

  console.log(`\n🎉 Successfully seeded ${inserted} lessons with sections!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
