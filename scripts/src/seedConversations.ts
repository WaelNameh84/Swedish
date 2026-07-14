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
  postoffice: "https://media.gettyimages.com/id/1398977604/photo/portrait-of-smiling-female-worker-at-post-office-counter.jpg?s=612x612&w=0&k=20&c=3L0bLFsxHBVy6mRiJLe0OxZVNi0JdFGaJbDL5WQIqXs=",
  hairdresser:"https://media.gettyimages.com/id/1365440931/photo/hairdresser-cutting-hair-of-male-client-in-salon.jpg?s=612x612&w=0&k=20&c=3C3rVV5t9X8F_dGo8fSiuZ3u7bBLCrKNz6NpSwfIPRw=",
  dentist:    "https://media.gettyimages.com/id/1369745082/photo/dentist-examining-teeth-of-patient-in-clinic.jpg?s=612x612&w=0&k=20&c=9rHaFD6NGhEiTQ0W4sczI2yF_vToK5r8gS0Wk7oB5Ik=",
  veterinarian:"https://media.gettyimages.com/id/1362367065/photo/veterinarian-examining-dog-in-clinic.jpg?s=612x612&w=0&k=20&c=Bz1sCKBiJjRVV8yXQO6Mc5gQN5VJgC3Q9e8e8ydMgX0=",
  gym:        "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  furniture:  "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  apartment:  "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  migration:  "https://media.gettyimages.com/id/1219665545/photo/immigration-officer-checking-passport-at-the-border.jpg?s=612x612&w=0&k=20&c=7o8R2hMB3s5cL9J7kO9kL5nIa2gRwMsQ5s2F3aVOAhg=",
  employment: "https://media.gettyimages.com/id/1286580259/photo/job-interview-in-office.jpg?s=612x612&w=0&k=20&c=j5Xo3vJvUe8Rq7L4eHsY0ZKsGN2VtN9H4Z2XkQkHq9k=",
  phone:      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  library:    "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  carrepair:  "https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  park:       "https://images.pexels.com/photos/1084411/pexels-photo-1084411.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  party:      "https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
  recycling:  "https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=612&h=408&dpr=1",
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
  quiz: { question: string; options: string[]; correct: number; explanation?: string }[];
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
    quiz: [
      { question: "ما معنى كلمة 'passet' بالعربية؟", options: ["التذكرة", "جواز السفر", "الأمتعة", "البوابة"], correct: 1, explanation: "'passet' تعني جواز السفر." },
      { question: "ما هو مصطلح 'incheckning' بالعربية؟", options: ["المغادرة", "الوصول", "تسجيل الوصول", "نقطة الأمن"], correct: 2, explanation: "'incheckning' تعني تسجيل الوصول (check-in)." },
      { question: "ماذا تعني عبارة 'Ha en trevlig resa'؟", options: ["هل لديك تذكرة؟", "أتمنى لك رحلة ممتعة", "أين البوابة؟", "متى يغادر الطائرة؟"], correct: 1, explanation: "هذه العبارة تُقال للمسافر تمنياً برحلة ممتعة." },
      { question: "أكمل الجملة: 'Jag vill gärna ha ett _____ om möjligt.'", options: ["bagaget", "passet", "fönsterplats", "avgång"], correct: 2, explanation: "'fönsterplats' تعني مقعد النافذة." },
      { question: "ماذا تعني كلمة 'avgång'؟", options: ["الوصول", "المغادرة", "البوابة", "نقطة الأمن"], correct: 1, explanation: "'avgång' تعني المغادرة بينما 'ankomst' تعني الوصول." },
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
    quiz: [
      { question: "ما معنى 'feber' بالعربية؟", options: ["ألم", "حمى", "حساسية", "وصفة طبية"], correct: 1, explanation: "'feber' تعني حمى." },
      { question: "كيف تقول 'أشعر بألم في بطني' بالسويدية؟", options: ["Jag har feber.", "Jag är allergisk.", "Jag har ont i magen.", "Jag behöver recept."], correct: 2, explanation: "'ont i' + عضو الجسم تعني الشعور بألم في ذلك العضو." },
      { question: "ما معنى كلمة 'apoteket'؟", options: ["المستشفى", "العيادة", "الصيدلية", "المركز الصحي"], correct: 2, explanation: "'apoteket' تعني الصيدلية." },
      { question: "ما هو رقم الاستشارة الصحية في السويد؟", options: ["112", "911", "1177", "999"], correct: 2, explanation: "يمكن الاتصال بـ 1177 للحصول على مشورة صحية على مدار الساعة." },
      { question: "ماذا تعني كلمة 'undersöka'؟", options: ["يصف", "يفحص", "يعالج", "يشخّص"], correct: 1, explanation: "'undersöka' تعني يفحص أو يتفحص." },
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
    quiz: [
      { question: "ما معنى 'schema' في سياق المدرسة؟", options: ["الكتاب المدرسي", "جدول دراسي", "الواجب المنزلي", "الدرجة"], correct: 1, explanation: "'schema' تعني الجدول الدراسي." },
      { question: "كيف تقول 'أنا لا أفهم، هل يمكنك الشرح مرة أخرى؟' بالسويدية؟", options: ["Kan du hjälpa mig?", "Jag förstår inte. Kan du förklara igen?", "Var är klassrummet?", "Kan jag gå på toaletten?"], correct: 1, explanation: "هذه العبارة مهمة جداً للطلاب في الصف." },
      { question: "ماذا تعني كلمة 'hemläxa'؟", options: ["استراحة", "درجة", "واجب منزلي", "مكتبة"], correct: 2, explanation: "'hemläxa' تعني الواجب المنزلي." },
      { question: "ما هو اختصار 'SFI'؟", options: ["Svenska För Integration", "Svenska För Invandrare", "Skolan För Inlärning", "Svenska Fri Inlärning"], correct: 1, explanation: "SFI = Svenska för invandrare، دورات مجانية لتعليم السويدية للمهاجرين." },
      { question: "في أي طابق يقع المكتبة وفق الحوار؟", options: ["الأول", "الثاني", "الثالث", "الرابع"], correct: 2, explanation: "قالت المعلمة 'I tredje våningen' أي في الطابق الثالث." },
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
    quiz: [
      { question: "ما معنى كلمة 'lön'؟", options: ["الخبرة", "الزميل", "الراتب", "الإجازة"], correct: 2, explanation: "'lön' تعني الراتب." },
      { question: "ماذا تعني عبارة 'Jag behärskar svenska'؟", options: ["أتعلم السويدية", "أتقن السويدية", "أحب السويدية", "أفهم السويدية"], correct: 1, explanation: "'behärskar' تعني يُتقن أو يُجيد." },
      { question: "كم يوم إجازة مدفوعة يحق للموظف في السويد كحد أدنى؟", options: ["15", "20", "25", "30"], correct: 2, explanation: "يحق للموظفين في السويد 25 يوم إجازة مدفوعة كحد أدنى." },
      { question: "ما معنى 'heltid / deltid'؟", options: ["يومي / أسبوعي", "دوام كامل / جزئي", "صباحي / مسائي", "داخلي / خارجي"], correct: 1, explanation: "'heltid' = دوام كامل و'deltid' = دوام جزئي." },
      { question: "في الحوار، كم سنة عمل خالد كمهندس؟", options: ["ثلاث", "أربع", "خمس", "ست"], correct: 2, explanation: "قال خالد 'Jag har jobbat som ingenjör i fem år' أي خمس سنوات." },
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
    quiz: [
      { question: "ما معنى 'kyparen'؟", options: ["الطاهي", "النادل", "الصندوق", "المدير"], correct: 1, explanation: "'kyparen' تعني النادل في المطعم." },
      { question: "ما معنى عبارة 'Jag skulle vilja ha'؟", options: ["لا أريد", "أودّ أن أحصل على", "هل لديكم", "كم يكلف"], correct: 1, explanation: "هذه صيغة مؤدبة لطلب الطعام أو الشيء." },
      { question: "ما معنى 'dricks' في سياق المطعم؟", options: ["المشروب", "الحساب", "الإكرامية (بقشيش)", "القائمة"], correct: 2, explanation: "'dricks' تعني البقشيش أو الإكرامية." },
      { question: "ما هو الاختيار الصحيح لعبارة 'كان لذيذاً جداً'؟", options: ["Det var trevligt!", "Det var jättegott!", "Det var billigt!", "Det var kul!"], correct: 1, explanation: "'Det var jättegott!' = كان لذيذاً جداً." },
      { question: "ماذا طلبت ليلى في الحوار؟", options: ["كرات اللحم", "يخنة العدس", "دجاجاً", "سمكاً"], correct: 1, explanation: "قالت ليلى 'Jag skulle vilja ha linsgryta' أي يخنة العدس." },
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
    quiz: [
      { question: "ما معنى 'utcheckning'؟", options: ["تسجيل الوصول", "مغادرة الفندق", "الفطور", "المفتاح"], correct: 1, explanation: "'utcheckning' تعني مغادرة الفندق (check-out)." },
      { question: "متى يُقدَّم الفطور في الفندق وفق الحوار؟", options: ["6-9", "7-10", "8-11", "9-12"], correct: 1, explanation: "قال موظف الاستقبال 'serveras klockan 7-10'." },
      { question: "ما معنى 'wifi-lösenordet'؟", options: ["رقم الغرفة", "وقت المغادرة", "كلمة مرور الواي فاي", "رقم الطابق"], correct: 2, explanation: "'lösenord' تعني كلمة المرور، وهنا كلمة مرور الواي فاي." },
      { question: "ما معنى عبارة 'Kan jag byta rum?'؟", options: ["هل يمكنني الحصول على فطور؟", "هل يمكنني تغيير الغرفة؟", "هل الغرفة نظيفة؟", "هل الفندق قريب؟"], correct: 1, explanation: "'byta' تعني يغيّر، و'rum' تعني غرفة." },
      { question: "ما هو رقم غرفة عمر في الحوار؟", options: ["212", "312", "412", "512"], correct: 2, explanation: "قال موظف الاستقبال 'rum nummer 412 på fjärde våningen'." },
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
    quiz: [
      { question: "ما معنى 'rea'؟", options: ["إعادة المنتج", "تخفيضات", "السعر الأصلي", "البطاقة الائتمانية"], correct: 1, explanation: "'rea' تعني تخفيضات أو عروض خاصة." },
      { question: "كيف تسأل عن المقاس بالسويدية؟", options: ["Vad kostar det?", "Har ni det i storlek medium?", "Var är provrummet?", "Jag vill returnera det här."], correct: 1, explanation: "'Har ni det i storlek...' للسؤال عن توفر مقاس معين." },
      { question: "ما معنى 'kvittot'؟", options: ["بطاقة الائتمان", "وصل / إيصال", "خصم", "المقاس"], correct: 1, explanation: "'kvittot' تعني الوصل أو الإيصال." },
      { question: "ما هو تطبيق الدفع الشائع في السويد؟", options: ["PayPal", "Apple Pay", "Swish", "Klarna"], correct: 2, explanation: "Swish تطبيق الدفع الأكثر شيوعاً في السويد." },
      { question: "بكم كانت الجاكيت قبل الخصم في الحوار؟", options: ["799 كرونة", "899 كرونة", "999 كرونة", "699 كرونة"], correct: 1, explanation: "قال البائع 'Den kostar 899 kronor' ثم ذكر خصم 20%." },
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
    quiz: [
      { question: "ما معنى 'anmälan'؟", options: ["التحقيق", "البلاغ", "الشاهد", "الحادثة"], correct: 1, explanation: "'anmälan' تعني البلاغ الرسمي للشرطة." },
      { question: "ماذا سُرق من كريم في الحوار؟", options: ["هاتفه", "حقيبته", "محفظته", "جواز سفره"], correct: 2, explanation: "قال كريم 'Min plånbok har blivit stulen' أي سُرقت محفظته." },
      { question: "ما هو رقم الطوارئ في السويد؟", options: ["911", "999", "112", "1177"], correct: 2, explanation: "رقم الطوارئ الموحد في السويد هو 112." },
      { question: "ما معنى 'vittne'؟", options: ["ضابط", "مشتبه به", "شاهد", "ضحية"], correct: 2, explanation: "'vittne' تعني شاهد على الحادثة." },
      { question: "في أي وسيلة مواصلات حدثت السرقة؟", options: ["الحافلة", "الترام", "القطار", "المترو"], correct: 3, explanation: "قال كريم 'Det hände på tunnelbanan' أي في المترو." },
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
    quiz: [
      { question: "ما معنى 'insättning'؟", options: ["سحب", "إيداع", "تحويل", "فائدة"], correct: 1, explanation: "'insättning' تعني الإيداع البنكي." },
      { question: "ما هو 'BankID' في السويد؟", options: ["بطاقة بنكية مادية", "نظام التحقق الرقمي الوطني", "تطبيق الدفع", "رقم الحساب"], correct: 1, explanation: "BankID نظام التحقق الرقمي يُستخدم لكل الخدمات تقريباً في السويد." },
      { question: "كيف تقول 'أريد فتح حساب'؟", options: ["Jag vill öppna ett konto.", "Jag vill ta ut pengar.", "Jag vill växla valuta.", "Jag vill ha ett recept."], correct: 0, explanation: "'öppna ett konto' تعني فتح حساب بنكي." },
      { question: "ما هو سعر صرف اليورو للكرونة في الحوار؟", options: ["10.50", "11.20", "12.00", "9.80"], correct: 1, explanation: "قال مستشار البنك 'Kursen idag är 11,20 kronor per euro'." },
      { question: "ما معنى 'autogiro'؟", options: ["بطاقة بنكية", "صرف عملة", "خصم تلقائي", "رمز سري"], correct: 2, explanation: "'autogiro' تعني الخصم التلقائي من الحساب." },
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
    quiz: [
      { question: "ما معنى 'försenad'؟", options: ["سريع", "مباشر", "متأخر", "ملغى"], correct: 2, explanation: "'försenad' تعني متأخر." },
      { question: "كم تكلف تذكرة الذهاب (enkelbiljett) في المترو وفق الحوار؟", options: ["29 كرونة", "39 كرونة", "49 كرونة", "59 كرونة"], correct: 1, explanation: "قال المسافر 'En enkelbiljett kostar 39 kronor'." },
      { question: "ما معنى 'månadskort'؟", options: ["تذكرة ذهاب", "تذكرة عودة", "تذكرة شهرية", "تذكرة يومية"], correct: 2, explanation: "'månadskort' تعني التذكرة الشهرية للمواصلات." },
      { question: "كم محطة بعيدة Gamla Stan وفق الحوار؟", options: ["محطتان", "ثلاث محطات", "أربع محطات", "خمس محطات"], correct: 1, explanation: "قال المسافر 'Gamla Stan är tre stationer bort'." },
      { question: "ماذا تعني 'spårvagn'؟", options: ["حافلة", "مترو", "ترام", "قطار"], correct: 2, explanation: "'spårvagn' تعني الترام." },
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
    quiz: [
      { question: "ما معنى 'medvetslös'؟", options: ["متعب", "فاقد الوعي", "مريض", "متألم"], correct: 1, explanation: "'medvetslös' تعني فاقد الوعي." },
      { question: "ما هو رمز 'HLR'؟", options: ["الإسعافات الأولية / الإنعاش القلبي", "اتصال الطوارئ", "سيارة الإسعاف", "خط الصحة"], correct: 0, explanation: "HLR = hjärt-lungräddning أي الإنعاش القلبي الرئوي." },
      { question: "في أي مدينة وقعت حادثة الطوارئ في الحوار؟", options: ["ستوكهولم", "مالمو", "يوتيبوري", "أوبسالا"], correct: 2, explanation: "قالت رنا 'i Göteborg' أي في يوتيبوري." },
      { question: "ماذا تعني 'brandkåren'؟", options: ["سيارة الإسعاف", "الشرطة", "سيارة الإطفاء", "الحرس"], correct: 2, explanation: "'brandkåren' تعني سيارة الإطفاء أو فرقة الإطفاء." },
      { question: "ما هو رقم الاستشارة الطبية غير العاجلة في السويد؟", options: ["112", "113", "1177", "1188"], correct: 2, explanation: "للاستشارة الطبية غير العاجلة يُتصل بـ 1177." },
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
    quiz: [
      { question: "ما معنى كلمة 'grannen'؟", options: ["الصديق", "الجار", "الزميل", "الأخ"], correct: 1, explanation: "'grannen' تعني الجار." },
      { question: "ما معنى 'mysigt'؟", options: ["مملّ", "دافئ ومريح", "صاخب", "رسمي"], correct: 1, explanation: "'mysigt' من الكلمات المحبوبة سويدياً وتعني الدفء والراحة." },
      { question: "ماذا أرادت دينا أن تستعير من إيريك؟", options: ["دقيق", "حليب", "سكر", "زيت"], correct: 2, explanation: "قالت دينا 'Får jag låna lite socker?' أي السكر." },
      { question: "ما معنى عبارة 'Vi ses!'؟", options: ["كيف حالك؟", "إلى اللقاء!", "مرحباً!", "شكراً!"], correct: 1, explanation: "'Vi ses' تعني إلى اللقاء! تحية وداع شائعة." },
      { question: "ما الذي كانت دينا ستخبزه؟", options: ["كعك العيد", "خبز", "لفائف القرفة", "تورتة"], correct: 2, explanation: "قال إيريك 'Ska du baka kanelbullar?' مستفسراً عن لفائف القرفة." },
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
    quiz: [
      { question: "ما معنى 'vårdcentralen'؟", options: ["المستشفى الكبير", "المركز الصحي", "الصيدلية", "عيادة الأسنان"], correct: 1, explanation: "'vårdcentralen' هو المركز الصحي، أول نقطة اتصال للرعاية الصحية." },
      { question: "ما معنى 'avboka'؟", options: ["يحجز موعداً", "يلغي موعداً", "يؤجل موعداً", "يحضر موعداً"], correct: 1, explanation: "'avboka' تعني إلغاء الحجز." },
      { question: "ما هي الأعراض التي ذكرها يوسف في الحوار؟", options: ["صداع وحمى", "ألم في الحلق وحمى", "ألم في البطن وغثيان", "سعال وزكام"], correct: 1, explanation: "قال يوسف 'ont i halsen och lite feber' أي ألم في الحلق وحمى خفيفة." },
      { question: "ما معنى 'remiss'؟", options: ["تحليل", "وصفة طبية", "تحويل طبي", "موعد طارئ"], correct: 2, explanation: "'remiss' تعني التحويل الطبي من طبيب إلى آخر." },
      { question: "في أي يوم حصل يوسف على الموعد أخيراً؟", options: ["اليوم نفسه", "غداً", "الخميس", "الإثنين"], correct: 1, explanation: "قالت الموظفة 'Vi har en avbokad tid imorgon' أي غداً." },
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
    quiz: [
      { question: "ما معنى 'utvecklingssamtal'؟", options: ["اجتماع الأساتذة", "لقاء تقييم التطور الدراسي", "اجتماع مجلس الطلاب", "امتحان نهاية الفصل"], correct: 1, explanation: "'utvecklingssamtal' هو لقاء تقييم تطور الطالب مع الوالدين والمعلم." },
      { question: "ما معنى 'trivsel' في سياق المدرسة؟", options: ["الدرجة", "السلوك", "الشعور بالراحة والانتماء", "المنهج الدراسي"], correct: 2, explanation: "'trivsel' تعني الشعور بالراحة والانتماء في البيئة الدراسية." },
      { question: "ما الذي أشادت به المعلمة في أداء آدم؟", options: ["الرياضيات فقط", "السويدية والرياضيات", "العلوم والتاريخ", "اللغة الإنجليزية"], correct: 1, explanation: "قالت المعلمة 'Adam gör bra framsteg i svenska och gillar matematik mycket'." },
      { question: "ما معنى 'extra stöd'؟", options: ["دعم إضافي", "درس إضافي", "كتاب إضافي", "موعد إضافي"], correct: 0, explanation: "'extra stöd' تعني الدعم الإضافي للطلاب المحتاجين." },
      { question: "ماذا أوصت المعلمة الوالدين بفعله في المنزل؟", options: ["ممارسة الرياضيات", "قراءة كتب سويدية كل مساء", "مشاهدة التلفاز بالسويدية", "اللعب مع الأصدقاء"], correct: 1, explanation: "قالت 'Läs gärna svenska böcker tillsammans varje kväll'." },
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
    quiz: [
      { question: "ما معنى 'passerkort'؟", options: ["بطاقة العمل", "بطاقة الدخول", "بطاقة الهوية", "بطاقة الراتب"], correct: 1, explanation: "'passerkort' تعني بطاقة الدخول للمبنى." },
      { question: "ما معنى 'fikapaus'؟", options: ["استراحة غداء", "استراحة القهوة", "نهاية يوم العمل", "اجتماع الفريق"], correct: 1, explanation: "'fikapaus' تعني استراحة القهوة والكعك، عادة اجتماعية مهمة في السويد." },
      { question: "متى كانت استراحة الفيكا في الحوار؟", options: ["الساعة التاسعة", "الساعة العاشرة", "الساعة الحادية عشرة", "الساعة الثانية عشرة"], correct: 1, explanation: "قالت المديرة 'Vi tar fika tillsammans klockan tio'." },
      { question: "ما معنى 'provanställning'؟", options: ["عقد دائم", "فترة تجربة للتوظيف", "عمل مؤقت", "عمل جزئي"], correct: 1, explanation: "'provanställning' هي فترة الاختبار في بداية التوظيف." },
      { question: "ما الذي ينادي به الموظفون مديريهم في السويد عادةً؟", options: ["لقب المنصب", "السيد أو السيدة", "الاسم الأول", "الدكتور أو المدير"], correct: 2, explanation: "ثقافة العمل السويدية أفقية ويُنادى المدير بالاسم الأول عادةً." },
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
    quiz: [
      { question: "ما معنى 'kanelbulle'؟", options: ["كعك الشوكولاتة", "لفيفة قرفة", "فطيرة التفاح", "كعك الهيل"], correct: 1, explanation: "'kanelbulle' = لفيفة القرفة، من أشهر المعجنات السويدية." },
      { question: "ماذا تعني عبارة 'här eller ta med?'", options: ["هل تشرب قهوة أم شاياً؟", "هنا أم للأخذ؟", "هل تريد سكراً أم حليباً؟", "كبير أم صغير؟"], correct: 1, explanation: "هذا السؤال الشائع في المقاهي يعني هل ستتناوله هنا أم ستأخذه معك." },
      { question: "كم كان إجمالي الفاتورة لفراس في الحوار؟", options: ["45 كرونة", "55 كرونة", "65 كرونة", "75 كرونة"], correct: 2, explanation: "قالت الباريستا 'Det blir 65 kronor totalt'." },
      { question: "ما معنى 'Fika' في الثقافة السويدية؟", options: ["وجبة الغداء", "استراحة قهوة وحلويات اجتماعية", "وجبة الفطور", "شراء القهوة للمنزل"], correct: 1, explanation: "Fika عادة اجتماعية أساسية في السويد، أكثر من مجرد شرب قهوة." },
      { question: "أين يجد الزبون كود الواي فاي وفق الحوار؟", options: ["على الطاولة", "على القائمة", "على الإيصال", "على الجدار"], correct: 2, explanation: "قالت الباريستا 'Koden står på kvittot' أي على الإيصال." },
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
    quiz: [
      { question: "ما معنى 'trasig'؟", options: ["نظيف", "جديد", "معطّل / مكسور", "صغير"], correct: 2, explanation: "'trasig' تعني معطّل أو مكسور." },
      { question: "كيف تقول 'التكييف لا يعمل'؟", options: ["Värmen fungerar inte.", "Luftkonditioneringen fungerar inte.", "Wifi fungerar inte.", "Dörren fungerar inte."], correct: 1, explanation: "'luftkonditioneringen' تعني التكييف و'fungerar inte' تعني لا يعمل." },
      { question: "ما معنى 'kompensation'؟", options: ["شكوى", "تعويض", "إصلاح", "تغيير"], correct: 1, explanation: "'kompensation' تعني التعويض الذي يقدمه الفندق لحل المشكلة." },
      { question: "ماذا عرض موظف الاستقبال لمنى في البداية؟", options: ["تغيير الفندق", "تحديث الغرفة", "غرفة مؤقتة", "إلغاء الحجز"], correct: 2, explanation: "قال الموظف 'Jag kan erbjuda dig ett tillfälligt rum'." },
      { question: "كم كان الخصم الذي حصلت عليه منى كتعويض؟", options: ["10%", "15%", "20%", "25%"], correct: 2, explanation: "قال الموظف 'Vi ger dig 20% rabatt på din vistelse'." },
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
    quiz: [
      { question: "ما معنى 'halalkött'؟", options: ["لحم مجمّد", "لحم حلال", "لحم نباتي", "لحم عضوي"], correct: 1, explanation: "'halalkött' تعني اللحم الحلال." },
      { question: "كيف تسأل 'أين أجد الحليب؟' بالسويدية؟", options: ["Har ni mjölk?", "Var hittar jag mjölk?", "Vill du ha mjölk?", "Kan jag köpa mjölk?"], correct: 1, explanation: "'Var hittar jag' تعني 'أين أجد' وتُستخدم للبحث عن منتج في المتجر." },
      { question: "أي المتاجر السويدية الكبرى ذُكرت في الملاحظات الثقافية؟", options: ["Ikea وH&M", "ICA وCoop وWillys", "Lidl وAldi", "Systembolaget وApoteket"], correct: 1, explanation: "ذُكرت ICA وCoop وWillys كمتاجر بقالة سويدية كبرى." },
      { question: "ما معنى 'självscanning'؟", options: ["الدفع ببطاقة ائتمان", "الطلب الإلكتروني", "المسح الذاتي", "الخصم الفوري"], correct: 2, explanation: "'självscanning' نظام المسح الذاتي للمنتجات لتسريع الدفع." },
      { question: "أين يقع قسم اللحم الحلال وفق الحوار؟", options: ["عند المدخل", "في الوسط", "في الخلف على اليمين", "في الخلف على اليسار"], correct: 2, explanation: "قالت الموظفة 'längst bak till höger' أي في الخلف على اليمين." },
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
    quiz: [
      { question: "ما معنى 'förlorat'؟", options: ["مسروق", "مفقود / ضائع", "محطّم", "منتهي الصلاحية"], correct: 1, explanation: "'förlorat' تعني مفقود أو ضائع." },
      { question: "ما معنى 'ambassaden'؟", options: ["المحكمة", "الشرطة", "السفارة", "المطار"], correct: 2, explanation: "'ambassaden' تعني السفارة." },
      { question: "أين فقد طارق جواز سفره وفق الحوار؟", options: ["في المطار", "في المترو أو متجر", "في الفندق", "في المطعم"], correct: 1, explanation: "قال طارق 'Antagligen på tåget eller i en affär'." },
      { question: "ما معنى 'polisrapport'؟", options: ["بطاقة شرطة", "تقرير شرطة", "رقم بلاغ", "وثيقة هوية"], correct: 1, explanation: "'polisrapport' تعني التقرير الرسمي الصادر عن الشرطة." },
      { question: "في أي حي تقع السفارة المصرية وفق الحوار؟", options: ["Gamla Stan", "Södermalm", "Kungsholmen", "Östermalm"], correct: 2, explanation: "قالت الضابطة 'Den ligger på Kungsholmen'." },
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
    quiz: [
      { question: "ما معنى 'bolån'؟", options: ["قرض شخصي", "قرض عقاري", "قرض سيارة", "قرض تعليمي"], correct: 1, explanation: "'bolån' تعني القرض العقاري لشراء منزل أو شقة." },
      { question: "ما هي الدفعة المقدمة الدنيا للحصول على قرض عقاري في السويد؟", options: ["10%", "15%", "20%", "25%"], correct: 1, explanation: "تتطلب البنوك السويدية دفعة مقدمة لا تقل عن 15% من سعر العقار." },
      { question: "ما معنى 'amortering'؟", options: ["معدل الفائدة", "سداد أصل القرض", "مدة القرض", "الضامن"], correct: 1, explanation: "'amortering' تعني سداد أصل القرض تدريجياً، وهو إلزامي في السويد." },
      { question: "كم بلغ معدل الفائدة على القروض العقارية في الحوار؟", options: ["2%", "3%", "4%", "5%"], correct: 2, explanation: "قال المستشار 'Just nu ligger den runt 4 procent'." },
      { question: "ما معنى 'borgensman'؟", options: ["المستشار المالي", "الضامن", "المحامي", "الدائن"], correct: 1, explanation: "'borgensman' هو الضامن الذي يكفل سداد القرض." },
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
    quiz: [
      { question: "ما معنى 'hyrbil'؟", options: ["سيارة شخصية", "سيارة مستأجرة", "سيارة إسعاف", "سيارة أجرة"], correct: 1, explanation: "'hyrbil' تعني السيارة المستأجرة." },
      { question: "ما معنى 'automatlåda'؟", options: ["قفل أوتوماتيكي", "ناقل حركة أوتوماتيكي", "خزان وقود تلقائي", "نظام ملاحة"], correct: 1, explanation: "'automatlåda' تعني ناقل الحركة الأوتوماتيكي." },
      { question: "ما معنى 'återlämna'؟", options: ["يستأجر", "يقود", "يُرجع / يُعيد", "يصلح"], correct: 2, explanation: "'återlämna' تعني إرجاع السيارة أو أي شيء مستأجر." },
      { question: "أي نوع سيارة اقترح الموظف على وليد؟", options: ["BMW", "Volvo", "Toyota", "Volkswagen Golf"], correct: 3, explanation: "قال الموظف 'Vi har en fin Volkswagen Golf'." },
      { question: "ماذا يحدث إذا لم يكن خزان الوقود ممتلئاً عند إرجاع السيارة؟", options: ["لا شيء", "رسم إضافي", "تمديد الاستئجار", "إلغاء العقد"], correct: 1, explanation: "قال الموظف 'annars tar vi ut en extra avgift'." },
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
    quiz: [
      { question: "ما معنى 'trafikolycka'؟", options: ["حريق", "حادث سير", "فيضان", "انفجار"], correct: 1, explanation: "'trafikolycka' تعني حادث سير." },
      { question: "ما معنى 'skadad'؟", options: ["خائف", "مصدوم", "مُصاب / متضرر", "محظوظ"], correct: 2, explanation: "'skadad' تعني مُصاب أو متضرر." },
      { question: "على أي طريق وقع الحادث في الحوار؟", options: ["E18", "E4", "E6", "E20"], correct: 1, explanation: "قال بلال 'Det har hänt en trafikolycka på E4:an'." },
      { question: "ما معنى 'bärgningsbil'؟", options: ["سيارة شرطة", "سيارة إسعاف", "سيارة سطحة / جرّ", "سيارة إطفاء"], correct: 2, explanation: "'bärgningsbil' تعني سيارة الجر أو السطحة." },
      { question: "كم دقيقة قدّر مركز الطوارئ وصول النجدة؟", options: ["خمس دقائق", "سبع دقائق", "عشر دقائق", "خمس عشرة دقيقة"], correct: 1, explanation: "قال مركز الطوارئ 'Cirka sju minuter'." },
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
    quiz: [
      { question: "ما معنى 'tvättstugan'؟", options: ["المطبخ المشترك", "غرفة الغسيل المشتركة", "غرفة التخزين", "مدخل البناية"], correct: 1, explanation: "'tvättstugan' هي غرفة الغسيل المشتركة الموجودة في أغلب المباني السويدية." },
      { question: "ما معنى 'torktumlare'؟", options: ["غسالة", "مجفف ملابس", "مبخّر", "مكواة"], correct: 1, explanation: "'torktumlare' تعني مجفف الملابس." },
      { question: "ما معنى 'grannsämja'؟", options: ["جمعية السكان", "العلاقة الطيبة بين الجيران", "لجنة البناية", "قواعد السكن"], correct: 1, explanation: "'grannsämja' تعني العلاقة الطيبة واحترام الجيران." },
      { question: "ماذا طلبت لينا من رهف في الحوار؟", options: ["استعارة الغسالة", "استعارة مسحوق الغسيل", "الانتظار ساعة", "مفتاح الغرفة"], correct: 1, explanation: "قالت لينا 'Kan jag låna lite tvättmedel?' أي استعارة مسحوق الغسيل." },
      { question: "ما معنى 'städa efter sig'؟", options: ["يدفع رسوم التنظيف", "ينظّف بعد استخدامه", "يحجز وقتاً", "يترك الغرفة"], correct: 1, explanation: "'städa efter sig' تعني الالتزام بتنظيف المكان بعد الاستخدام." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 25. البريد
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På posten", titleAr: "في مكتب البريد", scenario: "postoffice",
    category: "يومي", difficulty: "beginner", emoji: "📮",
    imageUrl: IMG.postoffice, durationMinutes: 10,
    vocabList: [
      { sv: "posten", ar: "البريد / مكتب البريد", phonetic: "/ˈpɔstːən/" },
      { sv: "brevet", ar: "الرسالة / الخطاب", phonetic: "/ˈbreːvət/" },
      { sv: "paketet", ar: "الطرد", phonetic: "/paˈkeːtːət/" },
      { sv: "frimärket", ar: "طابع البريد", phonetic: "/ˈfriːˌmɛrkːət/" },
      { sv: "adressaten", ar: "المرسَل إليه", phonetic: "" },
      { sv: "avsändaren", ar: "المرسِل", phonetic: "" },
      { sv: "postnumret", ar: "الرمز البريدي", phonetic: "" },
      { sv: "rekommenderat brev", ar: "رسالة مسجّلة", phonetic: "" },
      { sv: "spårning", ar: "تتبع الطرد", phonetic: "" },
      { sv: "avi", ar: "إشعار استلام طرد", phonetic: "/ˈɑːvi/" },
    ],
    grammarTips: [
      { title: "السؤال عن الخدمة: 'Hur lång tid tar det'", explanation: "للسؤال عن المدة الزمنية لخدمة ما", example: "Hur lång tid tar det att skicka paketet till Syrien?", exampleAr: "كم يستغرق إرسال الطرد إلى سوريا؟" },
      { title: "طلب خدمة بصيغة مؤدبة: 'Jag skulle vilja skicka'", explanation: "صيغة رسمية ومؤدبة لطلب إرسال شيء", example: "Jag skulle vilja skicka det här paketet.", exampleAr: "أودّ إرسال هذا الطرد." },
    ],
    culturalNotes: "البريد السويدي (PostNord) يقدم خدمات إرسال الطرود والرسائل. معظم الطرود الكبيرة لا تُوصَّل إلى الباب بل تُرسَل رسالة استلام (avi) ويُستلم من مركز البريد القريب. يمكن تتبع الطرود إلكترونياً عبر موقع PostNord. الطوابع البريدية متوفرة في مكاتب البريد والمتاجر الكبيرة.",
    usefulPhrases: [
      { sv: "Jag skulle vilja skicka det här.", ar: "أودّ إرسال هذا." },
      { sv: "Hur mycket kostar det att skicka till Egypten?", ar: "كم يكلف الإرسال إلى مصر؟" },
      { sv: "Jag vill ha spårning.", ar: "أريد خدمة التتبع." },
      { sv: "Jag har fått en avi.", ar: "لقد حصلت على إشعار استلام طرد." },
      { sv: "Kan jag få ett rekommenderat brev?", ar: "هل يمكنني إرسال رسالة مسجّلة؟" },
      { sv: "Vad är postnumret?", ar: "ما هو الرمز البريدي؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "مايا", speakerRole: "زبونة", textSv: "Hej! Jag skulle vilja skicka det här paketet till Libanon.", textAr: "مرحباً! أودّ إرسال هذا الطرد إلى لبنان.", phonetic: "" },
      { speaker: "B", speakerName: "موظف البريد", speakerRole: "موظف البريد", textSv: "Självklart. Hur tungt är paketet?", textAr: "بالطبع. كم وزن الطرد؟", phonetic: "" },
      { speaker: "A", speakerName: "مايا", speakerRole: "زبونة", textSv: "Det väger ungefär två kilo. Hur lång tid tar det?", textAr: "يزن حوالي كيلوين. كم يستغرق؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف البريد", speakerRole: "موظف البريد", textSv: "Med standardpost tar det 7-14 dagar. Med express 3-5 dagar.", textAr: "بالبريد العادي يستغرق 7-14 يوماً. بالسريع 3-5 أيام.", phonetic: "" },
      { speaker: "A", speakerName: "مايا", speakerRole: "زبونة", textSv: "Jag tar expressleveransen. Kan jag få spårning?", textAr: "سآخذ التوصيل السريع. هل يمكنني الحصول على خدمة التتبع؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف البريد", speakerRole: "موظف البريد", textSv: "Ja, spårning ingår i expresspriset. Fyll i adressen här.", textAr: "نعم، التتبع مشمول في سعر السريع. اكتبي العنوان هنا.", phonetic: "" },
      { speaker: "A", speakerName: "مايا", speakerRole: "زبونة", textSv: "Behöver jag ange postnummer för Libanon?", textAr: "هل يجب أن أكتب رمزاً بريدياً للبنان؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف البريد", speakerRole: "موظف البريد", textSv: "Nej, det räcker med stad och land. Totalt blir det 380 kronor.", textAr: "لا، يكفي المدينة والبلد. المجموع 380 كرونة.", phonetic: "" },
      { speaker: "A", speakerName: "مايا", speakerRole: "زبونة", textSv: "Okej, jag betalar med kort. Kan jag få ett kvitto?", textAr: "حسناً، سأدفع بالبطاقة. هل يمكنني الحصول على وصل؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف البريد", speakerRole: "موظف البريد", textSv: "Varsågod! Här är kvittot och spårningsnumret. Lycka till!", textAr: "تفضلي! هذا الوصل ورقم التتبع. حظاً موفقاً!", phonetic: "", noteAr: "'Lycka till' = حظاً موفقاً، تحية ودية شائعة." },
    ],
    quiz: [
      { question: "ما معنى 'paketet' بالعربية؟", options: ["الرسالة", "الطرد", "الطابع", "الإشعار"], correct: 1, explanation: "'paketet' تعني الطرد البريدي." },
      { question: "ما معنى 'avi' في سياق البريد؟", options: ["طابع بريدي", "رسالة مسجّلة", "إشعار استلام طرد", "رمز بريدي"], correct: 2, explanation: "'avi' هو الإشعار الذي يُرسَل عند وجود طرد في مركز البريد." },
      { question: "كم يستغرق التوصيل السريع إلى لبنان وفق الحوار؟", options: ["1-2 يوم", "3-5 أيام", "7-14 يوماً", "شهر"], correct: 1, explanation: "قال الموظف 'Med express 3-5 dagar'." },
      { question: "ما اسم خدمة البريد في السويد؟", options: ["SwedPost", "PostNord", "SverigePost", "NordMail"], correct: 1, explanation: "PostNord هي شركة البريد السويدية الرسمية." },
      { question: "ما معنى 'rekommenderat brev'؟", options: ["رسالة عادية", "رسالة مسجّلة", "طرد صغير", "بريد إلكتروني"], correct: 1, explanation: "'rekommenderat brev' تعني الرسالة المسجّلة التي تتطلب توقيعاً عند الاستلام." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 26. الحلاق
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Hos frisören", titleAr: "عند الحلاق", scenario: "hairdresser",
    category: "يومي", difficulty: "beginner", emoji: "💇",
    imageUrl: IMG.hairdresser, durationMinutes: 10,
    vocabList: [
      { sv: "frisören", ar: "الحلاق / صالون الشعر", phonetic: "/ˈfriːˌsøːrən/" },
      { sv: "håret", ar: "الشعر", phonetic: "/ˈhɔːrət/" },
      { sv: "klippning", ar: "قص الشعر", phonetic: "/ˈklɪpːnɪŋ/" },
      { sv: "lite kortare", ar: "أقصر قليلاً", phonetic: "" },
      { sv: "sidorna", ar: "الجوانب", phonetic: "" },
      { sv: "toppen", ar: "القمة / الأعلى", phonetic: "" },
      { sv: "tvätta håret", ar: "غسيل الشعر", phonetic: "" },
      { sv: "styling", ar: "تصفيف / تسريح الشعر", phonetic: "" },
      { sv: "färga håret", ar: "صبغ الشعر", phonetic: "" },
      { sv: "rakning", ar: "حلاقة (اللحية)", phonetic: "" },
    ],
    grammarTips: [
      { title: "وصف ما تريد: 'Jag vill ha'", explanation: "للتعبير عن الرغبة في تغيير معين في الشعر", example: "Jag vill ha lite kortare på sidorna.", exampleAr: "أريد الجوانب أقصر قليلاً." },
      { title: "المقارنة: 'kortare / längre'", explanation: "يُستخدم للمقارنة عند الطلب", example: "Kan du klippa det lite kortare?", exampleAr: "هل يمكنك قصه أقصر قليلاً؟" },
    ],
    culturalNotes: "صالونات الشعر في السويد (frisörsalonger) تقدم خدماتها للرجال والنساء. الحجز المسبق (bokning) عادةً ضروري. الأسعار مرتفعة نسبياً مقارنة بدول أخرى. كثير من الصالونات تقدم القهوة أثناء انتظار الخدمة. من الشائع إعطاء بقشيش صغير لأصحاب الخدمة الجيدة.",
    usefulPhrases: [
      { sv: "Jag vill boka en tid för klippning.", ar: "أريد حجز موعد لقص الشعر." },
      { sv: "Lite kortare, tack.", ar: "أقصر قليلاً، من فضلك." },
      { sv: "Inte för kort.", ar: "ليس قصيراً جداً." },
      { sv: "Kan du visa mig spegeln?", ar: "هل يمكنك إريتاني المرآة؟" },
      { sv: "Det ser bra ut!", ar: "يبدو جيداً!" },
      { sv: "Hur mycket kostar en klippning?", ar: "كم يكلف قص الشعر؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "جواد", speakerRole: "زبون", textSv: "God dag! Jag har en bokning, Jawad Al-Amin.", textAr: "مرحباً! لدي حجز، جواد الأمين.", phonetic: "" },
      { speaker: "B", speakerName: "الحلاقة", speakerRole: "الحلاقة", textSv: "Välkommen, Jawad! Sätt dig gärna. Vad vill du ha gjort idag?", textAr: "أهلاً جواد! تفضل بالجلوس. ماذا تريد اليوم؟", phonetic: "" },
      { speaker: "A", speakerName: "جواد", speakerRole: "زبون", textSv: "En enkel klippning. Lite kortare på sidorna och toppen.", textAr: "قص بسيط. أقصر قليلاً على الجوانب والأعلى.", phonetic: "" },
      { speaker: "B", speakerName: "الحلاقة", speakerRole: "الحلاقة", textSv: "Okej. Vill du att vi tvättar håret också?", textAr: "حسناً. هل تريد أن نغسل الشعر أيضاً؟", phonetic: "" },
      { speaker: "A", speakerName: "جواد", speakerRole: "زبون", textSv: "Ja gärna, det vore bra. Och inte för kort bakåt.", textAr: "نعم من فضلك، سيكون جيداً. وليس قصيراً جداً في الخلف.", phonetic: "" },
      { speaker: "B", speakerName: "الحلاقة", speakerRole: "الحلاقة", textSv: "Självklart. Vill du ha styling efter klippningen?", textAr: "بالطبع. هل تريد تصفيف الشعر بعد القص؟", phonetic: "" },
      { speaker: "A", speakerName: "جواد", speakerRole: "زبون", textSv: "Nej tack, det behövs inte idag.", textAr: "لا شكراً، ليس ضرورياً اليوم.", phonetic: "" },
      { speaker: "B", speakerName: "الحلاقة", speakerRole: "الحلاقة", textSv: "Titta i spegeln – vad tycker du?", textAr: "انظر في المرآة - ما رأيك؟", phonetic: "" },
      { speaker: "A", speakerName: "جواد", speakerRole: "زبون", textSv: "Det ser jättebra ut! Precis som jag ville ha det.", textAr: "يبدو رائعاً جداً! بالضبط كما أردت.", phonetic: "" },
      { speaker: "B", speakerName: "الحلاقة", speakerRole: "الحلاقة", textSv: "Kul att höra! Det blir 250 kronor.", textAr: "سعيدة بسماع ذلك! المجموع 250 كرونة.", phonetic: "", noteAr: "أسعار الحلاقة في السويد مرتفعة نسبياً." },
    ],
    quiz: [
      { question: "ما معنى 'klippning'؟", options: ["صبغ الشعر", "قص الشعر", "غسيل الشعر", "تصفيف الشعر"], correct: 1, explanation: "'klippning' تعني قص الشعر." },
      { question: "كيف تقول 'أقصر قليلاً' بالسويدية؟", options: ["Mycket kortare", "Lite kortare", "Inte kortare", "Mer kortare"], correct: 1, explanation: "'lite' تعني قليلاً و'kortare' تعني أقصر." },
      { question: "ما معنى 'färga håret'؟", options: ["قص الشعر", "غسيل الشعر", "صبغ الشعر", "تجعيد الشعر"], correct: 2, explanation: "'färga' تعني يصبغ و'håret' تعني الشعر." },
      { question: "ما معنى 'sidorna' في سياق الحلاقة؟", options: ["الأعلى", "الجوانب", "الخلف", "مقدمة الرأس"], correct: 1, explanation: "'sidorna' تعني الجوانب أو الأطراف الجانبية للشعر." },
      { question: "كم كان سعر الحلاقة في الحوار؟", options: ["150 كرونة", "200 كرونة", "250 كرونة", "300 كرونة"], correct: 2, explanation: "قالت الحلاقة 'Det blir 250 kronor'." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 27. طبيب الأسنان
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Hos tandläkaren", titleAr: "عند طبيب الأسنان", scenario: "dentist",
    category: "صحة", difficulty: "intermediate", emoji: "🦷",
    imageUrl: IMG.dentist, durationMinutes: 12,
    vocabList: [
      { sv: "tandläkaren", ar: "طبيب الأسنان", phonetic: "/ˈtandˌlɛːkarən/" },
      { sv: "tanden", ar: "السنة / الضرس", phonetic: "/ˈtandːən/" },
      { sv: "tandvärk", ar: "ألم الأسنان", phonetic: "" },
      { sv: "fyllning", ar: "حشو الأسنان", phonetic: "" },
      { sv: "bedövning", ar: "تخدير", phonetic: "" },
      { sv: "tandborstning", ar: "تنظيف الأسنان بالفرشاة", phonetic: "" },
      { sv: "tandtråd", ar: "خيط تنظيف الأسنان", phonetic: "" },
      { sv: "röntgen", ar: "أشعة سينية", phonetic: "" },
      { sv: "tandkräm", ar: "معجون الأسنان", phonetic: "" },
      { sv: "tandhygienist", ar: "أخصائي نظافة الأسنان", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن الألم في الأسنان: 'ont i tanden'", explanation: "مثل 'ont i magen' لكن خاص بالأسنان", example: "Jag har ont i en tand.", exampleAr: "عندي ألم في سن." },
      { title: "السؤال عن الضرورة: 'Måste jag'", explanation: "'måste' تعني يجب أو لا بد من", example: "Måste jag ha bedövning?", exampleAr: "هل يجب أن أتخدّر؟" },
    ],
    culturalNotes: "رعاية الأسنان في السويد عالية الجودة لكنها مكلفة للبالغين. الأطفال حتى سن 23 يحصلون على رعاية أسنان مجانية. هناك نظام دعم حكومي (tandvårdsstöd) يغطي جزءاً من التكاليف للبالغين. يُنصح بزيارة طبيب الأسنان مرة أو مرتين سنوياً للفحص الدوري.",
    usefulPhrases: [
      { sv: "Jag har ont i en tand.", ar: "عندي ألم في سن." },
      { sv: "Behöver jag bedövning?", ar: "هل أحتاج إلى تخدير؟" },
      { sv: "Kan du vara försiktig?", ar: "هل يمكنك التأني؟" },
      { sv: "Hur länge håller fyllningen?", ar: "كم تدوم الحشوة؟" },
      { sv: "Ska jag ta röntgen?", ar: "هل يجب أن آخذ أشعة سينية؟" },
      { sv: "Hur mycket kostar det?", ar: "كم يكلف ذلك؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "حنان", speakerRole: "مريضة", textSv: "Hej, jag har bokat en tid. Jag har haft tandvärk i tre dagar.", textAr: "مرحباً، لدي موعد. عندي ألم في الأسنان منذ ثلاثة أيام.", phonetic: "" },
      { speaker: "B", speakerName: "طبيب الأسنان", speakerRole: "طبيب الأسنان", textSv: "Välkommen! Öppna munnen, tack. Jag ska titta.", textAr: "أهلاً! افتحي فمك من فضلك. سأفحص.", phonetic: "" },
      { speaker: "A", speakerName: "حنان", speakerRole: "مريضة", textSv: "Det gör ont när jag biter.", textAr: "يؤلمني عندما أعضّ.", phonetic: "" },
      { speaker: "B", speakerName: "طبيب الأسنان", speakerRole: "طبيب الأسنان", textSv: "Jag ser problemet – du har ett litet hål. Vi behöver ta en röntgenbild.", textAr: "أرى المشكلة - لديكِ ثقب صغير. نحتاج إلى أشعة سينية.", phonetic: "" },
      { speaker: "A", speakerName: "حنان", speakerRole: "مريضة", textSv: "Behöver jag en fyllning?", textAr: "هل أحتاج إلى حشو؟", phonetic: "" },
      { speaker: "B", speakerName: "طبيب الأسنان", speakerRole: "طبيب الأسنان", textSv: "Troligtvis ja. Vi ger dig bedövning först, det gör inte ont.", textAr: "على الأرجح نعم. سنخدّركِ أولاً، لن يؤلم.", phonetic: "" },
      { speaker: "A", speakerName: "حنان", speakerRole: "مريضة", textSv: "Okej, men jag är lite nervös för nålen.", textAr: "حسناً، لكنني خائفة قليلاً من الإبرة.", phonetic: "" },
      { speaker: "B", speakerName: "طبيب الأسنان", speakerRole: "طبيب الأسنان", textSv: "Det är normalt! Vi gör det så försiktigt som möjligt.", textAr: "ذلك طبيعي! سنفعل ذلك بأقصى قدر من الحذر.", phonetic: "" },
      { speaker: "A", speakerName: "حنان", speakerRole: "مريضة", textSv: "Tack. Hur länge håller fyllningen?", textAr: "شكراً. كم تدوم الحشوة؟", phonetic: "" },
      { speaker: "B", speakerName: "طبيب الأسنان", speakerRole: "طبيب الأسنان", textSv: "Minst 5-10 år om du borstar tänderna bra och använder tandtråd.", textAr: "على الأقل 5-10 سنوات إذا نظّفتِ أسنانكِ جيداً واستخدمتِ خيط الأسنان.", phonetic: "", noteAr: "استخدام خيط الأسنان يومياً مهم جداً لصحة الأسنان." },
    ],
    quiz: [
      { question: "ما معنى 'tandvärk'؟", options: ["حشو الأسنان", "ألم الأسنان", "تنظيف الأسنان", "تخدير الأسنان"], correct: 1, explanation: "'tandvärk' تعني ألم الأسنان." },
      { question: "ما معنى 'bedövning'؟", options: ["أشعة سينية", "خيط تنظيف", "تخدير", "حشوة"], correct: 2, explanation: "'bedövning' تعني التخدير الموضعي." },
      { question: "حتى أي سن تكون رعاية الأسنان مجانية في السويد؟", options: ["18", "20", "23", "25"], correct: 2, explanation: "الأطفال والشباب حتى سن 23 يحصلون على رعاية أسنان مجانية في السويد." },
      { question: "ما الذي احتاجه طبيب الأسنان قبل الحشوة في الحوار؟", options: ["تحليل دم", "أشعة سينية", "وصفة طبية", "استشارة أخرى"], correct: 1, explanation: "قال الطبيب 'Vi behöver ta en röntgenbild' أي أشعة سينية." },
      { question: "كم تدوم الحشوة وفق الحوار؟", options: ["1-3 سنوات", "3-5 سنوات", "5-10 سنوات", "10-15 سنة"], correct: 2, explanation: "قال الطبيب 'Minst 5-10 år'." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 28. الطبيب البيطري
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Hos veterinären", titleAr: "عند الطبيب البيطري", scenario: "veterinarian",
    category: "يومي", difficulty: "intermediate", emoji: "🐾",
    imageUrl: IMG.veterinarian, durationMinutes: 10,
    vocabList: [
      { sv: "veterinären", ar: "الطبيب البيطري", phonetic: "/ˌveːtəriˈnɛːrən/" },
      { sv: "hunden", ar: "الكلب", phonetic: "" },
      { sv: "katten", ar: "القطة", phonetic: "" },
      { sv: "vaccinering", ar: "تطعيم", phonetic: "" },
      { sv: "mikrochip", ar: "شريحة إلكترونية", phonetic: "" },
      { sv: "husdjuret", ar: "الحيوان الأليف", phonetic: "" },
      { sv: "receptbelagd medicin", ar: "دواء بوصفة طبية بيطرية", phonetic: "" },
      { sv: "klinik", ar: "عيادة بيطرية", phonetic: "" },
      { sv: "loppmedel", ar: "دواء مضاد للبراغيث", phonetic: "" },
      { sv: "provtagning", ar: "أخذ عينة", phonetic: "" },
    ],
    grammarTips: [
      { title: "وصف أعراض حيوان أليف", explanation: "استخدام ضمير 'han/hon/den' للحيوانات", example: "Han äter inte och verkar trött.", exampleAr: "هو لا يأكل ويبدو متعباً." },
      { title: "السؤال عن الضرورة الطبية: 'Behöver han'", explanation: "للسؤال إن كان الحيوان بحاجة لعلاج معين", example: "Behöver han vaccineras nu?", exampleAr: "هل يحتاج للتطعيم الآن؟" },
    ],
    culturalNotes: "امتلاك الحيوانات الأليفة في السويد شائع جداً. القانون السويدي يُلزم بتسجيل الكلاب وتزويدها بشريحة إلكترونية (mikrochip). التأمين على الحيوانات الأليفة (djurförsäkring) منتشر جداً نظراً لارتفاع تكاليف العلاج. العيادات البيطرية تتوفر على مدار الساعة في المدن الكبرى.",
    usefulPhrases: [
      { sv: "Min hund mår inte bra.", ar: "كلبي ليس بخير." },
      { sv: "Han har inte ätit på två dagar.", ar: "لم يأكل منذ يومين." },
      { sv: "Behöver han vaccineras?", ar: "هل يحتاج إلى تطعيم؟" },
      { sv: "Kan jag få ett recept?", ar: "هل يمكنني الحصول على وصفة بيطرية؟" },
      { sv: "Hur allvarligt är det?", ar: "ما مدى خطورة الأمر؟" },
      { sv: "Har ni jour?", ar: "هل لديكم خدمة طوارئ؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "طارق", speakerRole: "صاحب الحيوان", textSv: "Hej! Jag är orolig för min katt. Hon äter inte och verkar slö.", textAr: "مرحباً! أنا قلق على قطتي. لا تأكل وتبدو خاملة.", phonetic: "" },
      { speaker: "B", speakerName: "الطبيبة البيطرية", speakerRole: "الطبيبة البيطرية", textSv: "Hur länge har hon haft de här symptomen?", textAr: "منذ متى لديها هذه الأعراض؟", phonetic: "" },
      { speaker: "A", speakerName: "طارق", speakerRole: "صاحب الحيوان", textSv: "Sedan igår. Och hon dricker inte heller.", textAr: "منذ أمس. وهي لا تشرب أيضاً.", phonetic: "" },
      { speaker: "B", speakerName: "الطبيبة البيطرية", speakerRole: "الطبيبة البيطرية", textSv: "Jag ska undersöka henne. Är hon vaccinerad?", textAr: "سأفحصها. هل هي مطعّمة؟", phonetic: "" },
      { speaker: "A", speakerName: "طارق", speakerRole: "صاحب الحيوان", textSv: "Ja, hon fick sitt vaccin förra året.", textAr: "نعم، حصلت على تطعيمها العام الماضي.", phonetic: "" },
      { speaker: "B", speakerName: "الطبيبة البيطرية", speakerRole: "الطبيبة البيطرية", textSv: "Bra. Jag tar en provtagning för att kontrollera blodet.", textAr: "جيد. سأأخذ عينة للتحقق من الدم.", phonetic: "" },
      { speaker: "A", speakerName: "طارق", speakerRole: "صاحب الحيوان", textSv: "Är det allvarligt? Jag är verkligen orolig.", textAr: "هل الأمر خطير؟ أنا قلق حقاً.", phonetic: "" },
      { speaker: "B", speakerName: "الطبيبة البيطرية", speakerRole: "الطبيبة البيطرية", textSv: "Det ser inte akut ut, men vi måste vänta på svaret. Har hon mikrochip?", textAr: "لا يبدو الأمر عاجلاً، لكن يجب أن ننتظر النتيجة. هل لديها شريحة إلكترونية؟", phonetic: "" },
      { speaker: "A", speakerName: "طارق", speakerRole: "صاحب الحيوان", textSv: "Ja, hon är registrerad. Vad gör jag under tiden?", textAr: "نعم، هي مسجّلة. ماذا أفعل في هذه الأثناء؟", phonetic: "" },
      { speaker: "B", speakerName: "الطبيبة البيطرية", speakerRole: "الطبيبة البيطرية", textSv: "Erbjud henne vatten ofta och håll henne varm. Vi ringer när svaret kommer.", textAr: "قدّم لها الماء كثيراً وأبقها دافئة. سنتصل بك عند وصول النتيجة.", phonetic: "", noteAr: "الاهتمام بالحيوانات الأليفة له ثقافة راسخة في السويد." },
    ],
    quiz: [
      { question: "ما معنى 'vaccinering'؟", options: ["فحص", "علاج", "تطعيم", "جراحة"], correct: 2, explanation: "'vaccinering' تعني التطعيم أو اللقاح." },
      { question: "ما معنى 'husdjuret'؟", options: ["الحيوان المفترس", "الحيوان الأليف", "حيوان الحديقة", "الحيوان البري"], correct: 1, explanation: "'husdjuret' تعني الحيوان الأليف الذي يُربّى في المنزل." },
      { question: "ما معنى 'mikrochip' في سياق الحيوانات؟", options: ["دواء صغير", "شريحة إلكترونية للتعريف", "حقنة صغيرة", "لصقة علاجية"], correct: 1, explanation: "القانون السويدي يُلزم بتزويد الكلاب بشريحة إلكترونية للتعريف بها." },
      { question: "ما أعراض قطة طارق في الحوار؟", options: ["سعال وعطاس", "لا تأكل ولا تشرب وخاملة", "حمى وألم", "جروح في الجسم"], correct: 1, explanation: "قال طارق 'Hon äter inte och verkar slö' وأضاف 'hon dricker inte heller'." },
      { question: "ما الذي قررت الطبيبة فعله لتشخيص حالة القطة؟", options: ["إعطاء حبوب", "أشعة سينية", "أخذ عينة دم", "إجراء عملية"], correct: 2, explanation: "قالت الطبيبة 'Jag tar en provtagning för att kontrollera blodet'." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 29. الجيم
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På gymmet", titleAr: "في الجيم", scenario: "gym",
    category: "يومي", difficulty: "beginner", emoji: "💪",
    imageUrl: IMG.gym, durationMinutes: 10,
    vocabList: [
      { sv: "gymmet", ar: "النادي الرياضي", phonetic: "/ˈjɪmːət/" },
      { sv: "träning", ar: "تدريب / رياضة", phonetic: "" },
      { sv: "styrketräning", ar: "تدريب على الأوزان", phonetic: "" },
      { sv: "löpband", ar: "جهاز الجري", phonetic: "" },
      { sv: "omklädningsrummet", ar: "غرفة تغيير الملابس", phonetic: "" },
      { sv: "handduk", ar: "منشفة", phonetic: "" },
      { sv: "medlemskapet", ar: "العضوية", phonetic: "" },
      { sv: "personlig tränare", ar: "مدرب شخصي", phonetic: "" },
      { sv: "uppvärmning", ar: "إحماء", phonetic: "" },
      { sv: "sträckning", ar: "تمديد / شد عضلي", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن التكرار: 'X gånger i veckan'", explanation: "للتعبير عن كم مرة تمارس الرياضة أسبوعياً", example: "Jag tränar tre gånger i veckan.", exampleAr: "أتدرب ثلاث مرات في الأسبوع." },
      { title: "السؤال عن الطريقة: 'Hur använder man'", explanation: "للسؤال عن كيفية استخدام الأجهزة", example: "Hur använder man den här maskinen?", exampleAr: "كيف تُستخدم هذه الآلة؟" },
    ],
    culturalNotes: "النوادي الرياضية (gym) منتشرة جداً في السويد وتُعدّ جزءاً من ثقافة الصحة السويدية. سلاسل مثل SATS وWorldClass وTräningskompaniet تغطي معظم المدن. كثير من أصحاب العمل يدعمون اشتراكات موظفيهم في النوادي الرياضية (friskvårdsbidrag). الخوذة والمنشفة ضرورتان لدخول معظم النوادي.",
    usefulPhrases: [
      { sv: "Jag vill bli medlem.", ar: "أريد أن أصبح عضواً." },
      { sv: "Hur mycket kostar ett månadsmedlemskap?", ar: "كم يكلف الاشتراك الشهري؟" },
      { sv: "Kan du visa mig hur man använder den här maskinen?", ar: "هل يمكنك أن تريني كيف تُستخدم هذه الآلة؟" },
      { sv: "Var är omklädningsrummet?", ar: "أين غرفة تغيير الملابس؟" },
      { sv: "Behöver jag ta med handduk?", ar: "هل يجب أن آتي بمنشفة؟" },
      { sv: "Jag tränar för att gå ner i vikt.", ar: "أتدرب لأفقد الوزن." },
    ],
    lines: [
      { speaker: "A", speakerName: "سلوى", speakerRole: "عضو جديدة", textSv: "Hej! Jag är ny här och vet inte riktigt hur jag ska börja.", textAr: "مرحباً! أنا جديدة هنا ولا أعرف تماماً كيف أبدأ.", phonetic: "" },
      { speaker: "B", speakerName: "المدرب", speakerRole: "المدرب الشخصي", textSv: "Välkommen! Vad är ditt träningsmål?", textAr: "أهلاً بك! ما هو هدفك من التدريب؟", phonetic: "" },
      { speaker: "A", speakerName: "سلوى", speakerRole: "عضو جديدة", textSv: "Jag vill bli starkare och förbättra konditionen.", textAr: "أريد أن أصبح أقوى وأحسّن لياقتي البدنية.", phonetic: "" },
      { speaker: "B", speakerName: "المدرب", speakerRole: "المدرب الشخصي", textSv: "Bra! Hur många gånger i veckan kan du träna?", textAr: "جيد! كم مرة في الأسبوع يمكنك التدريب؟", phonetic: "" },
      { speaker: "A", speakerName: "سلوى", speakerRole: "عضو جديدة", textSv: "Tre till fyra gånger tror jag.", textAr: "ثلاث إلى أربع مرات أظن.", phonetic: "" },
      { speaker: "B", speakerName: "المدرب", speakerRole: "المدرب الشخصي", textSv: "Perfekt. Glöm inte uppvärmning och sträckning efter varje pass.", textAr: "ممتاز. لا تنسي الإحماء والشد العضلي بعد كل جلسة.", phonetic: "" },
      { speaker: "A", speakerName: "سلوى", speakerRole: "عضو جديدة", textSv: "Var är omklädningsrummet? Och behöver jag ta med handduk?", textAr: "أين غرفة تغيير الملابس؟ وهل يجب أن آتي بمنشفة؟", phonetic: "" },
      { speaker: "B", speakerName: "المدرب", speakerRole: "المدرب الشخصي", textSv: "Omklädningsrummet är till höger. Handduk är obligatoriskt.", textAr: "غرفة تغيير الملابس على اليمين. المنشفة إلزامية.", phonetic: "" },
      { speaker: "A", speakerName: "سلوى", speakerRole: "عضو جديدة", textSv: "Okej! Hur använder man löpbandet?", textAr: "حسناً! كيف يُستخدم جهاز الجري؟", phonetic: "" },
      { speaker: "B", speakerName: "المدرب", speakerRole: "المدرب الشخصي", textSv: "Tryck på start, välj hastighet och börja gå. Enkelt!", textAr: "اضغطي على ابدأ، اختاري السرعة وابدئي بالمشي. بسيط!", phonetic: "", noteAr: "'Enkelt' تعني بسيط أو سهل." },
    ],
    quiz: [
      { question: "ما معنى 'träning'؟", options: ["طعام صحي", "تدريب / رياضة", "مسبح", "غرفة"], correct: 1, explanation: "'träning' تعني التدريب أو ممارسة الرياضة." },
      { question: "ما معنى 'uppvärmning'؟", options: ["شد عضلي", "تبريد", "إحماء", "استراحة"], correct: 2, explanation: "'uppvärmning' تعني الإحماء قبل التمرين." },
      { question: "ما معنى 'friskvårdsbidrag'؟", options: ["بطاقة عضوية", "دعم صاحب العمل لاشتراك الرياضة", "قسم رياضي في المدرسة", "تأمين صحي"], correct: 1, explanation: "كثير من أصحاب العمل في السويد يدعمون اشتراكات موظفيهم الرياضية." },
      { question: "ما الذي يُعدّ إلزامياً في الجيم وفق الحوار؟", options: ["الحذاء الرياضي", "القفازات", "المنشفة", "خزانة شخصية"], correct: 2, explanation: "قال المدرب 'Handduk är obligatoriskt' أي المنشفة إلزامية." },
      { question: "كم مرة أسبوعياً تعتزم سلوى التدريب؟", options: ["مرة إلى مرتين", "مرتين إلى ثلاث", "ثلاث إلى أربع", "كل يوم"], correct: 2, explanation: "قالت سلوى 'Tre till fyra gånger tror jag'." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 30. التسوق للأثاث (IKEA)
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "I möbelaffären", titleAr: "في متجر الأثاث", scenario: "furniture",
    category: "تسوق", difficulty: "beginner", emoji: "🛋️",
    imageUrl: IMG.furniture, durationMinutes: 10,
    vocabList: [
      { sv: "möbelaffären", ar: "متجر الأثاث", phonetic: "" },
      { sv: "soffan", ar: "الأريكة", phonetic: "" },
      { sv: "sängen", ar: "السرير", phonetic: "" },
      { sv: "skrivbordet", ar: "المكتب", phonetic: "" },
      { sv: "hyllan", ar: "الرف", phonetic: "" },
      { sv: "leverans", ar: "توصيل", phonetic: "" },
      { sv: "montering", ar: "تركيب / تجميع", phonetic: "" },
      { sv: "artikelnumret", ar: "رقم المنتج", phonetic: "" },
      { sv: "lagersaldo", ar: "المخزون المتوفر", phonetic: "" },
      { sv: "kassan", ar: "الكاشير / الصندوق", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن التوفر: 'Finns det... i lager'", explanation: "للسؤال إن كان المنتج متوفراً في المخزن", example: "Finns det den här soffan i grått i lager?", exampleAr: "هل هذه الأريكة متوفرة باللون الرمادي في المخزن؟" },
      { title: "التعبير عن الرغبة في الشراء: 'Jag tänker köpa'", explanation: "تعني 'أفكر في شراء' أو 'سأشتري'", example: "Jag tänker köpa den här hyllan.", exampleAr: "أفكر في شراء هذا الرف." },
    ],
    culturalNotes: "IKEA هي شركة أثاث سويدية عالمية الشهرة تأسست عام 1943. يُعدّ التسوق في IKEA تجربة اجتماعية في السويد - تبدأ بالمطعم ثم جولة المنتجات ثم منطقة الاستلام. كثير من المنتجات مسماة بأسماء سويدية. نظام الشراء ذاتي التجميع (flat-pack) أحدث ثورة في عالم الأثاث.",
    usefulPhrases: [
      { sv: "Var hittar jag sofforna?", ar: "أين أجد الأرائك؟" },
      { sv: "Finns det den här i en annan färg?", ar: "هل هذا متوفر بلون آخر؟" },
      { sv: "Erbjuder ni hemleverans?", ar: "هل تقدمون توصيلاً للمنزل؟" },
      { sv: "Kan ni hjälpa med monteringen?", ar: "هل يمكنكم المساعدة في التركيب؟" },
      { sv: "Vad är artikelnumret?", ar: "ما هو رقم المنتج؟" },
      { sv: "Hur länge är garantin?", ar: "ما مدة الضمان؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "عدنان", speakerRole: "زبون", textSv: "Ursäkta! Jag letar efter en soffa till mitt vardagsrum.", textAr: "عفواً! أبحث عن أريكة لغرفة معيشتي.", phonetic: "" },
      { speaker: "B", speakerName: "موظفة IKEA", speakerRole: "موظفة المتجر", textSv: "Välkommen! Sofforna finns på plan ett. Har du något visst i tankarna?", textAr: "أهلاً! الأرائك في الطابق الأول. هل لديك شيء معين في ذهنك؟", phonetic: "" },
      { speaker: "A", speakerName: "عدنان", speakerRole: "زبون", textSv: "Jag vill ha något stort och bekvämt, gärna i grått.", textAr: "أريد شيئاً كبيراً ومريحاً، ويفضّل أن يكون رمادياً.", phonetic: "" },
      { speaker: "B", speakerName: "موظفة IKEA", speakerRole: "موظفة المتجر", textSv: "Den här KIVIK-soffan är väldigt populär och finns i grått.", textAr: "هذه الأريكة KIVIK شعبية جداً وهي متوفرة باللون الرمادي.", phonetic: "" },
      { speaker: "A", speakerName: "عدنان", speakerRole: "زبون", textSv: "Fin! Erbjuder ni hemleverans? Jag har ingen bil.", textAr: "جميلة! هل تقدمون توصيلاً للمنزل؟ ليس لدي سيارة.", phonetic: "" },
      { speaker: "B", speakerName: "موظفة IKEA", speakerRole: "موظفة المتجر", textSv: "Ja, vi levererar hela veckan. Priset beror på din adress.", textAr: "نعم، نوصّل طوال الأسبوع. السعر يعتمد على عنوانك.", phonetic: "" },
      { speaker: "A", speakerName: "عدنان", speakerRole: "زبون", textSv: "Och ingår montering i leveransen?", textAr: "وهل يشمل التوصيل التركيب؟", phonetic: "" },
      { speaker: "B", speakerName: "موظفة IKEA", speakerRole: "موظفة المتجر", textSv: "Monteringen är en extra tjänst, 500 kronor.", textAr: "التركيب خدمة إضافية بـ 500 كرونة.", phonetic: "" },
      { speaker: "A", speakerName: "عدنان", speakerRole: "زبون", textSv: "Okej, jag tar leveransen med montering. Hur länge är garantin?", textAr: "حسناً، سآخذ التوصيل مع التركيب. ما مدة الضمان؟", phonetic: "" },
      { speaker: "B", speakerName: "موظفة IKEA", speakerRole: "موظفة المتجر", textSv: "Tio års garanti på KIVIK-soffan. Köp den vid kassan och boka leverans online.", textAr: "ضمان عشر سنوات على أريكة KIVIK. اشترِها عند الكاشير واحجز التوصيل عبر الإنترنت.", phonetic: "", noteAr: "IKEA سويدية الأصل وتقدم ضمانات طويلة الأمد على منتجاتها." },
    ],
    quiz: [
      { question: "ما معنى 'leverans'؟", options: ["إعادة المنتج", "التوصيل", "الضمان", "التركيب"], correct: 1, explanation: "'leverans' تعني التوصيل أو الإيصال." },
      { question: "ما معنى 'montering'؟", options: ["التغليف", "التوصيل", "التركيب / التجميع", "التخزين"], correct: 2, explanation: "'montering' تعني تركيب أو تجميع القطع." },
      { question: "متى تأسست شركة IKEA؟", options: ["1940", "1943", "1950", "1960"], correct: 1, explanation: "تأسست IKEA عام 1943 في السويد." },
      { question: "كم تكلف خدمة التركيب في الحوار؟", options: ["200 كرونة", "350 كرونة", "500 كرونة", "700 كرونة"], correct: 2, explanation: "قالت الموظفة 'Monteringen är en extra tjänst, 500 kronor'." },
      { question: "كم سنة ضمان على أريكة KIVIK؟", options: ["3 سنوات", "5 سنوات", "7 سنوات", "10 سنوات"], correct: 3, explanation: "قالت الموظفة 'Tio års garanti på KIVIK-soffan'." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 31. البحث عن شقة
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Lägenhetsjakt", titleAr: "البحث عن شقة", scenario: "apartment",
    category: "يومي", difficulty: "intermediate", emoji: "🏠",
    imageUrl: IMG.apartment, durationMinutes: 12,
    vocabList: [
      { sv: "lägenheten", ar: "الشقة", phonetic: "" },
      { sv: "hyran", ar: "الإيجار", phonetic: "" },
      { sv: "depositionsavgiften", ar: "مبلغ التأمين (الوديعة)", phonetic: "" },
      { sv: "kvadratmeter", ar: "متر مربع", phonetic: "" },
      { sv: "andrahandsuthyrning", ar: "الإيجار من الباطن", phonetic: "" },
      { sv: "hyresvärden", ar: "مالك العقار", phonetic: "" },
      { sv: "bostadskö", ar: "قائمة انتظار السكن", phonetic: "" },
      { sv: "inflyttning", ar: "موعد الانتقال للسكن", phonetic: "" },
      { sv: "husdjur", ar: "حيوان أليف", phonetic: "" },
      { sv: "kontraktet", ar: "عقد الإيجار", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن الشروط: 'Är det tillåtet att'", explanation: "للسؤال عن ما هو مسموح به في الشقة", example: "Är det tillåtet att ha husdjur?", exampleAr: "هل يُسمح بوجود حيوانات أليفة؟" },
      { title: "التعبير عن الوضع: 'Jag är på kö för'", explanation: "للتعبير عن أنك في قائمة الانتظار", example: "Jag är på kö för en lägenhet i centrum.", exampleAr: "أنا في قائمة انتظار لشقة في المركز." },
    ],
    culturalNotes: "سوق الإيجار في السويد صعب جداً، خصوصاً في ستوكهولم ومالمو ويوتيبوري. قوائم الانتظار (bostadskö) قد تمتد لسنوات عديدة. الإيجار من الباطن (andrahandsuthyrning) شائع لكنه يتطلب إذن المالك. هناك رقابة حكومية صارمة على مستويات الإيجار. مواقع مثل Blocket وHemnet من أشهر مواقع البحث عن العقارات.",
    usefulPhrases: [
      { sv: "Jag söker en lägenhet.", ar: "أبحث عن شقة." },
      { sv: "Hur hög är hyran?", ar: "كم يبلغ الإيجار؟" },
      { sv: "Ingår el och vatten i hyran?", ar: "هل تشمل الكهرباء والماء الإيجار؟" },
      { sv: "Är det möblerat?", ar: "هل هي مفروشة؟" },
      { sv: "Kan jag se lägenheten?", ar: "هل يمكنني رؤية الشقة؟" },
      { sv: "Hur lång är uppsägningstiden?", ar: "ما مهلة إشعار الإخلاء؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "ريم", speakerRole: "مستأجرة محتملة", textSv: "Hej! Jag ringer angående lägenheten på Drottninggatan.", textAr: "مرحباً! أتصل بخصوص الشقة في درتنينغغاتان.", phonetic: "" },
      { speaker: "B", speakerName: "المالك", speakerRole: "مالك العقار", textSv: "Hej! Ja, den är fortfarande ledig. Det är en 2:a på 45 kvm.", textAr: "مرحباً! نعم، ما زالت شاغرة. هي شقة بغرفتين ومساحتها 45 متراً مربعاً.", phonetic: "" },
      { speaker: "A", speakerName: "ريم", speakerRole: "مستأجرة محتملة", textSv: "Hur hög är hyran per månad?", textAr: "كم يبلغ الإيجار الشهري؟", phonetic: "" },
      { speaker: "B", speakerName: "المالك", speakerRole: "مالك العقار", textSv: "9 500 kronor. El och internet tillkommer.", textAr: "9500 كرونة. الكهرباء والإنترنت إضافية.", phonetic: "" },
      { speaker: "A", speakerName: "ريم", speakerRole: "مستأجرة محتملة", textSv: "Förstår. Är det möblerat?", textAr: "أفهم. هل هي مفروشة؟", phonetic: "" },
      { speaker: "B", speakerName: "المالك", speakerRole: "مالك العقار", textSv: "Nej, omöblerat. Är det tillåtet att ha husdjur?", textAr: "لا، غير مفروشة. تسألين هل يُسمح بالحيوانات الأليفة؟", phonetic: "" },
      { speaker: "A", speakerName: "ريم", speakerRole: "مستأجرة محتملة", textSv: "Ja precis, jag har en katt.", textAr: "نعم بالضبط، لدي قطة.", phonetic: "" },
      { speaker: "B", speakerName: "المالك", speakerRole: "مالك العقار", textSv: "Det är okej med katt. Kan du visa inkomstbevis och references?", textAr: "القطة مقبولة. هل يمكنك إظهار إثبات دخل ومراجع؟", phonetic: "" },
      { speaker: "A", speakerName: "ريم", speakerRole: "مستأجرة محتملة", textSv: "Ja absolut. Kan jag komma och titta på lägenheten?", textAr: "بالتأكيد. هل يمكنني القدوم لرؤية الشقة؟", phonetic: "" },
      { speaker: "B", speakerName: "المالك", speakerRole: "مالك العقار", textSv: "Visning är på lördag klockan 11. Ta med ID och lönespecifikation.", textAr: "المعاينة يوم السبت الساعة 11. أحضري بطاقة هويتك وإفصاح الراتب.", phonetic: "", noteAr: "سوق الإيجار السويدي تنافسي جداً - كن مستعداً بكل الوثائق." },
    ],
    quiz: [
      { question: "ما معنى 'bostadskö'؟", options: ["قائمة انتظار السكن", "مكتب الإيجار", "سوق العقارات", "عقد الإيجار"], correct: 0, explanation: "'bostadskö' هي قائمة انتظار السكن التي قد تمتد لسنوات في السويد." },
      { question: "ما معنى 'hyresvärden'؟", options: ["المستأجر", "الوسيط العقاري", "مالك العقار", "المقيّم"], correct: 2, explanation: "'hyresvärden' تعني مالك العقار أو المؤجِّر." },
      { question: "كم مساحة الشقة في الحوار؟", options: ["35 م²", "40 م²", "45 م²", "50 م²"], correct: 2, explanation: "قال المالك 'Det är en 2:a på 45 kvm'." },
      { question: "ما معنى 'andrahandsuthyrning'؟", options: ["الشقة الفندقية", "الإيجار من الباطن", "الشقة الطلابية", "المساكن الاجتماعية"], correct: 1, explanation: "'andrahandsuthyrning' هو الإيجار من الباطن الذي يحتاج إذن المالك." },
      { question: "متى كانت موعد المعاينة في الحوار؟", options: ["الجمعة الساعة 10", "السبت الساعة 11", "الأحد الساعة 12", "الخميس الساعة 9"], correct: 1, explanation: "قال المالك 'Visning är på lördag klockan 11'." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 32. إدارة الهجرة
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På Migrationsverket", titleAr: "في إدارة الهجرة", scenario: "migration",
    category: "رسمي", difficulty: "advanced", emoji: "🗂️",
    imageUrl: IMG.migration, durationMinutes: 14,
    vocabList: [
      { sv: "uppehållstillstånd", ar: "إذن الإقامة", phonetic: "" },
      { sv: "arbetstillstånd", ar: "تصريح العمل", phonetic: "" },
      { sv: "asylansökan", ar: "طلب اللجوء", phonetic: "" },
      { sv: "medborgarskap", ar: "الجنسية", phonetic: "" },
      { sv: "personnummer", ar: "الرقم الشخصي الوطني", phonetic: "" },
      { sv: "biometri", ar: "البيانات الحيوية (بصمة)", phonetic: "" },
      { sv: "förlängning", ar: "التمديد", phonetic: "" },
      { sv: "beslutet", ar: "القرار", phonetic: "" },
      { sv: "handläggningstid", ar: "مدة المعالجة", phonetic: "" },
      { sv: "sambo", ar: "شريك/ة الحياة المقيم معاً", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن حالة الطلب: 'Hur långt har ni kommit'", explanation: "للسؤال عن مرحلة معالجة الطلب", example: "Hur långt har ni kommit med min ansökan?", exampleAr: "ما مرحلة معالجة طلبي؟" },
      { title: "التعبير عن الضرورة: 'Det krävs att'", explanation: "يعني 'يُشترط أن' أو 'من الضروري أن'", example: "Det krävs att du är folkbokförd.", exampleAr: "يُشترط أن تكون مسجّلاً في السكان." },
    ],
    culturalNotes: "Migrationsverket هي الجهة الحكومية المسؤولة عن إذونات الإقامة والعمل واللجوء. يمكن تقديم الطلبات إلكترونياً عبر موقعهم. مدة المعالجة تتفاوت من أسابيع إلى أشهر. يحق لمقدمي الطلبات الحصول على مترجم مجاني. التواصل المنتظم مع الجهة مهم لمتابعة الطلب.",
    usefulPhrases: [
      { sv: "Jag vill ansöka om uppehållstillstånd.", ar: "أريد التقديم لإذن الإقامة." },
      { sv: "Hur lång är handläggningstiden?", ar: "كم تستغرق مدة المعالجة؟" },
      { sv: "Kan jag få en tolk?", ar: "هل يمكنني الحصول على مترجم؟" },
      { sv: "Mitt tillstånd löper ut snart.", ar: "إذني على وشك الانتهاء." },
      { sv: "Jag vill förlänga mitt tillstånd.", ar: "أريد تمديد إذني." },
      { sv: "Vad händer om ansökan avslås?", ar: "ماذا يحدث إذا رُفض الطلب؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "عمر", speakerRole: "مقدم طلب", textSv: "God morgon. Jag är här för att ansöka om förlängning av mitt uppehållstillstånd.", textAr: "صباح الخير. أنا هنا لتقديم طلب تمديد إذن إقامتي.", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف Migrationsverket", textSv: "Välkommen. Har du din nuvarande tillståndshandling och pass med dig?", textAr: "أهلاً. هل لديك وثيقة إذنك الحالي وجواز سفرك معك؟", phonetic: "" },
      { speaker: "A", speakerName: "عمر", speakerRole: "مقدم طلب", textSv: "Ja, här är de. Mitt tillstånd löper ut om tre månader.", textAr: "نعم، هي هنا. إذني ينتهي بعد ثلاثة أشهر.", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف Migrationsverket", textSv: "Bra att du ansöker i tid. Vad baseras din ansökan på, arbete eller familj?", textAr: "جيد أنك قدّمت في الوقت المناسب. على ماذا يستند طلبك، عمل أم أسرة؟", phonetic: "" },
      { speaker: "A", speakerName: "عمر", speakerRole: "مقدم طلب", textSv: "Arbete. Jag har jobbat hos samma arbetsgivare i två år.", textAr: "عمل. لقد عملت لدى نفس صاحب العمل لمدة سنتين.", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف Migrationsverket", textSv: "Bra. Du behöver också lämna biometri. Hur lång är handläggningstiden?", textAr: "جيد. ستحتاج أيضاً إلى تقديم بياناتك الحيوية. كم هي مدة المعالجة؟", phonetic: "" },
      { speaker: "A", speakerName: "عمر", speakerRole: "مقدم طلب", textSv: "Det är just det jag undrar. Hur lång tid tar det?", textAr: "هذا بالضبط ما أتساءل عنه. كم يستغرق الأمر؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف Migrationsverket", textSv: "Normalt 3-4 månader. Du får ett skriftligt beslut hem.", textAr: "عادةً 3-4 أشهر. ستتلقى قراراً مكتوباً في المنزل.", phonetic: "" },
      { speaker: "A", speakerName: "عمر", speakerRole: "مقدم طلب", textSv: "Behöver jag göra något mer?", textAr: "هل يجب أن أفعل شيئاً آخر؟", phonetic: "" },
      { speaker: "B", speakerName: "الموظف", speakerRole: "موظف Migrationsverket", textSv: "Fyll i formuläret online och betala avgiften. Välkommen tillbaka för biometri-insamlingen.", textAr: "املأ النموذج عبر الإنترنت وادفع الرسوم. مرحباً بك مجدداً لجمع البيانات الحيوية.", phonetic: "", noteAr: "يمكن متابعة حالة الطلب عبر موقع Migrationsverket الإلكتروني." },
    ],
    quiz: [
      { question: "ما معنى 'uppehållstillstånd'؟", options: ["رخصة عمل", "إذن الإقامة", "جواز سفر", "تأشيرة سياحية"], correct: 1, explanation: "'uppehållstillstånd' هو إذن الإقامة الرسمي في السويد." },
      { question: "ما معنى 'handläggningstid'؟", options: ["موعد المقابلة", "مدة المعالجة", "وقت الانتظار في الطابور", "مدة صلاحية الوثيقة"], correct: 1, explanation: "'handläggningstid' تعني الوقت الذي تستغرقه الجهة لمعالجة الطلب." },
      { question: "كم شهراً كانت مدة معالجة طلب التمديد وفق الحوار؟", options: ["1-2 شهر", "2-3 أشهر", "3-4 أشهر", "6 أشهر"], correct: 2, explanation: "قال الموظف 'Normalt 3-4 månader'." },
      { question: "ما معنى 'biometri'؟", options: ["صورة شخصية", "البيانات الحيوية (بصمة)", "التوقيع الإلكتروني", "رمز الهوية"], correct: 1, explanation: "'biometri' تعني جمع البيانات الحيوية كبصمة الأصابع للتحقق من الهوية." },
      { question: "على أي أساس كان طلب عمر للتمديد؟", options: ["الدراسة", "الأسرة", "اللجوء", "العمل"], correct: 3, explanation: "قال عمر 'Arbete. Jag har jobbat hos samma arbetsgivare i två år'." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 33. مكتب التوظيف
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På Arbetsförmedlingen", titleAr: "في مكتب التوظيف", scenario: "employment",
    category: "عمل", difficulty: "intermediate", emoji: "📋",
    imageUrl: IMG.employment, durationMinutes: 12,
    vocabList: [
      { sv: "Arbetsförmedlingen", ar: "مكتب التوظيف", phonetic: "" },
      { sv: "arbetslös", ar: "عاطل عن العمل", phonetic: "" },
      { sv: "a-kassa", ar: "صندوق دعم العاطلين", phonetic: "" },
      { sv: "aktivitetsrapport", ar: "تقرير النشاط الوظيفي", phonetic: "" },
      { sv: "handlingsplan", ar: "خطة العمل", phonetic: "" },
      { sv: "platsbanken", ar: "بنك الوظائف", phonetic: "" },
      { sv: "kompetensutveckling", ar: "تطوير المهارات", phonetic: "" },
      { sv: "arbetsmarknadsutbildning", ar: "تدريب سوق العمل", phonetic: "" },
      { sv: "anvisning", ar: "توجيه وظيفي", phonetic: "" },
      { sv: "sysselsättning", ar: "التشغيل / التوظيف", phonetic: "" },
    ],
    grammarTips: [
      { title: "التعبير عن مدة البطالة: 'Jag har varit arbetslös i'", explanation: "يُستخدم للحديث عن مدة البطالة", example: "Jag har varit arbetslös i tre månader.", exampleAr: "أنا عاطل عن العمل منذ ثلاثة أشهر." },
      { title: "السؤال عن الدعم المتاح: 'Vilka stödinsatser finns'", explanation: "للسؤال عن أنواع الدعم التي تقدمها الجهة", example: "Vilka stödinsatser finns tillgängliga för mig?", exampleAr: "ما هي إجراءات الدعم المتاحة لي؟" },
    ],
    culturalNotes: "Arbetsförmedlingen هي الجهة الحكومية السويدية المسؤولة عن سوق العمل ومساعدة الباحثين عن عمل. عند التسجيل كعاطل، يجب تقديم تقارير نشاط دورية. صندوق دعم العاطلين (a-kassa) يدفع تعويضاً بنسبة 80% من آخر راتب للأعضاء. Platsbanken هو موقع الوظائف الرسمي.",
    usefulPhrases: [
      { sv: "Jag är nyligen arbetslös.", ar: "أنا حديث البطالة." },
      { sv: "Kan jag registrera mig som arbetssökande?", ar: "هل يمكنني التسجيل كباحث عن عمل؟" },
      { sv: "Vad är Platsbanken?", ar: "ما هو بنك الوظائف (Platsbanken)؟" },
      { sv: "Har ni kurser jag kan gå?", ar: "هل لديكم دورات يمكنني الالتحاق بها؟" },
      { sv: "Jag söker jobb inom IT.", ar: "أبحث عن وظيفة في مجال تكنولوجيا المعلومات." },
      { sv: "Hur ansöker jag om a-kassa?", ar: "كيف أتقدم للحصول على دعم العاطلين؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "نادر", speakerRole: "باحث عن عمل", textSv: "Hej, jag är nyligen arbetslös och vill registrera mig.", textAr: "مرحباً، أنا حديث البطالة وأريد التسجيل.", phonetic: "" },
      { speaker: "B", speakerName: "المستشار", speakerRole: "مستشار التوظيف", textSv: "Välkommen. Hur länge har du varit utan jobb?", textAr: "أهلاً. منذ متى أنت بدون عمل؟", phonetic: "" },
      { speaker: "A", speakerName: "نادر", speakerRole: "باحث عن عمل", textSv: "Sedan förra månaden. Mitt kontrakt gick ut.", textAr: "منذ الشهر الماضي. انتهى عقدي.", phonetic: "" },
      { speaker: "B", speakerName: "المستشار", speakerRole: "مستشار التوظيف", textSv: "Okej. Vad har du för utbildning och erfarenhet?", textAr: "حسناً. ما هو تعليمك وخبرتك؟", phonetic: "" },
      { speaker: "A", speakerName: "نادر", speakerRole: "باحث عن عمل", textSv: "Jag är ingenjör och har jobbat med projektledning i fem år.", textAr: "أنا مهندس وعملت في إدارة المشاريع لمدة خمس سنوات.", phonetic: "" },
      { speaker: "B", speakerName: "المستشار", speakerRole: "مستشار التوظيف", textSv: "Bra profil! Har du kollat Platsbanken? Det finns lediga tjänster inom ditt fält.", textAr: "ملف قوي! هل راجعت بنك الوظائف؟ هناك وظائف شاغرة في مجالك.", phonetic: "" },
      { speaker: "A", speakerName: "نادر", speakerRole: "باحث عن عمل", textSv: "Ja, men kan ni hjälpa mig att förbättra mitt CV?", textAr: "نعم، لكن هل يمكنكم مساعدتي في تحسين سيرتي الذاتية؟", phonetic: "" },
      { speaker: "B", speakerName: "المستشار", speakerRole: "مستشار التوظيف", textSv: "Absolut, vi erbjuder CV-workshops varje vecka. Behöver du a-kassa?", textAr: "بالتأكيد، نقدم ورشات للسيرة الذاتية كل أسبوع. هل تحتاج دعم العاطلين؟", phonetic: "" },
      { speaker: "A", speakerName: "نادر", speakerRole: "باحث عن عمل", textSv: "Ja, hur ansöker jag om det?", textAr: "نعم، كيف أتقدم للحصول عليه؟", phonetic: "" },
      { speaker: "B", speakerName: "المستشار", speakerRole: "مستشار التوظيف", textSv: "Du ansöker direkt hos ditt a-kassas förbund. Glöm inte aktivitetsrapporten varje månad.", textAr: "تتقدم مباشرةً إلى صندوق دعم العاطلين الخاص بنقابتك. لا تنسَ تقرير النشاط الشهري.", phonetic: "", noteAr: "تقرير النشاط الشهري إلزامي للحفاظ على الدعم المالي." },
    ],
    quiz: [
      { question: "ما معنى 'arbetslös'؟", options: ["باحث عن عمل فعّال", "عاطل عن العمل", "موظف مؤقت", "متقاعد"], correct: 1, explanation: "'arbetslös' تعني عاطل عن العمل." },
      { question: "ما هو 'a-kassa'؟", options: ["صندوق الادخار", "صندوق دعم العاطلين", "مكتب التوظيف", "ضريبة الدخل"], correct: 1, explanation: "'a-kassa' هو صندوق التأمين ضد البطالة الذي يدفع تعويضاً للعاطلين." },
      { question: "ما معنى 'Platsbanken'؟", options: ["بنك التدريب", "بنك الوظائف الرسمي", "مخزن التعليم", "سوق العمل التجاري"], correct: 1, explanation: "Platsbanken هو موقع الوظائف الرسمي التابع لـ Arbetsförmedlingen." },
      { question: "ما مجال عمل نادر في الحوار؟", options: ["تكنولوجيا المعلومات", "الطب", "إدارة المشاريع الهندسية", "التعليم"], correct: 2, explanation: "قال نادر 'Jag är ingenjör och har jobbat med projektledning'." },
      { question: "ما هو التزام العاطل عن العمل الشهري وفق الحوار؟", options: ["حضور ورشة عمل", "إرسال تقرير النشاط", "التقديم على عشر وظائف", "الاجتماع مع مستشار"], correct: 1, explanation: "قال المستشار 'Glöm inte aktivitetsrapporten varje månad'." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 34. اشتراك الهاتف والإنترنت
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Telefonabonnemang", titleAr: "اشتراك الهاتف والإنترنت", scenario: "phone",
    category: "يومي", difficulty: "intermediate", emoji: "📱",
    imageUrl: IMG.phone, durationMinutes: 10,
    vocabList: [
      { sv: "abonnemang", ar: "اشتراك", phonetic: "" },
      { sv: "datamängd", ar: "حجم البيانات", phonetic: "" },
      { sv: "samtal", ar: "مكالمات", phonetic: "" },
      { sv: "SMS", ar: "رسائل نصية", phonetic: "" },
      { sv: "bindningstid", ar: "مدة التعاقد الإلزامية", phonetic: "" },
      { sv: "bredband", ar: "الإنترنت عريض النطاق", phonetic: "" },
      { sv: "router", ar: "جهاز الراوتر", phonetic: "/ˈruːtːər/" },
      { sv: "SIM-kort", ar: "شريحة SIM", phonetic: "" },
      { sv: "mobiloperatören", ar: "مشغل الشبكة", phonetic: "" },
      { sv: "fakturan", ar: "الفاتورة", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن الحزمة: 'Vad ingår i'", explanation: "للسؤال عن محتوى حزمة الاشتراك", example: "Vad ingår i det här abonnemanget?", exampleAr: "ماذا يشمل هذا الاشتراك؟" },
      { title: "التعبير عن الرفض: 'Jag vill inte ha bindningstid'", explanation: "للتعبير عن رفض التعاقد لفترة ثابتة", example: "Jag vill inte ha bindningstid.", exampleAr: "لا أريد مدة تعاقد إلزامية." },
    ],
    culturalNotes: "السوق السويدية للاتصالات تنافسية جداً مع مشغلين رئيسيين مثل Telia وTelenor وTre وComviq. معظم الاشتراكات تتضمن بيانات لا محدودة. الإنترنت الثابت بسرعة عالية متاح في معظم أنحاء السويد. المقارنة بين العروض سهلة عبر مواقع المقارنة مثل Prisjakt.",
    usefulPhrases: [
      { sv: "Jag vill teckna ett abonnemang.", ar: "أريد الاشتراك في باقة." },
      { sv: "Hur mycket data ingår?", ar: "كم حجم البيانات المشمولة؟" },
      { sv: "Har ni ett abonnemang utan bindningstid?", ar: "هل لديكم اشتراك بدون مدة تعاقد ثابتة؟" },
      { sv: "Kan jag behålla mitt gamla nummer?", ar: "هل يمكنني الاحتفاظ برقمي القديم؟" },
      { sv: "Hur lång är leveranstiden för routern?", ar: "كم وقت التسليم للراوتر؟" },
      { sv: "Jag har problem med min faktura.", ar: "لدي مشكلة في فاتورتي." },
    ],
    lines: [
      { speaker: "A", speakerName: "إبراهيم", speakerRole: "زبون", textSv: "Hej! Jag vill teckna ett mobilabonnemang. Vad har ni för erbjudanden?", textAr: "مرحباً! أريد الاشتراك في باقة هاتف. ما هي عروضكم؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف المتجر", speakerRole: "موظف التوصيل", textSv: "Vi har tre nivåer. Vad är viktigast för dig – samtal, data eller pris?", textAr: "لدينا ثلاثة مستويات. ما الأهم لك - المكالمات، البيانات، أم السعر؟", phonetic: "" },
      { speaker: "A", speakerName: "إبراهيم", speakerRole: "زبون", textSv: "Framförallt data. Jag streamar mycket video.", textAr: "البيانات أساساً. أنا أبثّ الفيديو كثيراً.", phonetic: "" },
      { speaker: "B", speakerName: "موظف المتجر", speakerRole: "موظف التوصيل", textSv: "Då rekommenderar vi 'Obegränsad data' för 299 kronor i månaden.", textAr: "إذاً نوصي بباقة 'بيانات لا محدودة' بـ 299 كرونة شهرياً.", phonetic: "" },
      { speaker: "A", speakerName: "إبراهيم", speakerRole: "زبون", textSv: "Bra. Finns det bindningstid?", textAr: "جيد. هل هناك مدة تعاقد ثابتة؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف المتجر", speakerRole: "موظف التوصيل", textSv: "Du kan välja utan bindningstid, men med 12 månader får du 50 kronor rabatt.", textAr: "يمكنك الاختيار بدون مدة ثابتة، لكن بـ 12 شهراً تحصل على خصم 50 كرونة.", phonetic: "" },
      { speaker: "A", speakerName: "إبراهيم", speakerRole: "زبون", textSv: "Jag tar utan bindningstid. Kan jag behålla mitt gamla nummer?", textAr: "سآخذ بدون مدة ثابتة. هل يمكنني الاحتفاظ برقمي القديم؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف المتجر", speakerRole: "موظف التوصيل", textSv: "Absolut, det kallas nummerflytt och är kostnadsfritt.", textAr: "بالتأكيد، يُسمى ذلك نقل الرقم وهو مجاني.", phonetic: "" },
      { speaker: "A", speakerName: "إبراهيم", speakerRole: "زبون", textSv: "Perfekt. Får jag ett nytt SIM-kort?", textAr: "ممتاز. هل سأحصل على شريحة SIM جديدة؟", phonetic: "" },
      { speaker: "B", speakerName: "موظف المتجر", speakerRole: "موظف التوصيل", textSv: "Ja, direkt. Abonnemanget aktiveras inom 2 timmar. Välkommen som kund!", textAr: "نعم، فوراً. الاشتراك سيُفعَّل خلال ساعتين. أهلاً بك كزبون!", phonetic: "", noteAr: "'nummerflytt' = نقل الرقم من شبكة لأخرى دون تغييره." },
    ],
    quiz: [
      { question: "ما معنى 'abonnemang'؟", options: ["فاتورة", "اشتراك", "مكالمة", "رسالة نصية"], correct: 1, explanation: "'abonnemang' تعني الاشتراك في خدمة ما كالهاتف أو الإنترنت." },
      { question: "ما معنى 'bindningstid'؟", options: ["وقت الاستخدام", "حجم البيانات", "مدة التعاقد الإلزامية", "سرعة الإنترنت"], correct: 2, explanation: "'bindningstid' تعني الفترة الإلزامية في العقد التي لا يمكن الإلغاء خلالها." },
      { question: "ما معنى 'nummerflytt'؟", options: ["تغيير الرقم", "نقل الرقم للشبكة الجديدة", "حذف الرقم", "إيقاف الخدمة"], correct: 1, explanation: "'nummerflytt' تعني نقل الرقم القديم إلى الشبكة الجديدة دون تغييره." },
      { question: "كم كان سعر باقة البيانات اللامحدودة في الحوار؟", options: ["199 كرونة", "249 كرونة", "299 كرونة", "349 كرونة"], correct: 2, explanation: "قال الموظف '299 kronor i månaden'." },
      { question: "ما هي أهم احتياجات إبراهيم في الاشتراك؟", options: ["المكالمات المجانية", "البيانات للبث", "رسائل SMS مجانية", "تغطية دولية"], correct: 1, explanation: "قال إبراهيم 'Framförallt data. Jag streamar mycket video'." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 35. المكتبة العامة
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På biblioteket", titleAr: "في المكتبة العامة", scenario: "library",
    category: "تعليم", difficulty: "beginner", emoji: "📖",
    imageUrl: IMG.library, durationMinutes: 10,
    vocabList: [
      { sv: "biblioteket", ar: "المكتبة", phonetic: "/bɪˈbliːɔˌteːkːət/" },
      { sv: "låna en bok", ar: "استعارة كتاب", phonetic: "" },
      { sv: "lånekort", ar: "بطاقة المكتبة", phonetic: "" },
      { sv: "återlämna", ar: "إعادة الكتاب", phonetic: "" },
      { sv: "förfallodatum", ar: "تاريخ الإعادة", phonetic: "" },
      { sv: "reservera", ar: "يحجز كتاباً", phonetic: "" },
      { sv: "böter", ar: "غرامة التأخير", phonetic: "" },
      { sv: "läsesalen", ar: "قاعة القراءة", phonetic: "" },
      { sv: "e-böcker", ar: "كتب إلكترونية", phonetic: "" },
      { sv: "katalogen", ar: "الفهرس / قائمة الكتب", phonetic: "" },
    ],
    grammarTips: [
      { title: "طلب الاستعارة: 'Jag skulle vilja låna'", explanation: "صيغة مؤدبة لطلب استعارة كتاب", example: "Jag skulle vilja låna den här boken.", exampleAr: "أودّ استعارة هذا الكتاب." },
      { title: "السؤال عن الكتب: 'Har ni böcker om'", explanation: "للسؤال عن توفر كتب حول موضوع معين", example: "Har ni böcker om svensk historia?", exampleAr: "هل لديكم كتب عن التاريخ السويدي؟" },
    ],
    culturalNotes: "المكتبات العامة في السويد (folkbibliotek) مجانية ومفتوحة للجميع. يمكن استعارة الكتب والأفلام والموسيقى والصحف الرقمية. كثير من المكتبات تقدم خدمات باللغات المختلفة. مكتبات السويد تقدم أيضاً دورات تعليمية وأحداثاً ثقافية. يمكن استخدام المكتبة كمكان عمل هادئ.",
    usefulPhrases: [
      { sv: "Jag vill skaffa ett lånekort.", ar: "أريد الحصول على بطاقة مكتبة." },
      { sv: "Hur länge kan jag låna boken?", ar: "كم يمكنني استعارة الكتاب؟" },
      { sv: "Kan jag förnya lånet?", ar: "هل يمكنني تجديد الاستعارة؟" },
      { sv: "Var finns böcker på arabiska?", ar: "أين توجد الكتب باللغة العربية؟" },
      { sv: "Har ni tyst zon?", ar: "هل لديكم منطقة هادئة؟" },
      { sv: "Kan jag använda en dator här?", ar: "هل يمكنني استخدام حاسوب هنا؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "لطيفة", speakerRole: "زبونة", textSv: "Hej! Jag är ny i Sverige och vill skaffa ett lånekort.", textAr: "مرحباً! أنا جديدة في السويد وأريد الحصول على بطاقة مكتبة.", phonetic: "" },
      { speaker: "B", speakerName: "أمين المكتبة", speakerRole: "أمين المكتبة", textSv: "Välkommen! Det är enkelt – du behöver bara ett ID.", textAr: "أهلاً! إنه بسيط - تحتاجين فقط إلى بطاقة هوية.", phonetic: "" },
      { speaker: "A", speakerName: "لطيفة", speakerRole: "زبونة", textSv: "Bra! Hur länge kan jag låna en bok?", textAr: "جيد! كم أستطيع استعارة كتاب؟", phonetic: "" },
      { speaker: "B", speakerName: "أمين المكتبة", speakerRole: "أمين المكتبة", textSv: "Tre veckor, och du kan förnya online två gånger.", textAr: "ثلاثة أسابيع، ويمكنك التجديد عبر الإنترنت مرتين.", phonetic: "" },
      { speaker: "A", speakerName: "لطيفة", speakerRole: "زبونة", textSv: "Perfekt. Har ni böcker på arabiska?", textAr: "ممتاز. هل لديكم كتب باللغة العربية؟", phonetic: "" },
      { speaker: "B", speakerName: "أمين المكتبة", speakerRole: "أمين المكتبة", textSv: "Ja! Vi har ett bra urval. Du hittar dem i avdelning C.", textAr: "نعم! لدينا مجموعة جيدة. ستجدينها في قسم C.", phonetic: "" },
      { speaker: "A", speakerName: "لطيفة", speakerRole: "زبونة", textSv: "Tack! Har ni e-böcker också?", textAr: "شكراً! هل لديكم كتب إلكترونية أيضاً؟", phonetic: "" },
      { speaker: "B", speakerName: "أمين المكتبة", speakerRole: "أمين المكتبة", textSv: "Ja, med lånekort får du tillgång till Libby och Legimus.", textAr: "نعم، ببطاقة المكتبة تحصلين على وصول لـ Libby وLegimus.", phonetic: "" },
      { speaker: "A", speakerName: "لطيفة", speakerRole: "زبونة", textSv: "Är det tyst zon i den sidan?", textAr: "هل هناك منطقة هادئة في تلك الناحية؟", phonetic: "" },
      { speaker: "B", speakerName: "أمين المكتبة", speakerRole: "أمين المكتبة", textSv: "Ja, läsesalen på plan 2 är tyst zon. Välkommen tillbaka!", textAr: "نعم، قاعة القراءة في الطابق 2 منطقة هادئة. أهلاً بك مجدداً!", phonetic: "", noteAr: "المكتبات السويدية تقدم خدماتها مجاناً للجميع بما فيها الكتب الرقمية." },
    ],
    quiz: [
      { question: "ما معنى 'lånekort'؟", options: ["بطاقة هوية", "بطاقة ائتمان", "بطاقة المكتبة", "بطاقة عضوية"], correct: 2, explanation: "'lånekort' هي البطاقة التي تتيح استعارة الكتب من المكتبة." },
      { question: "كم أسبوعاً يمكن استعارة الكتاب وفق الحوار؟", options: ["أسبوع", "أسبوعان", "ثلاثة أسابيع", "شهر"], correct: 2, explanation: "قال أمين المكتبة 'Tre veckor'." },
      { question: "ما معنى 'böter' في سياق المكتبة؟", options: ["رسوم الاستعارة", "ثمن الكتاب", "غرامة التأخير", "اشتراك سنوي"], correct: 2, explanation: "'böter' تعني الغرامة المالية عند التأخر في إعادة الكتب." },
      { question: "ما هي منصة الكتب الإلكترونية المذكورة في الحوار؟", options: ["Kindle وAmazon", "Libby وLegimus", "Storytel وBookbeat", "Overdrive وScribd"], correct: 1, explanation: "قال أمين المكتبة 'Libby och Legimus' كمنصات رقمية مدعومة من المكتبة." },
      { question: "ماذا تحتاج للحصول على بطاقة المكتبة؟", options: ["عنوان السكن", "بطاقة هوية", "رقم شخصي", "دفع رسوم"], correct: 1, explanation: "قال الأمين 'du behöver bara ett ID' أي بطاقة هوية فقط." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 36. ورشة السيارات
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På bilverkstaden", titleAr: "في ورشة السيارات", scenario: "carrepair",
    category: "يومي", difficulty: "intermediate", emoji: "🔧",
    imageUrl: IMG.carrepair, durationMinutes: 12,
    vocabList: [
      { sv: "bilverkstaden", ar: "ورشة السيارات", phonetic: "" },
      { sv: "däcket", ar: "الإطار / الكفر", phonetic: "" },
      { sv: "bromsarna", ar: "الفرامل", phonetic: "" },
      { sv: "motoroljan", ar: "زيت المحرك", phonetic: "" },
      { sv: "batteriet", ar: "البطارية", phonetic: "" },
      { sv: "verkstaden", ar: "الورشة", phonetic: "" },
      { sv: "kontrollbesiktning", ar: "الفحص الدوري الإلزامي", phonetic: "" },
      { sv: "reservdelar", ar: "قطع الغيار", phonetic: "" },
      { sv: "kostnadsöversikt", ar: "تقدير التكاليف", phonetic: "" },
      { sv: "garantin", ar: "الضمان", phonetic: "" },
    ],
    grammarTips: [
      { title: "وصف المشكلة: 'Det låter konstigt när'", explanation: "للتعبير عن صوت غريب عند القيام بشيء", example: "Det låter konstigt när jag bromsar.", exampleAr: "يصدر صوتاً غريباً عندما أفرمل." },
      { title: "طلب التقدير: 'Kan ni ge mig en kostnadsöversikt'", explanation: "للسؤال عن تكلفة الإصلاح قبل البدء", example: "Kan ni ge mig en kostnadsöversikt?", exampleAr: "هل يمكنكم إعطائي تقديراً للتكاليف؟" },
    ],
    culturalNotes: "السيارة أساسية في السويد خاصة خارج المدن الكبرى. الفحص الدوري الإلزامي (kontrollbesiktning) يجب أن يُجرى كل 1-2 سنة حسب عمر السيارة. Bilprovningen هي الجهة الرسمية لفحص السيارات. التأمين الشامل (vagnskadeförsäkring) منتشر ويُوصى به.",
    usefulPhrases: [
      { sv: "Bilen startar inte.", ar: "السيارة لا تشتغل." },
      { sv: "Det låter konstigt.", ar: "يصدر صوتاً غريباً." },
      { sv: "Kan ni titta på bilen?", ar: "هل يمكنكم الاطلاع على السيارة؟" },
      { sv: "Hur lång tid tar reparationen?", ar: "كم يستغرق الإصلاح؟" },
      { sv: "Kan jag få en hyrbil under tiden?", ar: "هل يمكنني الحصول على سيارة بديلة في هذه الأثناء؟" },
      { sv: "Ger ni garanti på arbetet?", ar: "هل تقدمون ضماناً على العمل؟" },
    ],
    lines: [
      { speaker: "A", speakerName: "حسين", speakerRole: "صاحب السيارة", textSv: "Hej! Jag har problem med min bil. Det låter konstigt när jag bromsar.", textAr: "مرحباً! لدي مشكلة في سيارتي. يصدر صوتاً غريباً عندما أفرمل.", phonetic: "" },
      { speaker: "B", speakerName: "الميكانيكي", speakerRole: "الميكانيكي", textSv: "Det kan vara bromsarna. Hur länge sedan har det börjat?", textAr: "قد تكون الفرامل. منذ متى بدأ ذلك؟", phonetic: "" },
      { speaker: "A", speakerName: "حسين", speakerRole: "صاحب السيارة", textSv: "Sedan förra veckan. Och bilen drar åt höger.", textAr: "منذ الأسبوع الماضي. والسيارة تنجرف يميناً.", phonetic: "" },
      { speaker: "B", speakerName: "الميكانيكي", speakerRole: "الميكانيكي", textSv: "Vi tittar på det direkt. Kan du lämna bilen hos oss?", textAr: "سننظر في ذلك مباشرةً. هل يمكنك ترك السيارة عندنا؟", phonetic: "" },
      { speaker: "A", speakerName: "حسين", speakerRole: "صاحب السيارة", textSv: "Ja. Kan jag få en kostnadsöversikt innan ni börjar?", textAr: "نعم. هل يمكنني الحصول على تقدير للتكاليف قبل أن تبدأوا؟", phonetic: "" },
      { speaker: "B", speakerName: "الميكانيكي", speakerRole: "الميكانيكي", textSv: "Absolut, vi kollar och återkommer med en offert inom en timme.", textAr: "بالتأكيد، سنتحقق ونعود بعرض سعر خلال ساعة.", phonetic: "" },
      { speaker: "A", speakerName: "حسين", speakerRole: "صاحب السيارة", textSv: "Bra. Hur lång tid tar reparationen om det är bromsarna?", textAr: "جيد. كم يستغرق الإصلاح إذا كانت الفرامل؟", phonetic: "" },
      { speaker: "B", speakerName: "الميكانيكي", speakerRole: "الميكانيكي", textSv: "Ungefär tre till fyra timmar. Vi ger garanti på arbetet i ett år.", textAr: "حوالي ثلاث إلى أربع ساعات. نقدم ضماناً على العمل لمدة سنة.", phonetic: "" },
      { speaker: "A", speakerName: "حسين", speakerRole: "صاحب السيارة", textSv: "Perfekt. Erbjuder ni en lånebil?", textAr: "ممتاز. هل تقدمون سيارة بديلة؟", phonetic: "" },
      { speaker: "B", speakerName: "الميكانيكي", speakerRole: "الميكانيكي", textSv: "Ja, vi har en lånebil tillgänglig idag. Fyll i formuläret i receptionen.", textAr: "نعم، لدينا سيارة بديلة متاحة اليوم. املأ النموذج في الاستقبال.", phonetic: "", noteAr: "'lånebil' هي السيارة البديلة التي تُقدّم خلال فترة الإصلاح." },
    ],
    quiz: [
      { question: "ما معنى 'bromsarna'؟", options: ["المحرك", "الفرامل", "الإطارات", "الأضواء"], correct: 1, explanation: "'bromsarna' تعني الفرامل." },
      { question: "ما معنى 'kontrollbesiktning'؟", options: ["تأمين السيارة", "رخصة القيادة", "الفحص الدوري الإلزامي", "ضريبة السيارة"], correct: 2, explanation: "'kontrollbesiktning' هو الفحص الدوري الإلزامي للسيارات في السويد." },
      { question: "ما مشكلة سيارة حسين بجانب الصوت الغريب؟", options: ["لا تشتغل", "تنجرف يميناً", "البطارية ضعيفة", "الوقود ينتهي سريعاً"], correct: 1, explanation: "قال حسين 'bilen drar åt höger' أي السيارة تنجرف يميناً." },
      { question: "كم سنة ضمان على عمل الإصلاح وفق الحوار؟", options: ["6 أشهر", "سنة واحدة", "سنتان", "3 سنوات"], correct: 1, explanation: "قال الميكانيكي 'Vi ger garanti på arbetet i ett år'." },
      { question: "ما معنى 'reservdelar'؟", options: ["أدوات التصليح", "قطع الغيار", "الزيت والسوائل", "الأضواء الاحتياطية"], correct: 1, explanation: "'reservdelar' تعني قطع الغيار المستخدمة في الإصلاح." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 37. لقاء الأصدقاء في الحديقة
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "I parken med vänner", titleAr: "مع الأصدقاء في الحديقة", scenario: "park",
    category: "يومي", difficulty: "beginner", emoji: "🌳",
    imageUrl: IMG.park, durationMinutes: 8,
    vocabList: [
      { sv: "parken", ar: "الحديقة العامة", phonetic: "" },
      { sv: "picknick", ar: "نزهة / بيكنيك", phonetic: "" },
      { sv: "solsken", ar: "ضوء الشمس", phonetic: "" },
      { sv: "utomhus", ar: "في الهواء الطلق", phonetic: "" },
      { sv: "bänken", ar: "المقعد", phonetic: "" },
      { sv: "grilla", ar: "يشوي على المشواة", phonetic: "" },
      { sv: "bollspel", ar: "لعب الكرة", phonetic: "" },
      { sv: "frisbee", ar: "قرص بلاستيكي للرمي", phonetic: "" },
      { sv: "träffa kompisar", ar: "لقاء الأصدقاء", phonetic: "" },
      { sv: "ligga i gräset", ar: "الاستلقاء على العشب", phonetic: "" },
    ],
    grammarTips: [
      { title: "الدعوة: 'Ska vi inte...'", explanation: "طريقة غير رسمية لاقتراح نشاط بصيغة سؤال", example: "Ska vi inte grilla i parken idag?", exampleAr: "ألا نشوي في الحديقة اليوم؟" },
      { title: "التعبير عن الاستمتاع: 'Det är skönt'", explanation: "'skönt' تعني ممتعاً أو رائعاً في اللحظة الحالية", example: "Det är skönt att vara utomhus.", exampleAr: "من الرائع أن نكون في الهواء الطلق." },
    ],
    culturalNotes: "السويديون يحبون الطبيعة كثيراً ويقضون وقتاً طويلاً في الهواء الطلق خاصة في الصيف. مفهوم 'friluftsliv' (الحياة في الهواء الطلق) جوهري في الثقافة السويدية. الشواء في الحدائق العامة مسموح به في أماكن مخصصة. البيكنيك مع الأصدقاء في الصيف من أكثر الأنشطة الاجتماعية شعبيةً.",
    usefulPhrases: [
      { sv: "Vill du hänga med till parken?", ar: "هل تريد المجيء معي إلى الحديقة؟" },
      { sv: "Det är ett så fint väder!", ar: "الطقس رائع جداً!" },
      { sv: "Ska vi ha picknick?", ar: "هل نقوم بنزهة؟" },
      { sv: "Jag tar med mig mat.", ar: "سأحضر طعاماً." },
      { sv: "Har du en filt?", ar: "هل لديك بطانية؟" },
      { sv: "Vi ses vid fontänen!", ar: "نلتقي عند النافورة!" },
    ],
    lines: [
      { speaker: "A", speakerName: "ديما", speakerRole: "صديقة", textSv: "Hej Sara! Det är ju strålande sol idag!", textAr: "مرحباً سارة! الشمس رائعة اليوم!", phonetic: "" },
      { speaker: "B", speakerName: "سارة", speakerRole: "صديقة", textSv: "Ja, äntligen! Ska vi inte gå till Hagaparken och ha picknick?", textAr: "نعم، أخيراً! ألا نذهب إلى حديقة هاغا ونقوم بنزهة؟", phonetic: "" },
      { speaker: "A", speakerName: "ديما", speakerRole: "صديقة", textSv: "Jättebra idé! Jag tar med frukt och lite dricka.", textAr: "فكرة رائعة! سأحضر فاكهة وشيئاً للشرب.", phonetic: "" },
      { speaker: "B", speakerName: "سارة", speakerRole: "صديقة", textSv: "Perfekt. Jag tar filt och mackor. Ska vi fråga Nour också?", textAr: "ممتاز. سأحضر بطانية وسندويشات. هل ندعو نور أيضاً؟", phonetic: "" },
      { speaker: "A", speakerName: "ديما", speakerRole: "صديقة", textSv: "Ja självklart! Och Erik kanske också vill hänga med.", textAr: "نعم بالطبع! وربما يريد إيريك الانضمام أيضاً.", phonetic: "" },
      { speaker: "B", speakerName: "سارة", speakerRole: "صديقة", textSv: "Super! Vi tar med frisbee. Det är alltid kul att kasta lite.", textAr: "رائع! سنأخذ الفريسبي. إنه دائماً ممتع أن نرمي قليلاً.", phonetic: "" },
      { speaker: "A", speakerName: "ديما", speakerRole: "صديقة", textSv: "Och kanske grilla lite? Det finns grillplatser i parken.", textAr: "وربما نشوي قليلاً؟ هناك أماكن شواء في الحديقة.", phonetic: "" },
      { speaker: "B", speakerName: "سارة", speakerRole: "صديقة", textSv: "Ja! Jag köper kol på vägen. Vi ses vid fontänen klockan 13?", textAr: "نعم! سأشتري فحماً في الطريق. نلتقي عند النافورة الساعة الواحدة؟", phonetic: "" },
      { speaker: "A", speakerName: "ديما", speakerRole: "صديقة", textSv: "Perfekt. Det blir en riktigt mysig dag!", textAr: "ممتاز. ستكون يوماً دافئاً وجميلاً!", phonetic: "", noteAr: "'mysig dag' = يوم دافئ ومريح، من أكثر التعابير شعبيةً في السويدية." },
    ],
    quiz: [
      { question: "ما معنى 'picknick'؟", options: ["حفلة داخلية", "نزهة في الطبيعة مع طعام", "مباراة رياضية", "تجمع رسمي"], correct: 1, explanation: "'picknick' تعني نزهة في الطبيعة مع تناول الطعام." },
      { question: "ما معنى مفهوم 'friluftsliv'؟", options: ["الرياضة الداخلية", "الحياة في الهواء الطلق", "السياحة الخارجية", "العيش في المزرعة"], correct: 1, explanation: "'friluftsliv' مفهوم سويدي جوهري يعني الحياة في الهواء الطلق والتواصل مع الطبيعة." },
      { question: "أين تقرر ديما وسارة الاجتماع في الحوار؟", options: ["عند المدخل الرئيسي", "عند النافورة", "تحت الشجرة الكبيرة", "عند الملعب"], correct: 1, explanation: "قالت سارة 'Vi ses vid fontänen' أي عند النافورة." },
      { question: "ما الذي وافقت ديما على إحضاره؟", options: ["بطانية وسندويشات", "فحم للشواء", "فاكهة وشراب", "فريسبي وألعاب"], correct: 2, explanation: "قالت ديما 'Jag tar med frukt och lite dricka'." },
      { question: "ما معنى 'ligga i gräset'؟", options: ["اللعب على العشب", "الاستلقاء على العشب", "قطع العشب", "السير على العشب"], correct: 1, explanation: "'ligga' تعني يستلقي و'gräset' تعني العشب." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 38. حفلة عيد الميلاد
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "På kalas", titleAr: "في حفلة عيد الميلاد", scenario: "party",
    category: "يومي", difficulty: "beginner", emoji: "🎂",
    imageUrl: IMG.party, durationMinutes: 10,
    vocabList: [
      { sv: "kalas", ar: "حفلة عيد ميلاد / احتفال", phonetic: "" },
      { sv: "tårta", ar: "كعكة عيد الميلاد", phonetic: "" },
      { sv: "grattis", ar: "مبروك / تهانينا", phonetic: "" },
      { sv: "present", ar: "هدية", phonetic: "/prɛˈsɛnt/" },
      { sv: "ballong", ar: "بالون", phonetic: "" },
      { sv: "önskning", ar: "أمنية", phonetic: "" },
      { sv: "bjuda på", ar: "يكرم / يعزم على", phonetic: "" },
      { sv: "sång", ar: "أغنية", phonetic: "" },
      { sv: "på fötterna", ar: "التهاني الشفهية القائمة", phonetic: "" },
      { sv: "firandet", ar: "الاحتفال", phonetic: "" },
    ],
    grammarTips: [
      { title: "تقديم التهاني: 'Grattis på'", explanation: "'Grattis' = مبروك وتُستخدم مع مناسبات كثيرة", example: "Grattis på födelsedagen!", exampleAr: "كل عام وأنت بخير! (مبروك في عيد الميلاد)" },
      { title: "تقديم هدية: 'Det här är till dig'", explanation: "طريقة بسيطة لتقديم هدية", example: "Det här är till dig – hoppas du gillar det!", exampleAr: "هذا لك - أتمنى أن يعجبك!" },
    ],
    culturalNotes: "احتفالات أعياد الميلاد في السويد لها تقاليد خاصة. أغنية 'Ja, må han/hon leva' هي أغنية تهنئة عيد الميلاد السويدية التقليدية. الحفلات عادةً احتفالية وغير رسمية. تقديم الهدية علناً أمام الجميع شائع. الكعكة مهمة جداً وعادةً يطفئ صاحب الميلاد الشموع.",
    usefulPhrases: [
      { sv: "Grattis på födelsedagen!", ar: "كل عام وأنت بخير!" },
      { sv: "Hur gammal fyller du?", ar: "كم عمرك هذا العام؟" },
      { sv: "Vad önskar du dig?", ar: "ماذا تتمنى كهدية؟" },
      { sv: "Det här är till dig.", ar: "هذا لك." },
      { sv: "Ska vi sjunga Ja, må han leva?", ar: "هل نغني أغنية عيد الميلاد؟" },
      { sv: "Blåser ut ljusen!", ar: "أطفئ الشموع!" },
    ],
    lines: [
      { speaker: "A", speakerName: "ليندة", speakerRole: "ضيفة", textSv: "Grattis på födelsedagen, Johan! Hur gammal fyller du idag?", textAr: "كل عام وأنت بخير يوهان! كم عمرك اليوم؟", phonetic: "" },
      { speaker: "B", speakerName: "يوهان", speakerRole: "صاحب الحفلة", textSv: "Tack! Jag fyller 30 år idag – det är stort!", textAr: "شكراً! أكمل اليوم 30 عاماً - هذا شيء كبير!", phonetic: "" },
      { speaker: "A", speakerName: "ليندة", speakerRole: "ضيفة", textSv: "Det är verkligen det! Det här är till dig.", textAr: "بالفعل كذلك! هذا لك.", phonetic: "" },
      { speaker: "B", speakerName: "يوهان", speakerRole: "صاحب الحفلة", textSv: "Oj, tack så jättemycket! Ska jag öppna det nu?", textAr: "يا إلهي، شكراً جزيلاً جداً! هل أفتحه الآن؟", phonetic: "" },
      { speaker: "A", speakerName: "ليندة", speakerRole: "ضيفة", textSv: "Ja, öppna nu! Vi vill se!", textAr: "نعم، افتح الآن! نريد أن نرى!", phonetic: "" },
      { speaker: "B", speakerName: "يوهان", speakerRole: "صاحب الحفلة", textSv: "Wow, en kokkbok! Jag har velat ha den här! Tack så mycket!", textAr: "واو، كتاب طبخ! كنت أريد هذا! شكراً جداً!", phonetic: "" },
      { speaker: "A", speakerName: "ليندة", speakerRole: "ضيفة", textSv: "Ska vi sjunga Ja, må han leva nu?", textAr: "هل نغني أغنية عيد الميلاد السويدية الآن؟", phonetic: "" },
      { speaker: "B", speakerName: "يوهان", speakerRole: "صاحب الحفلة", textSv: "Ja! Men blås ut ljusen på tårtan först!", textAr: "نعم! لكن أطفئ الشموع على الكعكة أولاً!", phonetic: "" },
      { speaker: "A", speakerName: "ليندة", speakerRole: "ضيفة", textSv: "Okej, alla sjunger! Ja, må han leva! Ja, må han leva!", textAr: "حسناً، الجميع يغني! مبروك! مبروك!", phonetic: "" },
      { speaker: "B", speakerName: "يوهان", speakerRole: "صاحب الحفلة", textSv: "Tack allihopa! Ni är bäst! Nu äter vi tårta!", textAr: "شكراً للجميع! أنتم الأفضل! الآن نأكل الكعكة!", phonetic: "", noteAr: "'Ni är bäst' = أنتم الأفضل. تعبير حماسي شائع في السويد." },
    ],
    quiz: [
      { question: "ما معنى 'grattis'؟", options: ["وداعاً", "مبروك / تهانينا", "آسف", "شكراً"], correct: 1, explanation: "'grattis' تعني مبروك أو تهانينا." },
      { question: "ما هو الاسم الكامل لأغنية عيد الميلاد السويدية؟", options: ["Happy Birthday to You", "Ja, må han leva", "Grattis på dagen", "Fira med oss"], correct: 1, explanation: "'Ja, må han/hon leva' هي أغنية عيد الميلاد التقليدية السويدية." },
      { question: "كم عاماً يحتفل يوهان في الحوار؟", options: ["25", "28", "30", "35"], correct: 2, explanation: "قال يوهان 'Jag fyller 30 år idag'." },
      { question: "ما الهدية التي أحضرتها ليندة ليوهان؟", options: ["قميص", "كتاب طبخ", "ساعة", "لعبة"], correct: 1, explanation: "قال يوهان 'en kokbok! Jag har velat ha den här!'." },
      { question: "ما معنى 'blåsa ut ljusen'؟", options: ["إضاءة الشموع", "إطفاء الشموع", "تقطيع الكعكة", "توزيع الهدايا"], correct: 1, explanation: "'blåsa ut' تعني ينفخ ليطفئ، و'ljusen' تعني الشموع." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 39. محطة إعادة التدوير
  // ══════════════════════════════════════════════════════════════════════════
  {
    title: "Vid återvinningsstationen", titleAr: "في محطة إعادة التدوير", scenario: "recycling",
    category: "يومي", difficulty: "beginner", emoji: "♻️",
    imageUrl: IMG.recycling, durationMinutes: 8,
    vocabList: [
      { sv: "återvinning", ar: "إعادة التدوير", phonetic: "" },
      { sv: "sopsortering", ar: "فرز النفايات", phonetic: "" },
      { sv: "papperskorgen", ar: "سلة المهملات", phonetic: "" },
      { sv: "glas", ar: "زجاج", phonetic: "" },
      { sv: "plast", ar: "بلاستيك", phonetic: "" },
      { sv: "metall", ar: "معدن", phonetic: "" },
      { sv: "matavfall", ar: "نفايات غذائية", phonetic: "" },
      { sv: "pant", ar: "مبلغ مستردّ عند إعادة الزجاجة", phonetic: "" },
      { sv: "miljövänligt", ar: "صديق للبيئة", phonetic: "" },
      { sv: "komposter", ar: "سماد عضوي / كومبوست", phonetic: "" },
    ],
    grammarTips: [
      { title: "السؤال عن التصنيف: 'Var ska jag lägga'", explanation: "للسؤال عن أين يُرمى نوع معين من النفايات", example: "Var ska jag lägga glasflaskor?", exampleAr: "أين أضع الزجاجات الزجاجية؟" },
      { title: "التعبير عن الاستدامة: 'Det är viktigt att'", explanation: "يُستخدم للتعبير عن أهمية شيء ما", example: "Det är viktigt att sortera soporna.", exampleAr: "من المهم فرز النفايات." },
    ],
    culturalNotes: "إعادة التدوير ثقافة أساسية في السويد. السويد من أعلى دول العالم في معدلات إعادة التدوير. نظام 'pant' يُشجّع على إعادة العلب والزجاجات مقابل مبالغ مالية صغيرة. كل بلدية لديها محطات إعادة تدوير (återvinningscentralen). فرز النفايات إلزامي بموجب القانون في كثير من البلديات.",
    usefulPhrases: [
      { sv: "Var slänger jag glas?", ar: "أين أرمي الزجاج؟" },
      { sv: "Hur sorterar jag soporna?", ar: "كيف أفرز النفايات؟" },
      { sv: "Kan jag panta den här flaskan?", ar: "هل يمكنني إعادة هذه الزجاجة مقابل المبلغ؟" },
      { sv: "Var är närmaste återvinningsstation?", ar: "أين أقرب محطة إعادة تدوير؟" },
      { sv: "Det här är miljövänligt.", ar: "هذا صديق للبيئة." },
      { sv: "Jag försöker minska mitt avfall.", ar: "أحاول تقليل نفاياتي." },
    ],
    lines: [
      { speaker: "A", speakerName: "أمل", speakerRole: "مقيمة جديدة", textSv: "Ursäkta! Jag är ny här och förstår inte sopsorteringen.", textAr: "عفواً! أنا جديدة هنا ولا أفهم كيفية فرز النفايات.", phonetic: "" },
      { speaker: "B", speakerName: "الجار", speakerRole: "جار متمرس", textSv: "Inga problem, jag hjälper dig! Sverige sorterar i flera fraktioner.", textAr: "لا مشكلة، سأساعدك! السويد تفرز في فئات عديدة.", phonetic: "" },
      { speaker: "A", speakerName: "أمل", speakerRole: "مقيمة جديدة", textSv: "Var ska jag lägga glasflaskorna?", textAr: "أين أضع الزجاجات الزجاجية؟", phonetic: "" },
      { speaker: "B", speakerName: "الجار", speakerRole: "جار متمرس", textSv: "Glasflaskor i den gröna behållaren. Men om de är pantade, ta dem till affären!", textAr: "الزجاجات في الحاوية الخضراء. لكن إذا كان لها مبلغ مستردّ، خذها للمتجر!", phonetic: "" },
      { speaker: "A", speakerName: "أمل", speakerRole: "مقيمة جديدة", textSv: "Ah, det är pant på dem? Hur vet jag det?", textAr: "آه، لها مبلغ مستردّ؟ كيف أعرف ذلك؟", phonetic: "" },
      { speaker: "B", speakerName: "الجار", speakerRole: "جار متمرس", textSv: "Om det finns en liten pant-symbol på flaskan. Och matavfall?", textAr: "إذا كان هناك رمز 'pant' صغير على الزجاجة. وماذا عن نفايات الطعام؟", phonetic: "" },
      { speaker: "A", speakerName: "أمل", speakerRole: "مقيمة جديدة", textSv: "Matavfall... i den bruna påsen?", textAr: "نفايات الطعام... في الكيس البني؟", phonetic: "" },
      { speaker: "B", speakerName: "الجار", speakerRole: "جار متمرس", textSv: "Exakt! Du lär dig snabbt! Plast i den gula, metall i den blå.", textAr: "بالضبط! أنتِ تتعلمين بسرعة! البلاستيك في الأصفر، المعدن في الأزرق.", phonetic: "" },
      { speaker: "A", speakerName: "أمل", speakerRole: "مقيمة جديدة", textSv: "Tack så mycket! Är sopsortering vanligt i Sverige?", textAr: "شكراً جزيلاً! هل فرز النفايات شائع في السويد؟", phonetic: "" },
      { speaker: "B", speakerName: "الجار", speakerRole: "جار متمرس", textSv: "Ja, det är obligatoriskt och jätteviktigt! Sverige är ett av världens mest miljövänliga länder.", textAr: "نعم، إنه إلزامي ومهم جداً! السويد من أكثر دول العالم صداقةً للبيئة.", phonetic: "", noteAr: "السويد تعيد تدوير أكثر من 99% من نفاياتها المنزلية بطريقة أو بأخرى." },
    ],
    quiz: [
      { question: "ما معنى 'återvinning'؟", options: ["جمع النفايات", "إعادة التدوير", "حرق النفايات", "دفن النفايات"], correct: 1, explanation: "'återvinning' تعني إعادة التدوير." },
      { question: "ما معنى 'pant' في السياق السويدي؟", options: ["غرامة رمي النفايات", "مبلغ مستردّ عند إعادة الزجاجة", "ضريبة البيئة", "رسوم جمع النفايات"], correct: 1, explanation: "'pant' هو المبلغ الصغير الذي تستردّه عند إعادة العلب أو الزجاجات للمتجر." },
      { question: "أي حاوية تُرمى فيها نفايات الطعام وفق الحوار؟", options: ["الخضراء", "الصفراء", "البنية", "الزرقاء"], correct: 2, explanation: "قالت أمل 'في الكيس البني' وصادق الجار على ذلك." },
      { question: "أي حاوية يُرمى فيها البلاستيك؟", options: ["الخضراء", "الصفراء", "البنية", "الزرقاء"], correct: 1, explanation: "قال الجار 'Plast i den gula' أي البلاستيك في الحاوية الصفراء." },
      { question: "ما معنى 'miljövänligt'؟", options: ["مضرّ بالبيئة", "محايد بيئياً", "صديق للبيئة", "قابل للإعادة"], correct: 2, explanation: "'miljövänligt' تعني صديق للبيئة (eco-friendly)." },
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
