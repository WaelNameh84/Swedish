import { db, conversationsTable, conversationLinesTable } from "@workspace/db";

const IMG = {
  airport:    "https://media.gettyimages.com/id/1369603867/photo/passengers-at-an-airport-with-luggage.jpg?s=612x612&w=0&k=20&c=dFOkKw8nVYBlcBMzWECxNmOvYg6fvgPGLx_SIHJrPcA=",
  hospital:   "https://media.gettyimages.com/id/731741979/photo/doctor-walking-through-hospital-corridor.jpg?s=612x612&w=0&k=20&c=94a50kc59V322iYjCtqtAM2f6GmIW7T_hiDezvf5TsE=",
  school:     "https://media.gettyimages.com/id/1667940273/photo/portrait-of-smiling-female-student-with-friend-in-university.jpg?s=612x612&w=0&k=20&c=ePwPB-IfQ5SEUEQQMiN6LVIDDK6wTsAjHVH0b9Yy_5A=",
  work:       "https://media.gettyimages.com/id/2198968434/photo/students-using-laptop-and-smartphone-in-malmo-sweden.jpg?s=612x612&w=0&k=20&c=CabGwvl3Hs5Mx7_rk0o7weZFg5t4KeAIzeUBNWIUED8=",
  restaurant: "https://media.gettyimages.com/id/2215023550/photo/traditional-swedish-meatballs-with-mashed-potatoes-pickles-and-cranberry-sauce.jpg?s=612x612&w=0&k=20&c=ZrzruuV67aiz_Eb-Howv1tBi1jw3yp-IvVGYl1MNzn0=",
  hotel:      "https://media.gettyimages.com/id/1278673078/photo/empty-table-and-chair-against-window-at-new-workplace.jpg?s=612x612&w=0&k=20&c=ktE2JWrBuWhe6vmk18E1QsnswMPllZ0s3v96a5ivPlo=",
  shopping:   "https://thumbs.dreamstime.com/b/bright-interior-swedish-supermarket-food-products-discount-signs-shopping-carts-aisle-390370221.jpg",
  police:     "https://static.vecteezy.com/system/resources/thumbnails/046/599/964/small/female-student-hands-testing-in-exercise-and-taking-fill-in-exam-paper-sheet-with-pencil-at-school-test-photo.jpg",
  bank:       "https://media.gettyimages.com/id/505985703/photo/man-sitting-in-a-chair-on-the-porch-reading-todays-newspaper.jpg?s=612x612&w=0&k=20&c=tuj1RPsQDlZpBUcnRm8ztgXbFP7YIA7YQtypkyDIZPA=",
  transport:  "https://media.gettyimages.com/id/471593267/photo/swedish-midsummer-celebration.jpg?s=612x612&w=0&k=20&c=w6gGn813BegVGMlmicCT4P7G3XEsf4b0b21cgCw4hwc=",
  emergency:  "https://media.gettyimages.com/id/1300189216/photo/happy-family-eating-breakfast-seen-through-doorway-of-kitchen-at-home.jpg?s=612x612&w=0&k=20&c=tpaZ_wI_lBB7q4LN-GkHcQhkVleWUSO4qfb8_IxLeyE=",
  daily:      "https://i0.wp.com/atravelingfairy.com/wp-content/uploads/2022/11/DSC04547.jpg?w=1100&ssl=1",
};

type Line = { speaker: string; speakerName: string; speakerRole: string; textSv: string; textAr: string; phonetic: string; noteAr?: string };
type ScenarioData = {
  title: string; titleAr: string; scenario: string; category: string;
  difficulty: string; emoji: string; imageUrl: string; durationMinutes: number;
  vocabList: { sv: string; ar: string; phonetic?: string }[];
  grammarTips: { title: string; explanation: string; example: string; exampleAr: string }[];
  culturalNotes: string;
  usefulPhrases: { sv: string; ar: string; phonetic?: string }[];
  lines: Line[];
};

const scenarios: ScenarioData[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // 1. المطار
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På flygplatsen", titleAr: "في المطار", scenario: "airport",
    category: "سفر", difficulty: "beginner", emoji: "✈️",
    imageUrl: IMG.airport, durationMinutes: 12,
    vocabList: [
      { sv: "flygplatsen", ar: "المطار", phonetic: "/ˈflyːɡˌplatsən/" },
      { sv: "passet", ar: "جواز السفر", phonetic: "/ˈpasːət/" },
      { sv: "biljetten", ar: "التذكرة", phonetic: "/bɪˈjɛtːən/" },
      { sv: "incheckning", ar: "تسجيل الوصول", phonetic: "/ˈɪntɕɛkːnɪŋ/" },
      { sv: "bagaget", ar: "الأمتعة", phonetic: "/baˈɡɑːʒət/" },
      { sv: "gaten", ar: "البوابة", phonetic: "/ˈɡeɪtːən/" },
      { sv: "avgång", ar: "المغادرة", phonetic: "/ˈɑːvɡɔŋ/" },
      { sv: "ankomst", ar: "الوصول", phonetic: "/ˈɑŋkɔmst/" },
      { sv: "säkerhetskontrollen", ar: "نقطة الأمن", phonetic: "" },
      { sv: "fönsterplats", ar: "مقعد النافذة", phonetic: "" },
    ],
    grammarTips: [
      { title: "حرف الجر 'till'", explanation: "يُستخدم 'till' للدلالة على الوجهة (إلى)", example: "Jag flyger till Stockholm.", exampleAr: "أنا أسافر جواً إلى ستوكهولم." },
      { title: "سؤال بـ 'Var är'", explanation: "للسؤال عن مكان شيء ما", example: "Var är gaten?", exampleAr: "أين البوابة؟" },
    ],
    culturalNotes: "مطارات السويد معروفة بتنظيمها العالي. أرلاندا (Arlanda) هو أكبر مطار في السويد ويقع شمال ستوكهولم. يُنصح بالتسجيل قبل ساعتين على الأقل. معظم الموظفين يتحدثون الإنجليزية لكن محاولة التحدث بالسويدية تُقدَّر كثيراً.",
    usefulPhrases: [
      { sv: "Var är incheckningen?", ar: "أين تسجيل الوصول؟" },
      { sv: "Jag har tappat mitt bagage.", ar: "لقد فقدت أمتعتي." },
      { sv: "När avgår planet?", ar: "متى يغادر الطائرة؟" },
      { sv: "Kan jag få ett fönsterplats?", ar: "هل يمكنني الحصول على مقعد نافذة؟" },
      { sv: "Är flighten försenad?", ar: "هل الرحلة متأخرة؟" },
      { sv: "Hur länge är mellanlandningen?", ar: "كم مدة التوقف؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "أحمد", speakerRole: "مسافر", textSv: "Ursäkta, var är incheckningsdisken för SAS?", textAr: "عفواً، أين طاولة تسجيل شركة SAS؟", phonetic: "/ɵrˈɧɛkta var ɛr ɪntɕɛkːnɪŋsˌdɪskən/", noteAr: "'Ursäkta' تعني 'عفواً' للاستئذان." },
      { speaker: "B", speakerName: "الموظفة", speakerRole: "موظفة المطار", textSv: "Den är i terminal 2, rak fram och sedan till vänster.", textAr: "إنها في المبنى 2، مستقيم ثم يساراً.", phonetic: "/dɛn ɛr iː tɛrˈmɪnɑːl tɔː/" },
      { speaker: "A", speakerName: "أحمد", speakerRole: "مسافر", textSv: "Tack! Jag har en bokning på namnet Ahmed Al-Rashid.", textAr: "شكراً! لدي حجز باسم أحمد الراشد.", phonetic: "/takː jaɡ hɑːr ɛn ˈbɔkːnɪŋ/" },
      { speaker: "B", speakerName: "الموظفة", speakerRole: "موظفة المطار", textSv: "Kan jag få se ditt pass och biljett?", textAr: "هل يمكنني رؤية جواز سفرك وتذكرتك؟", phonetic: "/kan jaɡ fɔː seː dɪt pasː/" },
      { speaker: "A", speakerName: "أحمد", speakerRole: "مسافر", textSv: "Varsågod. Jag vill gärna ha ett fönsterplats om möjligt.", textAr: "تفضل. أفضل مقعد نافذة إن أمكن.", phonetic: "/ˈvɑːɧɔˌɡuːd/", noteAr: "'Varsågod' تعني 'تفضل' عند تقديم شيء." },
      { speaker: "B", speakerName: "الموظفة", speakerRole: "موظفة المطار", textSv: "Självklart! Hur många väskor ska du checka in?", textAr: "بالطبع! كم حقيبة ستسجّل؟", phonetic: "/ɧɛlvˈklɑːrt/" },
      { speaker: "A", speakerName: "أحمد", speakerRole: "مسافر", textSv: "Bara en. Är det extra kostnad för bagage?", textAr: "واحدة فقط. هل هناك رسوم إضافية للأمتعة؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظفة", speakerRole: "موظفة المطار", textSv: "Nej, en väska ingår i priset. Vilken gata avgår planet från?", textAr: "لا، حقيبة واحدة مشمولة في السعر. الطائرة تغادر من البوابة G12.", phonetic: "" },
      { speaker: "A", speakerName: "أحمد", speakerRole: "مسافر", textSv: "G12, okej. När öppnar gaten?", textAr: "G12، حسناً. متى تُفتح البوابة؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظفة", speakerRole: "موظفة المطار", textSv: "Om ungefär en timme. Ha en trevlig resa!", textAr: "بعد ساعة تقريباً. أتمنى لك رحلة ممتعة!", phonetic: "/ɔm ˈɵŋːəˌfɛːr ɛn ˈtɪmːə/", noteAr: "'Ha en trevlig resa' = تمنية بالسلامة للمسافر." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 2. المستشفى
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På sjukhuset", titleAr: "في المستشفى", scenario: "hospital",
    category: "صحة", difficulty: "intermediate", emoji: "🏥",
    imageUrl: IMG.hospital, durationMinutes: 15,
    vocabList: [
      { sv: "läkaren", ar: "الطبيب", phonetic: "/ˈlɛːkarən/" },
      { sv: "sjuksköterskan", ar: "الممرضة", phonetic: "" },
      { sv: "ont", ar: "ألم", phonetic: "/ɔnt/" },
      { sv: "feber", ar: "حمى", phonetic: "/ˈfeːbər/" },
      { sv: "recept", ar: "وصفة طبية", phonetic: "/rɛˈsɛpt/" },
      { sv: "apoteket", ar: "الصيدلية", phonetic: "" },
      { sv: "allergi", ar: "حساسية", phonetic: "" },
      { sv: "försäkringen", ar: "التأمين الصحي", phonetic: "" },
      { sv: "blodtrycket", ar: "ضغط الدم", phonetic: "" },
      { sv: "undersöka", ar: "يفحص", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن الألم: 'ont i'", explanation: "يُستخدم 'ont i' + عضو الجسم للدلالة على الألم", example: "Jag har ont i magen.", exampleAr: "أشعر بألم في بطني." },
      { title: "الفعل المساعد 'kan'", explanation: "يُستخدم 'kan' للاستفسار عن الإمكانية", example: "Kan ni undersöka mig?", exampleAr: "هل يمكنكم فحصي؟" },
    ],
    culturalNotes: "النظام الصحي السويدي عالمي المستوى ومجاني إلى حد كبير للمقيمين. للحصول على موعد، عادةً تتصل بـ'vårdcentralen' (المركز الصحي). في حالات الطوارئ اتصل بـ 112. يمكن الاتصال بـ 1177 للحصول على مشورة صحية باللغة السويدية على مدار الساعة.",
    usefulPhrases: [
      { sv: "Jag behöver en läkare.", ar: "أحتاج إلى طبيب." },
      { sv: "Jag har ont i...", ar: "عندي ألم في..." },
      { sv: "Jag är allergisk mot...", ar: "أنا حساس لـ..." },
      { sv: "Var är närmaste apotek?", ar: "أين أقرب صيدلية؟" },
      { sv: "Kan jag få ett recept?", ar: "هل يمكنني الحصول على وصفة طبية؟" },
      { sv: "Hur länge ska jag ta medicinen?", ar: "كم يجب أن آخذ الدواء؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "سارة", speakerRole: "مريضة", textSv: "Hej, jag mår inte bra. Jag har ont i magen och lite feber.", textAr: "مرحباً، لست بخير. عندي ألم في البطن وحمى خفيفة.", phonetic: "/jaɡ mɔːr ɪnt brɑː/" },
      { speaker: "B", speakerName: "الممرضة", speakerRole: "ممرضة الاستقبال", textSv: "Förstår jag. Sedan hur länge har du haft dessa symptom?", textAr: "أفهم. منذ متى لديكِ هذه الأعراض؟", phonetic: "" },
      { speaker: "A", speakerName: "سارة", speakerRole: "مريضة", textSv: "Sedan igår kväll. Febern är 38,5 grader.", textAr: "منذ مساء أمس. الحمى 38.5 درجة.", phonetic: "" },
      { speaker: "B", speakerName: "الممرضة", speakerRole: "ممرضة الاستقبال", textSv: "Okej. Är du allergisk mot några läkemedel?", textAr: "حسناً. هل أنتِ حساسة لأي أدوية؟", phonetic: "" },
      { speaker: "A", speakerName: "سارة", speakerRole: "مريضة", textSv: "Ja, jag är allergisk mot penicillin.", textAr: "نعم، أنا حساسة للبنسلين.", phonetic: "" },
      { speaker: "B", speakerName: "الممرضة", speakerRole: "ممرضة الاستقبال", textSv: "Bra att veta. Har du sjukförsäkring?", textAr: "من الجيد معرفة ذلك. هل لديكِ تأمين صحي؟", phonetic: "" },
      { speaker: "A", speakerName: "سارة", speakerRole: "مريضة", textSv: "Ja, jag har europeiskt sjukförsäkringskort.", textAr: "نعم، لدي البطاقة الصحية الأوروبية.", phonetic: "" },
      { speaker: "C", speakerName: "الطبيب", speakerRole: "الطبيب", textSv: "God dag! Jag är doktor Lindqvist. Kan du berätta mer om dina symptom?", textAr: "مرحباً! أنا الدكتور لندكفيست. هل يمكنكِ إخباري أكثر عن أعراضكِ؟", phonetic: "" },
      { speaker: "A", speakerName: "سارة", speakerRole: "مريضة", textSv: "Det gör ont hela tiden och jag känner mig illamående.", textAr: "الألم مستمر وأشعر بالغثيان.", phonetic: "/dɛt jʉːr ɔnt ˈhɛːlːa ˈtɪdːən/", noteAr: "'Det gör ont' = يؤلم. 'illamående' = غثيان." },
      { speaker: "C", speakerName: "الطبيب", speakerRole: "الطبيب", textSv: "Jag ska undersöka dig. Kan du lägga dig på britsen?", textAr: "سأفحصكِ. هل يمكنكِ الاستلقاء على طاولة الفحص؟", phonetic: "" },
      { speaker: "A", speakerName: "سارة", speakerRole: "مريضة", textSv: "Självklart.", textAr: "بالطبع.", phonetic: "/ɧɛlvˈklɑːrt/" },
      { speaker: "C", speakerName: "الطبيب", speakerRole: "الطبيب", textSv: "Det verkar vara en maginfluensa. Jag skriver ut ett recept. Ta medicinen tre gånger om dagen med mat.", textAr: "يبدو أنه إنفلونزا معوية. سأكتب لكِ وصفة طبية. تناولي الدواء ثلاث مرات يومياً مع الطعام.", phonetic: "", noteAr: "'tre gånger om dagen' = ثلاث مرات في اليوم." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 3. المدرسة
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På skolan", titleAr: "في المدرسة", scenario: "school",
    category: "تعليم", difficulty: "beginner", emoji: "📚",
    imageUrl: IMG.school, durationMinutes: 10,
    vocabList: [
      { sv: "rektor", ar: "مدير المدرسة", phonetic: "" },
      { sv: "klasslärare", ar: "معلم الصف", phonetic: "" },
      { sv: "klass", ar: "صف / فصل", phonetic: "" },
      { sv: "schema", ar: "جدول دراسي", phonetic: "/ˈɧeːma/" },
      { sv: "lärobok", ar: "كتاب مدرسي", phonetic: "" },
      { sv: "biblioteket", ar: "المكتبة", phonetic: "" },
      { sv: "lunch", ar: "وجبة الغداء", phonetic: "" },
      { sv: "rast", ar: "استراحة", phonetic: "" },
      { sv: "hemläxa", ar: "واجب منزلي", phonetic: "" },
      { sv: "betyg", ar: "درجة / علامة", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال بـ 'Kan du hjälpa mig'", explanation: "طريقة مؤدبة لطلب المساعدة", example: "Kan du hjälpa mig med läxorna?", exampleAr: "هل يمكنك مساعدتي في الواجب؟" },
      { title: "التعبير عن عدم الفهم", explanation: "جمل مهمة في سياق التعلم", example: "Jag förstår inte. Kan du förklara igen?", exampleAr: "لا أفهم. هل يمكنك الشرح مرة أخرى؟" },
    ],
    culturalNotes: "التعليم في السويد مجاني من الصف الأول حتى الجامعة. المدارس السويدية تشجع على الاستقلالية والتفكير النقدي. الغداء المدرسي مجاني لجميع الطلاب. كما أن السويد تقدم دورات مجانية لتعليم السويدية للمهاجرين تُعرف بـ SFI (svenska för invandrare).",
    usefulPhrases: [
      { sv: "Var är klassrummet?", ar: "أين الفصل الدراسي؟" },
      { sv: "Förstår du?", ar: "هل تفهم؟" },
      { sv: "Kan du upprepa det?", ar: "هل يمكنك تكراره؟" },
      { sv: "Jag har glömt boken hemma.", ar: "نسيت الكتاب في المنزل." },
      { sv: "Hur skriver man det?", ar: "كيف يُكتب ذلك؟" },
      { sv: "Kan jag gå på toaletten?", ar: "هل يمكنني الذهاب للحمام؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "مريم", speakerRole: "طالبة جديدة", textSv: "Ursäkta, är du läraren för klass 7B?", textAr: "عفواً، هل أنتِ معلمة الصف 7B؟", phonetic: "" },
      { speaker: "B", speakerName: "السيدة أندرسون", speakerRole: "المعلمة", textSv: "Ja, det är jag! Du måste vara Mariam, vår nya elev. Välkommen!", textAr: "نعم، أنا هي! يجب أن تكوني مريم، طالبتنا الجديدة. أهلاً بكِ!", phonetic: "/ˈvɛlkɔmːən/" },
      { speaker: "A", speakerName: "مريم", speakerRole: "طالبة جديدة", textSv: "Tack! Jag är lite nervös. Det är min första dag.", textAr: "شكراً! أنا متوترة قليلاً. هذا أول يوم لي.", phonetic: "/jaɡ ɛr ˈlɪtːə ˈnɛrˌvøːs/" },
      { speaker: "B", speakerName: "السيدة أندرسون", speakerRole: "المعلمة", textSv: "Det är helt normalt. Har du fått ditt schema?", textAr: "ذلك طبيعي تماماً. هل حصلتِ على جدولكِ الدراسي؟", phonetic: "" },
      { speaker: "A", speakerName: "مريم", speakerRole: "طالبة جديدة", textSv: "Nej, inte än. Och vilka böcker behöver jag?", textAr: "لا، ليس بعد. وأي كتب أحتاجها؟", phonetic: "" },
      { speaker: "B", speakerName: "السيدة أندرسون", speakerRole: "المعلمة", textSv: "Du behöver en matte-bok och en svens kabok. Vi har extra på skolan.", textAr: "تحتاجين كتاب رياضيات وكتاب سويدي. لدينا نسخ إضافية في المدرسة.", phonetic: "" },
      { speaker: "A", speakerName: "مريم", speakerRole: "طالبة جديدة", textSv: "Bra! Förresten, när är lunchen?", textAr: "ممتاز! بالمناسبة، متى يكون الغداء؟", phonetic: "/bɾɑː fœˈrɛstən/" },
      { speaker: "B", speakerName: "السيدة أندرسون", speakerRole: "المعلمة", textSv: "Klockan elva trettio. Maten är alltid gratis för alla elever.", textAr: "الساعة الحادية عشرة والنصف. الطعام دائماً مجاني لجميع الطلاب.", phonetic: "", noteAr: "الغداء المدرسي مجاني في السويد لجميع الأعمار." },
      { speaker: "A", speakerName: "مريم", speakerRole: "طالبة جديدة", textSv: "Vilken tur! En sak till – var är biblioteket?", textAr: "يا للحظ! شيء آخر - أين المكتبة؟", phonetic: "" },
      { speaker: "B", speakerName: "السيدة أندرسون", speakerRole: "المعلمة", textSv: "I tredje våningen, bredvid datasal ett. Du kan låna böcker gratis.", textAr: "في الطابق الثالث، بجانب قاعة الحاسوب الأولى. يمكنكِ استعارة الكتب مجاناً.", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 4. العمل
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På jobbet – Anställningsintervju", titleAr: "مقابلة العمل", scenario: "work",
    category: "عمل", difficulty: "intermediate", emoji: "💼",
    imageUrl: IMG.work, durationMinutes: 15,
    vocabList: [
      { sv: "anställningsintervju", ar: "مقابلة توظيف", phonetic: "" },
      { sv: "erfarenhet", ar: "خبرة", phonetic: "" },
      { sv: "CV / meritförteckning", ar: "السيرة الذاتية", phonetic: "" },
      { sv: "lön", ar: "الراتب", phonetic: "/løːn/" },
      { sv: "arbetstid", ar: "ساعات العمل", phonetic: "" },
      { sv: "kollega", ar: "زميل", phonetic: "" },
      { sv: "heltid / deltid", ar: "دوام كامل / جزئي", phonetic: "" },
      { sv: "semester", ar: "إجازة سنوية", phonetic: "" },
      { sv: "startdatum", ar: "تاريخ البدء", phonetic: "" },
      { sv: "referens", ar: "مرجع / توصية", phonetic: "" },
    ],
    grammarTips: [
      { title: "الحديث عن الخبرة: 'har jobbat med'", explanation: "يُستخدم للتحدث عن الخبرة السابقة", example: "Jag har jobbat med kundtjänst i tre år.", exampleAr: "عملت في خدمة العملاء لمدة ثلاث سنوات." },
      { title: "التعبير عن المهارات: 'behärskar'", explanation: "يعني 'يُتقن' أو 'يجيد'", example: "Jag behärskar svenska och engelska.", exampleAr: "أتقن السويدية والإنجليزية." },
    ],
    culturalNotes: "ثقافة العمل السويدية تتميز بالمساواة والشفافية. يُعدّ التوازن بين العمل والحياة الشخصية (work-life balance) قيمة أساسية. لدى الموظفين في السويد 25 يوم إجازة مدفوعة كحد أدنى. الاجتماعات غالباً تكون غير رسمية وجميع الآراء مرحب بها.",
    usefulPhrases: [
      { sv: "Jag är mycket intresserad av den här tjänsten.", ar: "أنا مهتم جداً بهذه الوظيفة." },
      { sv: "Jag är en lagspelare.", ar: "أنا شخص يعمل ضمن الفريق." },
      { sv: "Vilka är arbetsuppgifterna?", ar: "ما هي مهام العمل؟" },
      { sv: "Kan du berätta mer om företaget?", ar: "هل يمكنك إخباري أكثر عن الشركة؟" },
      { sv: "Har ni flexibel arbetstid?", ar: "هل لديكم ساعات عمل مرنة؟" },
    ],
    lines: [
      { speaker: "B", speakerName: "كريستينا", speakerRole: "مديرة الموارد البشرية", textSv: "Välkommen! Jag heter Kristina Berg. Sätt dig gärna.", textAr: "أهلاً بك! اسمي كريستينا بيرج. تفضل بالجلوس.", phonetic: "/ˈvɛlkɔmːən/" },
      { speaker: "A", speakerName: "خالد", speakerRole: "مرشح للوظيفة", textSv: "Tack! Det är ett nöje att träffas. Jag heter Khaled Mansour.", textAr: "شكراً! يسعدني لقاؤكِ. اسمي خالد منصور.", phonetic: "" },
      { speaker: "B", speakerName: "كريستينا", speakerRole: "مديرة الموارد البشرية", textSv: "Berätta lite om dig själv och din bakgrund.", textAr: "حدثني قليلاً عن نفسك وخلفيتك.", phonetic: "" },
      { speaker: "A", speakerName: "خالد", speakerRole: "مرشح للوظيفة", textSv: "Jag har jobbat som ingenjör i fem år, mestadels med mjukvaruutveckling. Jag behärskar Java och Python.", textAr: "عملت كمهندس لمدة خمس سنوات، معظمها في تطوير البرمجيات. أتقن جافا وبايثون.", phonetic: "" },
      { speaker: "B", speakerName: "كريستينا", speakerRole: "مديرة الموارد البشرية", textSv: "Utmärkt. Varför vill du jobba hos oss?", textAr: "ممتاز. لماذا تريد العمل لدينا؟", phonetic: "/ˈɵtːˌmɛrkt/" },
      { speaker: "A", speakerName: "خالد", speakerRole: "مرشح للوظيفة", textSv: "Ert företag är känt för innovation och bra arbetskultur. Jag vill bidra och växa med er.", textAr: "شركتكم معروفة بالابتكار وثقافة العمل الجيدة. أريد أن أساهم وأنمو معكم.", phonetic: "" },
      { speaker: "B", speakerName: "كريستينا", speakerRole: "مديرة الموارد البشرية", textSv: "Bra svar. Vad är din starkaste egenskap?", textAr: "إجابة جيدة. ما هي أقوى صفاتك؟", phonetic: "" },
      { speaker: "A", speakerName: "خالد", speakerRole: "مرشح للوظيفة", textSv: "Jag är problemlösare och jobbar bra i team. Jag är också väldigt strukturerad.", textAr: "أنا حلّال للمشكلات وأعمل بشكل جيد ضمن الفريق. أنا أيضاً منظم جداً.", phonetic: "" },
      { speaker: "B", speakerName: "كريستينا", speakerRole: "مديرة الموارد البشرية", textSv: "Har du några frågor till oss?", textAr: "هل لديك أي أسئلة لنا؟", phonetic: "" },
      { speaker: "A", speakerName: "خالد", speakerRole: "مرشح للوظيفة", textSv: "Ja, när kan jag förvänta mig besked? Och hur ser möjligheterna till distansarbete ut?", textAr: "نعم، متى يمكنني توقع الرد؟ وكيف هي إمكانيات العمل عن بُعد؟", phonetic: "" },
      { speaker: "B", speakerName: "كريستينا", speakerRole: "مديرة الموارد البشرية", textSv: "Vi hör av oss inom en vecka. Vi erbjuder hybrid-arbete, två dagar hemifrån.", textAr: "سنتواصل معك خلال أسبوع. نقدم عمل هجين، يومان من المنزل.", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 5. المطعم
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På restaurangen", titleAr: "في المطعم", scenario: "restaurant",
    category: "طعام", difficulty: "beginner", emoji: "🍽️",
    imageUrl: IMG.restaurant, durationMinutes: 10,
    vocabList: [
      { sv: "menyn", ar: "القائمة", phonetic: "" },
      { sv: "förrätt", ar: "المقبلات", phonetic: "" },
      { sv: "huvudrätt", ar: "الطبق الرئيسي", phonetic: "" },
      { sv: "dessert", ar: "الحلوى", phonetic: "" },
      { sv: "vegetarisk", ar: "نباتي", phonetic: "" },
      { sv: "allergi", ar: "حساسية", phonetic: "" },
      { sv: "notan", ar: "الحساب / الفاتورة", phonetic: "" },
      { sv: "dricks", ar: "إكرامية (بقشيش)", phonetic: "" },
      { sv: "bordet", ar: "الطاولة", phonetic: "" },
      { sv: "kyparen", ar: "النادل", phonetic: "" },
    ],
    grammarTips: [
      { title: "طلب الطعام: 'Jag skulle vilja ha'", explanation: "صيغة مؤدبة لطلب الطعام - تعني 'أودّ أن أحصل على'", example: "Jag skulle vilja ha köttbullar.", exampleAr: "أودّ أن أحصل على كرات اللحم." },
      { title: "السؤال عن المكونات: 'Innehåller det'", explanation: "للسؤال عن مكونات الطبق", example: "Innehåller det gluten?", exampleAr: "هل يحتوي على غلوتين؟" },
    ],
    culturalNotes: "ثقافة تناول الطعام في السويد هادئة ومريحة. البقشيش (dricks) غير إلزامي لكنه مُقدَّر (عادةً 10%). الماء مجاني في المطاعم. يُعدّ 'Fika' (استراحة القهوة والكعك) جزءاً أساسياً من الثقافة اليومية. الطعام النباتي والخالي من الغلوتين منتشر جداً.",
    usefulPhrases: [
      { sv: "Har ni ett bord för två?", ar: "هل لديكم طاولة لشخصين؟" },
      { sv: "Vad rekommenderar ni?", ar: "ماذا توصون؟" },
      { sv: "Jag är vegetarian.", ar: "أنا نباتي." },
      { sv: "Kan jag få notan, tack?", ar: "هل يمكنني الحصول على الحساب، من فضلك؟" },
      { sv: "Kan vi betala var för sig?", ar: "هل يمكننا الدفع بشكل منفصل؟" },
      { sv: "Det var jättegott!", ar: "كان لذيذاً جداً!" },
    ],
    lines: [
      { speaker: "A", speakerName: "ليلى", speakerRole: "زبونة", textSv: "God kväll! Har ni ett bord för tre personer?", textAr: "مساء الخير! هل لديكم طاولة لثلاثة أشخاص؟", phonetic: "/ɡuːd kvɛlː/" },
      { speaker: "B", speakerName: "النادل", speakerRole: "النادل", textSv: "God kväll! Ja visst, följ mig, tack.", textAr: "مساء الخير! بالتأكيد، تفضلوا معي.", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "زبونة", textSv: "Tack. Kan vi få menyn?", textAr: "شكراً. هل يمكننا الحصول على القائمة؟", phonetic: "" },
      { speaker: "B", speakerName: "النادل", speakerRole: "النادل", textSv: "Naturligtvis. Vill ni ha något att dricka medan ni bestämmer er?", textAr: "بالطبع. هل تريدون شيئاً للشرب بينما تختارون؟", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "زبونة", textSv: "Vatten, tack. Och jag undrar – har ni vegetariska alternativ?", textAr: "ماء، من فضلك. وأتساءل - هل لديكم خيارات نباتية؟", phonetic: "" },
      { speaker: "B", speakerName: "النادل", speakerRole: "النادل", textSv: "Absolut! Vi har flera vegetariska rätter. Vår linsgryta är väldigt populär.", textAr: "بالتأكيد! لدينا عدة أطباق نباتية. يخنة العدس لدينا شعبية جداً.", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "زبونة", textSv: "Jag skulle vilja ha linsgryta, tack. Och är köttbullarna halal?", textAr: "أودّ أن أطلب يخنة العدس، شكراً. وهل كرات اللحم حلال؟", phonetic: "" },
      { speaker: "B", speakerName: "النادل", speakerRole: "النادل", textSv: "Tyvärr är de inte det. Men vi har halalmat på menyn – kyckling eller lamm.", textAr: "للأسف لا. لكن لدينا طعام حلال في القائمة - دجاج أو لحم ضأن.", phonetic: "/ˈtʏvɛr/", noteAr: "'Tyvärr' = للأسف. كلمة مهمة جداً!" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "زبونة", textSv: "Perfekt, jag tar kycklingen. Kan jag få notan efteråt?", textAr: "ممتاز، سآخذ الدجاج. هل يمكنني الحصول على الحساب بعد ذلك؟", phonetic: "" },
      { speaker: "B", speakerName: "النادل", speakerRole: "النادل", textSv: "Självklart. Varsågod, njut av maten!", textAr: "بالطبع. تفضلوا، استمتعوا بالطعام!", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 6. الفندق
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På hotellet", titleAr: "في الفندق", scenario: "hotel",
    category: "سفر", difficulty: "beginner", emoji: "🏨",
    imageUrl: IMG.hotel, durationMinutes: 10,
    vocabList: [
      { sv: "receptionen", ar: "الاستقبال", phonetic: "" },
      { sv: "rummet", ar: "الغرفة", phonetic: "" },
      { sv: "incheckning", ar: "تسجيل الوصول", phonetic: "" },
      { sv: "utcheckning", ar: "مغادرة الفندق", phonetic: "" },
      { sv: "frukosten", ar: "الفطور", phonetic: "" },
      { sv: "nyckeln", ar: "المفتاح", phonetic: "" },
      { sv: "wifi-lösenordet", ar: "كلمة مرور الواي فاي", phonetic: "" },
      { sv: "städning", ar: "التنظيف", phonetic: "" },
      { sv: "minibar", ar: "ثلاجة صغيرة في الغرفة", phonetic: "" },
      { sv: "extra kudde", ar: "وسادة إضافية", phonetic: "" },
    ],
    grammarTips: [
      { title: "طلب الخدمة: 'Kan jag beställa'", explanation: "للطلب في الفندق", example: "Kan jag beställa frukost på rummet?", exampleAr: "هل يمكنني طلب الفطور إلى الغرفة؟" },
      { title: "الشكوى بلطف: 'Det verkar vara ett problem'", explanation: "طريقة مؤدبة للتعبير عن مشكلة", example: "Det verkar vara ett problem med värmen.", exampleAr: "يبدو أن هناك مشكلة في التدفئة." },
    ],
    culturalNotes: "الفنادق السويدية معروفة بنظافتها وتنظيمها. الفطور السويدي (svensk frukost) عادةً بوفيه غني يشمل الجبن والسلامي والخبز والفاكهة. غرف التدخين نادرة جداً. بطاقة الغرفة الإلكترونية شائعة. وقت تسجيل الوصول عادةً الساعة 3 مساءً والمغادرة 11 صباحاً.",
    usefulPhrases: [
      { sv: "Jag har en bokning.", ar: "لدي حجز." },
      { sv: "Kan jag få wifi-lösenordet?", ar: "هل يمكنني الحصول على كلمة مرور الواي فاي؟" },
      { sv: "Är frukost inkluderat?", ar: "هل الفطور مشمول؟" },
      { sv: "Rummet är inte städat.", ar: "الغرفة لم تُنظَّف." },
      { sv: "Kan jag byta rum?", ar: "هل يمكنني تغيير الغرفة؟" },
      { sv: "Vad är utcheckningstiden?", ar: "ما هو وقت المغادرة؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "عمر", speakerRole: "نزيل", textSv: "God eftermiddag! Jag heter Omar Hassan. Jag har en bokning för tre nätter.", textAr: "مساء الخير! اسمي عمر حسن. لدي حجز لثلاث ليالٍ.", phonetic: "" },
      { speaker: "B", speakerName: "موظف الاستقبال", speakerRole: "موظف الاستقبال", textSv: "Välkommen till Hotel Vasa! Kan jag få se ditt ID?", textAr: "أهلاً بك في فندق فازا! هل يمكنني رؤية هويتك؟", phonetic: "" },
      { speaker: "A", speakerName: "عمر", speakerRole: "نزيل", textSv: "Varsågod. Jag har bokat ett dubbelrum med havsutsikt.", textAr: "تفضل. لقد حجزت غرفة مزدوجة بإطلالة على البحر.", phonetic: "" },
      { speaker: "B", speakerName: "موظف الاستقبال", speakerRole: "موظف الاستقبال", textSv: "Perfekt. Frukost ingår och serveras klockan 7-10 i restaurangen.", textAr: "ممتاز. الفطور مشمول ويُقدَّم من 7 إلى 10 في المطعم.", phonetic: "" },
      { speaker: "A", speakerName: "عمر", speakerRole: "نزيل", textSv: "Bra! Vad är wifi-lösenordet?", textAr: "جيد! ما هي كلمة مرور الواي فاي؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف الاستقبال", speakerRole: "موظف الاستقبال", textSv: "Det är HotelVasa2024. Här är ditt rum, nummer 412 på fjärde våningen.", textAr: "إنها HotelVasa2024. هذه غرفتك، رقم 412 في الطابق الرابع.", phonetic: "" },
      { speaker: "A", speakerName: "عمر", speakerRole: "نزيل", textSv: "Tack. Förresten, är det möjligt att få sen utcheckning?", textAr: "شكراً. بالمناسبة، هل من الممكن المغادرة المتأخرة؟", phonetic: "", noteAr: "'sen utcheckning' = late check-out" },
      { speaker: "B", speakerName: "موظف الاستقبال", speakerRole: "موظف الاستقبال", textSv: "Vi kan erbjuda klockan 13 utan extra kostnad. Njut av din vistelse!", textAr: "يمكننا تقديم الساعة 1 ظهراً بدون رسوم إضافية. استمتع بإقامتك!", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 7. التسوق
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "I affären – Shopping", titleAr: "في التسوق", scenario: "shopping",
    category: "تسوق", difficulty: "beginner", emoji: "🛒",
    imageUrl: IMG.shopping, durationMinutes: 10,
    vocabList: [
      { sv: "storleken", ar: "المقاس", phonetic: "" },
      { sv: "priset", ar: "السعر", phonetic: "" },
      { sv: "rabatt", ar: "خصم", phonetic: "" },
      { sv: "kassan", ar: "الصندوق / كاشير", phonetic: "" },
      { sv: "kvittot", ar: "الوصل / الإيصال", phonetic: "" },
      { sv: "prova", ar: "يجرب / يلبس", phonetic: "" },
      { sv: "provrum", ar: "غرفة القياس", phonetic: "" },
      { sv: "återlämning", ar: "إعادة المنتج", phonetic: "" },
      { sv: "kreditkort", ar: "بطاقة ائتمان", phonetic: "" },
      { sv: "rea", ar: "تخفيضات", phonetic: "/reː ɑː/" },
    ],
    grammarTips: [
      { title: "السؤال عن المقاس: 'Har ni det i'", explanation: "للسؤال عن توفر مقاس معين", example: "Har ni det i storlek medium?", exampleAr: "هل لديكم هذا بمقاس متوسط؟" },
      { title: "التعبير عن الرأي: 'Det passar bra'", explanation: "للتعبير عن أن الملابس مناسبة", example: "Det passar perfekt!", exampleAr: "إنه مناسب تماماً!" },
    ],
    culturalNotes: "التسوق في السويد سلس ومنظم. الاستدامة مهمة جداً للسويديين - المتاجر كـ H&M وIKEA سويدية الأصل. تُستخدم Swish (تطبيق للدفع) بكثرة. أكياس التسوق ليست مجانية. فترة إعادة المنتجات عادةً 30 يوماً مع الوصل.",
    usefulPhrases: [
      { sv: "Hur mycket kostar det?", ar: "كم يكلف هذا؟" },
      { sv: "Har ni det i en annan färg?", ar: "هل لديكم هذا بلون آخر؟" },
      { sv: "Var är provrummet?", ar: "أين غرفة القياس؟" },
      { sv: "Det är för stort / litet.", ar: "إنه كبير / صغير جداً." },
      { sv: "Jag vill returnera det här.", ar: "أريد إعادة هذا." },
      { sv: "Tar ni Swish?", ar: "هل تقبلون Swish؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "نور", speakerRole: "زبونة", textSv: "Ursäkta, kan du hjälpa mig hitta rätt storlek?", textAr: "عفواً، هل يمكنك مساعدتي في إيجاد المقاس الصحيح؟", phonetic: "" },
      { speaker: "B", speakerName: "البائع", speakerRole: "موظف المحل", textSv: "Självklart! Vad letar du efter?", textAr: "بالطبع! ما الذي تبحثين عنه؟", phonetic: "" },
      { speaker: "A", speakerName: "نور", speakerRole: "زبونة", textSv: "Den här jackan – har ni den i storlek S?", textAr: "هذه الجاكيت - هل لديكم مقاس S؟", phonetic: "" },
      { speaker: "B", speakerName: "البائع", speakerRole: "موظف المحل", textSv: "Låt mig kolla. Ja, vi har en S kvar i den svarta färgen.", textAr: "دعني أتحقق. نعم، لدينا مقاس S في اللون الأسود.", phonetic: "" },
      { speaker: "A", speakerName: "نور", speakerRole: "زبونة", textSv: "Kan jag prova den? Var är provrummet?", textAr: "هل يمكنني تجربتها؟ أين غرفة القياس؟", phonetic: "" },
      { speaker: "B", speakerName: "البائع", speakerRole: "موظف المحل", textSv: "Provrummen är i hörnet till vänster. Ta den med dig!", textAr: "غرف القياس في الزاوية على اليسار. خذيها معكِ!", phonetic: "" },
      { speaker: "A", speakerName: "نور", speakerRole: "زبونة", textSv: "Perfekt, den passar jättebra! Hur mycket kostar den?", textAr: "ممتاز، إنها تناسبني جيداً جداً! كم تكلف؟", phonetic: "" },
      { speaker: "B", speakerName: "البائع", speakerRole: "موظف المحل", textSv: "Den kostar 899 kronor. Men idag är den på 20% rea!", textAr: "تكلف 899 كرونة. لكن اليوم عليها خصم 20%!", phonetic: "", noteAr: "'rea' تعني تخفيضات في السويدية." },
      { speaker: "A", speakerName: "نور", speakerRole: "زبونة", textSv: "Bra! Tar ni kort eller Swish?", textAr: "جيد! هل تقبلون البطاقة أو Swish؟", phonetic: "" },
      { speaker: "B", speakerName: "البائع", speakerRole: "موظف المحل", textSv: "Vi tar båda. Vill du ha ett kvitto?", textAr: "نقبل كليهما. هل تريدين وصلاً؟", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 8. الشرطة
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På polisstationen", titleAr: "في مركز الشرطة", scenario: "police",
    category: "رسمي", difficulty: "intermediate", emoji: "👮",
    imageUrl: IMG.police, durationMinutes: 12,
    vocabList: [
      { sv: "polisen", ar: "الشرطة", phonetic: "" },
      { sv: "anmälan", ar: "البلاغ", phonetic: "" },
      { sv: "stölden", ar: "السرقة", phonetic: "" },
      { sv: "plånboken", ar: "المحفظة", phonetic: "" },
      { sv: "mobiltelefonen", ar: "الهاتف المحمول", phonetic: "" },
      { sv: "vittne", ar: "شاهد", phonetic: "" },
      { sv: "händelsen", ar: "الحادثة", phonetic: "" },
      { sv: "signalement", ar: "الوصف / الهيئة", phonetic: "" },
      { sv: "ärendenummer", ar: "رقم البلاغ", phonetic: "" },
      { sv: "försäkringen", ar: "التأمين", phonetic: "" },
    ],
    grammarTips: [
      { title: "الإبلاغ عن حادثة: 'Jag vill anmäla'", explanation: "للإبلاغ عن جريمة أو حادثة", example: "Jag vill anmäla en stöld.", exampleAr: "أريد الإبلاغ عن سرقة." },
      { title: "وصف الوقت والمكان", explanation: "استخدام 'klockan' للوقت و'på/vid' للمكان", example: "Det hände klockan tre vid centralstationen.", exampleAr: "حدث ذلك الساعة الثالثة بالقرب من محطة المركزية." },
    ],
    culturalNotes: "الشرطة السويدية (Polisen) معروفة بالمهنية. رقم الطوارئ هو 112. يمكن تقديم البلاغ عبر الموقع الإلكتروني polisen.se أيضاً. يحق لك الحصول على مترجم مجاني إذا لم تكن تتحدث السويدية. احتفظ دائماً برقم البلاغ (ärendenummer) لاستخدامه مع شركة التأمين.",
    usefulPhrases: [
      { sv: "Jag vill göra en anmälan.", ar: "أريد تقديم بلاغ." },
      { sv: "Jag har blivit rånad.", ar: "لقد تم سرقتي / اعترضني لص." },
      { sv: "Kan jag få en tolk?", ar: "هل يمكنني الحصول على مترجم؟" },
      { sv: "Vad är ärendenumret?", ar: "ما هو رقم البلاغ؟" },
      { sv: "Det hände för en timme sedan.", ar: "حدث ذلك قبل ساعة." },
    ],
    lines: [
      { speaker: "A", speakerName: "كريم", speakerRole: "مواطن", textSv: "God dag. Jag vill göra en anmälan. Min plånbok har blivit stulen.", textAr: "مرحباً. أريد تقديم بلاغ. لقد سُرقت محفظتي.", phonetic: "" },
      { speaker: "B", speakerName: "الضابط", speakerRole: "ضابط الشرطة", textSv: "Beklagar att höra det. Var hände det och när?", textAr: "أتأسف لسماع ذلك. أين ومتى حدث ذلك؟", phonetic: "" },
      { speaker: "A", speakerName: "كريم", speakerRole: "مواطن", textSv: "Det hände på tunnelbanan, linje 17, för ungefär en timme sedan.", textAr: "حدث ذلك في المترو، الخط 17، قبل ساعة تقريباً.", phonetic: "" },
      { speaker: "B", speakerName: "الضابط", speakerRole: "ضابط الشرطة", textSv: "Okej. Vad fanns det i plånboken?", textAr: "حسناً. ماذا كان في المحفظة؟", phonetic: "" },
      { speaker: "A", speakerName: "كريم", speakerRole: "مواطن", textSv: "Mitt bankkort, 500 kronor kontant och mitt körkort.", textAr: "بطاقتي البنكية، 500 كرونة نقداً ورخصة القيادة.", phonetic: "" },
      { speaker: "B", speakerName: "الضابط", speakerRole: "ضابط الشرطة", textSv: "Har du sett vem som tog den? Kan du beskriva personen?", textAr: "هل رأيت من أخذها؟ هل يمكنك وصف الشخص؟", phonetic: "" },
      { speaker: "A", speakerName: "كريم", speakerRole: "مواطن", textSv: "Det var en man, ungefär 30 år, lång med mörkblå jacka.", textAr: "كان رجلاً، حوالي 30 عاماً، طويل القامة بجاكيت أزرق داكن.", phonetic: "" },
      { speaker: "B", speakerName: "الضابط", speakerRole: "ضابط الشرطة", textSv: "Tack. Vi registrerar anmälan nu. Här är ditt ärendenummer för försäkringen.", textAr: "شكراً. سنسجل البلاغ الآن. هذا رقم بلاغك للتأمين.", phonetic: "", noteAr: "احتفظ برقم البلاغ للتأمين." },
      { speaker: "A", speakerName: "كريم", speakerRole: "مواطن", textSv: "Ska jag blockera mitt bankkort?", textAr: "هل يجب أن أحجب بطاقتي البنكية؟", phonetic: "" },
      { speaker: "B", speakerName: "الضابط", speakerRole: "ضابط الشرطة", textSv: "Ja, gör det omedelbart! Ring din bank direkt.", textAr: "نعم، افعل ذلك فوراً! اتصل ببنكك مباشرةً.", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 9. البنك
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På banken", titleAr: "في البنك", scenario: "bank",
    category: "رسمي", difficulty: "intermediate", emoji: "🏦",
    imageUrl: IMG.bank, durationMinutes: 12,
    vocabList: [
      { sv: "konto", ar: "حساب بنكي", phonetic: "" },
      { sv: "insättning", ar: "إيداع", phonetic: "" },
      { sv: "uttag", ar: "سحب", phonetic: "" },
      { sv: "överföring", ar: "تحويل", phonetic: "" },
      { sv: "räntan", ar: "الفائدة", phonetic: "" },
      { sv: "bankkort", ar: "بطاقة بنكية", phonetic: "" },
      { sv: "PIN-kod", ar: "الرمز السري", phonetic: "" },
      { sv: "bankID", ar: "هوية بنكية رقمية", phonetic: "" },
      { sv: "växla valuta", ar: "صرف العملة", phonetic: "" },
      { sv: "autogiro", ar: "خصم تلقائي", phonetic: "" },
    ],
    grammarTips: [
      { title: "طلب المساعدة: 'Jag skulle vilja öppna'", explanation: "طريقة رسمية لطلب الخدمة", example: "Jag skulle vilja öppna ett sparkonto.", exampleAr: "أودّ فتح حساب توفير." },
      { title: "السؤال عن الرسوم: 'Kostar det något'", explanation: "للاستفسار عن التكاليف", example: "Kostar det något att skicka pengar utomlands?", exampleAr: "هل هناك رسوم لإرسال الأموال للخارج؟" },
    ],
    culturalNotes: "السويد من أقل المجتمعات استخداماً للنقد في العالم. BankID هو نظام التحقق الرقمي الوطني ويُستخدم لكل شيء تقريباً. Swish هو تطبيق الدفع الأكثر شيوعاً. معظم البنوك لديها خدمات رقمية متكاملة. فتح حساب بنكي يتطلب عادةً بطاقة هوية سارية وعنوان إقامة في السويد.",
    usefulPhrases: [
      { sv: "Jag vill öppna ett konto.", ar: "أريد فتح حساب." },
      { sv: "Kan jag växla euro till kronor?", ar: "هل يمكنني صرف يورو إلى كرونة؟" },
      { sv: "Vad är dagens kurs?", ar: "ما هو سعر الصرف اليوم؟" },
      { sv: "Jag har glömt min PIN-kod.", ar: "لقد نسيت رمزي السري." },
      { sv: "Kan jag få ett kontoutdrag?", ar: "هل يمكنني الحصول على كشف حساب؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "إياد", speakerRole: "عميل", textSv: "God morgon. Jag är ny i Sverige och skulle vilja öppna ett bankkonto.", textAr: "صباح الخير. أنا جديد في السويد وأودّ فتح حساب بنكي.", phonetic: "" },
      { speaker: "B", speakerName: "مستشار البنك", speakerRole: "مستشار البنك", textSv: "Välkommen! Det är vi glada att höra. Vilket typ av konto vill du ha?", textAr: "أهلاً بك! يسعدنا ذلك. ما نوع الحساب الذي تريده؟", phonetic: "" },
      { speaker: "A", speakerName: "إياد", speakerRole: "عميل", textSv: "Ett vanligt lönekonto och kanske ett sparkonto.", textAr: "حساب راتب عادي وربما حساب توفير.", phonetic: "" },
      { speaker: "B", speakerName: "مستشار البنك", speakerRole: "مستشار البنك", textSv: "Bra val. Har du personnummer?", textAr: "اختيار جيد. هل لديك رقم شخصي (personnummer)؟", phonetic: "", noteAr: "personnummer هو الرقم الشخصي الوطني في السويد، ضروري لمعظم الخدمات." },
      { speaker: "A", speakerName: "إياد", speakerRole: "عميل", textSv: "Ja, jag fick det förra veckan från Skatteverket.", textAr: "نعم، حصلت عليه الأسبوع الماضي من مصلحة الضرائب.", phonetic: "" },
      { speaker: "B", speakerName: "مستشار البنك", speakerRole: "مستشار البنك", textSv: "Perfekt. Du behöver också BankID – det är som en digital signatur.", textAr: "ممتاز. ستحتاج أيضاً إلى BankID - وهو كالتوقيع الرقمي.", phonetic: "" },
      { speaker: "A", speakerName: "إياد", speakerRole: "عميل", textSv: "Kan jag också växla pengar? Jag har euro.", textAr: "هل يمكنني أيضاً صرف العملة؟ لدي يورو.", phonetic: "" },
      { speaker: "B", speakerName: "مستشار البنك", speakerRole: "مستشار البنك", textSv: "Ja, vi har valutaväxling här. Kursen idag är 11,20 kronor per euro.", textAr: "نعم، لدينا صرف عملات هنا. السعر اليوم هو 11.20 كرونة لكل يورو.", phonetic: "" },
      { speaker: "A", speakerName: "إياد", speakerRole: "عميل", textSv: "Tack. Kostar det något att öppna kontot?", textAr: "شكراً. هل هناك رسوم لفتح الحساب؟", phonetic: "" },
      { speaker: "B", speakerName: "مستشار البنك", speakerRole: "مستشار البنك", textSv: "Nej, det är gratis. Vi skickar kortet hem till dig inom fem dagar.", textAr: "لا، إنه مجاني. سنرسل البطاقة إلى منزلك خلال خمسة أيام.", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 10. المواصلات
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Kollektivtrafiken", titleAr: "المواصلات العامة", scenario: "transport",
    category: "سفر", difficulty: "beginner", emoji: "🚌",
    imageUrl: IMG.transport, durationMinutes: 10,
    vocabList: [
      { sv: "hållplatsen", ar: "محطة الوقوف", phonetic: "" },
      { sv: "biljettenmaskin", ar: "ماكينة التذاكر", phonetic: "" },
      { sv: "reskort", ar: "بطاقة التنقل", phonetic: "" },
      { sv: "perrong", ar: "رصيف القطار", phonetic: "" },
      { sv: "försenad", ar: "متأخر", phonetic: "" },
      { sv: "slutstation", ar: "المحطة الأخيرة", phonetic: "" },
      { sv: "bytes", ar: "تغيير الوسيلة", phonetic: "" },
      { sv: "enkelbiljett", ar: "تذكرة ذهاب", phonetic: "" },
      { sv: "månadskort", ar: "تذكرة شهرية", phonetic: "" },
      { sv: "spårvagn", ar: "ترام", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن الاتجاهات: 'Hur kommer jag till'", explanation: "للسؤال عن كيفية الوصول لمكان", example: "Hur kommer jag till Centralstationen?", exampleAr: "كيف أصل إلى المحطة المركزية؟" },
      { title: "التعبير عن المدة: 'Det tar'", explanation: "للتعبير عن وقت الرحلة", example: "Det tar ungefär tjugo minuter.", exampleAr: "يستغرق حوالي عشرين دقيقة." },
    ],
    culturalNotes: "السويد تمتلك شبكة نقل عامة متطورة جداً. في ستوكهولم، يمكن استخدام SL-kortet (بطاقة النقل) في المترو والحافلات والترام. يمكن شراء التذاكر عبر التطبيق. الدراجة الهوائية وسيلة نقل شعبية جداً خاصة في المدن الصغيرة. القطارات (SJ) تربط المدن الكبرى.",
    usefulPhrases: [
      { sv: "Vilken linje går till centrum?", ar: "أي خط يذهب إلى المركز؟" },
      { sv: "Var byter jag?", ar: "أين أغير الوسيلة؟" },
      { sv: "Är nästa station Odenplan?", ar: "هل المحطة القادمة أودنبلان؟" },
      { sv: "Hur länge tar resan?", ar: "كم تستغرق الرحلة؟" },
      { sv: "Är tåget försenat?", ar: "هل القطار متأخر؟" },
      { sv: "Kan jag ta med cykel?", ar: "هل يمكنني أخذ الدراجة معي؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "هاني", speakerRole: "مسافر", textSv: "Ursäkta, hur kommer jag till Gamla Stan härifrån?", textAr: "عفواً، كيف أصل إلى المدينة القديمة من هنا؟", phonetic: "" },
      { speaker: "B", speakerName: "المسافر السويدي", speakerRole: "مسافر محلي", textSv: "Du kan ta tunnelbana, röda linjen mot Norsborg. Gamla Stan är tre stationer bort.", textAr: "يمكنك أخذ المترو، الخط الأحمر باتجاه نورسبورج. المدينة القديمة على بعد ثلاث محطات.", phonetic: "" },
      { speaker: "A", speakerName: "هاني", speakerRole: "مسافر", textSv: "Tack! Var köper jag biljett?", textAr: "شكراً! أين أشتري التذكرة؟", phonetic: "" },
      { speaker: "B", speakerName: "المسافر السويدي", speakerRole: "مسافر محلي", textSv: "I automaten eller via SL-appen på mobilen. En enkelbiljett kostar 39 kronor.", textAr: "في الماكينة أو عبر تطبيق SL على الهاتف. تذكرة الذهاب تكلف 39 كرونة.", phonetic: "" },
      { speaker: "A", speakerName: "هاني", speakerRole: "مسافر", textSv: "Och hur länge tar resan?", textAr: "وكم تستغرق الرحلة؟", phonetic: "" },
      { speaker: "B", speakerName: "المسافر السويدي", speakerRole: "مسافر محلي", textSv: "Ungefär åtta minuter utan byten. Väldigt smidigt!", textAr: "حوالي ثماني دقائق بدون تغيير. سلس جداً!", phonetic: "" },
      { speaker: "A", speakerName: "هاني", speakerRole: "مسافر", textSv: "Kan jag också gå med Swish vid automaten?", textAr: "هل يمكنني أيضاً الدفع بـ Swish في الماكينة؟", phonetic: "" },
      { speaker: "B", speakerName: "المسافر السويدي", speakerRole: "مسافر محلي", textSv: "Ja, eller kort. Kontanter tar de inte längre.", textAr: "نعم، أو بطاقة. لم يعودوا يقبلون النقد.", phonetic: "", noteAr: "السويد تتجه نحو مجتمع بلا نقد تقريباً." },
      { speaker: "A", speakerName: "هاني", speakerRole: "مسافر", textSv: "Intressant! Tack för hjälpen.", textAr: "مثير للاهتمام! شكراً على المساعدة.", phonetic: "" },
      { speaker: "B", speakerName: "المسافر السويدي", speakerRole: "مسافر محلي", textSv: "Ingen fara! Ha en bra dag i Stockholm!", textAr: "لا شكر على واجب! أتمنى لك يوماً جميلاً في ستوكهولم!", phonetic: "/ɪŋːən ˈfɑːra/" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 11. الطوارئ
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Nödsituationen – Ring 112", titleAr: "الطوارئ - اتصل 112", scenario: "emergency",
    category: "طوارئ", difficulty: "intermediate", emoji: "🚨",
    imageUrl: IMG.emergency, durationMinutes: 10,
    vocabList: [
      { sv: "nödsituationen", ar: "الطوارئ / الأزمة", phonetic: "" },
      { sv: "ambulansen", ar: "سيارة الإسعاف", phonetic: "" },
      { sv: "brandkåren", ar: "سيارة الإطفاء", phonetic: "" },
      { sv: "polisen", ar: "الشرطة", phonetic: "" },
      { sv: "medvetslös", ar: "فاقد الوعي", phonetic: "" },
      { sv: "andas", ar: "يتنفس", phonetic: "" },
      { sv: "hjärtattack", ar: "نوبة قلبية", phonetic: "" },
      { sv: "branden", ar: "الحريق", phonetic: "" },
      { sv: "adressen", ar: "العنوان", phonetic: "" },
      { sv: "HLR / hjärt-lungräddning", ar: "الإسعافات الأولية / الإنعاش القلبي", phonetic: "" },
    ],
    grammarTips: [
      { title: "الإبلاغ عن طارئ", explanation: "ابدأ دائماً بوصف الحالة ثم الموقع", example: "Det är en olycka på Kungsgatan 15.", exampleAr: "هناك حادث في كونغسغاتان 15." },
      { title: "وصف الحالة الطبية", explanation: "استخدم المضارع للتعبير عما يحدث الآن", example: "Han andas inte och är medvetslös.", exampleAr: "هو لا يتنفس وفاقد للوعي." },
    ],
    culturalNotes: "رقم الطوارئ الأوروبي الموحد 112 يعمل في السويد. يمكن الاتصال 24/7 وخدماتهم مجانية. للاستشارة الطبية غير العاجلة: اتصل بـ 1177. احفظ عنوانك أو استخدم تطبيق الخرائط لتحديد موقعك قبل الاتصال. دورات الإسعافات الأولية (HLR) منتشرة ومجانية في كثير من الأحيان.",
    usefulPhrases: [
      { sv: "Hjälp! Det är en nödsituation!", ar: "مساعدة! هذه حالة طوارئ!" },
      { sv: "Ring 112 omedelbart!", ar: "اتصل بـ 112 فوراً!" },
      { sv: "Skicka en ambulans!", ar: "أرسل إسعافاً!" },
      { sv: "Han/Hon andas inte.", ar: "هو/هي لا يتنفس." },
      { sv: "Det är brand!", ar: "هناك حريق!" },
      { sv: "Min adress är...", ar: "عنواني هو..." },
    ],
    lines: [
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "SOS Alarm, vad har hänt?", textAr: "SOS إنذار، ماذا حدث؟", phonetic: "" },
      { speaker: "A", speakerName: "رنا", speakerRole: "مبلّغة", textSv: "Hjälp! Min granne har ramlat och är medvetslös!", textAr: "مساعدة! جاري سقط وفقد وعيه!", phonetic: "/jɛlːp mɪn ˈɡranːe har ˈramːat/", noteAr: "ابدأ دائماً بـ 'Hjälp!' في الطوارئ." },
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "Okej, håll dig lugn. Vad är adressen?", textAr: "حسناً، ابقي هادئة. ما هو العنوان؟", phonetic: "" },
      { speaker: "A", speakerName: "رنا", speakerRole: "مبلّغة", textSv: "Storgatan 45, lägenhet 3B, i Göteborg.", textAr: "ستورغاتان 45، شقة 3B، في يوتيبوري.", phonetic: "" },
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "Bra. Andas han? Kan du kontrollera?", textAr: "جيد. هل يتنفس؟ هل يمكنك التحقق؟", phonetic: "" },
      { speaker: "A", speakerName: "رنا", speakerRole: "مبلّغة", textSv: "Vänta... Nej, det verkar som att han inte andas!", textAr: "انتظري... لا، يبدو أنه لا يتنفس!", phonetic: "" },
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "Ambulansen är på väg. Börja med HLR nu – tryckt på bröstet 30 gånger.", textAr: "سيارة الإسعاف في الطريق. ابدئي بالإنعاش القلبي الآن - اضغطي على الصدر 30 مرة.", phonetic: "" },
      { speaker: "A", speakerName: "رنا", speakerRole: "مبلّغة", textSv: "Okej, jag gör det! Hur snabbt kommer ambulansen?", textAr: "حسناً، أفعل ذلك! متى تصل سيارة الإسعاف؟", phonetic: "" },
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "Inom fem minuter. Fortsätt med HLR. Jag stannar kvar på linjen.", textAr: "خلال خمس دقائق. استمري بالإنعاش. سأبقى على الخط.", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 12. الحياة اليومية
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Vardagslivet – Hos grannen", titleAr: "الحياة اليومية – مع الجار", scenario: "daily",
    category: "يومي", difficulty: "beginner", emoji: "☀️",
    imageUrl: IMG.daily, durationMinutes: 8,
    vocabList: [
      { sv: "grannen", ar: "الجار", phonetic: "" },
      { sv: "trappuppgången", ar: "درج البناية", phonetic: "" },
      { sv: "soporna", ar: "القمامة", phonetic: "" },
      { sv: "lånar", ar: "يستعير", phonetic: "" },
      { sv: "socker", ar: "سكر", phonetic: "" },
      { sv: "bjuder", ar: "يدعو / يعزم", phonetic: "" },
      { sv: "mysigt", ar: "دافئ ومريح", phonetic: "" },
      { sv: "väder", ar: "الطقس", phonetic: "" },
      { sv: "vintern", ar: "الشتاء", phonetic: "" },
      { sv: "semestern", ar: "العطلة", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعابير اليومية: 'Hur är läget?'", explanation: "تعبير غير رسمي يعني 'كيف الحال؟'", example: "Hur är läget? – Det är bra, tack!", exampleAr: "كيف الحال؟ - بخير، شكراً!" },
      { title: "صيغة الطلب اللطيف: 'Får jag låna'", explanation: "طريقة مؤدبة لطلب استعارة شيء", example: "Får jag låna en kopp mjöl?", exampleAr: "هل يمكنني استعارة كوب دقيق؟" },
    ],
    culturalNotes: "العلاقات مع الجيران في السويد عادةً محترمة ومتحفظة. السويديون يحبون الهدوء والخصوصية، لكنهم ودودون جداً حين تتحدث إليهم. 'Fika' مع الجيران تقليد اجتماعي لطيف. الضجيج بعد الساعة 10 مساءً يُعدّ غير مقبول في المجمعات السكنية.",
    usefulPhrases: [
      { sv: "God morgon, grannen!", ar: "صباح الخير أيها الجار!" },
      { sv: "Hur mår du?", ar: "كيف حالك؟" },
      { sv: "Vädret är fint idag!", ar: "الطقس جميل اليوم!" },
      { sv: "Kan du vara lite tystare?", ar: "هل يمكنك الهدوء قليلاً؟" },
      { sv: "Vi ses!", ar: "إلى اللقاء!" },
      { sv: "Trevlig helg!", ar: "عطلة نهاية أسبوع ممتعة!" },
    ],
    lines: [
      { speaker: "A", speakerName: "دينا", speakerRole: "جارة", textSv: "Hej Erik! God morgon. Hur mår du?", textAr: "مرحباً إيريك! صباح الخير. كيف حالك؟", phonetic: "" },
      { speaker: "B", speakerName: "إيريك", speakerRole: "الجار", textSv: "Hej Dina! Jo tack, det är bra! Lite trött men okej. Och du?", textAr: "مرحباً دينا! بخير، شكراً! متعب قليلاً لكن على ما يرام. وأنتِ؟", phonetic: "" },
      { speaker: "A", speakerName: "دينا", speakerRole: "جارة", textSv: "Bra tack! Vädret är fint idag, äntligen!", textAr: "بخير، شكراً! الطقس جميل اليوم، أخيراً!", phonetic: "" },
      { speaker: "B", speakerName: "إيريك", speakerRole: "الجار", textSv: "Ja, det var länge sedan! Vintern var lång i år.", textAr: "نعم، مضى وقت طويل! كان الشتاء طويلاً هذا العام.", phonetic: "" },
      { speaker: "A", speakerName: "دينا", speakerRole: "جارة", textSv: "Förresten, får jag låna lite socker? Jag ska baka.", textAr: "بالمناسبة، هل يمكنني استعارة بعض السكر؟ سأخبز.", phonetic: "" },
      { speaker: "B", speakerName: "إيريك", speakerRole: "الجار", textSv: "Självklart! Ska du baka kanelbullar?", textAr: "بالطبع! هل ستخبزين لفائف القرفة؟", phonetic: "", noteAr: "kanelbullar = لفائف القرفة، الأكثر شعبيةً في السويد!" },
      { speaker: "A", speakerName: "دينا", speakerRole: "جارة", textSv: "Ja! Vill du ha en kopp kaffe och en bulle när de är klara?", textAr: "نعم! هل تريد كوب قهوة ولفيفة عندما تكون جاهزة؟", phonetic: "" },
      { speaker: "B", speakerName: "إيريك", speakerRole: "الجار", textSv: "Det vore jättekul! Fika med grannen – det är ju mysigt!", textAr: "سيكون ذلك رائعاً! فيكا مع الجار - ذلك دافئ جداً!", phonetic: "", noteAr: "'mysigt' من الكلمات السويدية المحبوبة - تعني الدفء والراحة." },
      { speaker: "A", speakerName: "دينا", speakerRole: "جارة", textSv: "Perfekt! Kom om en timme, okej?", textAr: "ممتاز! تعال بعد ساعة، حسناً؟", phonetic: "" },
      { speaker: "B", speakerName: "إيريك", speakerRole: "الجار", textSv: "Det låter bra. Vi ses då!", textAr: "يبدو ذلك جيداً. إلى اللقاء!", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 13. المطار — الجزء الثاني: التفتيش الجمركي
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Vid gränskontrollen", titleAr: "عند نقطة التفتيش الجمركي", scenario: "airport",
    category: "سفر", difficulty: "beginner", emoji: "🛃",
    imageUrl: IMG.airport, durationMinutes: 8,
    vocabList: [
      { sv: "gränskontroll", ar: "نقطة التفتيش الحدودية", phonetic: "" },
      { sv: "tullen", ar: "الجمارك", phonetic: "" },
      { sv: "syftet med resan", ar: "الغرض من الزيارة", phonetic: "" },
      { sv: "vistelsen", ar: "مدة الإقامة", phonetic: "" },
      { sv: "deklarera", ar: "يُصرِّح (جمركياً)", phonetic: "" },
      { sv: "visum", ar: "تأشيرة", phonetic: "" },
      { sv: "uppehållstillstånd", ar: "إذن الإقامة", phonetic: "" },
      { sv: "återresebiljett", ar: "تذكرة العودة", phonetic: "" },
      { sv: "boardingkort", ar: "بطاقة الصعود للطائرة", phonetic: "" },
      { sv: "tullfritt", ar: "معفى من الجمارك", phonetic: "" },
    ],
    grammarTips: [
      { title: "الحديث عن الغرض: 'Jag är här för att'", explanation: "تعني 'أنا هنا لكي' لشرح سبب الزيارة", example: "Jag är här för att besöka min familj.", exampleAr: "أنا هنا لزيارة عائلتي." },
      { title: "التعبير عن المدة: 'i X dagar/veckor'", explanation: "يُستخدم 'i' + عدد + وحدة زمن للتعبير عن مدة الإقامة", example: "Jag stannar i två veckor.", exampleAr: "سأبقى لمدة أسبوعين." },
    ],
    culturalNotes: "السويد عضو في منطقة شنغن، فالتفتيش الحدودي عادةً سريع وغير معقّد لحاملي تأشيرة شنغن. ضباط الجوازات مهنيون ومباشرون في أسئلتهم. يُفضَّل تجهيز الوثائق (الجواز، التذكرة، عنوان الإقامة) مسبقاً لتسريع الإجراء.",
    usefulPhrases: [
      { sv: "Jag är här på semester.", ar: "أنا هنا في عطلة." },
      { sv: "Jag ska besöka släktingar.", ar: "سأزور أقارب." },
      { sv: "Jag stannar i en vecka.", ar: "سأبقى لمدة أسبوع." },
      { sv: "Har du något att deklarera?", ar: "هل لديك شيء تُصرِّح عنه؟" },
      { sv: "Nej, ingenting att deklarera.", ar: "لا، لا شيء لأُصرِّح عنه." },
    ],
    lines: [
      { speaker: "B", speakerName: "ضابط الجوازات", speakerRole: "ضابط جوازات", textSv: "God dag. Får jag se ditt pass, tack?", textAr: "مرحباً. هل يمكنني رؤية جواز سفرك؟", phonetic: "" },
      { speaker: "A", speakerName: "ياسمين", speakerRole: "مسافرة", textSv: "Varsågod. Här är mitt pass och min biljett.", textAr: "تفضل. هذا جواز سفري وتذكرتي.", phonetic: "" },
      { speaker: "B", speakerName: "ضابط الجوازات", speakerRole: "ضابط جوازات", textSv: "Vad är syftet med din resa till Sverige?", textAr: "ما هو الغرض من زيارتك للسويد؟", phonetic: "" },
      { speaker: "A", speakerName: "ياسمين", speakerRole: "مسافرة", textSv: "Jag är här för att besöka min syster som bor i Malmö.", textAr: "أنا هنا لزيارة أختي التي تعيش في مالمو.", phonetic: "" },
      { speaker: "B", speakerName: "ضابط الجوازات", speakerRole: "ضابط جوازات", textSv: "Hur länge tänker du stanna?", textAr: "كم من الوقت تنوين البقاء؟", phonetic: "" },
      { speaker: "A", speakerName: "ياسمين", speakerRole: "مسافرة", textSv: "Jag stannar i tio dagar. Här är min återresebiljett.", textAr: "سأبقى عشرة أيام. هذه تذكرة عودتي.", phonetic: "" },
      { speaker: "B", speakerName: "ضابط الجوازات", speakerRole: "ضابط جوازات", textSv: "Bra. Har du något att deklarera i tullen?", textAr: "جيد. هل لديك شيء لتُصرِّحي عنه في الجمارك؟", phonetic: "" },
      { speaker: "A", speakerName: "ياسمين", speakerRole: "مسافرة", textSv: "Nej, ingenting särskilt. Bara personliga tillhörigheter.", textAr: "لا، لا شيء خاص. فقط أشياء شخصية.", phonetic: "" },
      { speaker: "B", speakerName: "ضابط الجوازات", speakerRole: "ضابط جوازات", textSv: "Perfekt, allt ser bra ut. Välkommen till Sverige!", textAr: "ممتاز، كل شيء يبدو جيداً. أهلاً بك في السويد!", phonetic: "", noteAr: "'Välkommen' هي التحية الرسمية عند الترحيب." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 14. المستشفى — الجزء الثاني: حجز موعد في المركز الصحي
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På vårdcentralen", titleAr: "حجز موعد في المركز الصحي", scenario: "hospital",
    category: "صحة", difficulty: "beginner", emoji: "🩺",
    imageUrl: IMG.hospital, durationMinutes: 10,
    vocabList: [
      { sv: "vårdcentralen", ar: "المركز الصحي", phonetic: "" },
      { sv: "boka en tid", ar: "يحجز موعداً", phonetic: "" },
      { sv: "1177", ar: "خط النصائح الصحية", phonetic: "" },
      { sv: "vårdnummer", ar: "رقم البطاقة الصحية", phonetic: "" },
      { sv: "väntetid", ar: "وقت الانتظار", phonetic: "" },
      { sv: "symtom", ar: "أعراض", phonetic: "" },
      { sv: "remiss", ar: "تحويل طبي", phonetic: "" },
      { sv: "avboka", ar: "يلغي موعداً", phonetic: "" },
      { sv: "distriktsläkare", ar: "طبيب عائلة", phonetic: "" },
      { sv: "provtagning", ar: "أخذ عيّنة / تحليل", phonetic: "" },
    ],
    grammarTips: [
      { title: "طلب حجز موعد: 'Jag skulle vilja boka'", explanation: "صيغة مؤدبة لطلب حجز موعد", example: "Jag skulle vilja boka en tid hos läkaren.", exampleAr: "أودّ حجز موعد عند الطبيب." },
      { title: "التعبير عن مدة الأعراض: 'i X dagar'", explanation: "يُستخدم لوصف منذ متى بدأت الأعراض", example: "Jag har haft huvudvärk i tre dagar.", exampleAr: "أعاني من صداع منذ ثلاثة أيام." },
    ],
    culturalNotes: "في السويد، أول نقطة اتصال للرعاية الصحية غير الطارئة هي 'vårdcentralen' (المركز الصحي). يمكن الحجز عبر الهاتف أو تطبيق 1177 أو الإنترنت. الأولوية تُمنح حسب شدة الحالة، فالانتظار قد يطول للحالات غير العاجلة. زيارة طبيب العائلة غالباً تتطلب رسماً رمزياً صغيراً.",
    usefulPhrases: [
      { sv: "Jag skulle vilja boka en tid.", ar: "أودّ حجز موعد." },
      { sv: "Är det bråttom?", ar: "هل هي حالة عاجلة؟" },
      { sv: "Kan jag få en tid imorgon?", ar: "هل يمكنني الحصول على موعد غداً؟" },
      { sv: "Jag behöver avboka min tid.", ar: "أحتاج لإلغاء موعدي." },
      { sv: "Vad är mitt vårdnummer?", ar: "ما هو رقم بطاقتي الصحية؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "يوسف", speakerRole: "مريض", textSv: "Hej, jag skulle vilja boka en tid hos en distriktsläkare.", textAr: "مرحباً، أودّ حجز موعد عند طبيب عائلة.", phonetic: "" },
      { speaker: "B", speakerName: "موظفة الاستقبال", speakerRole: "موظفة استقبال", textSv: "Visst. Vad gäller det, om jag får fråga?", textAr: "بالتأكيد. عن ماذا يتعلق الأمر، إن سمحت؟", phonetic: "" },
      { speaker: "A", speakerName: "يوسف", speakerRole: "مريض", textSv: "Jag har haft ont i halsen och lite feber i tre dagar.", textAr: "أعاني من ألم في الحلق وحمى خفيفة منذ ثلاثة أيام.", phonetic: "" },
      { speaker: "B", speakerName: "موظفة الاستقبال", speakerRole: "موظفة استقبال", textSv: "Okej, det låter inte akut. Jag kan erbjuda en tid på torsdag.", textAr: "حسناً، لا يبدو الأمر عاجلاً. يمكنني تقديم موعد يوم الخميس.", phonetic: "" },
      { speaker: "A", speakerName: "يوسف", speakerRole: "مريض", textSv: "Finns det något tidigare? Jag mår ganska dåligt.", textAr: "هل يوجد موعد أقرب؟ حالتي ليست جيدة إلى حد ما.", phonetic: "" },
      { speaker: "B", speakerName: "موظفة الاستقبال", speakerRole: "موظفة استقبال", textSv: "Låt mig kolla igen... Vi har en avbokad tid imorgon klockan 10.", textAr: "دعني أتحقق مرة أخرى... لدينا موعد فُتح غداً الساعة 10.", phonetic: "" },
      { speaker: "A", speakerName: "يوسف", speakerRole: "مريض", textSv: "Perfekt, jag tar den! Vad behöver jag ta med mig?", textAr: "ممتاز، سآخذه! ماذا يجب أن آخذ معي؟", phonetic: "" },
      { speaker: "B", speakerName: "موظفة الاستقبال", speakerRole: "موظفة استقبال", textSv: "Bara ditt ID-kort och vårdnummer om du har det.", textAr: "فقط بطاقة هويتك ورقم بطاقتك الصحية إن كان لديك.", phonetic: "", noteAr: "كل الأشخاص المسجلين لديهم رقم صحي شخصي." },
      { speaker: "A", speakerName: "يوسف", speakerRole: "مريض", textSv: "Tack så mycket för hjälpen!", textAr: "شكراً جزيلاً على المساعدة!", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 15. المدرسة — الجزء الثاني: اجتماع أولياء الأمور
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Föräldramöte", titleAr: "اجتماع أولياء الأمور", scenario: "school",
    category: "تعليم", difficulty: "intermediate", emoji: "🧑‍🏫",
    imageUrl: IMG.school, durationMinutes: 12,
    vocabList: [
      { sv: "föräldramöte", ar: "اجتماع أولياء الأمور", phonetic: "" },
      { sv: "utvecklingssamtal", ar: "لقاء تقييم التطور الدراسي", phonetic: "" },
      { sv: "framsteg", ar: "تقدم / تطور", phonetic: "" },
      { sv: "uppförande", ar: "السلوك", phonetic: "" },
      { sv: "läroplan", ar: "المنهج الدراسي", phonetic: "" },
      { sv: "extra stöd", ar: "دعم إضافي", phonetic: "" },
      { sv: "mentor", ar: "مرشد / موجه", phonetic: "" },
      { sv: "svårigheter", ar: "صعوبات", phonetic: "" },
      { sv: "målsättning", ar: "هدف / غاية", phonetic: "" },
      { sv: "trivsel", ar: "الشعور بالراحة والانتماء", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن التقدّم: 'göra framsteg'", explanation: "تعني 'يحقق تقدماً'", example: "Han gör bra framsteg i matematik.", exampleAr: "هو يحقق تقدماً جيداً في الرياضيات." },
      { title: "طلب التوضيح: 'Vad menar du med'", explanation: "للسؤال عن معنى شيء ذُكر", example: "Vad menar du med extra stöd?", exampleAr: "ماذا تقصد بالدعم الإضافي؟" },
    ],
    culturalNotes: "اجتماعات أولياء الأمور (utvecklingssamtal) تُعقد عادةً مرة أو مرتين في السنة الدراسية وتشمل الطالب نفسه غالباً. التواصل بين المعلم والأسرة مباشر وودود. المعلمون يشجعون على المشاركة الفعّالة من الوالدين ويستقبلون الأسئلة بانفتاح.",
    usefulPhrases: [
      { sv: "Hur går det för mitt barn?", ar: "كيف يسير أداء طفلي؟" },
      { sv: "Finns det något vi kan göra hemma?", ar: "هل هناك شيء يمكننا فعله في المنزل؟" },
      { sv: "Behöver hon extra stöd?", ar: "هل تحتاج إلى دعم إضافي؟" },
      { sv: "Trivs han i klassen?", ar: "هل يشعر بالراحة في الصف؟" },
      { sv: "Tack för informationen.", ar: "شكراً على المعلومات." },
    ],
    lines: [
      { speaker: "B", speakerName: "المعلمة", speakerRole: "معلمة الصف", textSv: "Tack för att ni kom. Låt oss prata om hur det går för Adam.", textAr: "شكراً لحضوركم. لنتحدث عن كيفية أداء آدم.", phonetic: "" },
      { speaker: "A", speakerName: "سمير", speakerRole: "ولي أمر", textSv: "Tack för att ni ordnade mötet. Vi är väldigt nyfikna.", textAr: "شكراً لترتيب الاجتماع. نحن مهتمون جداً.", phonetic: "" },
      { speaker: "B", speakerName: "المعلمة", speakerRole: "معلمة الصف", textSv: "Adam gör bra framsteg i svenska och gillar matematik mycket.", textAr: "آدم يحقق تقدماً جيداً في السويدية ويحب الرياضيات كثيراً.", phonetic: "" },
      { speaker: "A", speakerName: "سمير", speakerRole: "ولي أمر", textSv: "Det är glädjande att höra! Finns det något område han behöver jobba på?", textAr: "من السار سماع ذلك! هل هناك مجال يحتاج للعمل عليه؟", phonetic: "" },
      { speaker: "B", speakerName: "المعلمة", speakerRole: "معلمة الصف", textSv: "Han kan bli bättre på att räcka upp handen och delta i diskussioner.", textAr: "يمكنه أن يتحسن في رفع يده والمشاركة في المناقشات.", phonetic: "" },
      { speaker: "A", speakerName: "سمير", speakerRole: "ولي أمر", textSv: "Förstår. Trivs han bra med klasskompisarna?", textAr: "أفهم. هل يشعر بالراحة مع زملاء الصف؟", phonetic: "" },
      { speaker: "B", speakerName: "المعلمة", speakerRole: "معلمة الصف", textSv: "Ja, han har flera goda vänner och verkar trygg i gruppen.", textAr: "نعم، لديه عدة أصدقاء جيدين ويبدو مطمئناً في المجموعة.", phonetic: "" },
      { speaker: "A", speakerName: "سمير", speakerRole: "ولي أمر", textSv: "Vad kan vi göra hemma för att stötta honom?", textAr: "ماذا يمكننا فعله في المنزل لدعمه؟", phonetic: "" },
      { speaker: "B", speakerName: "المعلمة", speakerRole: "معلمة الصف", textSv: "Läs gärna svenska böcker tillsammans varje kväll, det hjälper mycket.", textAr: "يفضّل قراءة كتب سويدية معاً كل مساء، ذلك يساعد كثيراً.", phonetic: "", noteAr: "القراءة اليومية من أهم النصائح للمعلمين السويديين." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 16. العمل — الجزء الثاني: أول يوم في العمل
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Första dagen på jobbet", titleAr: "أول يوم في العمل", scenario: "work",
    category: "عمل", difficulty: "beginner", emoji: "🧑‍💼",
    imageUrl: IMG.work, durationMinutes: 10,
    vocabList: [
      { sv: "introduktion", ar: "تعريف / توجيه", phonetic: "" },
      { sv: "passerkort", ar: "بطاقة الدخول", phonetic: "" },
      { sv: "arbetsplatsen", ar: "مكان العمل", phonetic: "" },
      { sv: "chefen", ar: "المدير المباشر", phonetic: "" },
      { sv: "kollegorna", ar: "الزملاء", phonetic: "" },
      { sv: "fikapaus", ar: "استراحة القهوة", phonetic: "" },
      { sv: "lönebesked", ar: "قسيمة الراتب", phonetic: "" },
      { sv: "arbetsschema", ar: "جدول العمل", phonetic: "" },
      { sv: "personalhandbok", ar: "دليل الموظف", phonetic: "" },
      { sv: "provanställning", ar: "فترة تجربة للتوظيف", phonetic: "" },
    ],
    grammarTips: [
      { title: "التقديم عن النفس رسمياً: 'Jag heter... och jag ska'", explanation: "صيغة تعريف مناسبة في بيئة العمل", example: "Jag heter Layla och jag ska jobba i marknadsavdelningen.", exampleAr: "اسمي ليلى وسأعمل في قسم التسويق." },
      { title: "طلب التوضيح بأدب: 'Skulle du kunna visa mig'", explanation: "طريقة مهذبة لطلب المساعدة أو التوضيح", example: "Skulle du kunna visa mig var köket är?", exampleAr: "هل يمكنك أن تُريني أين المطبخ؟" },
    ],
    culturalNotes: "أول يوم عمل في السويد يبدأ عادةً بجولة تعريفية (introduktion) على المكتب والزملاء. ثقافة العمل السويدية أفقية - يُنادى المدير بالاسم الأول عادةً وليس بالمنصب. استراحة 'fika' الصباحية فرصة مهمة للتعارف الاجتماعي مع الزملاء.",
    usefulPhrases: [
      { sv: "Trevligt att träffas!", ar: "سعيد بلقائك!" },
      { sv: "Var är mitt skrivbord?", ar: "أين مكتبي؟" },
      { sv: "Vem ska jag kontakta om jag har frågor?", ar: "من يجب أن أتصل به إذا كانت لدي أسئلة؟" },
      { sv: "Får jag en rundtur?", ar: "هل يمكنني الحصول على جولة تعريفية؟" },
      { sv: "Jag ser fram emot att jobba här.", ar: "أتطلع للعمل هنا." },
    ],
    lines: [
      { speaker: "B", speakerName: "المديرة", speakerRole: "مديرة القسم", textSv: "God morgon och välkommen till ditt första jobb hos oss!", textAr: "صباح الخير ومرحباً بك في أول يوم عمل لك معنا!", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "موظفة جديدة", textSv: "Tack så mycket! Jag är verkligen glad att vara här.", textAr: "شكراً جزيلاً! أنا سعيدة جداً بوجودي هنا.", phonetic: "" },
      { speaker: "B", speakerName: "المديرة", speakerRole: "مديرة القسم", textSv: "Först ska jag visa dig runt och presentera dina kollegor.", textAr: "أولاً سأريكِ المكان وأعرّفكِ بزملائك.", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "موظفة جديدة", textSv: "Perfekt. Var kommer jag att sitta?", textAr: "ممتاز. أين سأجلس؟", phonetic: "" },
      { speaker: "B", speakerName: "المديرة", speakerRole: "مديرة القسم", textSv: "Ditt skrivbord är där borta, bredvid Johan från IT-teamet.", textAr: "مكتبكِ هناك، بجانب يوهان من فريق تقنية المعلومات.", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "موظفة جديدة", textSv: "Bra! Vem ska jag kontakta om jag har tekniska frågor?", textAr: "جيد! من يجب أن أتصل به إذا كانت لدي أسئلة تقنية؟", phonetic: "" },
      { speaker: "B", speakerName: "المديرة", speakerRole: "مديرة القسم", textSv: "Johan hjälper dig gärna. Vi tar fika tillsammans klockan tio.", textAr: "يوهان سيسعده مساعدتكِ. سنأخذ فيكا معاً الساعة العاشرة.", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "موظفة جديدة", textSv: "Jag ser fram emot det. Får jag mitt passerkort idag?", textAr: "أتطلع لذلك. هل سأحصل على بطاقة الدخول اليوم؟", phonetic: "" },
      { speaker: "B", speakerName: "المديرة", speakerRole: "مديرة القسم", textSv: "Ja, receptionen fixar det direkt efter lunch.", textAr: "نعم، الاستقبال سيجهزها مباشرة بعد الغداء.", phonetic: "", noteAr: "بطاقة الدخول ضرورية للوصول لمعظم مباني العمل السويدية." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 17. المطعم — الجزء الثاني: في المقهى (Fika)
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På caféet – Fika", titleAr: "في المقهى – فيكا", scenario: "restaurant",
    category: "طعام", difficulty: "beginner", emoji: "☕",
    imageUrl: IMG.restaurant, durationMinutes: 8,
    vocabList: [
      { sv: "fika", ar: "استراحة قهوة وحلويات", phonetic: "" },
      { sv: "kaffe", ar: "قهوة", phonetic: "" },
      { sv: "kanelbulle", ar: "لفيفة قرفة", phonetic: "" },
      { sv: "mjölk", ar: "حليب", phonetic: "" },
      { sv: "socker", ar: "سكر", phonetic: "" },
      { sv: "här eller ta med", ar: "هنا أم للأخذ", phonetic: "" },
      { sv: "sittplats", ar: "مكان جلوس", phonetic: "" },
      { sv: "termos", ar: "ترمس / كوب سفر", phonetic: "" },
      { sv: "wifi-koden", ar: "كود الواي فاي", phonetic: "" },
      { sv: "espresso", ar: "إسبريسو", phonetic: "" },
    ],
    grammarTips: [
      { title: "طلب مشروب: 'Jag tar en'", explanation: "طريقة بسيطة وشائعة للطلب في المقهى", example: "Jag tar en kaffe och en kanelbulle.", exampleAr: "سأطلب قهوة ولفيفة قرفة." },
      { title: "السؤال 'här eller ta med?'", explanation: "سؤال شائع يعني 'هنا أم للأخذ؟'", example: "Ska du dricka det här eller ta med?", exampleAr: "هل ستشربها هنا أم ستأخذها معك؟" },
    ],
    culturalNotes: "'Fika' ليست مجرد شرب قهوة - إنها عادة اجتماعية أساسية في السويد، غالباً مع كعك القرفة (kanelbulle) أو الكعك اللزج (kladdkaka). يمارسها السويديون في العمل، مع الأصدقاء، وحتى في المواعيد. القهوة السويدية عادةً قوية وتُقدَّم بكثرة على مدار اليوم.",
    usefulPhrases: [
      { sv: "Jag tar en kaffe, tack.", ar: "سأطلب قهوة، من فضلك." },
      { sv: "Har ni något att äta till?", ar: "هل لديكم شيء لتناوله معها؟" },
      { sv: "Kan jag få mjölk till kaffet?", ar: "هل يمكنني الحصول على حليب مع القهوة؟" },
      { sv: "Ska bli fika!", ar: "حان وقت الفيكا!" },
      { sv: "Vad är wifi-koden?", ar: "ما هو كود الواي فاي؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "فراس", speakerRole: "زبون", textSv: "Hej! Jag tar en kaffe och en kanelbulle, tack.", textAr: "مرحباً! سأطلب قهوة ولفيفة قرفة، من فضلك.", phonetic: "" },
      { speaker: "B", speakerName: "الباريستا", speakerRole: "باريستا", textSv: "Absolut! Ska du dricka det här eller ta med?", textAr: "بالتأكيد! هل ستشربها هنا أم ستأخذها معك؟", phonetic: "" },
      { speaker: "A", speakerName: "فراس", speakerRole: "زبون", textSv: "Här, tack. Har ni sittplats vid fönstret?", textAr: "هنا، من فضلك. هل لديكم مكان جلوس عند النافذة؟", phonetic: "" },
      { speaker: "B", speakerName: "الباريستا", speakerRole: "باريستا", textSv: "Ja, det finns ett bord ledigt där. Vill du ha mjölk till kaffet?", textAr: "نعم، هناك طاولة شاغرة. هل تريد حليباً مع القهوة؟", phonetic: "" },
      { speaker: "A", speakerName: "فراس", speakerRole: "زبون", textSv: "Ja tack, lite mjölk. Hur mycket blir det?", textAr: "نعم من فضلك، قليل من الحليب. كم سيكون المجموع؟", phonetic: "" },
      { speaker: "B", speakerName: "الباريستا", speakerRole: "باريستا", textSv: "Det blir 65 kronor totalt. Betalar du med kort?", textAr: "المجموع 65 كرونة. هل ستدفع بالبطاقة؟", phonetic: "" },
      { speaker: "A", speakerName: "فراس", speakerRole: "زبون", textSv: "Ja, med kort. Och vad är wifi-koden?", textAr: "نعم، بالبطاقة. وما هو كود الواي فاي؟", phonetic: "" },
      { speaker: "B", speakerName: "الباريستا", speakerRole: "باريستا", textSv: "Koden står på kvittot. Trevlig fika!", textAr: "الكود موجود على الإيصال. فيكا سعيدة!", phonetic: "", noteAr: "'Trevlig fika' تحية شائعة عند تقديم القهوة." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 18. الفندق — الجزء الثاني: مشكلة في الغرفة
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Problem med rummet", titleAr: "مشكلة في الغرفة", scenario: "hotel",
    category: "سفر", difficulty: "intermediate", emoji: "🛎️",
    imageUrl: IMG.hotel, durationMinutes: 8,
    vocabList: [
      { sv: "trasig", ar: "معطّل / مكسور", phonetic: "" },
      { sv: "värmen", ar: "التدفئة", phonetic: "" },
      { sv: "luftkonditioneringen", ar: "التكييف", phonetic: "" },
      { sv: "handdukar", ar: "منشفات", phonetic: "" },
      { sv: "byta rum", ar: "تغيير الغرفة", phonetic: "" },
      { sv: "störande ljud", ar: "ضجيج مزعج", phonetic: "" },
      { sv: "reparera", ar: "يُصلح", phonetic: "" },
      { sv: "kompensation", ar: "تعويض", phonetic: "" },
      { sv: "felanmälan", ar: "بلاغ عن عطل", phonetic: "" },
      { sv: "underhåll", ar: "الصيانة", phonetic: "" },
    ],
    grammarTips: [
      { title: "الإشارة إلى مشكلة: 'Det fungerar inte'", explanation: "تعني 'لا يعمل' وتُستخدم لأي عطل", example: "Luftkonditioneringen fungerar inte.", exampleAr: "التكييف لا يعمل." },
      { title: "طلب حل: 'Kan ni skicka någon'", explanation: "طلب مؤدب لإرسال شخص لحل المشكلة", example: "Kan ni skicka någon för att fixa det?", exampleAr: "هل يمكنكم إرسال شخص لإصلاح ذلك؟" },
    ],
    culturalNotes: "الفنادق السويدية تأخذ الشكاوى بجدية وتسعى لحلها بسرعة، غالباً بتقديم تعويض كخصم أو ترقية غرفة. التواصل مباشر ومهذب - لا حاجة للغضب، فمجرد وصف المشكلة بوضوح يكفي للحصول على حل سريع.",
    usefulPhrases: [
      { sv: "Det är ett problem med rummet.", ar: "هناك مشكلة في الغرفة." },
      { sv: "Värmen fungerar inte.", ar: "التدفئة لا تعمل." },
      { sv: "Kan jag byta till ett annat rum?", ar: "هل يمكنني الانتقال إلى غرفة أخرى؟" },
      { sv: "Det är väldigt bullrigt här.", ar: "الضجيج شديد هنا." },
      { sv: "Kan jag få en kompensation?", ar: "هل يمكنني الحصول على تعويض؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "منى", speakerRole: "نزيلة", textSv: "Hej, jag ringer från rum 214. Värmen fungerar inte alls.", textAr: "مرحباً، أتصل من الغرفة 214. التدفئة لا تعمل أبداً.", phonetic: "" },
      { speaker: "B", speakerName: "موظف الاستقبال", speakerRole: "موظف الاستقبال", textSv: "Jag beklagar det. Jag skickar upp underhållspersonal direkt.", textAr: "أعتذر عن ذلك. سأرسل فريق الصيانة إليكِ مباشرة.", phonetic: "" },
      { speaker: "A", speakerName: "منى", speakerRole: "نزيلة", textSv: "Tack, det är riktigt kallt här inne. Kan det gå snabbt?", textAr: "شكراً، البرد شديد هنا. هل يمكن أن يتم ذلك بسرعة؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف الاستقبال", speakerRole: "موظف الاستقبال", textSv: "Absolut. Under tiden kan jag erbjuda dig ett tillfälligt rum.", textAr: "بالتأكيد. في هذه الأثناء يمكنني تقديم غرفة مؤقتة لكِ.", phonetic: "" },
      { speaker: "A", speakerName: "منى", speakerRole: "نزيلة", textSv: "Det låter bra. Kan jag också få extra handdukar där?", textAr: "يبدو ذلك جيداً. هل يمكنني الحصول على منشفات إضافية أيضاً هناك؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف الاستقبال", speakerRole: "موظف الاستقبال", textSv: "Självklart, jag ordnar det. Rum 305 är klart för dig nu.", textAr: "بالطبع، سأرتب ذلك. الغرفة 305 جاهزة لكِ الآن.", phonetic: "" },
      { speaker: "A", speakerName: "منى", speakerRole: "نزيلة", textSv: "Tack. Jag vill också nämna att detta stör min vistelse.", textAr: "شكراً. أريد أيضاً أن أذكر أن هذا يؤثر على إقامتي.", phonetic: "" },
      { speaker: "B", speakerName: "موظف الاستقبال", speakerRole: "موظف الاستقبال", textSv: "Jag förstår helt. Vi ger dig 20% rabatt på din vistelse som kompensation.", textAr: "أتفهم ذلك تماماً. سنمنحكِ خصم 20% على إقامتك كتعويض.", phonetic: "", noteAr: "'som kompensation' = كتعويض." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 19. التسوق — الجزء الثاني: في السوبر ماركت
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "I mataffären", titleAr: "في السوبر ماركت", scenario: "shopping",
    category: "تسوق", difficulty: "beginner", emoji: "🛍️",
    imageUrl: IMG.shopping, durationMinutes: 8,
    vocabList: [
      { sv: "matkassen", ar: "سلة التسوق", phonetic: "" },
      { sv: "grönsaker", ar: "خضروات", phonetic: "" },
      { sv: "mejeriprodukter", ar: "منتجات الألبان", phonetic: "" },
      { sv: "fryst", ar: "مجمّد", phonetic: "" },
      { sv: "bäst-före-datum", ar: "تاريخ انتهاء الصلاحية", phonetic: "" },
      { sv: "erbjudande", ar: "عرض / تخفيض", phonetic: "" },
      { sv: "självscanning", ar: "المسح الذاتي", phonetic: "" },
      { sv: "kundvagn", ar: "عربة تسوق", phonetic: "" },
      { sv: "matvarukedjan", ar: "سلسلة متاجر البقالة", phonetic: "" },
      { sv: "halalkött", ar: "لحم حلال", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن موقع منتج: 'Var hittar jag'", explanation: "تعني 'أين أجد' للسؤال عن موقع منتج في المتجر", example: "Var hittar jag halalkött?", exampleAr: "أين أجد اللحم الحلال؟" },
      { title: "التعبير عن الكمية: 'en påse med'", explanation: "يُستخدم لوصف كمية أو كيس من شيء", example: "Jag vill ha en påse med äpplen.", exampleAr: "أريد كيساً من التفاح." },
    ],
    culturalNotes: "المتاجر السويدية الكبرى مثل ICA وCoop وWillys منظمة جداً وتقدّم خيارات صحية وعضوية واسعة. المسح الذاتي (självscanning) منتشر جداً لتسريع الدفع. لحم الحلال متوفر في أغلب المتاجر الكبيرة خصوصاً في المدن الكبرى. أكياس التسوق البلاستيكية تُدفع ثمنها منفصلة تشجيعاً على إعادة الاستخدام.",
    usefulPhrases: [
      { sv: "Var hittar jag mjölk?", ar: "أين أجد الحليب؟" },
      { sv: "Har ni halalkött?", ar: "هل لديكم لحم حلال؟" },
      { sv: "Är det här på erbjudande?", ar: "هل هذا معروض بتخفيض؟" },
      { sv: "Kan jag använda självscanning?", ar: "هل يمكنني استخدام المسح الذاتي؟" },
      { sv: "Har ni glutenfritt bröd?", ar: "هل لديكم خبز خالٍ من الغلوتين؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "حسام", speakerRole: "زبون", textSv: "Ursäkta, var hittar jag halalkött i affären?", textAr: "عفواً، أين أجد اللحم الحلال في المتجر؟", phonetic: "" },
      { speaker: "B", speakerName: "موظفة المتجر", speakerRole: "موظفة المتجر", textSv: "Det finns i köttavdelningen, längst bak till höger.", textAr: "يوجد في قسم اللحوم، في الخلف على اليمين.", phonetic: "" },
      { speaker: "A", speakerName: "حسام", speakerRole: "زبون", textSv: "Tack! Och har ni något erbjudande denna vecka på grönsaker?", textAr: "شكراً! وهل لديكم أي عرض هذا الأسبوع على الخضروات؟", phonetic: "" },
      { speaker: "B", speakerName: "موظفة المتجر", speakerRole: "موظفة المتجر", textSv: "Ja, tomater och paprika är på extrapris just nu.", textAr: "نعم، الطماطم والفليفلة معروضة بسعر خاص الآن.", phonetic: "" },
      { speaker: "A", speakerName: "حسام", speakerRole: "زبون", textSv: "Perfekt, jag tar en påse tomater. Kan jag använda självscanning?", textAr: "ممتاز، سآخذ كيساً من الطماطم. هل يمكنني استخدام المسح الذاتي؟", phonetic: "" },
      { speaker: "B", speakerName: "موظفة المتجر", speakerRole: "موظفة المتجر", textSv: "Absolut, scannerna finns vid ingången till kassorna.", textAr: "بالتأكيد، أجهزة المسح موجودة عند مدخل الكاشير.", phonetic: "" },
      { speaker: "A", speakerName: "حسام", speakerRole: "زبون", textSv: "Bra att veta. Behöver jag betala för en matkasse?", textAr: "جيد أن أعرف ذلك. هل يجب أن أدفع ثمن كيس تسوق؟", phonetic: "" },
      { speaker: "B", speakerName: "موظفة المتجر", speakerRole: "موظفة المتجر", textSv: "Ja, en påse kostar 3 kronor. Ha en trevlig dag!", textAr: "نعم، الكيس يكلف 3 كرونات. أتمنى لك يوماً سعيداً!", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 20. الشرطة — الجزء الثاني: فقدان جواز السفر
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Förlorat pass", titleAr: "فقدان جواز السفر", scenario: "police",
    category: "رسمي", difficulty: "intermediate", emoji: "🪪",
    imageUrl: IMG.police, durationMinutes: 10,
    vocabList: [
      { sv: "förlorat", ar: "مفقود / ضائع", phonetic: "" },
      { sv: "ambassaden", ar: "السفارة", phonetic: "" },
      { sv: "identitetshandling", ar: "وثيقة هوية", phonetic: "" },
      { sv: "kopia", ar: "نسخة", phonetic: "" },
      { sv: "polisrapport", ar: "تقرير شرطة", phonetic: "" },
      { sv: "temporärt pass", ar: "جواز سفر مؤقت", phonetic: "" },
      { sv: "hemresa", ar: "رحلة العودة", phonetic: "" },
      { sv: "bekräftelse", ar: "تأكيد / إثبات", phonetic: "" },
      { sv: "efterlysning", ar: "بلاغ بحث", phonetic: "" },
      { sv: "underskrift", ar: "توقيع", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن الفقدان: 'Jag har tappat/förlorat'", explanation: "'tappat' للفقدان العرضي و'förlorat' أعم استخداماً", example: "Jag har tappat mitt pass.", exampleAr: "لقد فقدت جواز سفري." },
      { title: "طلب وثيقة رسمية: 'Jag behöver en'", explanation: "للتعبير عن الحاجة لوثيقة أو خدمة", example: "Jag behöver en polisrapport för ambassaden.", exampleAr: "أحتاج إلى تقرير شرطة للسفارة." },
    ],
    culturalNotes: "في حال فقدان جواز السفر في السويد، يجب أولاً تقديم بلاغ للشرطة (لا يتطلب زيارة شخصية دائماً - يمكن عبر الإنترنت)، ثم التوجه للسفارة المعنية بجواز سفر مؤقت. الشرطة السويدية تصدر تقرير البلاغ بسرعة وهو ضروري لإجراءات السفارة.",
    usefulPhrases: [
      { sv: "Jag har tappat mitt pass.", ar: "لقد فقدت جواز سفري." },
      { sv: "Var ligger min ambassad?", ar: "أين تقع سفارتي؟" },
      { sv: "Kan jag få en polisrapport?", ar: "هل يمكنني الحصول على تقرير شرطة؟" },
      { sv: "Hur lång tid tar det att få ett nytt pass?", ar: "كم يستغرق الحصول على جواز جديد؟" },
      { sv: "Har någon hittat mitt pass?", ar: "هل عثر أحد على جواز سفري؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "طارق", speakerRole: "مواطن", textSv: "Hej, jag har tappat mitt pass någonstans i centrum idag.", textAr: "مرحباً، فقدت جواز سفري في مكان ما بوسط المدينة اليوم.", phonetic: "" },
      { speaker: "B", speakerName: "الضابطة", speakerRole: "ضابطة شرطة", textSv: "Jag förstår. Var tror du att du tappade det?", textAr: "أفهم ذلك. أين تظن أنك فقدته؟", phonetic: "" },
      { speaker: "A", speakerName: "طارق", speakerRole: "مواطن", textSv: "Antagligen på tåget eller i en affär. Jag är inte säker.", textAr: "من المحتمل في القطار أو في متجر. لست متأكداً.", phonetic: "" },
      { speaker: "B", speakerName: "الضابطة", speakerRole: "ضابطة شرطة", textSv: "Okej, jag registrerar en anmälan om förlorad identitetshandling.", textAr: "حسناً، سأسجل بلاغاً عن وثيقة هوية مفقودة.", phonetic: "" },
      { speaker: "A", speakerName: "طارق", speakerRole: "مواطن", textSv: "Tack. Jag behöver en polisrapport för min ambassad.", textAr: "شكراً. أحتاج إلى تقرير شرطة لسفارتي.", phonetic: "" },
      { speaker: "B", speakerName: "الضابطة", speakerRole: "ضابطة شرطة", textSv: "Här är rapporten med ett ärendenummer. Kontakta ambassaden direkt.", textAr: "هذا التقرير مع رقم البلاغ. اتصل بسفارتك مباشرة.", phonetic: "" },
      { speaker: "A", speakerName: "طارق", speakerRole: "مواطن", textSv: "Vet du var den egyptiska ambassaden ligger?", textAr: "هل تعرفين أين تقع السفارة المصرية؟", phonetic: "" },
      { speaker: "B", speakerName: "الضابطة", speakerRole: "ضابطة شرطة", textSv: "Den ligger på Kungsholmen. De kan utfärda ett temporärt pass.", textAr: "تقع في كونغسهولمن. يمكنهم إصدار جواز سفر مؤقت لك.", phonetic: "", noteAr: "'temporärt pass' جواز سفر مؤقت يصدره السفارة للطوارئ." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 21. البنك — الجزء الثاني: طلب قرض
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Ansöka om lån", titleAr: "طلب قرض", scenario: "bank",
    category: "رسمي", difficulty: "advanced", emoji: "💳",
    imageUrl: IMG.bank, durationMinutes: 12,
    vocabList: [
      { sv: "lån", ar: "قرض", phonetic: "" },
      { sv: "bolån", ar: "قرض عقاري", phonetic: "" },
      { sv: "amortering", ar: "سداد أصل القرض", phonetic: "" },
      { sv: "ränta", ar: "فائدة", phonetic: "" },
      { sv: "kreditupplysning", ar: "تقرير ائتماني", phonetic: "" },
      { sv: "inkomst", ar: "الدخل", phonetic: "" },
      { sv: "kontantinsats", ar: "الدفعة المقدمة", phonetic: "" },
      { sv: "löptid", ar: "مدة القرض", phonetic: "" },
      { sv: "borgensman", ar: "الضامن", phonetic: "" },
      { sv: "skuld", ar: "دَين", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن النية: 'Jag funderar på att'", explanation: "تعني 'أفكر في' وتُستخدم للتعبير عن نية مستقبلية", example: "Jag funderar på att ansöka om ett lån.", exampleAr: "أفكر في التقديم على قرض." },
      { title: "السؤال عن الشروط: 'Vilka villkor gäller'", explanation: "للاستفسار عن شروط عقد أو خدمة", example: "Vilka villkor gäller för bolånet?", exampleAr: "ما هي الشروط المطبقة على القرض العقاري؟" },
    ],
    culturalNotes: "الحصول على قرض عقاري (bolån) في السويد يتطلب دفعة مقدمة لا تقل عن 15% من سعر العقار وتقييماً دقيقاً للدخل والديون. البنوك السويدية تعتمد بشكل كبير على 'kreditupplysning' (التقرير الائتماني) و personnummer الشخصي. معدلات الفائدة والسداد (amortering) تخضع لقواعد صارمة من هيئة الرقابة المالية.",
    usefulPhrases: [
      { sv: "Jag skulle vilja ansöka om ett lån.", ar: "أودّ التقديم على قرض." },
      { sv: "Vad är räntan just nu?", ar: "ما هو معدل الفائدة الآن؟" },
      { sv: "Hur mycket kan jag låna?", ar: "كم يمكنني أن أستقرض؟" },
      { sv: "Behöver jag en borgensman?", ar: "هل أحتاج إلى ضامن؟" },
      { sv: "Hur lång är löptiden?", ar: "كم مدة القرض؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "زياد", speakerRole: "عميل", textSv: "Hej, jag funderar på att ansöka om ett bolån för en lägenhet.", textAr: "مرحباً، أفكر في التقديم على قرض عقاري لشقة.", phonetic: "" },
      { speaker: "B", speakerName: "مستشار القروض", speakerRole: "مستشار القروض", textSv: "Bra! Har du en kontantinsats sparad redan?", textAr: "جيد! هل جمعت دفعة مقدمة بالفعل؟", phonetic: "" },
      { speaker: "A", speakerName: "زياد", speakerRole: "عميل", textSv: "Ja, jag har sparat 15% av lägenhetens pris.", textAr: "نعم، جمعت 15% من سعر الشقة.", phonetic: "" },
      { speaker: "B", speakerName: "مستشار القروض", speakerRole: "مستشار القروض", textSv: "Utmärkt. Vi behöver också göra en kreditupplysning på dig.", textAr: "ممتاز. سنحتاج أيضاً إلى إجراء تقرير ائتماني عليك.", phonetic: "" },
      { speaker: "A", speakerName: "زياد", speakerRole: "عميل", textSv: "Inga problem. Vad är räntan just nu på bolån?", textAr: "لا مشكلة. ما هو معدل الفائدة الآن على القروض العقارية؟", phonetic: "" },
      { speaker: "B", speakerName: "مستشار القروض", speakerRole: "مستشار القروض", textSv: "Just nu ligger den runt 4 procent, beroende på löptid.", textAr: "حالياً يبلغ حوالي 4 بالمئة، حسب مدة القرض.", phonetic: "" },
      { speaker: "A", speakerName: "زياد", speakerRole: "عميل", textSv: "Förstår. Hur mycket skulle jag behöva amortera per månad?", textAr: "أفهم. كم يجب أن أسدد شهرياً من أصل القرض؟", phonetic: "" },
      { speaker: "B", speakerName: "مستشار القروض", speakerRole: "مستشار القروض", textSv: "Det beror på lånets storlek, men vi räknar ut det tillsammans nu.", textAr: "يعتمد على حجم القرض، لكن سنحسبه معاً الآن.", phonetic: "", noteAr: "'amortera' تعني سداد أصل القرض تدريجياً، إلزامي في السويد." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 22. المواصلات — الجزء الثاني: استئجار سيارة
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Hyra bil", titleAr: "استئجار سيارة", scenario: "transport",
    category: "سفر", difficulty: "intermediate", emoji: "🚗",
    imageUrl: IMG.transport, durationMinutes: 10,
    vocabList: [
      { sv: "hyrbil", ar: "سيارة مستأجرة", phonetic: "" },
      { sv: "körkort", ar: "رخصة قيادة", phonetic: "" },
      { sv: "försäkring", ar: "تأمين", phonetic: "" },
      { sv: "tank", ar: "خزان الوقود", phonetic: "" },
      { sv: "automatlåda", ar: "ناقل حركة أوتوماتيكي", phonetic: "" },
      { sv: "depositionen", ar: "مبلغ الضمان", phonetic: "" },
      { sv: "återlämna", ar: "يُرجع (السيارة)", phonetic: "" },
      { sv: "kilometerstånd", ar: "عدد الكيلومترات المقطوعة", phonetic: "" },
      { sv: "extra förare", ar: "سائق إضافي", phonetic: "" },
      { sv: "hyrestid", ar: "مدة الاستئجار", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن الرغبة بالحجز: 'Jag vill hyra'", explanation: "صيغة مباشرة تعني 'أريد أن أستأجر'", example: "Jag vill hyra en bil för fem dagar.", exampleAr: "أريد استئجار سيارة لخمسة أيام." },
      { title: "السؤال عن الشمول: 'Ingår ... i priset'", explanation: "للسؤال عن ما هو مشمول في السعر", example: "Ingår försäkringen i priset?", exampleAr: "هل التأمين مشمول في السعر؟" },
    ],
    culturalNotes: "استئجار السيارات في السويد يتطلب رخصة قيادة سارية (دولية أو أوروبية غالباً مقبولة) وبطاقة ائتمان لمبلغ الضمان. القيادة تكون على الجانب الأيمن من الطريق. الطرق السويدية منظمة جيداً والحدود القصوى للسرعة تُطبَّق بصرامة بكاميرات المراقبة.",
    usefulPhrases: [
      { sv: "Jag vill hyra en bil.", ar: "أريد استئجار سيارة." },
      { sv: "Ingår försäkringen?", ar: "هل التأمين مشمول؟" },
      { sv: "Har ni automatlåda?", ar: "هل لديكم ناقل حركة أوتوماتيكي؟" },
      { sv: "När måste jag återlämna bilen?", ar: "متى يجب أن أُرجع السيارة؟" },
      { sv: "Måste tanken vara full?", ar: "هل يجب أن يكون الخزان مليئاً؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "وليد", speakerRole: "زبون", textSv: "Hej, jag vill hyra en bil för en veckas resa.", textAr: "مرحباً، أريد استئجار سيارة لرحلة أسبوعية.", phonetic: "" },
      { speaker: "B", speakerName: "موظف التأجير", speakerRole: "موظف تأجير سيارات", textSv: "Absolut! Vilken typ av bil letar du efter?", textAr: "بالتأكيد! أي نوع من السيارات تبحث عنه؟", phonetic: "" },
      { speaker: "A", speakerName: "وليد", speakerRole: "زبون", textSv: "Något litet och bränslesnålt, med automatlåda om möjligt.", textAr: "شيء صغير واقتصادي في الوقود، بناقل حركة أوتوماتيكي إن أمكن.", phonetic: "" },
      { speaker: "B", speakerName: "موظف التأجير", speakerRole: "موظف تأجير سيارات", textSv: "Vi har en fin Volkswagen Golf, automatlåda och sparsam.", textAr: "لدينا فولكس فاغن غولف جيدة، ناقل حركة أوتوماتيكي واقتصادية.", phonetic: "" },
      { speaker: "A", speakerName: "وليد", speakerRole: "زبون", textSv: "Perfekt. Ingår försäkringen i priset?", textAr: "ممتاز. هل التأمين مشمول في السعر؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف التأجير", speakerRole: "موظف تأجير سيارات", textSv: "Grundförsäkringen ingår, men jag rekommenderar fullförsäkring.", textAr: "التأمين الأساسي مشمول، لكنني أنصح بالتأمين الشامل.", phonetic: "" },
      { speaker: "A", speakerName: "وليد", speakerRole: "زبون", textSv: "Okej, jag tar fullförsäkringen. Måste tanken vara full vid återlämning?", textAr: "حسناً، سآخذ التأمين الشامل. هل يجب أن يكون الخزان مليئاً عند الإرجاع؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف التأجير", speakerRole: "موظف تأجير سيارات", textSv: "Ja, annars tar vi ut en extra avgift. Här är nycklarna och avtalet.", textAr: "نعم، وإلا سنفرض رسماً إضافياً. هذه المفاتيح والعقد.", phonetic: "", noteAr: "دائماً تحقق من مستوى الوقود قبل استلام السيارة." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 23. الطوارئ — الجزء الثاني: حادث سير
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Trafikolycka", titleAr: "حادث سير", scenario: "emergency",
    category: "طوارئ", difficulty: "intermediate", emoji: "🚑",
    imageUrl: IMG.emergency, durationMinutes: 10,
    vocabList: [
      { sv: "trafikolycka", ar: "حادث سير", phonetic: "" },
      { sv: "krockade", ar: "اصطدم", phonetic: "" },
      { sv: "skadad", ar: "مُصاب / متضرر", phonetic: "" },
      { sv: "vägkanten", ar: "جانب الطريق", phonetic: "" },
      { sv: "bärgningsbil", ar: "سيارة سطحة / جرّ", phonetic: "" },
      { sv: "vittnesuppgifter", ar: "شهادة الشاهد", phonetic: "" },
      { sv: "skadeanmälan", ar: "بلاغ حادث للتأمين", phonetic: "" },
      { sv: "registreringsnummer", ar: "رقم لوحة السيارة", phonetic: "" },
      { sv: "airbag", ar: "كيس الهواء", phonetic: "" },
      { sv: "vägassistans", ar: "خدمة المساعدة على الطريق", phonetic: "" },
    ],
    grammarTips: [
      { title: "وصف حادث بصيغة الماضي", explanation: "استخدام الماضي البسيط لوصف ما حدث", example: "Bilen krockade med ett träd.", exampleAr: "اصطدمت السيارة بشجرة." },
      { title: "السؤال عن الحالة الصحية: 'Är du skadad'", explanation: "سؤال مباشر ومهم في حالات الطوارئ", example: "Är du skadad? Kan du röra dig?", exampleAr: "هل أنت مصاب؟ هل يمكنك التحرك؟" },
    ],
    culturalNotes: "في حال وقوع حادث سير في السويد، يجب الاتصال بـ112 إذا كان هناك جرحى، ونقل السيارات إلى جانب الطريق إن أمكن لتجنب حوادث أخرى. تبادل معلومات التأمين ورقم اللوحة إلزامي. شركات التأمين السويدية تتطلب 'skadeanmälan' (بلاغ حادث) سريعاً بعد الواقعة.",
    usefulPhrases: [
      { sv: "Det har hänt en trafikolycka!", ar: "وقع حادث سير!" },
      { sv: "Är någon skadad?", ar: "هل هناك أي مصاب؟" },
      { sv: "Kan du flytta bilen åt sidan?", ar: "هل يمكنك تحريك السيارة جانباً؟" },
      { sv: "Vi behöver göra en skadeanmälan.", ar: "نحتاج لتقديم بلاغ حادث." },
      { sv: "Kan jag få ditt registreringsnummer?", ar: "هل يمكنني الحصول على رقم لوحتك؟" },
    ],
    lines: [
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "SOS Alarm, vad har hänt?", textAr: "SOS إنذار، ماذا حدث؟", phonetic: "" },
      { speaker: "A", speakerName: "بلال", speakerRole: "شاهد على الحادث", textSv: "Det har hänt en trafikolycka på E4:an, två bilar krockade!", textAr: "وقع حادث سير على الطريق E4، اصطدمت سيارتان!", phonetic: "" },
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "Är någon skadad? Kan du se in i bilarna?", textAr: "هل هناك مصاب؟ هل يمكنك الرؤية داخل السيارات؟", phonetic: "" },
      { speaker: "A", speakerName: "بلال", speakerRole: "شاهد على الحادث", textSv: "En förare verkar chockad men vaken. Den andra rör sig inte mycket.", textAr: "سائق واحد يبدو مصدوماً لكنه واعٍ. الآخر لا يتحرك كثيراً.", phonetic: "" },
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "Ambulans och polis är på väg. Var exakt befinner ni er?", textAr: "الإسعاف والشرطة في الطريق. أين موقعكم بالضبط؟", phonetic: "" },
      { speaker: "A", speakerName: "بلال", speakerRole: "شاهد على الحادث", textSv: "Vid avfarten mot Södertälje, cirka två kilometer norrut.", textAr: "عند مخرج سودرتاليه، حوالي كيلومترين شمالاً.", phonetic: "" },
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "Bra. Försök varna andra bilar och håll er på säkert avstånd.", textAr: "جيد. حاولوا تحذير السيارات الأخرى وابقوا على مسافة آمنة.", phonetic: "" },
      { speaker: "A", speakerName: "بلال", speakerRole: "شاهد على الحادث", textSv: "Okej, jag gör det. Hur lång tid tar det för dem att komma?", textAr: "حسناً، سأفعل ذلك. كم سيستغرق وصولهم؟", phonetic: "" },
      { speaker: "B", speakerName: "مركز الطوارئ", speakerRole: "مشغل الطوارئ", textSv: "Cirka sju minuter. Stanna kvar på linjen tills de anländer.", textAr: "حوالي سبع دقائق. بقوا على الخط حتى وصولهم.", phonetic: "" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 24. الحياة اليومية — الجزء الثاني: غرفة الغسيل المشتركة
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Tvättstugan", titleAr: "غرفة الغسيل المشتركة", scenario: "daily",
    category: "يومي", difficulty: "beginner", emoji: "🧺",
    imageUrl: IMG.daily, durationMinutes: 8,
    vocabList: [
      { sv: "tvättstugan", ar: "غرفة الغسيل المشتركة", phonetic: "" },
      { sv: "bokningslista", ar: "قائمة الحجز", phonetic: "" },
      { sv: "tvättmaskin", ar: "غسالة", phonetic: "" },
      { sv: "torktumlare", ar: "مجفف ملابس", phonetic: "" },
      { sv: "tvättmedel", ar: "مسحوق غسيل", phonetic: "" },
      { sv: "tvättpass", ar: "فترة الحجز للغسيل", phonetic: "" },
      { sv: "bricka / nyckelbricka", ar: "بطاقة/مفتاح الدخول", phonetic: "" },
      { sv: "torkrum", ar: "غرفة تجفيف", phonetic: "" },
      { sv: "grannsämja", ar: "علاقة طيبة بين الجيران", phonetic: "" },
      { sv: "städa efter sig", ar: "ينظّف بعد استخدامه", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن الحجز: 'Har du bokat'", explanation: "للاستفسار إذا كان الشخص قد حجز فترة معينة", example: "Har du bokat tvättstugan idag?", exampleAr: "هل حجزت غرفة الغسيل اليوم؟" },
      { title: "طلب لطيف: 'Skulle det gå bra om'", explanation: "طريقة مؤدبة جداً لطلب شيء من الجار", example: "Skulle det gå bra om jag byter tvättpass med dig?", exampleAr: "هل يناسبك أن أُبدّل فترة الغسيل معك؟" },
    ],
    culturalNotes: "'Tvättstugan' هي غرفة الغسيل المشتركة الموجودة في أغلب المباني السكنية السويدية، حيث يحجز السكان أوقاتهم عبر قائمة أو نظام رقمي. من المهم جداً احترام الوقت المحجوز والالتزام بتنظيف المكان بعد الاستخدام - وهذا جزء أساسي من احترام الجيران (grannsämja) في الثقافة السويدية.",
    usefulPhrases: [
      { sv: "Har du bokat en tid idag?", ar: "هل حجزت وقتاً اليوم؟" },
      { sv: "Jag är snart klar.", ar: "سأنتهي قريباً." },
      { sv: "Glöm inte att städa efter dig.", ar: "لا تنسَ التنظيف بعد الاستخدام." },
      { sv: "Var hänger jag upp tvätten?", ar: "أين أُعلّق الغسيل؟" },
      { sv: "Kan jag låna ditt tvättmedel?", ar: "هل يمكنني استعارة مسحوق غسيلك؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "لينا", speakerRole: "جارة", textSv: "Hej! Har du bokat tvättstugan just nu, eller är den fri?", textAr: "مرحباً! هل حجزتِ غرفة الغسيل الآن، أم أنها متاحة؟", phonetic: "" },
      { speaker: "B", speakerName: "رهف", speakerRole: "الجارة", textSv: "Jag har bokat den till klockan tre, men jag är snart klar.", textAr: "حجزتها حتى الساعة الثالثة، لكنني سأنتهي قريباً.", phonetic: "" },
      { speaker: "A", speakerName: "لينا", speakerRole: "جارة", textSv: "Ah okej, ingen fara. Skulle det gå bra om jag väntar tio minuter?", textAr: "حسناً، لا بأس. هل يناسبكِ أن أنتظر عشر دقائق؟", phonetic: "" },
      { speaker: "B", speakerName: "رهف", speakerRole: "الجارة", textSv: "Absolut, det tar bara en stund till för torktumlaren.", textAr: "بالتأكيد، سيستغرق المجفف وقتاً قصيراً فقط.", phonetic: "" },
      { speaker: "A", speakerName: "لينا", speakerRole: "جارة", textSv: "Perfekt. Förresten, kan jag låna lite tvättmedel? Jag glömde köpa.", textAr: "ممتاز. بالمناسبة، هل يمكنني استعارة قليل من مسحوق الغسيل؟ نسيت أن أشتري.", phonetic: "" },
      { speaker: "B", speakerName: "رهف", speakerRole: "الجارة", textSv: "Visst, det står på hyllan där. Ta gärna det du behöver.", textAr: "بالتأكيد، موجود على الرف هناك. خذي ما تحتاجينه.", phonetic: "" },
      { speaker: "A", speakerName: "لينا", speakerRole: "جارة", textSv: "Tack så mycket! Jag städar undan när jag är klar, som alltid.", textAr: "شكراً جزيلاً! سأنظّف بعد أن أنتهي، كالعادة.", phonetic: "" },
      { speaker: "B", speakerName: "رهف", speakerRole: "الجارة", textSv: "Toppen, det uppskattas verkligen av alla grannar!", textAr: "رائع، الجيران جميعاً يقدّرون ذلك حقاً!", phonetic: "", noteAr: "الحفاظ على نظافة الأماكن المشتركة قيمة أساسية في السكن السويدي." },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding conversations...");
  await db.delete(conversationLinesTable);
  await db.delete(conversationsTable);
  console.log("🗑️  Cleared existing conversations");

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const [conv] = await db.insert(conversationsTable).values({
      title: s.title,
      titleAr: s.titleAr,
      scenario: s.scenario,
      category: s.category,
      difficulty: s.difficulty,
      emoji: s.emoji,
      imageUrl: s.imageUrl,
      durationMinutes: s.durationMinutes,
      vocabList: s.vocabList,
      grammarTips: s.grammarTips,
      culturalNotes: s.culturalNotes,
      usefulPhrases: s.usefulPhrases,
    }).returning();

    for (let j = 0; j < s.lines.length; j++) {
      const line = s.lines[j];
      await db.insert(conversationLinesTable).values({
        conversationId: conv.id,
        orderIndex: j,
        speaker: line.speaker,
        speakerName: line.speakerName,
        speakerRole: line.speakerRole,
        textSv: line.textSv,
        textAr: line.textAr,
        phonetic: line.phonetic || null,
        noteAr: line.noteAr || null,
      });
    }
    console.log(`✅ [${i + 1}/${scenarios.length}] ${s.emoji} ${s.titleAr} — ${s.lines.length} سطر`);
  }

  console.log(`\n🎉 Seeded ${scenarios.length} conversations!`);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
