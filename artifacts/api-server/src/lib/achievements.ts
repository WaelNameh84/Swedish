export type AchievementInput = {
  lessonsCompleted: number;
  wordsLearned: number;
  streakDays: number;
  examTotalAttempts: number;
  examAvgPercentage: number;
  certifiedLevelsCount: number;
  pronunciationAvgScore: number;
  pronunciationTotalAttempts: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
};

export function computeAchievements(input: AchievementInput): Achievement[] {
  const list: Achievement[] = [
    {
      id: "first_lesson",
      title: "أول خطوة",
      description: "أكمل أول درس لك",
      icon: "footprints",
      unlocked: input.lessonsCompleted >= 1,
      progress: Math.min(input.lessonsCompleted, 1),
      target: 1,
    },
    {
      id: "week_streak",
      title: "أسبوع بلا توقف",
      description: "حافظ على سلسلة تعلم 7 أيام متتالية",
      icon: "flame",
      unlocked: input.streakDays >= 7,
      progress: Math.min(input.streakDays, 7),
      target: 7,
    },
    {
      id: "month_streak",
      title: "شهر كامل من الالتزام",
      description: "حافظ على سلسلة تعلم 30 يوماً متتالياً",
      icon: "flame",
      unlocked: input.streakDays >= 30,
      progress: Math.min(input.streakDays, 30),
      target: 30,
    },
    {
      id: "words_50",
      title: "جامع الكلمات",
      description: "تعلّم 50 كلمة سويدية",
      icon: "book-marked",
      unlocked: input.wordsLearned >= 50,
      progress: Math.min(input.wordsLearned, 50),
      target: 50,
    },
    {
      id: "words_200",
      title: "خزانة مفردات ضخمة",
      description: "تعلّم 200 كلمة سويدية",
      icon: "library",
      unlocked: input.wordsLearned >= 200,
      progress: Math.min(input.wordsLearned, 200),
      target: 200,
    },
    {
      id: "exams_10",
      title: "عاشق الاختبارات",
      description: "أكمل 10 محاولات اختبار",
      icon: "clipboard-check",
      unlocked: input.examTotalAttempts >= 10,
      progress: Math.min(input.examTotalAttempts, 10),
      target: 10,
    },
    {
      id: "exam_accuracy_90",
      title: "نجم الدقة",
      description: "حافظ على متوسط نتائج اختبارات 90% فأعلى",
      icon: "target",
      unlocked: input.examTotalAttempts > 0 && input.examAvgPercentage >= 90,
      progress: input.examTotalAttempts > 0 ? Math.min(input.examAvgPercentage, 90) : 0,
      target: 90,
    },
    {
      id: "level_certified_1",
      title: "بطل المستوى",
      description: "احصل على أول شهادة مستوى",
      icon: "award",
      unlocked: input.certifiedLevelsCount >= 1,
      progress: Math.min(input.certifiedLevelsCount, 1),
      target: 1,
    },
    {
      id: "level_certified_3",
      title: "متعدد المستويات",
      description: "احصل على شهادات في 3 مستويات مختلفة",
      icon: "award",
      unlocked: input.certifiedLevelsCount >= 3,
      progress: Math.min(input.certifiedLevelsCount, 3),
      target: 3,
    },
    {
      id: "pronunciation_80",
      title: "الناطق الفصيح",
      description: "حافظ على متوسط تقييم نطق 80% فأعلى (5 محاولات على الأقل)",
      icon: "badge-check",
      unlocked: input.pronunciationTotalAttempts >= 5 && input.pronunciationAvgScore >= 80,
      progress: input.pronunciationTotalAttempts >= 5 ? Math.min(input.pronunciationAvgScore, 80) : 0,
      target: 80,
    },
  ];
  return list;
}
