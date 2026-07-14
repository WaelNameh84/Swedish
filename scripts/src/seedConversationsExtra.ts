import { db, conversationsTable, conversationLinesTable } from "@workspace/db";

// Extra conversations — appends without deleting existing data

type Line = { speaker: string; speakerName: string; speakerRole: string; textSv: string; textAr: string; phonetic: string; noteAr?: string };
type ScenarioData = {
  title: string; titleAr: string; scenario: string; category: string;
  difficulty: string; emoji: string; imageUrl: string; durationMinutes: number;
  vocabList: { sv: string; ar: string; phonetic?: string }[];
  grammarTips: { title: string; explanation: string; example: string; exampleAr: string }[];
  culturalNotes: string;
  usefulPhrases: { sv: string; ar: string; phonetic?: string }[];
  lines: Line[];
  quiz: { question: string; options: string[]; correct: number; explanation?: string }[];
};

const IMG = {
  pharmacy:     "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  cooking:      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  hiking:       "https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  birthday:     "https://images.pexels.com/photos/796606/pexels-photo-796606.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  weather:      "https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  friendship:   "https://images.pexels.com/photos/1320701/pexels-photo-1320701.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  carrental:    "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  bills:        "https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  midsommar:    "https://media.gettyimages.com/id/471593267/photo/swedish-midsummer-celebration.jpg?s=612x612&w=0&k=20&c=w6gGn813BegVGMlmicCT4P7G3XEsf4b0b21cgCw4hwc=",
  swimming:     "https://images.pexels.com/photos/261185/pexels-photo-261185.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  jobinterview: "https://media.gettyimages.com/id/1286580259/photo/job-interview-in-office.jpg?s=612x612&w=0&k=20&c=j5Xo3vJvUe8Rq7L4eHsY0ZKsGN2VtN9H4Z2XkQkHq9k=",
  customerservice:"https://images.pexels.com/photos/3820380/pexels-photo-3820380.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  neighbor:     "https://images.pexels.com/photos/7578806/pexels-photo-7578806.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  sverigeclass: "https://media.gettyimages.com/id/1667940273/photo/portrait-of-smiling-female-student-with-friend-in-university.jpg?s=612x612&w=0&k=20&c=ePwPB-IfQ5SEUEQQMiN6LVIDDK6wTsAjHVH0b9Yy_5A=",
  parentmeeting:"https://images.pexels.com/photos/8363104/pexels-photo-8363104.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  onlineshopping:"https://images.pexels.com/photos/5632388/pexels-photo-5632388.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  clinic:       "https://media.gettyimages.com/id/731741979/photo/doctor-walking-through-hospital-corridor.jpg?s=612x612&w=0&k=20&c=94a50kc59V322iYjCtqtAM2f6GmIW7T_hiDezvf5TsE=",
  cafeteria:    "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  taxi:         "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  garden:       "https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  cinema:       "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  church:       "https://images.pexels.com/photos/208220/pexels-photo-208220.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  market:       "https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  sauna:        "https://images.pexels.com/photos/3312671/pexels-photo-3312671.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  volunteer:    "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
};

const extraScenarios: ScenarioData[] = [

  // ══════════════════════════════════════════════════════════════════
  // الصيدلية
  // ══════════════════════════════════════════════════════════════════
  {
    title: "På apoteket", titleAr: "في الصيدلية", scenario: "pharmacy",
    category: "صحة", difficulty: "beginner", emoji: "💊",
    imageUrl: IMG.pharmacy, durationMinutes: 10,
    vocabList: [
      { sv: "receptet", ar: "الوصفة الطبية", phonetic: "/rɛˈsɛptːət/" },
      { sv: "smärtstillande", ar: "مسكّن للألم", phonetic: "" },
      { sv: "hosta", ar: "سعال", phonetic: "/ˈhɔstːa/" },
      { sv: "förkylning", ar: "نزلة برد", phonetic: "/fœrˈɕyːlnɪŋ/" },
      { sv: "tabletter", ar: "أقراص / حبوب", phonetic: "" },
      { sv: "biverkningar", ar: "آثار جانبية", phonetic: "" },
      { sv: "dosering", ar: "جرعة", phonetic: "" },
      { sv: "allergi", ar: "حساسية", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن التوافر: 'Har ni'", explanation: "يُستخدم 'Har ni' للسؤال عن توافر شيء في المتجر", example: "Har ni smärtstillande utan recept?", exampleAr: "هل لديكم مسكّن ألم بدون وصفة طبية؟" },
      { title: "حرف الجر 'mot'", explanation: "'mot' بمعنى ضد/لعلاج", example: "Något mot hosta?", exampleAr: "شيء ضد السعال؟" },
    ],
    culturalNotes: "الصيدليات في السويد (Apotek) منظّمة جداً. بعض الأدوية تحتاج وصفة طبية (recept) وبعضها يُباع مباشرة. هناك سلسلة حكومية تُسمى Apotek Hjärtat وأخرى خاصة. الأدوية المزمنة مدعومة من الدولة جزئياً عبر نظام 'läkemedelsförmånen'.",
    usefulPhrases: [
      { sv: "Jag behöver ett recept.", ar: "أحتاج وصفة طبية." },
      { sv: "Har ni något mot hosta?", ar: "هل لديكم شيء للسعال؟" },
      { sv: "Vilken dos ska jag ta?", ar: "كم الجرعة التي يجب أن آخذها؟" },
      { sv: "Finns det biverkningar?", ar: "هل هناك آثار جانبية؟" },
      { sv: "Är det receptfritt?", ar: "هل هو بدون وصفة طبية؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "ليلى", speakerRole: "مريضة", textSv: "Hej! Jag har en förkylning och ont i halsen. Har ni något bra mot det?", textAr: "مرحباً! لديّ نزلة برد وألم في الحلق. هل لديكم شيء جيد لذلك؟", phonetic: "" },
      { speaker: "B", speakerName: "الصيدلانية", speakerRole: "صيدلانية", textSv: "Ja, det finns flera alternativ. Har du något recept från läkaren?", textAr: "نعم، هناك عدة خيارات. هل لديكِ وصفة طبية من الطبيب؟", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "مريضة", textSv: "Nej, inget recept. Det är bara en vanlig förkylning.", textAr: "لا، لا وصفة. إنها مجرد نزلة برد عادية.", phonetic: "" },
      { speaker: "B", speakerName: "الصيدلانية", speakerRole: "صيدلانية", textSv: "Okej. Jag rekommenderar dessa halsontabletterna — de är receptfria och hjälper mot smärtan.", textAr: "حسناً. أنصحكِ بهذه الأقراص للحلق — فهي بدون وصفة وتساعد على تخفيف الألم.", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "مريضة", textSv: "Hur många ska jag ta per dag?", textAr: "كم قرصاً آخذ في اليوم؟", phonetic: "" },
      { speaker: "B", speakerName: "الصيدلانية", speakerRole: "صيدلانية", textSv: "Två tabletter var sjätte timme, max åtta per dag. Och drick mycket vatten!", textAr: "قرصان كل ست ساعات، ثمانية كحد أقصى في اليوم. واشربي الماء كثيراً!", phonetic: "", noteAr: "'var sjätte timme' = كل ست ساعات" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "مريضة", textSv: "Kan jag ta dem om jag är gravid?", textAr: "هل يمكنني أخذها إذا كنتُ حاملاً؟", phonetic: "" },
      { speaker: "B", speakerName: "الصيدلانية", speakerRole: "صيدلانية", textSv: "Nej, om du är gravid bör du konsultera din läkare först. Det är viktigt!", textAr: "لا، إذا كنتِ حاملاً يجب أن تستشيري طبيبكِ أولاً. هذا مهم!", phonetic: "" },
      { speaker: "A", speakerName: "ليلى", speakerRole: "مريضة", textSv: "Okej, förstår. Jag tar dessa. Vad kostar de?", textAr: "حسناً، أفهم. سآخذ هذه. كم ثمنها؟", phonetic: "" },
      { speaker: "B", speakerName: "الصيدلانية", speakerRole: "صيدلانية", textSv: "Det blir 89 kronor. Hoppas du känner dig bättre snart!", textAr: "ثمنها 89 كروناً. أتمنى أن تتعافي قريباً!", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'receptfri' بالعربية؟", options: ["يحتاج وصفة طبية", "بدون وصفة طبية", "مجاني", "مدعوم"], correct: 1 },
      { question: "ما معنى 'förkylning'؟", options: ["حمى", "نزلة برد", "صداع", "سعال"], correct: 1 },
      { question: "كم قرصاً يُوصى بها كل ست ساعات حسب الحوار؟", options: ["واحد", "اثنان", "ثلاثة", "أربعة"], correct: 1 },
      { question: "ما معنى 'biverkningar'؟", options: ["جرعة", "تأثير سريع", "آثار جانبية", "حساسية"], correct: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // الطقس
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Att prata om vädret", titleAr: "الحديث عن الطقس", scenario: "weather",
    category: "حياة يومية", difficulty: "beginner", emoji: "🌦️",
    imageUrl: IMG.weather, durationMinutes: 8,
    vocabList: [
      { sv: "vädret", ar: "الطقس", phonetic: "/ˈvɛːdrət/" },
      { sv: "grader", ar: "درجات (مئوية)", phonetic: "" },
      { sv: "snö", ar: "ثلج", phonetic: "/snøː/" },
      { sv: "regn", ar: "مطر", phonetic: "/rɛŋn/" },
      { sv: "sol", ar: "شمس", phonetic: "/suːl/" },
      { sv: "vind", ar: "ريح", phonetic: "/vɪnd/" },
      { sv: "molnigt", ar: "غائم", phonetic: "" },
      { sv: "prognosen", ar: "التوقعات الجوية", phonetic: "" },
    ],
    grammarTips: [
      { title: "فعل 'Det är'", explanation: "للتعبير عن حالة الطقس", example: "Det är kallt idag.", exampleAr: "الجو بارد اليوم." },
      { title: "مقارنة الطقس: 'varmare / kallare'", explanation: "صيغة التفضيل بإضافة -are", example: "Idag är det varmare än igår.", exampleAr: "اليوم أدفأ من أمس." },
    ],
    culturalNotes: "الطقس موضوع محادثة بالغ الأهمية في السويد! يقول السويديون 'Det är inte dåligt väder, bara dåliga kläder' أي 'لا يوجد طقس سيء، بل ملابس سيئة'. الشتاء يمكن أن يكون قاسياً مع -20 درجة في الشمال، بينما الصيف دافئ ومشمس.",
    usefulPhrases: [
      { sv: "Vilket väder idag!", ar: "يا له من طقس اليوم!" },
      { sv: "Det verkar bli regn.", ar: "يبدو أنه سيمطر." },
      { sv: "Ta med paraply!", ar: "خذ مظلة معك!" },
      { sv: "Hur är vädret hos dig?", ar: "كيف الطقس عندك؟" },
      { sv: "Det är minusgrader ute.", ar: "الحرارة تحت الصفر في الخارج." },
    ],
    lines: [
      { speaker: "A", speakerName: "كريم", speakerRole: "زميل", textSv: "God morgon! Har du sett vädret idag?", textAr: "صباح الخير! هل رأيتَ الطقس اليوم؟", phonetic: "" },
      { speaker: "B", speakerName: "أنا", speakerRole: "زميل", textSv: "Ja, det är jättegrått och blåsigt! Jag frös när jag gick hit.", textAr: "نعم، إنه رمادي جداً وعاصف! كدتُ أتجمّد وأنا في الطريق إلى هنا.", phonetic: "", noteAr: "'grått' = رمادي، 'blåsigt' = عاصف" },
      { speaker: "A", speakerName: "كريم", speakerRole: "زميل", textSv: "Prognosen säger att det ska snöa i helgen!", textAr: "التوقعات الجوية تقول إنه سيتساقط الثلج في عطلة نهاية الأسبوع!", phonetic: "" },
      { speaker: "B", speakerName: "أنا", speakerRole: "زميل", textSv: "Verkligen? Men vi är i november, det är kanske normalt.", textAr: "حقاً؟ لكننا في نوفمبر، ربما هذا طبيعي.", phonetic: "" },
      { speaker: "A", speakerName: "كريم", speakerRole: "زميل", textSv: "Ja, i Sverige brukar det snöa från oktober till april i norr.", textAr: "نعم، في السويد عادةً يثلج من أكتوبر حتى أبريل في الشمال.", phonetic: "" },
      { speaker: "B", speakerName: "أنا", speakerRole: "زميل", textSv: "Och vad är din favoritsäsong?", textAr: "وما هو موسمك المفضل؟", phonetic: "" },
      { speaker: "A", speakerName: "كريم", speakerRole: "زميل", textSv: "Sommaren! Solen går aldrig ner i juli i norra Sverige.", textAr: "الصيف! الشمس لا تغرب أبداً في يوليو في شمال السويد.", phonetic: "", noteAr: "ظاهرة 'الشمس المنتصفية' (midnattssolen) موجودة في شمال السويد." },
      { speaker: "B", speakerName: "أنا", speakerRole: "زميل", textSv: "Det låter häftigt! Jag hoppas att vi får se det en dag.", textAr: "يبدو ذلك رائعاً! آمل أن نرى ذلك يوماً ما.", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'blåsigt'؟", options: ["ثلجي", "عاصف", "غائم", "ممطر"], correct: 1 },
      { question: "ما هي كلمة 'prognosen'؟", options: ["درجة الحرارة", "التوقعات الجوية", "المطر", "العاصفة"], correct: 1 },
      { question: "في أي شهر تقريباً يبدأ الثلج في الشمال السويدي حسب الحوار؟", options: ["يناير", "ديسمبر", "أكتوبر", "مارس"], correct: 2 },
      { question: "ما معنى 'grått'؟", options: ["رمادي", "مشمس", "دافئ", "بارد"], correct: 0 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // عيد الميلاد
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Kalas och födelsedag", titleAr: "حفلة وعيد الميلاد", scenario: "birthday",
    category: "اجتماعي", difficulty: "beginner", emoji: "🎂",
    imageUrl: IMG.birthday, durationMinutes: 10,
    vocabList: [
      { sv: "födelsedag", ar: "عيد الميلاد", phonetic: "/ˈfœdːəlsəˌdɑːɡ/" },
      { sv: "kalas", ar: "حفلة / مهرجان", phonetic: "/ˈkɑːlas/" },
      { sv: "presenten", ar: "الهدية", phonetic: "" },
      { sv: "tårtan", ar: "الكعكة", phonetic: "/ˈtɔːʈan/" },
      { sv: "att fira", ar: "يحتفل", phonetic: "" },
      { sv: "grattis", ar: "تهانيّ / مبروك", phonetic: "/ˈɡratːɪs/" },
      { sv: "inbjudan", ar: "الدعوة", phonetic: "" },
      { sv: "överraskning", ar: "مفاجأة", phonetic: "" },
    ],
    grammarTips: [
      { title: "التهنئة: 'Grattis på'", explanation: "'Grattis på födelsedag' = مبروك عيد الميلاد", example: "Grattis på födelsedagen, Mia!", exampleAr: "مبروك عيد ميلادك، ميا!" },
      { title: "دعوة رسمية: 'Får jag bjuda dig på'", explanation: "للدعوة إلى حفلة أو وجبة", example: "Får jag bjuda dig på tårta?", exampleAr: "أسمح لي أن أدعوك لتناول الكعكة؟" },
    ],
    culturalNotes: "في السويد، عيد الميلاد مناسبة عائلية مهمة. يُغنّى 'Ja, må han leva' بدلاً من Happy Birthday. الأطفال عادةً يحضرون 'kalas' مع أصدقائهم. تقليد 'prinsesstårta' (كعكة الأميرة) الخضراء مشهور جداً.",
    usefulPhrases: [
      { sv: "Grattis på födelsedagen!", ar: "مبروك عيد الميلاد!" },
      { sv: "Kan du komma på mitt kalas?", ar: "هل يمكنك الحضور لحفلتي؟" },
      { sv: "Vilken fin present!", ar: "يا لها من هدية جميلة!" },
      { sv: "Vi sjunger 'Ja, må han leva'!", ar: "سنغني 'Ja, må han leva'!" },
      { sv: "Jag fyller år idag!", ar: "اليوم هو عيد ميلادي!" },
    ],
    lines: [
      { speaker: "A", speakerName: "سارة", speakerRole: "صديقة", textSv: "Hej Omar! Grattis på födelsedagen!", textAr: "مرحباً عمر! مبروك عيد ميلادك!", phonetic: "" },
      { speaker: "B", speakerName: "عمر", speakerRole: "صاحب العيد", textSv: "Tack så mycket! Jag fyller tjugofem år idag.", textAr: "شكراً جزيلاً! أُتم خمسة وعشرين عاماً اليوم.", phonetic: "" },
      { speaker: "A", speakerName: "سارة", speakerRole: "صديقة", textSv: "Wow, ska du ha ett kalas?", textAr: "واو، هل ستقيم حفلة؟", phonetic: "" },
      { speaker: "B", speakerName: "عمر", speakerRole: "صاحب العيد", textSv: "Ja! Lördag kväll hemma hos mig. Kan du komma?", textAr: "نعم! مساء السبت في منزلي. هل يمكنكِ الحضور؟", phonetic: "" },
      { speaker: "A", speakerName: "سارة", speakerRole: "صديقة", textSv: "Absolut! Ska jag ta med något?", textAr: "بكل تأكيد! هل أحضر شيئاً معي؟", phonetic: "", noteAr: "'Absolut' = بكل تأكيد / بالطبع" },
      { speaker: "B", speakerName: "عمر", speakerRole: "صاحب العيد", textSv: "Nej, ingen present behövs! Din närvaro räcker.", textAr: "لا، لا داعي لهدية! حضوركِ يكفي.", phonetic: "" },
      { speaker: "A", speakerName: "سارة", speakerRole: "صديقة", textSv: "Okej, men jag tar med en blombukett ändå!", textAr: "حسناً، لكنني سأحضر باقة زهور على أي حال!", phonetic: "" },
      { speaker: "B", speakerName: "عمر", speakerRole: "صاحب العيد", textSv: "Du är så snäll! Vi bakar en prinsesstårta.", textAr: "أنتِ طيبة جداً! سنخبز كعكة الأميرة.", phonetic: "" },
      { speaker: "A", speakerName: "سارة", speakerRole: "صديقة", textSv: "Jättegott! Och ska vi sjunga 'Ja, må han leva'?", textAr: "لذيذة جداً! وهل سنغني 'Ja, må han leva'؟", phonetic: "" },
      { speaker: "B", speakerName: "عمر", speakerRole: "صاحب العيد", textSv: "Ja, självklart! Det är tradition i Sverige.", textAr: "نعم، بالطبع! هذا تقليد في السويد.", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'grattis'؟", options: ["شكراً", "مبروك / تهانيّ", "عفواً", "أهلاً"], correct: 1 },
      { question: "ما هي 'prinsesstårta'؟", options: ["حلوى سويدية بالشوكولاتة", "الكعكة التقليدية لعيد الميلاد", "كعكة خضراء بالكريمة", "معجنات مالحة"], correct: 2 },
      { question: "ما معنى 'inbjudan'؟", options: ["الهدية", "الاحتفال", "الدعوة", "المفاجأة"], correct: 2 },
      { question: "ما معنى 'fyller år'؟", options: ["يحتفل", "يُكمل سنواته / عيد ميلاده", "يدعو أصدقاء", "يقدّم هدية"], correct: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // استئجار سيارة
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Att hyra en bil", titleAr: "استئجار سيارة", scenario: "carrental",
    category: "سفر", difficulty: "intermediate", emoji: "🚗",
    imageUrl: IMG.carrental, durationMinutes: 12,
    vocabList: [
      { sv: "hyra", ar: "يستأجر", phonetic: "/ˈhyːra/" },
      { sv: "körkort", ar: "رخصة القيادة", phonetic: "" },
      { sv: "försäkring", ar: "تأمين", phonetic: "" },
      { sv: "bensinen", ar: "البنزين", phonetic: "" },
      { sv: "bilen", ar: "السيارة", phonetic: "" },
      { sv: "lämna tillbaka", ar: "يُعيد", phonetic: "" },
      { sv: "kilometrar", ar: "كيلومترات", phonetic: "" },
      { sv: "trafikreglerna", ar: "قواعد المرور", phonetic: "" },
    ],
    grammarTips: [
      { title: "المضارع المستمر بـ 'håller på att'", explanation: "للتعبير عن فعل جارٍ الآن", example: "Vi håller på att ordna pappren.", exampleAr: "نحن نُرتّب الأوراق الآن." },
      { title: "الشرط بـ 'om'", explanation: "للتعبير عن شرط", example: "Om du kör mer än 300 km betalar du extra.", exampleAr: "إذا قدتَ أكثر من 300 كم ستدفع إضافياً." },
    ],
    culturalNotes: "للقيادة في السويد تحتاج رخصة قيادة دولية أو رخصة من دولة EU. الحد الأقصى للكحول في الدم 0.02% (أقل من معظم الدول). في الشتاء، القانون يُلزم بإطارات شتوية. السرعة القصوى على الطرق السريعة 110-120 كم/ساعة.",
    usefulPhrases: [
      { sv: "Jag vill hyra en bil.", ar: "أريد استئجار سيارة." },
      { sv: "Vilket körkort har du?", ar: "ما نوع رخصة قيادتك؟" },
      { sv: "Ingår försäkringen?", ar: "هل التأمين مشمول؟" },
      { sv: "Var lämnar jag tillbaka bilen?", ar: "أين أُعيد السيارة؟" },
      { sv: "Är det obegränsad milkörning?", ar: "هل هناك عدد غير محدود من الكيلومترات؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "ياسر", speakerRole: "عميل", textSv: "Hej! Jag vill hyra en bil för tre dagar.", textAr: "مرحباً! أريد استئجار سيارة لثلاثة أيام.", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف التأجير", textSv: "Välkommen! Vilket slags bil letar du efter?", textAr: "أهلاً وسهلاً! ما نوع السيارة التي تبحث عنها؟", phonetic: "" },
      { speaker: "A", speakerName: "ياسر", speakerRole: "عميل", textSv: "En mellanklass, inte för stor. Helst med GPS.", textAr: "سيارة متوسطة الحجم، ليست كبيرة جداً. يُفضَّل مع نظام GPS.", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف التأجير", textSv: "Vi har en Volvo V60 tillgänglig. Har du ett körkort?", textAr: "لدينا فولفو V60 متاحة. هل لديك رخصة قيادة؟", phonetic: "" },
      { speaker: "A", speakerName: "ياسر", speakerRole: "عميل", textSv: "Ja, här är mitt internationella körkort.", textAr: "نعم، هذه رخصتي الدولية.", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف التأجير", textSv: "Perfekt. Vill du ha heltäckande försäkring?", textAr: "ممتاز. هل تريد تأميناً شاملاً؟", phonetic: "", noteAr: "'heltäckande' = شامل / كامل التغطية" },
      { speaker: "A", speakerName: "ياسر", speakerRole: "عميل", textSv: "Ja, det är bättre. Vad kostar det per dag?", textAr: "نعم، هذا أفضل. كم يكلف في اليوم؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف التأجير", textSv: "Bilen kostar 650 kronor per dag, och försäkringen är 150 kronor extra.", textAr: "السيارة بـ 650 كروناً في اليوم، والتأمين 150 كروناً إضافية.", phonetic: "" },
      { speaker: "A", speakerName: "ياسر", speakerRole: "عميل", textSv: "Okej. Och var ska jag lämna tillbaka den?", textAr: "حسناً. وأين أُعيد السيارة؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف التأجير", textSv: "På samma plats, här på kontoret, senast klockan 18 på lördag.", textAr: "في نفس المكان، هنا في المكتب، في موعد أقصاه الساعة 6 مساء السبت.", phonetic: "" },
      { speaker: "A", speakerName: "ياسر", speakerRole: "عميل", textSv: "Perfekt. Kan jag betala med kort?", textAr: "ممتاز. هل يمكنني الدفع بالبطاقة؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف التأجير", textSv: "Absolut! Vill du ha en karta över Sverige med?", textAr: "بالطبع! هل تريد خريطة السويد معك؟", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'hyra'؟", options: ["يشتري", "يستأجر", "يبيع", "يُصلح"], correct: 1 },
      { question: "ما هو 'körkort'؟", options: ["بطاقة الهوية", "رخصة القيادة", "جواز السفر", "بطاقة الائتمان"], correct: 1 },
      { question: "ما معنى 'heltäckande försäkring'؟", options: ["تأمين محدود", "بدون تأمين", "تأمين شامل", "تأمين رخيص"], correct: 2 },
      { question: "كم كروناً تكلف السيارة يومياً حسب الحوار؟", options: ["150", "500", "650", "800"], correct: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // المسبح / الرياضة
  // ══════════════════════════════════════════════════════════════════
  {
    title: "På simhallen", titleAr: "في المسبح", scenario: "swimming",
    category: "رياضة", difficulty: "beginner", emoji: "🏊",
    imageUrl: IMG.swimming, durationMinutes: 10,
    vocabList: [
      { sv: "simhallen", ar: "المسبح", phonetic: "/ˈsɪmːˌhalːən/" },
      { sv: "badrum", ar: "غرفة تغيير الملابس", phonetic: "" },
      { sv: "badmössa", ar: "غطاء رأس السباحة", phonetic: "" },
      { sv: "simglasögon", ar: "نظارات السباحة", phonetic: "" },
      { sv: "badet", ar: "الحمام / المسبح", phonetic: "" },
      { sv: "duscha", ar: "يستحم", phonetic: "/ˈdɵʂːa/" },
      { sv: "simmar", ar: "يسبح", phonetic: "" },
      { sv: "bana", ar: "مسار / حارة", phonetic: "/ˈbɑːna/" },
    ],
    grammarTips: [
      { title: "الأوامر للجمع: 'Ni måste'", explanation: "للإشارة إلى قاعدة تنطبق على الجميع", example: "Ni måste duscha innan ni hoppar i.", exampleAr: "يجب عليكم الاستحمام قبل الدخول." },
      { title: "الاستفسار بـ 'Finns det'", explanation: "للسؤال عن وجود شيء ما", example: "Finns det ett barnbad här?", exampleAr: "هل يوجد حوض للأطفال هنا؟" },
    ],
    culturalNotes: "المسابح العامة (simhallar) منتشرة في السويد وكثير منها مجاني أو برسوم رمزية. قواعد النظافة صارمة: الاستحمام إلزامي قبل الدخول. يُسمح بالسباحة لكلا الجنسين في نفس المكان. في فصل الصيف، يسبح السويديون في البحيرات والبحر.",
    usefulPhrases: [
      { sv: "Var är omklädningsrummet?", ar: "أين غرفة تغيير الملابس؟" },
      { sv: "Är bassängen öppen nu?", ar: "هل المسبح مفتوح الآن؟" },
      { sv: "Jag vill ha en bana för vuxna.", ar: "أريد حارة للبالغين." },
      { sv: "Krävs badmössa?", ar: "هل غطاء الرأس إلزامي؟" },
      { sv: "Hur länge kan man simma?", ar: "كم يمكن أن تسبح؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "دانيار", speakerRole: "زائر", textSv: "Hej! Vad kostar ett inträde till simhallen?", textAr: "مرحباً! كم ثمن تذكرة المسبح؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظفة", speakerRole: "موظفة الاستقبال", textSv: "Det kostar 80 kronor för vuxna och 40 för barn.", textAr: "ثمنها 80 كروناً للبالغين و40 للأطفال.", phonetic: "" },
      { speaker: "A", speakerName: "دانيار", speakerRole: "زائر", textSv: "En vuxenbiljett tack. Krävs badmössa?", textAr: "تذكرة للبالغين من فضلك. هل غطاء الرأس إلزامي؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظفة", speakerRole: "موظفة الاستقبال", textSv: "Nej, det är inte obligatoriskt men rekommenderat. Kom ihåg att duscha innan!", textAr: "لا، ليس إلزامياً لكنه موصى به. تذكر الاستحمام قبل الدخول!", phonetic: "" },
      { speaker: "A", speakerName: "دانيار", speakerRole: "زائر", textSv: "Förstås! Var är omklädningsrummet?", textAr: "بالطبع! أين غرفة تغيير الملابس؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظفة", speakerRole: "موظفة الاستقبال", textSv: "Till höger, och sedan rakt fram. Du hittar skåpen där.", textAr: "على اليمين، ثم مستقيم. ستجد خزائن الملابس هناك.", phonetic: "" },
      { speaker: "A", speakerName: "دانيار", speakerRole: "زائر", textSv: "Finns det separat bana för träning?", textAr: "هل يوجد مسار خاص للتدريب؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظفة", speakerRole: "موظفة الاستقبال", textSv: "Ja, bana 1 till 4 är för allvarlig träning, bana 5 är friare.", textAr: "نعم، الحارات 1 إلى 4 للتدريب الجاد، والحارة 5 أكثر حرية.", phonetic: "" },
      { speaker: "A", speakerName: "دانيار", speakerRole: "زائر", textSv: "Perfekt, tack för informationen!", textAr: "ممتاز، شكراً على المعلومات!", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'simhallen'؟", options: ["الصالة الرياضية", "المسبح", "الشاطئ", "غرفة التغيير"], correct: 1 },
      { question: "ما معنى 'obligatoriskt'؟", options: ["اختياري", "إلزامي", "مجاني", "مدفوع"], correct: 1 },
      { question: "كم ثمن تذكرة البالغين حسب الحوار؟", options: ["40 كرونا", "60 كرونا", "80 كرونا", "100 كرونا"], correct: 2 },
      { question: "ما معنى 'bana' في سياق المسبح؟", options: ["الطابق", "حارة السباحة", "حوض الأطفال", "الدش"], correct: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // درس اللغة السويدية (SFI)
  // ══════════════════════════════════════════════════════════════════
  {
    title: "I SFI-klassen", titleAr: "في فصل السويدية للمهاجرين", scenario: "sverigeclass",
    category: "تعليم", difficulty: "beginner", emoji: "📚",
    imageUrl: IMG.sverigeclass, durationMinutes: 10,
    vocabList: [
      { sv: "svenska för invandrare", ar: "السويدية للمهاجرين (SFI)", phonetic: "" },
      { sv: "läraren", ar: "المعلم/ة", phonetic: "" },
      { sv: "läxan", ar: "الواجب المنزلي", phonetic: "" },
      { sv: "grammatiken", ar: "القواعد النحوية", phonetic: "" },
      { sv: "uttal", ar: "النطق", phonetic: "" },
      { sv: "glosor", ar: "مفردات", phonetic: "" },
      { sv: "prov", ar: "اختبار", phonetic: "/pruːv/" },
      { sv: "förstår", ar: "يفهم", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن الصعوبة: 'svårt att'", explanation: "'Det är svårt att' + مصدر", example: "Det är svårt att förstå grammatiken.", exampleAr: "من الصعب فهم القواعد النحوية." },
      { title: "طلب التوضيح: 'Kan du förklara'", explanation: "للطلب من المعلم التوضيح", example: "Kan du förklara det igen, tack?", exampleAr: "هل يمكنك شرح ذلك مرة أخرى، من فضلك؟" },
    ],
    culturalNotes: "SFI (Svenska för invandrare) هو برنامج مجاني تموّله البلديات السويدية لتعليم اللغة للمهاجرين. يُقسَّم المستوى إلى A, B, C, D. يمكن أحياناً دمجه مع التدريب المهني. اجتياز SFI يفتح آفاقاً للعمل والتكامل الاجتماعي.",
    usefulPhrases: [
      { sv: "Jag förstår inte.", ar: "لا أفهم." },
      { sv: "Kan du prata långsammare?", ar: "هل يمكنك التحدث بشكل أبطأ؟" },
      { sv: "Hur skriver man det?", ar: "كيف يُكتب ذلك؟" },
      { sv: "Vad är läxan till imorgon?", ar: "ما هو الواجب لغد؟" },
      { sv: "Jag vill öva mer.", ar: "أريد أن أتدرب أكثر." },
    ],
    lines: [
      { speaker: "A", speakerName: "المعلمة آنا", speakerRole: "مدرّسة SFI", textSv: "God morgon allihopa! Idag ska vi öva på bestämd form.", textAr: "صباح الخير جميعاً! اليوم سنتدرب على الصيغة المعرّفة.", phonetic: "" },
      { speaker: "B", speakerName: "خالد", speakerRole: "طالب", textSv: "Ursäkta, vad menar du med 'bestämd form'?", textAr: "عفواً، ماذا تقصدين بـ 'الصيغة المعرّفة'؟", phonetic: "" },
      { speaker: "A", speakerName: "المعلمة آنا", speakerRole: "مدرّسة SFI", textSv: "Bra fråga! Det är när vi sätter -en eller -et efter substantivet. Till exempel: 'bok' blir 'boken'.", textAr: "سؤال ممتاز! هي عندما نضيف -en أو -et بعد الاسم. مثلاً: 'bok' تصبح 'boken'.", phonetic: "" },
      { speaker: "B", speakerName: "خالد", speakerRole: "طالب", textSv: "Ah, som arabiskans 'ال'?", textAr: "آه، كالتعريف بـ 'ال' في العربية؟", phonetic: "" },
      { speaker: "A", speakerName: "المعلمة آنا", speakerRole: "مدرّسة SFI", textSv: "Exakt! Det är en liknelse. I svenska lägger vi till det i slutet.", textAr: "بالضبط! إنها مماثلة. في السويدية نضيف التعريف في النهاية.", phonetic: "" },
      { speaker: "B", speakerName: "خالد", speakerRole: "طالب", textSv: "Och hur vet jag om ett ord är en eller ett?", textAr: "وكيف أعرف إذا كانت الكلمة من نوع 'en' أو 'ett'؟", phonetic: "" },
      { speaker: "A", speakerName: "المعلمة آنا", speakerRole: "مدرّسة SFI", textSv: "Det är svårt men det finns regler. Och du lär dig med övning!", textAr: "هذا صعب لكن هناك قواعد. وستتعلم مع التدريب!", phonetic: "" },
      { speaker: "B", speakerName: "خالد", speakerRole: "طالب", textSv: "Okej, jag ska försöka. Kan du ge ett exempel till?", textAr: "حسناً، سأحاول. هل يمكنك إعطاء مثال آخر؟", phonetic: "" },
      { speaker: "A", speakerName: "المعلمة آنا", speakerRole: "مدرّسة SFI", textSv: "Ja: 'hus' är ett-ord, så det blir 'huset'. 'Bil' är en-ord, 'bilen'.", textAr: "نعم: 'hus' كلمة ett فتصبح 'huset'. 'Bil' كلمة en، فتصبح 'bilen'.", phonetic: "" },
      { speaker: "B", speakerName: "خالد", speakerRole: "طالب", textSv: "Perfekt! Nu förstår jag bättre.", textAr: "ممتاز! الآن أفهم بشكل أفضل.", phonetic: "" },
    ],
    quiz: [
      { question: "ما هو SFI؟", options: ["اختبار السويدية", "دورة السويدية للمهاجرين المجانية", "جامعة سويدية", "منحة دراسية"], correct: 1 },
      { question: "كيف تصبح كلمة 'bok' في الصيغة المعرّفة؟", options: ["bokens", "boket", "boken", "boki"], correct: 2 },
      { question: "ما معنى 'glosor'؟", options: ["قواعد نحوية", "نطق", "مفردات", "اختبار"], correct: 2 },
      { question: "ما معنى 'prov'؟", options: ["واجب منزلي", "اختبار", "كتاب", "معلم"], correct: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // خدمة العملاء (شكوى)
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Kundservice och klagomål", titleAr: "خدمة العملاء والشكاوى", scenario: "customerservice",
    category: "تسوق", difficulty: "intermediate", emoji: "📞",
    imageUrl: IMG.customerservice, durationMinutes: 12,
    vocabList: [
      { sv: "klagomål", ar: "شكوى", phonetic: "/ˈklɑːɡɔˌmɔːl/" },
      { sv: "fel", ar: "خطأ / عيب", phonetic: "/feːl/" },
      { sv: "reklamation", ar: "إعادة / مطالبة", phonetic: "" },
      { sv: "byta", ar: "يستبدل", phonetic: "" },
      { sv: "återbetalning", ar: "استرداد المال", phonetic: "" },
      { sv: "kvittot", ar: "الإيصال", phonetic: "" },
      { sv: "garanti", ar: "ضمان", phonetic: "" },
      { sv: "defekt", ar: "معيب", phonetic: "" },
    ],
    grammarTips: [
      { title: "تقديم الشكوى: 'Jag vill klaga på'", explanation: "للتعبير عن الرغبة في تقديم شكوى", example: "Jag vill klaga på den här produkten.", exampleAr: "أريد أن أشكو بشأن هذا المنتج." },
      { title: "المطالبة المؤدبة: 'Jag skulle vilja ha'", explanation: "طلب مؤدب لشيء ما", example: "Jag skulle vilja ha pengarna tillbaka.", exampleAr: "أودّ أن أسترجع أموالي." },
    ],
    culturalNotes: "في السويد، حقوق المستهلك محمية جيداً. قانون 'konsumentköplagen' يُعطيك الحق في إصلاح أو استبدال أو استرداد المال إذا كانت البضاعة معيبة. الضمان الحكومي 3 سنوات للسلع. معظم المحلات تقبل الإرجاع خلال 30 يوماً.",
    usefulPhrases: [
      { sv: "Det här fungerar inte.", ar: "هذا لا يعمل." },
      { sv: "Jag vill returnera det.", ar: "أريد إرجاعه." },
      { sv: "Kan jag få en annan?", ar: "هل يمكنني الحصول على واحد آخر؟" },
      { sv: "Jag har kvittot här.", ar: "لديّ الإيصال هنا." },
      { sv: "Det var defekt från början.", ar: "كان معيباً من البداية." },
    ],
    lines: [
      { speaker: "A", speakerName: "هند", speakerRole: "عميلة", textSv: "Hej, jag köpte den här bärbara datorn för en vecka sedan, men den startar inte.", textAr: "مرحباً، اشتريتُ هذا الكمبيوتر المحمول منذ أسبوع، لكنه لا يبدأ.", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف خدمة العملاء", textSv: "Beklagar det! Har du kvittot med dig?", textAr: "أنا آسف! هل لديكِ الإيصال معكِ؟", phonetic: "" },
      { speaker: "A", speakerName: "هند", speakerRole: "عميلة", textSv: "Ja, här är det. Jag betalade 8 000 kronor.", textAr: "نعم، ها هو. دفعتُ 8 000 كرونا.", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف خدمة العملاء", textSv: "Jag förstår. Vi kan byta ut den mot en ny eller ge dig pengarna tillbaka.", textAr: "أفهم. يمكننا استبدالها بجهاز جديد أو إعادة أموالكِ.", phonetic: "" },
      { speaker: "A", speakerName: "هند", speakerRole: "عميلة", textSv: "Jag föredrar att få en ny dator, om möjligt.", textAr: "أُفضّل الحصول على كمبيوتر جديد، إن أمكن.", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف خدمة العملاء", textSv: "Absolut. Vi kollar om vi har samma modell i lager.", textAr: "بالطبع. سنتحقق إذا كان لدينا نفس الطراز في المستودع.", phonetic: "" },
      { speaker: "A", speakerName: "هند", speakerRole: "عميلة", textSv: "Och ingår garanti på den nya?", textAr: "وهل الجهاز الجديد مشمول بالضمان؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف خدمة العملاء", textSv: "Ja, tre år garanti på alla elektronikprodukter. Vänta en moment, jag hämtar den.", textAr: "نعم، ثلاث سنوات ضمان على جميع المنتجات الإلكترونية. انتظري لحظة، سأحضرها.", phonetic: "" },
      { speaker: "A", speakerName: "هند", speakerRole: "عميلة", textSv: "Tack för hjälpen, jag uppskattar det verkligen.", textAr: "شكراً على المساعدة، أقدّر ذلك حقاً.", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'klagomål'؟", options: ["استرداد المال", "شكوى", "ضمان", "إيصال"], correct: 1 },
      { question: "ما معنى 'återbetalning'؟", options: ["ضمان", "استبدال", "استرداد المال", "توصيل"], correct: 2 },
      { question: "ما معنى 'defekt'؟", options: ["جديد", "مكسور / معيب", "مجاني", "مضمون"], correct: 1 },
      { question: "كم سنة ضمان على الإلكترونيات حسب الحوار؟", options: ["سنة", "سنتان", "ثلاث سنوات", "خمس سنوات"], correct: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // اجتماع أولياء الأمور
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Föräldramöte på skolan", titleAr: "اجتماع أولياء الأمور في المدرسة", scenario: "parentmeeting",
    category: "تعليم", difficulty: "intermediate", emoji: "🏫",
    imageUrl: IMG.parentmeeting, durationMinutes: 12,
    vocabList: [
      { sv: "föräldramöte", ar: "اجتماع أولياء الأمور", phonetic: "" },
      { sv: "betyg", ar: "درجات / علامات", phonetic: "/ˈbeːtʏɡ/" },
      { sv: "framsteg", ar: "تقدم", phonetic: "" },
      { sv: "uppförande", ar: "سلوك", phonetic: "" },
      { sv: "matematiken", ar: "الرياضيات", phonetic: "" },
      { sv: "stöd", ar: "دعم", phonetic: "" },
      { sv: "koncentration", ar: "تركيز", phonetic: "" },
      { sv: "hemläxa", ar: "واجب منزلي", phonetic: "" },
    ],
    grammarTips: [
      { title: "المضارع التام: 'har + supinum'", explanation: "للحديث عن إنجازات حتى الآن", example: "Yusuf har gjort stora framsteg.", exampleAr: "يوسف أحرز تقدماً كبيراً." },
      { title: "التعبير عن القلق: 'Jag är orolig för'", explanation: "للتعبير عن القلق", example: "Jag är orolig för hans koncentration.", exampleAr: "أنا قلق على تركيزه." },
    ],
    culturalNotes: "التعليم في السويد مجاني من رياض الأطفال حتى الجامعة. اجتماعات أولياء الأمور (föräldramöten) تُعقد مرتين سنوياً تقريباً. النظام يشجع على التواصل بين الأهل والمعلمين. لا توجد تقديرات حرفية (A,B,C) حتى الصف السادس.",
    usefulPhrases: [
      { sv: "Hur klarar sig mitt barn?", ar: "كيف حال طفلي في المدرسة؟" },
      { sv: "Är han/hon aktiv i klassen?", ar: "هل هو/هي نشيط في الفصل؟" },
      { sv: "Finns det problem jag bör veta om?", ar: "هل هناك مشاكل يجب أن أعلم بها؟" },
      { sv: "Hur kan jag stödja hemma?", ar: "كيف يمكنني مساعدته في المنزل؟" },
      { sv: "Vi är väldigt nöjda med hans framsteg.", ar: "نحن سعداء جداً بتقدمه." },
    ],
    lines: [
      { speaker: "A", speakerName: "المعلمة ليندا", speakerRole: "مدرّسة", textSv: "Välkommen, det är kul att träffas! Yusuf är en fantastisk elev.", textAr: "أهلاً وسهلاً، يسعدني لقاؤكم! يوسف طالب رائع.", phonetic: "" },
      { speaker: "B", speakerName: "والد يوسف", speakerRole: "وليّ أمر", textSv: "Tack! Vi är stolta över honom. Hur klarar han sig i ämnena?", textAr: "شكراً! نحن فخورون به. كيف حاله في المواد الدراسية؟", phonetic: "" },
      { speaker: "A", speakerName: "المعلمة ليندا", speakerRole: "مدرّسة", textSv: "Han är jättebra i svenska och SO. Matematik är lite svårare.", textAr: "هو رائع في السويدية والعلوم الاجتماعية. الرياضيات أصعب قليلاً.", phonetic: "", noteAr: "'SO' = Samhällsorienterande ämnen = العلوم الاجتماعية" },
      { speaker: "B", speakerName: "والد يوسف", speakerRole: "وليّ أمر", textSv: "Ja, han säger att han tycker det är svårt. Vad kan vi göra hemma?", textAr: "نعم، يقول إنه يجده صعباً. ماذا يمكننا أن نفعل في المنزل؟", phonetic: "" },
      { speaker: "A", speakerName: "المعلمة ليندا", speakerRole: "مدرّسة", textSv: "Öva multiplikationstabellen varje kväll i tio minuter. Det hjälper mycket.", textAr: "تدرّبوا على جدول الضرب كل مساء لعشر دقائق. هذا يساعد كثيراً.", phonetic: "" },
      { speaker: "B", speakerName: "والد يوسف", speakerRole: "وليّ أمر", textSv: "Det gör vi! Och hur är hans uppförande?", textAr: "سنفعل ذلك! وكيف سلوكه؟", phonetic: "" },
      { speaker: "A", speakerName: "المعلمة ليندا", speakerRole: "مدرّسة", textSv: "Exemplariskt! Han är snäll mot alla och hjälper sina klasskompisar.", textAr: "مثالي! هو لطيف مع الجميع ويساعد زملاءه.", phonetic: "", noteAr: "'exemplarisk' = مثالي / نموذجي" },
      { speaker: "B", speakerName: "والد يوسف", speakerRole: "وليّ أمر", textSv: "Det är underbart att höra. Vi är väldigt nöjda!", textAr: "هذا رائع أن نسمعه. نحن سعداء جداً!", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'betyg'؟", options: ["واجب منزلي", "درجات / علامات", "سلوك", "تركيز"], correct: 1 },
      { question: "ما هي مادة 'SO' في المدارس السويدية؟", options: ["العلوم الطبيعية", "الرياضيات", "العلوم الاجتماعية", "اللغة الإنجليزية"], correct: 2 },
      { question: "ما معنى 'framsteg'؟", options: ["مشكلة", "تقدم", "دعم", "اختبار"], correct: 1 },
      { question: "ما معنى كلمة 'uppförande'؟", options: ["تركيز", "نشاط", "سلوك", "إنجاز"], correct: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // المصبح / مسمّر
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Midsommarfirande", titleAr: "الاحتفال بمنتصف الصيف (ميدسومار)", scenario: "midsommar",
    category: "ثقافة", difficulty: "intermediate", emoji: "🌸",
    imageUrl: IMG.midsommar, durationMinutes: 12,
    vocabList: [
      { sv: "midsommar", ar: "منتصف الصيف", phonetic: "/ˈmɪdːˌsɔmːar/" },
      { sv: "midsommarstången", ar: "عمود الميدسومار", phonetic: "" },
      { sv: "folkdans", ar: "رقص شعبي", phonetic: "" },
      { sv: "jordgubbar", ar: "فراولة", phonetic: "" },
      { sv: "sill", ar: "سمك الرنجة", phonetic: "/sɪlː/" },
      { sv: "kransen", ar: "إكليل الزهور", phonetic: "" },
      { sv: "snapsvisor", ar: "أغاني الشرب", phonetic: "" },
      { sv: "traditionen", ar: "التقليد", phonetic: "" },
    ],
    grammarTips: [
      { title: "الوصف بـ 'brukar'", explanation: "يُستخدم 'brukar' للإشارة إلى عادة متكررة", example: "Vi brukar fira midsommar på landet.", exampleAr: "عادةً نحتفل بالميدسومار في الريف." },
      { title: "دعوة بـ 'Vill du vara med och'", explanation: "للدعوة للمشاركة في نشاط", example: "Vill du vara med och dansa?", exampleAr: "هل تريد المشاركة في الرقص؟" },
    ],
    culturalNotes: "ميدسومار هو أهم عيد سويدي غير ديني. يُحتفل به في أقرب جمعة وسبت من 21 يونيو. العائلات تجتمع في الريف، يُقيمون عمود الزينة (midsommarstången)، يرقصون حوله ويأكلون الرنجة والفراولة. يُعتقد شعبياً أن من ينام على سبع أنواع من الزهور في ليلة الميدسومار يرى شريكه المستقبلي.",
    usefulPhrases: [
      { sv: "Glad midsommar!", ar: "ميدسومار سعيد!" },
      { sv: "Ska vi resa till landet?", ar: "هل سنذهب إلى الريف؟" },
      { sv: "Jag älskar jordgubbar med grädde.", ar: "أحب الفراولة مع الكريمة." },
      { sv: "Ska vi resa upp stången?", ar: "هل سنرفع العمود؟" },
      { sv: "Det är ljust hela natten!", ar: "الجو منير طوال الليل!" },
    ],
    lines: [
      { speaker: "A", speakerName: "إيما", speakerRole: "سويدية", textSv: "Glad midsommar, Hassan! Det här är din första midsommar i Sverige, eller hur?", textAr: "ميدسومار سعيد، حسن! هذا أول ميدسومار لك في السويد، أليس كذلك؟", phonetic: "" },
      { speaker: "B", speakerName: "حسن", speakerRole: "مهاجر جديد", textSv: "Ja! Vad är traditionen egentligen?", textAr: "نعم! ما هو التقليد في الواقع؟", phonetic: "" },
      { speaker: "A", speakerName: "إيما", speakerRole: "سويدية", textSv: "Vi reser upp en midsommarstång och dansar runt den. Sedan äter vi sill och dricker snapsar!", textAr: "نرفع عمود الميدسومار ونرقص حوله. ثم نأكل الرنجة ونشرب المشروبات!", phonetic: "" },
      { speaker: "B", speakerName: "حسن", speakerRole: "مهاجر جديد", textSv: "Intressant! Och vad är det för blommor på stången?", textAr: "مثير للاهتمام! وما هذه الزهور على العمود؟", phonetic: "" },
      { speaker: "A", speakerName: "إيما", speakerRole: "سويدية", textSv: "Björklöv och vilda blommor. Vi pyntar med det som finns i naturen.", textAr: "أوراق بتولا وزهور برية. نُزيّن بما يوجد في الطبيعة.", phonetic: "", noteAr: "'björklöv' = أوراق شجر البتولا، رمز السويد" },
      { speaker: "B", speakerName: "حسن", speakerRole: "مهاجر جديد", textSv: "Och folkdansen — vad sjunger ni?", textAr: "والرقص الشعبي — ماذا تغنون؟", phonetic: "" },
      { speaker: "A", speakerName: "إيما", speakerRole: "سويدية", textSv: "Gamla barnvisor som 'Små grodorna'! Det är jättekul!", textAr: "أغاني أطفال قديمة مثل 'الضفادع الصغيرة'! إنه ممتع جداً!", phonetic: "" },
      { speaker: "B", speakerName: "حسن", speakerRole: "مهاجر جديد", textSv: "Jag vill lära mig! Kan du lära mig stegen?", textAr: "أريد أن أتعلم! هل يمكنكِ أن تعلميني الخطوات؟", phonetic: "" },
      { speaker: "A", speakerName: "إيما", speakerRole: "سويدية", textSv: "Absolut! Det är enkelt, och efter det äter vi jordgubbar med grädde!", textAr: "بالطبع! الأمر بسيط، وبعد ذلك سنأكل الفراولة مع الكريمة!", phonetic: "" },
      { speaker: "B", speakerName: "حسن", speakerRole: "مهاجر جديد", textSv: "Det låter perfekt! Jag älskar redan midsommar!", textAr: "يبدو ذلك مثالياً! أنا أحب الميدسومار مسبقاً!", phonetic: "" },
    ],
    quiz: [
      { question: "ما هو 'midsommarstången'؟", options: ["طبق تقليدي", "عمود الزينة", "أغنية شعبية", "إكليل زهور"], correct: 1 },
      { question: "ما هو الطعام التقليدي في ميدسومار؟", options: ["كرات اللحم والبطاطس", "الرنجة والفراولة بالكريمة", "الكعكة الخضراء", "السمك المشوي"], correct: 1 },
      { question: "ما معنى 'folkdans'؟", options: ["موسيقى شعبية", "رقص شعبي", "أغنية شعبية", "ملابس تقليدية"], correct: 1 },
      { question: "متى يُحتفل بالميدسومار؟", options: ["في يناير", "في مايو", "في أقرب جمعة من 21 يونيو", "في ديسمبر"], correct: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // الجيران
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Att prata med grannen", titleAr: "الحديث مع الجار", scenario: "neighbor",
    category: "حياة يومية", difficulty: "beginner", emoji: "🏠",
    imageUrl: IMG.neighbor, durationMinutes: 10,
    vocabList: [
      { sv: "grannen", ar: "الجار", phonetic: "/ˈɡranːən/" },
      { sv: "lägenheten", ar: "الشقة", phonetic: "" },
      { sv: "trapphuset", ar: "مدخل البناية / السلّم", phonetic: "" },
      { sv: "buller", ar: "ضوضاء", phonetic: "/ˈbɵlːər/" },
      { sv: "lugnt", ar: "هادئ", phonetic: "" },
      { sv: "fest", ar: "حفلة", phonetic: "" },
      { sv: "störa", ar: "يُزعج", phonetic: "" },
      { sv: "styrelsen", ar: "مجلس البناية", phonetic: "" },
    ],
    grammarTips: [
      { title: "الاعتذار: 'Förlåt att jag stör'", explanation: "عبارة مؤدبة للاعتذار عن الإزعاج", example: "Förlåt att jag stör dig.", exampleAr: "أعتذر عن إزعاجك." },
      { title: "الطلب المؤدب: 'Skulle det vara möjligt att'", explanation: "أسلوب مؤدب جداً للطلب", example: "Skulle det vara möjligt att sänka musiken lite?", exampleAr: "هل يمكن خفض الموسيقى قليلاً؟" },
    ],
    culturalNotes: "السويديون يُقدّرون الهدوء في البنايات. هناك قواعد صارمة بخصوص الضوضاء؛ بعد الساعة 10 مساءً يجب الهدوء. 'brf' اختصار 'Bostadsrättsförening' وهو مجلس البناية الذي يُصدر قواعد السلوك. من الطبيعي مقدار الهدوء الذي يبحث عنه السويديون في بنايتهم.",
    usefulPhrases: [
      { sv: "Hej, jag heter... och bor på plan 3.", ar: "مرحباً، اسمي... وأسكن في الطابق 3." },
      { sv: "Kan du vara lite tystare?", ar: "هل يمكنك أن تكون أكثر هدوءاً؟" },
      { sv: "Förlåt, det ska inte hända igen.", ar: "آسف، لن يحدث ذلك مرة أخرى." },
      { sv: "Vi är grannar, vi borde hjälpa varandra.", ar: "نحن جيران، يجب أن نساعد بعضنا." },
      { sv: "Tvättstugan är ledig nu.", ar: "غرفة الغسيل فارغة الآن." },
    ],
    lines: [
      { speaker: "A", speakerName: "أنا", speakerRole: "جار جديد", textSv: "Hej! Jag heter Nour och har precis flyttat in på plan 4.", textAr: "مرحباً! اسمي نور وانتقلتُ للتو للطابق الرابع.", phonetic: "" },
      { speaker: "B", speakerName: "ستيفان", speakerRole: "جار قديم", textSv: "Välkommen till huset! Jag heter Stefan och bor granne med dig.", textAr: "مرحباً بك في البناية! اسمي ستيفان وأسكن بجانبك.", phonetic: "" },
      { speaker: "A", speakerName: "أنا", speakerRole: "جار جديد", textSv: "Trevligt att träffas! Är det okej om jag har lite folk hemma på fredag?", textAr: "يسعدني لقاؤك! هل سيكون مقبولاً أن يكون عندي بعض الأشخاص يوم الجمعة؟", phonetic: "" },
      { speaker: "B", speakerName: "ستيفان", speakerRole: "جار قديم", textSv: "Det är lugnt! Men tänk på att vi har tystregler efter klockan 22.", textAr: "لا مشكلة! لكن تذكّر أن لدينا قواعد صمت بعد الساعة 10 مساءً.", phonetic: "", noteAr: "'tystregler' = قواعد الصمت في البناية" },
      { speaker: "A", speakerName: "أنا", speakerRole: "جار جديد", textSv: "Absolut, jag respekterar det! Har du böcker om husets regler?", textAr: "بالطبع، سأحترم ذلك! هل لديك نشرة عن قواعد البناية؟", phonetic: "" },
      { speaker: "B", speakerName: "ستيفان", speakerRole: "جار قديم", textSv: "Ja, jag mejlar dig länken till brf-reglerna. Och tvättstugan bokar du online.", textAr: "نعم، سأرسل لك رابط قواعد مجلس البناية. وغرفة الغسيل تحجزها إلكترونياً.", phonetic: "" },
      { speaker: "A", speakerName: "أنا", speakerRole: "جار جديد", textSv: "Tack så mycket Stefan! Du är verkligen hjälpsam.", textAr: "شكراً جزيلاً يا ستيفان! أنت مساعد حقاً.", phonetic: "" },
      { speaker: "B", speakerName: "ستيفان", speakerRole: "جار قديم", textSv: "Ingen orsak! Välkommen igen. Hör av dig om du behöver något.", textAr: "لا شكر على واجب! أهلاً بك مجدداً. تواصل معي إذا احتجتَ شيئاً.", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'grannen'؟", options: ["المالك", "الجار", "الحارس", "المستأجر"], correct: 1 },
      { question: "بعد أي ساعة يجب الهدوء في البناية حسب الحوار؟", options: ["8 مساءً", "9 مساءً", "10 مساءً", "11 مساءً"], correct: 2 },
      { question: "ما معنى 'störa'؟", options: ["يُساعد", "يُزعج / يُقلق", "يسكن", "يُغلق"], correct: 1 },
      { question: "ما هي 'brf'؟", options: ["شركة سكنية", "مجلس البناية", "قانون الإيجار", "خدمة البريد"], correct: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // الطبخ السويدي
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Att laga svensk mat", titleAr: "طبخ الأكل السويدي", scenario: "cooking",
    category: "طعام", difficulty: "beginner", emoji: "🍳",
    imageUrl: IMG.cooking, durationMinutes: 10,
    vocabList: [
      { sv: "köttbullar", ar: "كرات اللحم السويدية", phonetic: "" },
      { sv: "potatisen", ar: "البطاطس", phonetic: "" },
      { sv: "lingonsylt", ar: "مربى التوت الأحمر", phonetic: "" },
      { sv: "ingredienser", ar: "المكونات", phonetic: "" },
      { sv: "receptet", ar: "الوصفة", phonetic: "" },
      { sv: "steka", ar: "يقلي", phonetic: "" },
      { sv: "koka", ar: "يطبخ / يسلق", phonetic: "" },
      { sv: "ugnen", ar: "الفرن", phonetic: "" },
    ],
    grammarTips: [
      { title: "الأمر في الطبخ: 'Häll i / Lägg till'", explanation: "صيغة أمر للتعليمات", example: "Häll i mjölken och rör om.", exampleAr: "أضف الحليب وحرّك." },
      { title: "الكمية: 'gram / dl'", explanation: "وحدات القياس في الوصفات السويدية", example: "Blanda 400 gram köttfärs.", exampleAr: "اخلط 400 جرام من اللحم المفروم." },
    ],
    culturalNotes: "الكرة اللحم (köttbullar) هي الطبق السويدي الأشهر عالمياً. عادةً تُقدّم مع البطاطا المهروسة ومربى التوت الأحمر وصلصة كريمية. IKEA جعلتها شهيرة دولياً. طبق الهرّينج (sill) وسمك السالمون والوافل (våffla) أيضاً من الأطباق التقليدية.",
    usefulPhrases: [
      { sv: "Kan du ge mig receptet?", ar: "هل يمكنك إعطائي الوصفة؟" },
      { sv: "Vad behöver vi till rätten?", ar: "ماذا نحتاج للطبق؟" },
      { sv: "Sätt ugnen på 200 grader.", ar: "اضبط الفرن على 200 درجة." },
      { sv: "Rösten om till det tjocknar.", ar: "حرّك حتى يتكثّف." },
      { sv: "Nu är maten klar!", ar: "الطعام جاهز الآن!" },
    ],
    lines: [
      { speaker: "A", speakerName: "ميريام", speakerRole: "صديقة سويدية", textSv: "Ska vi laga köttbullar idag? Det är inte svårt!", textAr: "هل سنصنع كرات اللحم اليوم؟ الأمر ليس صعباً!", phonetic: "" },
      { speaker: "B", speakerName: "رنا", speakerRole: "صديقة عربية", textSv: "Ja gärna! Vad behöver vi?", textAr: "بكل سرور! ماذا نحتاج؟", phonetic: "" },
      { speaker: "A", speakerName: "ميريام", speakerRole: "صديقة سويدية", textSv: "Köttfärs, lök, ägg, ströbröd, salt, peppar och lite mjölk.", textAr: "لحم مفروم، بصل، بيض، فتات خبز، ملح، فلفل وقليل من الحليب.", phonetic: "" },
      { speaker: "B", speakerName: "رنا", speakerRole: "صديقة عربية", textSv: "Okej! Och hur gör man dem?", textAr: "حسناً! وكيف نصنعها؟", phonetic: "" },
      { speaker: "A", speakerName: "ميريام", speakerRole: "صديقة سويدية", textSv: "Blanda allt i en skål, forma små bollar och stek dem i smör.", textAr: "اخلطي كل شيء في وعاء، كوّني كرات صغيرة واقليها في الزبدة.", phonetic: "", noteAr: "'smör' = زبدة، ضرورية لنكهة الكرات اللحم الأصيلة." },
      { speaker: "B", speakerName: "رنا", speakerRole: "صديقة عربية", textSv: "Hur länge steker man dem?", textAr: "كم من الوقت تُقلى؟", phonetic: "" },
      { speaker: "A", speakerName: "ميريام", speakerRole: "صديقة سويدية", textSv: "Ca tio minuter tills de är bruna runt om.", textAr: "حوالي عشر دقائق حتى تتحمّر من جميع الجوانب.", phonetic: "" },
      { speaker: "B", speakerName: "رنا", speakerRole: "صديقة عربية", textSv: "Och vad serverar man med köttbullarna?", textAr: "وماذا يُقدَّم مع كرات اللحم؟", phonetic: "" },
      { speaker: "A", speakerName: "ميريام", speakerRole: "صديقة سويدية", textSv: "Mosad potatis, gräddsås och lingonsylt. Det är klassiskt!", textAr: "بطاطا مهروسة، صلصة كريمية ومربى التوت الأحمر. هذا الكلاسيكي!", phonetic: "" },
      { speaker: "B", speakerName: "رنا", speakerRole: "صديقة عربية", textSv: "Mmm, det låter jättegott! Jag kan inte vänta!", textAr: "مممم، يبدو لذيذاً جداً! لا أستطيع الانتظار!", phonetic: "" },
    ],
    quiz: [
      { question: "ما هي 'köttbullar'؟", options: ["شوربة سويدية", "كرات اللحم", "سمك مشوي", "خبز سويدي"], correct: 1 },
      { question: "ما معنى 'steka'؟", options: ["يسلق", "يقلي", "يشوي في الفرن", "يعجن"], correct: 1 },
      { question: "ما الذي يُقدَّم مع كرات اللحم حسب الحوار؟", options: ["الأرز والسلطة", "البطاطا المهروسة والصلصة الكريمية ومربى التوت", "المعكرونة والجبن", "الخبز والخضار"], correct: 1 },
      { question: "ما معنى 'ingredienser'؟", options: ["الوصفة", "المكونات", "الطبق", "الكمية"], correct: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // التنزه في الطبيعة
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Vandring i naturen", titleAr: "المشي في الطبيعة", scenario: "hiking",
    category: "طبيعة", difficulty: "beginner", emoji: "🌲",
    imageUrl: IMG.hiking, durationMinutes: 10,
    vocabList: [
      { sv: "vandring", ar: "مشي / تجوال", phonetic: "" },
      { sv: "leden", ar: "المسار / الطريق", phonetic: "" },
      { sv: "naturen", ar: "الطبيعة", phonetic: "" },
      { sv: "skogen", ar: "الغابة", phonetic: "" },
      { sv: "sjön", ar: "البحيرة", phonetic: "" },
      { sv: "mygg", ar: "البعوض", phonetic: "" },
      { sv: "allemansrätten", ar: "حق التنزه في أي مكان", phonetic: "" },
      { sv: "kartan", ar: "الخريطة", phonetic: "" },
    ],
    grammarTips: [
      { title: "الاقتراح بـ 'Ska vi'", explanation: "للاقتراح على شخص آخر", example: "Ska vi gå den korta leden eller den långa?", exampleAr: "هل نسلك المسار القصير أم الطويل؟" },
      { title: "التعبير عن المسافة: 'det tar ... minuter'", explanation: "للتعبير عن الوقت اللازم للوصول", example: "Det tar 20 minuter att gå dit.", exampleAr: "يستغرق 20 دقيقة للوصول إلى هناك." },
    ],
    culturalNotes: "السويد لديها قانون 'Allemansrätten' (حق الجميع) الذي يسمح لأي شخص بالمشي والتخييم في أي أرض طبيعية حتى لو كانت خاصة، طالما لم يُسبّب ضرراً. هذا القانون الفريد يجعل السويد جنة للمشي والتخييم. توجد آلاف الكيلومترات من المسالك (leder).",
    usefulPhrases: [
      { sv: "Var börjar leden?", ar: "أين يبدأ المسار؟" },
      { sv: "Hur lång är vandringen?", ar: "كم طول المسار؟" },
      { sv: "Glöm inte myggmedlet!", ar: "لا تنسَ مبيد البعوض!" },
      { sv: "Vi campar vid sjön.", ar: "سنُخيّم بجانب البحيرة." },
      { sv: "Titta, ett älg!", ar: "انظر، أيل!" },
    ],
    lines: [
      { speaker: "A", speakerName: "يوهان", speakerRole: "صديق سويدي", textSv: "Idag vandrar vi i Tyresta nationalpark. Det är fantastisk natur!", textAr: "اليوم سنتنزه في حديقة تيرستا الوطنية. الطبيعة رائعة هناك!", phonetic: "" },
      { speaker: "B", speakerName: "طارق", speakerRole: "صديق", textSv: "Wow! Jag har aldrig vandrat i Sverige förut.", textAr: "واو! لم أتنزه في السويد من قبل.", phonetic: "" },
      { speaker: "A", speakerName: "يوهان", speakerRole: "صديق سويدي", textSv: "Du kommer att älska det! Har du bra skor?", textAr: "ستحبّه! هل لديك حذاء مناسب؟", phonetic: "" },
      { speaker: "B", speakerName: "طارق", speakerRole: "صديق", textSv: "Ja, jag har vandringskängor. Hur lång är leden?", textAr: "نعم، لديّ حذاء للمشي. كم طول المسار؟", phonetic: "" },
      { speaker: "A", speakerName: "يوهان", speakerRole: "صديق سويدي", textSv: "Ca 8 kilometer tur och retur. Det tar ungefär 3 timmar.", textAr: "حوالي 8 كيلومترات ذهاباً وإياباً. يستغرق حوالي 3 ساعات.", phonetic: "" },
      { speaker: "B", speakerName: "طارق", speakerRole: "صديق", textSv: "Och vad ska vi ta med oss?", textAr: "وماذا نأخذ معنا؟", phonetic: "" },
      { speaker: "A", speakerName: "يوهان", speakerRole: "صديق سويدي", textSv: "Vatten, matsäck och myggmedel. Myggen kan vara jobbiga!", textAr: "ماء، طعام ومبيد بعوض. البعوض قد يكون مزعجاً!", phonetic: "", noteAr: "'matsäck' = وجبة للسفر / ساندويتش الرحلة" },
      { speaker: "B", speakerName: "طارق", speakerRole: "صديق", textSv: "Okej! Och kan man plocka bär i naturen?", textAr: "حسناً! وهل يمكن قطف التوت في الطبيعة؟", phonetic: "" },
      { speaker: "A", speakerName: "يوهان", speakerRole: "صديق سويدي", textSv: "Ja! Tack vare allemansrätten kan alla plocka bär och svamp fritt.", textAr: "نعم! بفضل حق الجميع يمكن لأي شخص قطف التوت والفطر مجاناً.", phonetic: "" },
      { speaker: "B", speakerName: "طارق", speakerRole: "صديق", textSv: "Det är fantastiskt! Sverige är verkligen ett vackert land.", textAr: "هذا رائع! السويد حقاً بلد جميل.", phonetic: "" },
    ],
    quiz: [
      { question: "ما هو 'Allemansrätten'؟", options: ["قانون الطرق", "حق الجميع في التنزه في الطبيعة", "حق تربية الحيوانات", "قانون الصيد"], correct: 1 },
      { question: "ما معنى 'leden'؟", options: ["البحيرة", "الغابة", "المسار / الطريق", "الجبل"], correct: 2 },
      { question: "كم ساعة يستغرق المسار حسب الحوار؟", options: ["ساعة", "ساعتان", "3 ساعات", "5 ساعات"], correct: 2 },
      { question: "ما معنى 'plocka bär'؟", options: ["زراعة الأشجار", "قطف التوت", "صيد الأسماك", "قطع الأخشاب"], correct: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // مقابلة العمل
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Jobbintervju", titleAr: "مقابلة العمل", scenario: "jobinterview",
    category: "عمل", difficulty: "advanced", emoji: "👔",
    imageUrl: IMG.jobinterview, durationMinutes: 15,
    vocabList: [
      { sv: "jobbintervju", ar: "مقابلة العمل", phonetic: "" },
      { sv: "meritförteckning", ar: "السيرة الذاتية", phonetic: "" },
      { sv: "erfarenhet", ar: "خبرة", phonetic: "" },
      { sv: "kompetens", ar: "كفاءة / مهارة", phonetic: "" },
      { sv: "lön", ar: "راتب", phonetic: "/løːn/" },
      { sv: "heltid", ar: "وقت كامل", phonetic: "" },
      { sv: "deltid", ar: "وقت جزئي", phonetic: "" },
      { sv: "anställning", ar: "توظيف", phonetic: "" },
    ],
    grammarTips: [
      { title: "الحديث عن الماضي المهني", explanation: "استخدم 'har + supinum' للخبرة الحالية وpreteritum للماضي", example: "Jag har arbetat som ingenjör i fem år.", exampleAr: "عملتُ كمهندس منذ خمس سنوات." },
      { title: "وصف نفسك: 'Jag anser att jag är'", explanation: "طريقة مؤدبة وموضوعية لوصف نفسك", example: "Jag anser att jag är noggrann och ansvarsfull.", exampleAr: "أعتقد أنني دقيق ومسؤول." },
    ],
    culturalNotes: "في السويد، مقابلات العمل عادةً غير رسمية مقارنةً بالدول الأخرى. المساواة والأفقية (linjär hierarki) قيم مهمة. يُنصح بالاستعداد بأمثلة محددة عن تجاربك. الراتب (lön) قابل للتفاوض. إجازة الأمومة/الأبوة (föräldraledighet) من حقوق العمال.",
    usefulPhrases: [
      { sv: "Jag är väldigt intresserad av tjänsten.", ar: "أنا مهتم جداً بالوظيفة." },
      { sv: "Min styrka är...", ar: "نقطة قوتي هي..." },
      { sv: "Jag är van vid att arbeta i team.", ar: "أنا معتاد على العمل في فريق." },
      { sv: "Vad är nästa steg?", ar: "ما هي الخطوة التالية؟" },
      { sv: "Vilka möjligheter finns det att växa i rollen?", ar: "ما هي فرص النمو في هذا الدور؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "أنا لارسون", speakerRole: "مسؤول التوظيف", textSv: "Hej! Välkommen. Berätta lite om dig själv.", textAr: "مرحباً! أهلاً بك. أخبرني قليلاً عن نفسك.", phonetic: "" },
      { speaker: "B", speakerName: "يوسف", speakerRole: "المتقدم للوظيفة", textSv: "Hej! Jag heter Yusuf, jag är civilekonom och har arbetat inom finans i sju år.", textAr: "مرحباً! اسمي يوسف، أنا متخصص في الاقتصاد وعملتُ في المجال المالي سبع سنوات.", phonetic: "" },
      { speaker: "A", speakerName: "أنا لارسون", speakerRole: "مسؤول التوظيف", textSv: "Intressant! Varför söker du just den här tjänsten?", textAr: "مثير للاهتمام! لماذا تتقدم لهذه الوظيفة تحديداً؟", phonetic: "" },
      { speaker: "B", speakerName: "يوسف", speakerRole: "المتقدم للوظيفة", textSv: "Ert företag är ledande i branschen och jag delar era värderingar kring hållbarhet.", textAr: "شركتكم رائدة في المجال وأتشارك معكم القيم المتعلقة بالاستدامة.", phonetic: "", noteAr: "'hållbarhet' = استدامة، قيمة مهمة في بيئة العمل السويدية." },
      { speaker: "A", speakerName: "أنا لارسون", speakerRole: "مسؤول التوظيف", textSv: "Bra! Kan du berätta om en utmaning du har löst på jobbet?", textAr: "ممتاز! هل يمكنك أن تحدثني عن تحدٍّ واجهته في العمل وكيف حللته؟", phonetic: "" },
      { speaker: "B", speakerName: "يوسف", speakerRole: "المتقدم للوظيفة", textSv: "Absolut. Förra året ledde jag ett projekt med stram budget och levererade ändå i tid.", textAr: "بكل تأكيد. العام الماضي قدتُ مشروعاً بميزانية ضيقة وسلّمته في الموعد.", phonetic: "" },
      { speaker: "A", speakerName: "أنا لارسون", speakerRole: "مسؤول التوظيف", textSv: "Imponerande! Vad är din styrka?", textAr: "مبهر! ما هي نقطة قوتك؟", phonetic: "" },
      { speaker: "B", speakerName: "يوسف", speakerRole: "المتقدم للوظيفة", textSv: "Jag är analytisk, noggrann och trivs med att lösa komplexa problem.", textAr: "أنا تحليلي، دقيق وأستمتع بحل المشكلات المعقدة.", phonetic: "" },
      { speaker: "A", speakerName: "أنا لارسون", speakerRole: "مسؤول التوظيف", textSv: "Och vad förväntar du dig i lön?", textAr: "وما هو راتبك المتوقع؟", phonetic: "" },
      { speaker: "B", speakerName: "يوسف", speakerRole: "المتقدم للوظيفة", textSv: "Jag siktar på ungefär 55 000 kronor i månaden, men är öppen för diskussion.", textAr: "أطمح لحوالي 55 000 كرونا شهرياً، لكنني منفتح على النقاش.", phonetic: "" },
      { speaker: "A", speakerName: "أنا لارسون", speakerRole: "مسؤول التوظيف", textSv: "Det låter rimligt. Vi återkommer till dig inom en vecka.", textAr: "يبدو هذا معقولاً. سنتواصل معك خلال أسبوع.", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'meritförteckning'؟", options: ["خطاب التقديم", "السيرة الذاتية", "شهادة العمل", "عقد العمل"], correct: 1 },
      { question: "ما معنى 'heltid'؟", options: ["عمل جزء من اليوم", "عمل وقت كامل", "عمل من المنزل", "عمل مؤقت"], correct: 1 },
      { question: "ما معنى 'hållbarhet' في سياق العمل؟", options: ["الجودة", "السرعة", "الاستدامة", "الربحية"], correct: 2 },
      { question: "ما معنى كلمة 'lön'؟", options: ["وظيفة", "ترقية", "راتب", "عقد"], correct: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // تكوين الصداقات
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Att göra nya vänner", titleAr: "تكوين صداقات جديدة", scenario: "friendship",
    category: "اجتماعي", difficulty: "beginner", emoji: "🤝",
    imageUrl: IMG.friendship, durationMinutes: 10,
    vocabList: [
      { sv: "vän", ar: "صديق", phonetic: "/vɛːn/" },
      { sv: "bekant", ar: "معارف / شخص تعرفه", phonetic: "" },
      { sv: "hobby", ar: "هواية", phonetic: "" },
      { sv: "intresse", ar: "اهتمام", phonetic: "" },
      { sv: "gemensamt", ar: "مشترك", phonetic: "" },
      { sv: "träffas", ar: "يتقابلون", phonetic: "" },
      { sv: "fika", ar: "تناول القهوة والكعك", phonetic: "" },
      { sv: "kontakt", ar: "تواصل", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعرف: 'Vad heter du?'", explanation: "السؤال عن الاسم في السويدية", example: "Vad heter du? — Jag heter Lara.", exampleAr: "ما اسمك؟ — اسمي لارا." },
      { title: "السؤال عن الاهتمامات: 'Vad har du för intressen?'", explanation: "السؤال عن الهوايات", example: "Vad har du för intressen på fritiden?", exampleAr: "ما هي اهتماماتك في وقت الفراغ؟" },
    ],
    culturalNotes: "السويديون يُعرفون بأنهم أكثر تحفظاً في تكوين الصداقات مقارنةً بالثقافات الأخرى. لكن مجرد المبادرة والمثابرة تُنجح التواصل. 'fika' (وقت القهوة والكعك) هو الطريقة الأكثر شيوعاً للتقارب. الاتصال بالعيون ('ögonkontakt') مهم.",
    usefulPhrases: [
      { sv: "Trevligt att träffas!", ar: "يسعدني لقاؤك!" },
      { sv: "Vad jobbar du med?", ar: "ماذا تعمل؟" },
      { sv: "Ska vi ta en fika ihop?", ar: "هل نتناول القهوة معاً؟" },
      { sv: "Vi har mycket gemensamt!", ar: "لدينا الكثير من القواسم المشتركة!" },
      { sv: "Kan jag ha ditt nummer?", ar: "هل يمكنني أخذ رقمك؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "فريدة", speakerRole: "جار جديدة", textSv: "Hej! Är du ny i området? Jag har inte sett dig förut.", textAr: "مرحباً! هل أنتِ جديدة في الحي؟ لم أرَكِ من قبل.", phonetic: "" },
      { speaker: "B", speakerName: "إيميلي", speakerRole: "سكّانة جديدة", textSv: "Ja! Jag heter Emily, jag flyttade in för två veckor sedan.", textAr: "نعم! اسمي إيميلي، انتقلتُ للعيش هنا منذ أسبوعين.", phonetic: "" },
      { speaker: "A", speakerName: "فريدة", speakerRole: "جار جديدة", textSv: "Välkommen! Jag heter Farida. Varifrån kommer du?", textAr: "أهلاً وسهلاً! اسمي فريدة. من أين أنتِ؟", phonetic: "" },
      { speaker: "B", speakerName: "إيميلي", speakerRole: "سكّانة جديدة", textSv: "Jag är från Frankrike men har bott i Sverige i tre år.", textAr: "أنا من فرنسا لكنني أسكن في السويد منذ ثلاث سنوات.", phonetic: "" },
      { speaker: "A", speakerName: "فريدة", speakerRole: "جار جديدة", textSv: "Oj, bra svenska för att ha bott här i tre år!", textAr: "واو، سويدية جيدة لشخص أقام هنا ثلاث سنوات!", phonetic: "" },
      { speaker: "B", speakerName: "إيميلي", speakerRole: "سكّانة جديدة", textSv: "Tack! Jag övade mycket. Vad har du för intressen?", textAr: "شكراً! تدرّبتُ كثيراً. ما هي اهتماماتك؟", phonetic: "" },
      { speaker: "A", speakerName: "فريدة", speakerRole: "جار جديدة", textSv: "Jag gillar att läsa och gå på yoga. Och du?", textAr: "أحب القراءة وممارسة اليوغا. وأنتِ؟", phonetic: "" },
      { speaker: "B", speakerName: "إيميلي", speakerRole: "سكّانة جديدة", textSv: "Yoga! Jag också! Vi har mycket gemensamt.", textAr: "اليوغا! أنا أيضاً! لدينا الكثير من القواسم المشتركة.", phonetic: "" },
      { speaker: "A", speakerName: "فريدة", speakerRole: "جار جديدة", textSv: "Ska vi ta en fika ihop i helgen och prata mer?", textAr: "هل نتناول القهوة معاً في عطلة نهاية الأسبوع ونتحدث أكثر؟", phonetic: "" },
      { speaker: "B", speakerName: "إيميلي", speakerRole: "سكّانة جديدة", textSv: "Jättegärna! Det låter toppen.", textAr: "بكل سرور! يبدو هذا رائعاً.", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'fika' في الثقافة السويدية؟", options: ["وقبة الغداء", "تناول القهوة والكعك كتقليد اجتماعي", "رياضة شعبية", "وجبة صباحية"], correct: 1 },
      { question: "ما معنى 'gemensamt'؟", options: ["مختلف", "خاص", "مشترك", "جديد"], correct: 2 },
      { question: "ما معنى 'intresse'؟", options: ["هواية / اهتمام", "عمل", "مكان", "موعد"], correct: 0 },
      { question: "من أين أتت 'إيميلي' حسب الحوار؟", options: ["ألمانيا", "بريطانيا", "فرنسا", "هولندا"], correct: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // في الكافيتيريا
  // ══════════════════════════════════════════════════════════════════
  {
    title: "I cafeterian på jobbet", titleAr: "في كافيتيريا العمل", scenario: "cafeteria",
    category: "عمل", difficulty: "beginner", emoji: "☕",
    imageUrl: IMG.cafeteria, durationMinutes: 8,
    vocabList: [
      { sv: "kaffepausen", ar: "استراحة القهوة", phonetic: "" },
      { sv: "lunchen", ar: "وجبة الغداء", phonetic: "" },
      { sv: "kollegor", ar: "زملاء العمل", phonetic: "" },
      { sv: "vegetarisk", ar: "نباتي", phonetic: "" },
      { sv: "rätten", ar: "الطبق", phonetic: "" },
      { sv: "matsalen", ar: "صالة الطعام", phonetic: "" },
      { sv: "smörgåsen", ar: "الساندويتش", phonetic: "" },
      { sv: "salladen", ar: "السلطة", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن الرأي في الطعام: 'tycker om'", explanation: "يُستخدم 'tycka om' للتعبير عن الإعجاب", example: "Jag tycker om falafel.", exampleAr: "أنا أحب الفلافل." },
      { title: "السؤال عن الخيارات: 'Vad finns det för'", explanation: "للسؤال عن ما هو متاح", example: "Vad finns det för lunch idag?", exampleAr: "ما هو الغداء اليوم؟" },
    ],
    culturalNotes: "الغداء في السويد مهم اجتماعياً. 'Lunchrasten' عادةً بين الساعة 11:30 و13:00. الكافيتيريا في أماكن العمل تقدم وجبات متوازنة. استراحة القهوة (fika) صباحاً ومساءً هي تقليد راسخ في بيئة العمل السويدية.",
    usefulPhrases: [
      { sv: "Vad tar du till lunch?", ar: "ماذا ستأخذ للغداء؟" },
      { sv: "Det ser gott ut!", ar: "يبدو لذيذاً!" },
      { sv: "Är det vegetariskt?", ar: "هل هو نباتي؟" },
      { sv: "Kan jag sitta här?", ar: "هل يمكنني الجلوس هنا؟" },
      { sv: "Bon appétit! / Smaklig måltid!", ar: "شهية طيبة!" },
    ],
    lines: [
      { speaker: "A", speakerName: "أندرش", speakerRole: "زميل عمل", textSv: "Hej Amina! Ska du ha lunch nu?", textAr: "مرحباً أمينة! هل ستتناولين الغداء الآن؟", phonetic: "" },
      { speaker: "B", speakerName: "أمينة", speakerRole: "زميلة عمل", textSv: "Ja! Vad finns det för mat idag?", textAr: "نعم! ما هو الطعام اليوم؟", phonetic: "" },
      { speaker: "A", speakerName: "أندرش", speakerRole: "زميل عمل", textSv: "Det är laxsoppa och en vegetarisk pasta.", textAr: "هناك شوربة السالمون ومعكرونة نباتية.", phonetic: "" },
      { speaker: "B", speakerName: "أمينة", speakerRole: "زميلة عمل", textSv: "Jag tar pasta — jag äter inte fisk. Du då?", textAr: "سآخذ المعكرونة — أنا لا آكل السمك. وأنت؟", phonetic: "" },
      { speaker: "A", speakerName: "أندرش", speakerRole: "زميل عمل", textSv: "Jag tar soppan, den brukar vara jättegod!", textAr: "سآخذ الشوربة، عادةً تكون لذيذة جداً!", phonetic: "" },
      { speaker: "B", speakerName: "أمينة", speakerRole: "زميلة عمل", textSv: "Kan vi sitta vid fönstret? Det är vackrare.", textAr: "هل يمكننا الجلوس عند النافذة؟ أجمل.", phonetic: "" },
      { speaker: "A", speakerName: "أندرش", speakerRole: "زميل عمل", textSv: "Klart! Ska du också ta kaffe efteråt?", textAr: "بالطبع! هل ستأخذين القهوة بعد ذلك أيضاً؟", phonetic: "" },
      { speaker: "B", speakerName: "أمينة", speakerRole: "زميلة عمل", textSv: "Ja, och kanske en kanelbulle! Det är fika-dags snart.", textAr: "نعم، وربما خبيزة القرفة! وقت الفيكا قريب.", phonetic: "", noteAr: "'kanelbulle' = خبيزة القرفة السويدية، رمز وقت الفيكا." },
    ],
    quiz: [
      { question: "ما معنى 'kollegor'؟", options: ["أصدقاء", "زملاء العمل", "رؤساء", "طلاب"], correct: 1 },
      { question: "ما هي 'kanelbulle'؟", options: ["كعكة القرفة / خبيزة القرفة", "قهوة إسبريسو", "شوربة", "سلطة"], correct: 0 },
      { question: "ما معنى 'vegetarisk'؟", options: ["طازج", "حار", "نباتي", "لذيذ"], correct: 2 },
      { question: "ما معنى 'smaklig måltid'؟", options: ["الطعام جاهز", "شهية طيبة", "هل تريد المزيد؟", "الحساب لو سمحت"], correct: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // في التاكسي
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Ta en taxi", titleAr: "ركوب التاكسي", scenario: "taxi",
    category: "مواصلات", difficulty: "beginner", emoji: "🚕",
    imageUrl: IMG.taxi, durationMinutes: 8,
    vocabList: [
      { sv: "taxin", ar: "سيارة الأجرة", phonetic: "" },
      { sv: "destinationen", ar: "الوجهة", phonetic: "" },
      { sv: "mätaren", ar: "العدّاد", phonetic: "" },
      { sv: "priset", ar: "السعر", phonetic: "" },
      { sv: "dricks", ar: "إكرامية", phonetic: "" },
      { sv: "kortbetalning", ar: "الدفع بالبطاقة", phonetic: "" },
      { sv: "trafiken", ar: "حركة المرور", phonetic: "" },
      { sv: "framme", ar: "وصلنا / هنا", phonetic: "" },
    ],
    grammarTips: [
      { title: "طلب التوقف: 'Kan du stanna'", explanation: "للطلب من السائق التوقف", example: "Kan du stanna vid hörnet?", exampleAr: "هل يمكنك التوقف عند الزاوية؟" },
      { title: "الوجهة: 'Kör till'", explanation: "للإشارة إلى الوجهة المطلوبة", example: "Kör till Centralstationen, tack.", exampleAr: "اذهب إلى المحطة المركزية، من فضلك." },
    ],
    culturalNotes: "التاكسي في السويد مرخّص ومنظّم لكنه مكلف. يُوصى بتطبيقات مثل Uber أو Bolt كبديل. كثير من سيارات الأجرة تقبل البطاقة. الإكرامية (dricks) ليست إلزامية لكنها مُقدَّرة. في ستوكهولم توجد سيارات تاكسي مخصصة للنساء.",
    usefulPhrases: [
      { sv: "Kan du ringa efter en taxi åt mig?", ar: "هل يمكنك طلب تاكسي لي؟" },
      { sv: "Hur lång tid tar det?", ar: "كم يستغرق الطريق؟" },
      { sv: "Kan du gå lite fortare?", ar: "هل يمكنك السرعة قليلاً؟" },
      { sv: "Håll växeln!", ar: "احتفظ بالباقي!" },
      { sv: "Jag är framme, tack!", ar: "وصلتُ، شكراً!" },
    ],
    lines: [
      { speaker: "A", speakerName: "ريتا", speakerRole: "راكبة", textSv: "Hej! Kör till Arlanda flygplats, tack.", textAr: "مرحباً! اذهب إلى مطار أرلاندا من فضلك.", phonetic: "" },
      { speaker: "B", speakerName: "السائق", speakerRole: "سائق تاكسي", textSv: "Absolut! Sätt dig i bak. Det är lite trafik men vi borde vara där om en timme.", textAr: "بالطبع! اجلسي في الخلف. هناك بعض الازدحام لكن يجب أن نصل خلال ساعة.", phonetic: "" },
      { speaker: "A", speakerName: "ريتا", speakerRole: "راكبة", textSv: "Okej. Ungefär vad kostar resan?", textAr: "حسناً. كم يكلف الطريق تقريباً؟", phonetic: "" },
      { speaker: "B", speakerName: "السائق", speakerRole: "سائق تاكسي", textSv: "Runt 600-700 kronor beroende på trafiken.", textAr: "حوالي 600-700 كرونا حسب حركة المرور.", phonetic: "" },
      { speaker: "A", speakerName: "ريتا", speakerRole: "راكبة", textSv: "Kan jag betala med kort?", textAr: "هل يمكنني الدفع بالبطاقة؟", phonetic: "" },
      { speaker: "B", speakerName: "السائق", speakerRole: "سائق تاكسي", textSv: "Ja, vi tar kort och Swish.", textAr: "نعم، نقبل البطاقة وسويش.", phonetic: "", noteAr: "'Swish' تطبيق دفع سويدي شائع جداً." },
      { speaker: "A", speakerName: "ريتا", speakerRole: "راكبة", textSv: "Bra! Vi är framme — här är 700 kronor.", textAr: "ممتاز! وصلنا — هنا 700 كرونا.", phonetic: "" },
      { speaker: "B", speakerName: "السائق", speakerRole: "سائق تاكسي", textSv: "Tack! Resan kostade 650, här är växeln.", textAr: "شكراً! الرحلة كلّفت 650، هنا الباقي.", phonetic: "" },
      { speaker: "A", speakerName: "ريتا", speakerRole: "راكبة", textSv: "Håll växeln! Ha en bra dag!", textAr: "احتفظ بالباقي! يوماً طيباً!", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'mätaren'؟", options: ["المقعد الخلفي", "العدّاد", "الشارع", "الوجهة"], correct: 1 },
      { question: "ما معنى 'dricks'؟", options: ["مشروب", "إكرامية", "إيصال", "أجرة"], correct: 1 },
      { question: "ما هو 'Swish' في السويد؟", options: ["شركة تاكسي", "تطبيق دفع إلكتروني", "بطاقة ائتمان", "بنك"], correct: 1 },
      { question: "ما معنى 'Håll växeln'؟", options: ["أعدّ العداد", "احتفظ بالباقي", "أعطني الفكّة", "أوقف هنا"], correct: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // في السينما
  // ══════════════════════════════════════════════════════════════════
  {
    title: "På bio", titleAr: "في السينما", scenario: "cinema",
    category: "ترفيه", difficulty: "beginner", emoji: "🎬",
    imageUrl: IMG.cinema, durationMinutes: 8,
    vocabList: [
      { sv: "filmen", ar: "الفيلم", phonetic: "" },
      { sv: "bion", ar: "دار السينما", phonetic: "" },
      { sv: "biljetten", ar: "التذكرة", phonetic: "" },
      { sv: "salongen", ar: "قاعة السينما", phonetic: "" },
      { sv: "popcorn", ar: "فشار / بوب كورن", phonetic: "" },
      { sv: "undertext", ar: "ترجمة مكتوبة", phonetic: "" },
      { sv: "förhandsvisning", ar: "عرض أولي", phonetic: "" },
      { sv: "recension", ar: "مراجعة / نقد", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن الرأي: 'Jag tyckte att'", explanation: "للتعبير عن رأي بعد تجربة", example: "Jag tyckte att filmen var fantastisk.", exampleAr: "رأيتُ أن الفيلم كان رائعاً." },
      { title: "السؤال عن الوقت: 'När börjar'", explanation: "للسؤال عن وقت البدء", example: "När börjar filmen?", exampleAr: "متى يبدأ الفيلم؟" },
    ],
    culturalNotes: "السينما في السويد شعبية جداً. معظم الأفلام الأجنبية تُعرض بالصوت الأصلي مع ترجمة سويدية (undertext). أفلام الأطفال فقط تُدبلج. بطاقة 'SF Anytime' تُتيح مشاهدة أفلام بسعر ثابت شهرياً.",
    usefulPhrases: [
      { sv: "Vilken film vill du se?", ar: "أي فيلم تريد أن تشاهد؟" },
      { sv: "Är det på svenska eller engelska?", ar: "هل هو بالسويدية أم الإنجليزية؟" },
      { sv: "Har de undertext?", ar: "هل لديهم ترجمة مكتوبة؟" },
      { sv: "Ska vi ta popcorn?", ar: "هل نأخذ بوب كورن؟" },
      { sv: "Vad tyckte du om filmen?", ar: "ما رأيك في الفيلم؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "لوكاس", speakerRole: "صديق", textSv: "Ska vi gå på bio ikväll? Den nya Marvel-filmen är ute!", textAr: "هل نذهب إلى السينما الليلة؟ فيلم مارفل الجديد صدر!", phonetic: "" },
      { speaker: "B", speakerName: "سلمى", speakerRole: "صديقة", textSv: "Ja gärna! Är det med undertext?", textAr: "بكل سرور! هل فيه ترجمة مكتوبة؟", phonetic: "" },
      { speaker: "A", speakerName: "لوكاس", speakerRole: "صديق", textSv: "Ja, det är på engelska med svenska undertexter.", textAr: "نعم، هو بالإنجليزية مع ترجمة سويدية مكتوبة.", phonetic: "" },
      { speaker: "B", speakerName: "سلمى", speakerRole: "صديقة", textSv: "Perfekt! När börjar visningen?", textAr: "ممتاز! متى تبدأ العرض؟", phonetic: "" },
      { speaker: "A", speakerName: "لوكاس", speakerRole: "صديق", textSv: "Klockan 19:30. Ska vi ta biljetter online?", textAr: "الساعة 7:30 مساءً. هل نشتري التذاكر إلكترونياً؟", phonetic: "" },
      { speaker: "B", speakerName: "سلمى", speakerRole: "صديقة", textSv: "Ja, bättre att boka i förväg! Och ska vi ta stora popcorn?", textAr: "نعم، أفضل الحجز مسبقاً! وهل نأخذ بوب كورن كبيراً؟", phonetic: "" },
      { speaker: "A", speakerName: "لوكاس", speakerRole: "صديق", textSv: "Självklart! Utan popcorn är det inte bio!", textAr: "بالطبع! بدون بوب كورن ليست سينما!", phonetic: "" },
      { speaker: "B", speakerName: "سلمى", speakerRole: "صديقة", textSv: "(efter filmen) Vad tyckte du om den?", textAr: "(بعد الفيلم) ما رأيك فيه؟", phonetic: "" },
      { speaker: "A", speakerName: "لوكاس", speakerRole: "صديق", textSv: "Jag tyckte den var fantastisk! Specialeffekterna var häftiga.", textAr: "رأيتُ أنه كان رائعاً! المؤثرات الخاصة كانت مبهرة.", phonetic: "" },
      { speaker: "B", speakerName: "سلمى", speakerRole: "صديقة", textSv: "Håller med! Vi måste se uppföljaren när den kommer.", textAr: "أوافق! يجب أن نشاهد الجزء التالي عندما يصدر.", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'undertext' في سياق السينما؟", options: ["ترجمة صوتية", "ترجمة مكتوبة", "الفيلم الأصلي", "الدبلجة"], correct: 1 },
      { question: "ما معنى 'recension'؟", options: ["تذكرة الفيلم", "مراجعة الفيلم / نقده", "قاعة السينما", "موعد العرض"], correct: 1 },
      { question: "ما معنى 'förhandsvisning'؟", options: ["العرض الأخير", "عرض أولي", "فيلم قصير", "إعلان السينما"], correct: 1 },
      { question: "في أي لغة يُعرض الفيلم حسب الحوار؟", options: ["السويدية", "الفرنسية", "الإنجليزية مع ترجمة سويدية", "العربية"], correct: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // العمل التطوعي
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Att bli volontär", titleAr: "العمل التطوعي", scenario: "volunteer",
    category: "اجتماعي", difficulty: "intermediate", emoji: "🤲",
    imageUrl: IMG.volunteer, durationMinutes: 12,
    vocabList: [
      { sv: "volontär", ar: "متطوع", phonetic: "" },
      { sv: "ideell organisation", ar: "منظمة غير ربحية", phonetic: "" },
      { sv: "bidra", ar: "يُساهم", phonetic: "" },
      { sv: "samhället", ar: "المجتمع", phonetic: "" },
      { sv: "engagera sig", ar: "ينخرط / يشارك", phonetic: "" },
      { sv: "insatser", ar: "مساهمات / جهود", phonetic: "" },
      { sv: "verksamheten", ar: "النشاط / العمل", phonetic: "" },
      { sv: "stödja", ar: "يدعم", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن الرغبة بالمساهمة: 'Jag vill gärna engagera mig'", explanation: "طريقة لإظهار الاهتمام بالمشاركة", example: "Jag vill gärna engagera mig i er organisation.", exampleAr: "أودّ الانخراط في منظمتكم." },
      { title: "وصف المهارات: 'Jag är bra på'", explanation: "للتعبير عن نقاط القوة", example: "Jag är bra på att kommunicera och organisera.", exampleAr: "أنا جيد في التواصل والتنظيم." },
    ],
    culturalNotes: "العمل التطوعي شائع جداً في السويد. أكثر من 50% من السويديين ينخرطون في جمعيات طوعية. المنظمات ('föreningar') تشمل الرياضة والثقافة والإغاثة الاجتماعية. العمل التطوعي يُقدَّر في سيرتك الذاتية ويُساعد في التكامل الاجتماعي.",
    usefulPhrases: [
      { sv: "Söker ni volontärer?", ar: "هل تبحثون عن متطوعين؟" },
      { sv: "Hur kan jag hjälpa till?", ar: "كيف يمكنني المساعدة؟" },
      { sv: "Jag vill bidra till samhället.", ar: "أريد المساهمة في المجتمع." },
      { sv: "Hur ofta träffas ni?", ar: "كم مرة تجتمعون؟" },
      { sv: "Finns det utbildning för volontärer?", ar: "هل هناك تدريب للمتطوعين؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "نادية", speakerRole: "مسؤولة منظمة", textSv: "Hej! Välkommen till vår förening. Hur hörde du talas om oss?", textAr: "مرحباً! أهلاً بك في جمعيتنا. كيف سمعتَ عنّا؟", phonetic: "" },
      { speaker: "B", speakerName: "حمزة", speakerRole: "متطوع جديد", textSv: "Jag såg er annons på nätet. Jag vill gärna engagera mig.", textAr: "رأيتُ إعلانكم على الإنترنت. أودّ الانخراط في عملكم.", phonetic: "" },
      { speaker: "A", speakerName: "نادية", speakerRole: "مسؤولة منظمة", textSv: "Fantastiskt! Vi hjälper nyanlända med praktiska frågor. Har du erfarenhet av det?", textAr: "رائع! نحن نساعد الوافدين الجدد في الأمور العملية. هل لديك خبرة في ذلك؟", phonetic: "" },
      { speaker: "B", speakerName: "حمزة", speakerRole: "متطوع جديد", textSv: "Ja, jag kom själv till Sverige för fem år sedan. Jag förstår utmaningarna.", textAr: "نعم، أنا نفسي جئتُ إلى السويد منذ خمس سنوات. أفهم التحديات.", phonetic: "" },
      { speaker: "A", speakerName: "نادية", speakerRole: "مسؤولة منظمة", textSv: "Det är perfekt! Den erfarenheten är ovärderlig. Vad är du bra på?", textAr: "هذا مثالي! تلك الخبرة لا تُقدَّر بثمن. ما هي نقاط قوتك؟", phonetic: "" },
      { speaker: "B", speakerName: "حمزة", speakerRole: "متطوع جديد", textSv: "Jag talar arabiska, svenska och lite engelska. Och jag är van vid myndighetskontakter.", textAr: "أتحدث العربية والسويدية وبعض الإنجليزية. وأنا معتاد على التعامل مع الجهات الرسمية.", phonetic: "" },
      { speaker: "A", speakerName: "نادية", speakerRole: "مسؤولة منظمة", textSv: "Perfekt! Vi träffas varannan lördag. Passar det?", textAr: "ممتاز! نجتمع كل أسبوعين في السبت. هل يناسبك ذلك؟", phonetic: "" },
      { speaker: "B", speakerName: "حمزة", speakerRole: "متطوع جديد", textSv: "Absolut! Jag är redo att börja när som helst.", textAr: "بالطبع! أنا مستعد للبدء في أي وقت.", phonetic: "" },
      { speaker: "A", speakerName: "نادية", speakerRole: "مسؤولة منظمة", textSv: "Välkommen till teamet, Hamza! Vi är glada att ha dig.", textAr: "أهلاً بك في الفريق يا حمزة! يسعدنا انضمامك.", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'volontär'؟", options: ["مدير", "موظف", "متطوع", "عضو مدفوع"], correct: 2 },
      { question: "ما معنى 'ideell organisation'؟", options: ["شركة تجارية", "منظمة حكومية", "منظمة غير ربحية", "جامعة"], correct: 2 },
      { question: "ما معنى 'bidra'؟", options: ["يُساهم / يُسهم", "يتقدم بطلب", "يشكو", "يرفض"], correct: 0 },
      { question: "كم مرة تجتمع المجموعة حسب الحوار؟", options: ["كل أسبوع", "كل أسبوعين", "كل شهر", "كل يوم"], correct: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // في السوق الشعبي
  // ══════════════════════════════════════════════════════════════════
  {
    title: "På marknaden", titleAr: "في السوق الشعبي", scenario: "market",
    category: "تسوق", difficulty: "beginner", emoji: "🛍️",
    imageUrl: IMG.market, durationMinutes: 8,
    vocabList: [
      { sv: "marknaden", ar: "السوق", phonetic: "" },
      { sv: "grönsaker", ar: "خضروات", phonetic: "" },
      { sv: "frukten", ar: "الفاكهة", phonetic: "" },
      { sv: "färsk", ar: "طازج", phonetic: "/fɛːɧsk/" },
      { sv: "kilopriset", ar: "سعر الكيلوجرام", phonetic: "" },
      { sv: "ekologisk", ar: "عضوي / بيولوجي", phonetic: "" },
      { sv: "pruta", ar: "يساوم", phonetic: "" },
      { sv: "påsen", ar: "الكيس", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن السعر: 'Vad kostar'", explanation: "يُستخدم 'Vad kostar' + شيء للسؤال عن السعر", example: "Vad kostar ett kilo tomater?", exampleAr: "كم يكلف كيلو الطماطم؟" },
      { title: "الكميات: 'ett kilo / ett halvt kilo'", explanation: "وحدات الوزن الشائعة في السوق", example: "Jag tar ett halvt kilo äpplen.", exampleAr: "سآخذ نصف كيلو تفاح." },
    ],
    culturalNotes: "الأسواق الشعبية (marknader) شائعة في السويد خاصة صيفاً. Hötorget في ستوكهولم من أشهر أسواق الخضار والفاكهة. كثير من المنتجات يحمل شعار 'KRAV' للمنتجات العضوية المعتمدة في السويد. السوميون يُقدّرون الجودة ويحرصون على المنتجات المحلية.",
    usefulPhrases: [
      { sv: "Är det ekologiskt?", ar: "هل هو عضوي؟" },
      { sv: "Kan jag smaka?", ar: "هل يمكنني التذوق؟" },
      { sv: "Det är lite dyrt.", ar: "هذا غالٍ بعض الشيء." },
      { sv: "Har ni lokalt odlat?", ar: "هل لديكم منتجات محلية الزراعة؟" },
      { sv: "Det ser jättegott ut!", ar: "يبدو لذيذاً جداً!" },
    ],
    lines: [
      { speaker: "A", speakerName: "البائع", speakerRole: "بائع في السوق", textSv: "God dag! Vill du smaka på jordgubbarna? De är lokalt odlade!", textAr: "مرحباً! هل تريد تذوّق الفراولة؟ إنها من الزراعة المحلية!", phonetic: "" },
      { speaker: "B", speakerName: "رنا", speakerRole: "مشترية", textSv: "Ja, tack! Mmm, de är jättegoda!", textAr: "نعم، شكراً! مممم، إنها لذيذة جداً!", phonetic: "" },
      { speaker: "A", speakerName: "البائع", speakerRole: "بائع في السوق", textSv: "Tack! Vad kostar det? 60 kronor per kilo.", textAr: "شكراً! كم يكلف؟ 60 كروناً للكيلو.", phonetic: "" },
      { speaker: "B", speakerName: "رنا", speakerRole: "مشترية", textSv: "Okej. Jag tar ett kilo. Är de ekologiska?", textAr: "حسناً. سآخذ كيلو. هل هي عضوية؟", phonetic: "" },
      { speaker: "A", speakerName: "البائع", speakerRole: "بائع في السوق", textSv: "Nej, men de är odlade utan besprutning. Vill du ha något annat?", textAr: "لا، لكنها مزروعة بدون مبيدات. هل تريدين شيئاً آخر؟", phonetic: "", noteAr: "'besprutning' = رش المبيدات الحشرية" },
      { speaker: "B", speakerName: "رنا", speakerRole: "مشترية", textSv: "Ja! Vad kostar tomater och gurka?", textAr: "نعم! كم تكلف الطماطم والخيار؟", phonetic: "" },
      { speaker: "A", speakerName: "البائع", speakerRole: "بائع في السوق", textSv: "Tomater 35 kr/kg, gurka 15 kr styck.", textAr: "الطماطم 35 كروناً/كيلو، الخيار 15 كروناً للحبة.", phonetic: "" },
      { speaker: "B", speakerName: "رنا", speakerRole: "مشترية", textSv: "Jag tar ett halvt kilo tomater och två gurkor.", textAr: "سآخذ نصف كيلو طماطم وخيارتين.", phonetic: "" },
      { speaker: "A", speakerName: "البائع", speakerRole: "بائع في السوق", textSv: "Bra val! Det blir 107 kronor totalt. Vill du ha en kasse?", textAr: "اختيار ممتاز! المجموع 107 كرونا. هل تريدين كيساً؟", phonetic: "" },
      { speaker: "B", speakerName: "رنا", speakerRole: "مشترية", textSv: "Ja tack, jag glömde min väska hemma!", textAr: "نعم شكراً، نسيتُ حقيبتي في المنزل!", phonetic: "" },
    ],
    quiz: [
      { question: "ما معنى 'ekologisk'؟", options: ["طازج", "محلي", "عضوي", "رخيص"], correct: 2 },
      { question: "ما معنى 'färsk'؟", options: ["مجمّد", "طازج", "معلّب", "يابس"], correct: 1 },
      { question: "ما هي تكلفة كيلو الطماطم حسب الحوار؟", options: ["15 كرونا", "35 كرونا", "60 كرونا", "107 كرونا"], correct: 1 },
      { question: "ما معنى 'pruta'؟", options: ["يشتري", "يُعيد", "يُساوم", "يُقيّم"], correct: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // الساونا
  // ══════════════════════════════════════════════════════════════════
  {
    title: "Basta i bastu", titleAr: "تجربة الساونا", scenario: "sauna",
    category: "ثقافة", difficulty: "beginner", emoji: "🧖",
    imageUrl: IMG.sauna, durationMinutes: 8,
    vocabList: [
      { sv: "bastet", ar: "الساونا", phonetic: "" },
      { sv: "ånga", ar: "بخار", phonetic: "" },
      { sv: "bada", ar: "يستحم / يجلس في الساونا", phonetic: "" },
      { sv: "kallbad", ar: "حمام ماء بارد", phonetic: "" },
      { sv: "lösen", ar: "الحرارة / درجة الحرارة", phonetic: "" },
      { sv: "björkris", ar: "غصون البتولا", phonetic: "" },
      { sv: "avkoppling", ar: "استرخاء", phonetic: "" },
      { sv: "svettig", ar: "متعرّق", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن المشاعر الجسدية: 'Jag känner mig'", explanation: "للتعبير عن الإحساس الجسدي", example: "Jag känner mig avslappnad.", exampleAr: "أشعر بالاسترخاء." },
      { title: "المقارنة: 'Det är varmare/kallare'", explanation: "مقارنة درجات الحرارة", example: "Det är mycket varmare inne i bastet.", exampleAr: "الجو أكثر حرارة بكثير داخل الساونا." },
    ],
    culturalNotes: "الساونا ثقافة فنلندية انتشرت في الاسكندنافيا كلها. السويدية شائعة في المنازل والرياضات وأماكن السباحة. التقليد الكلاسيكي هو التبادل بين الحرارة والبرودة: ساونا ثم سباحة في بحيرة أو بحر بارد. الساونا المختلطة شائعة في السياق العائلي.",
    usefulPhrases: [
      { sv: "Hur varm är bastun?", ar: "كم درجة حرارة الساونا؟" },
      { sv: "Jag är inte van vid det.", ar: "لستُ معتاداً على ذلك." },
      { sv: "Det är skönt men väldigt varmt!", ar: "إنه ممتع لكن حار جداً!" },
      { sv: "Ska vi hoppa i sjön efteråt?", ar: "هل سنقفز في البحيرة بعد ذلك؟" },
      { sv: "Jag svettades mycket!", ar: "تعرّقتُ كثيراً!" },
    ],
    lines: [
      { speaker: "A", speakerName: "بير", speakerRole: "سويدي", textSv: "Kom, vi ska basta! Det är en äkta svensk tradition.", textAr: "تعال، سنجلس في الساونا! إنها تقليد سويدي أصيل.", phonetic: "" },
      { speaker: "B", speakerName: "كمال", speakerRole: "زائر", textSv: "Jag har aldrig provat bastu förut. Är det varmt?", textAr: "لم أجرّب الساونا من قبل. هل إنها حارة؟", phonetic: "" },
      { speaker: "A", speakerName: "بير", speakerRole: "سويدي", textSv: "Ja, ungefär 80 till 100 grader! Men det är torr värme.", textAr: "نعم، حوالي 80 إلى 100 درجة! لكنها حرارة جافة.", phonetic: "" },
      { speaker: "B", speakerName: "كمال", speakerRole: "زائر", textSv: "80 grader! Det låter extremt!", textAr: "80 درجة! يبدو ذلك قاسياً جداً!", phonetic: "" },
      { speaker: "A", speakerName: "بير", speakerRole: "سويدي", textSv: "Det vänjer man sig vid. Och sen hoppar vi i sjön — det är magiskt!", textAr: "ستعتاد على ذلك. ثم سنقفز في البحيرة — إنه سحري!", phonetic: "", noteAr: "التبادل بين الحرارة والبرودة ('växelduschar') مفيد جداً للدورة الدموية." },
      { speaker: "B", speakerName: "كمال", speakerRole: "زائر", textSv: "I sjön? Är vattnet inte iskallt?", textAr: "في البحيرة؟ أليس الماء مثلجاً؟", phonetic: "" },
      { speaker: "A", speakerName: "بير", speakerRole: "سويدي", textSv: "Ja, det är kallt! Men efter bastun känns det fantastiskt.", textAr: "نعم إنه بارد! لكن بعد الساونا تشعر أنه رائع.", phonetic: "" },
      { speaker: "B", speakerName: "كمال", speakerRole: "زائر", textSv: "(efter bastun) Wow! Jag känner mig verkligen avslappnad!", textAr: "(بعد الساونا) واو! أشعر بالاسترخاء حقاً!", phonetic: "" },
      { speaker: "A", speakerName: "بير", speakerRole: "سويدي", textSv: "Det är bastu-effekten! Nu hoppar vi i sjön!", textAr: "هذا هو تأثير الساونا! الآن نقفز في البحيرة!", phonetic: "" },
    ],
    quiz: [
      { question: "ما هي درجة حرارة الساونا حسب الحوار؟", options: ["40-50 درجة", "60-70 درجة", "80-100 درجة", "120-140 درجة"], correct: 2 },
      { question: "ما معنى 'kallbad'؟", options: ["حمام بارد", "حمام ساخن", "دش", "بركة سباحة"], correct: 0 },
      { question: "ما معنى 'avkoppling'؟", options: ["إثارة", "استرخاء", "تعرّق", "نشاط"], correct: 1 },
      { question: "ما التقليد الذي يتبع الساونا في الثقافة السويدية؟", options: ["النوم مباشرة", "القفز في بحيرة باردة", "الأكل الثقيل", "الجري"], correct: 1 },
    ],
  },
];

async function seed() {
  console.log("🌱 Adding extra conversations...");

  for (let i = 0; i < extraScenarios.length; i++) {
    const s = extraScenarios[i];
    // Skip if this scenario was already inserted by a previous run (redeploys
    // re-run this script against the same DB, so it must be idempotent).
    const existing = await db.query.conversationsTable.findFirst({
      where: (t, { eq }) => eq(t.scenario, s.scenario),
    });
    if (existing) {
      console.log(`⏭️  [${i + 1}/${extraScenarios.length}] ${s.emoji} ${s.titleAr} — already exists, skipped`);
      continue;
    }
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
      quiz: s.quiz,
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
    console.log(`✅ [${i + 1}/${extraScenarios.length}] ${s.emoji} ${s.titleAr} — ${s.lines.length} سطر`);
  }

  console.log(`\n🎉 Added ${extraScenarios.length} extra conversations!`);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
