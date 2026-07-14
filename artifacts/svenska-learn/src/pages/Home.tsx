import React from "react";
import { Link } from "wouter";
import { 
  Flame, 
  BookOpen, 
  Star, 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle2,
  ChevronLeft,
  Headphones,
  Mic,
  AlignLeft,
  MessageSquare,
  Gamepad2,
  ClipboardCheck,
  Languages,
  AudioLines,
  Users2,
  UserCircle2,
  Volume2
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  useGetUserProgress, 
  useGetRecentLesson, 
  useGetNewWords, 
  useGetStats, 
  useGetDailyChallenges, 
  useCompleteChallenge 
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { speak } from "@/lib/speech";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const { data: userProgress, isLoading: isLoadingProgress } = useGetUserProgress();
  const { data: recentLesson, isLoading: isLoadingLesson } = useGetRecentLesson();
  const { data: newWords, isLoading: isLoadingWords } = useGetNewWords();
  const { data: stats, isLoading: isLoadingStats } = useGetStats();
  const { data: challenges, isLoading: isLoadingChallenges } = useGetDailyChallenges();
  const completeChallenge = useCompleteChallenge();

  const handleChallengeComplete = (id: number, isCompleted: boolean) => {
    if (isCompleted || completeChallenge.isPending) return;
    completeChallenge.mutate({ id });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ساعة و ${mins} دقيقة` : `${hours} ساعة`;
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'vocabulary': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'listening': return <Headphones className="w-5 h-5 text-purple-500" />;
      case 'speaking': return <Mic className="w-5 h-5 text-green-500" />;
      case 'reading': return <BookOpen className="w-5 h-5 text-orange-500" />;
      case 'grammar': return <AlignLeft className="w-5 h-5 text-indigo-500" />;
      default: return <Target className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24 md:py-8 md:px-4 flex flex-col">
      <motion.div 
        className="flex flex-col gap-8 w-full px-4 md:px-0"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header & User Level */}
        <motion.header variants={itemVariants} className="pt-8 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">أهلاً، مرحباً بك!</h1>
            {isLoadingProgress ? (
              <Skeleton className="h-4 w-32 mt-2" />
            ) : (
              <p className="text-muted-foreground text-sm font-medium">
                {userProgress?.levelName} • المستوى {userProgress?.level}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 bg-accent/20 px-3 py-1.5 rounded-full border border-accent/30">
            <Star className="w-4 h-4 text-accent fill-accent" />
            {isLoadingProgress ? (
              <Skeleton className="h-4 w-12" />
            ) : (
              <span className="font-semibold text-accent-foreground text-sm">
                {userProgress?.xpPoints} XP
              </span>
            )}
          </div>
        </motion.header>

        {/* Progress & Streak Banner */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-card-border shadow-sm rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary" />
            <Target className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-sm text-muted-foreground font-medium mb-1">نسبة الإنجاز</h3>
            {isLoadingProgress ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-foreground">
                {userProgress?.completionPercentage}%
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-900/20 border border-orange-200 dark:border-orange-900/50 shadow-sm rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <Flame className="w-8 h-8 text-orange-500 fill-orange-500 mb-2 drop-shadow-sm" />
            <h3 className="text-sm text-orange-900/70 dark:text-orange-200/70 font-medium mb-1">أيام متتالية</h3>
            {isLoadingProgress ? (
              <Skeleton className="h-8 w-16 bg-orange-200" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {userProgress?.streakDays} <span className="text-lg">أيام</span>
                </div>
                <span className="text-[10px] font-medium text-orange-800/60 dark:text-orange-300/60 mt-1">
                  إجمالي: {userProgress?.totalDaysLearned} يوم
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Last Lesson */}
        <motion.section variants={itemVariants} className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            آخر درس
          </h2>
          {isLoadingLesson ? (
            <Skeleton className="h-32 w-full rounded-2xl" />
          ) : recentLesson ? (
            <div className="bg-card border border-card-border shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                      {recentLesson.category}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md uppercase tracking-wider">
                      {recentLesson.difficulty === 'beginner' ? 'مبتدئ' : 
                       recentLesson.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-1">{recentLesson.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5" dir="ltr">{recentLesson.titleSv}</p>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-full border-4 border-muted flex items-center justify-center relative">
                  <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                    <circle cx="20" cy="20" r="18" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-muted" />
                    <circle 
                      cx="20" cy="20" r="18" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      className="text-primary transition-all duration-1000 ease-out" 
                      strokeDasharray={18 * 2 * Math.PI} 
                      strokeDashoffset={18 * 2 * Math.PI - (recentLesson.completionPercentage / 100) * (18 * 2 * Math.PI)}
                    />
                  </svg>
                </div>
              </div>
              <Link href={recentLesson ? `/lessons/${recentLesson.id}` : "/lessons"} className="w-full">
                <Button className="w-full gap-2 group font-medium" size="lg">
                  متابعة التعلم
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-card-border rounded-2xl p-5 text-center text-muted-foreground">
              لا يوجد دروس سابقة. ابدأ رحلتك الآن!
            </div>
          )}
        </motion.section>

        {/* New Words Carousel */}
        <motion.section variants={itemVariants} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-accent fill-accent" />
              الكلمات الجديدة
            </h2>
          </div>
          
          <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
            <div className="flex gap-4 w-max">
              {isLoadingWords ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-48 rounded-xl shrink-0" />
                ))
              ) : newWords && newWords.length > 0 ? (
                newWords.map((word) => (
                  <div key={word.id} className="bg-card border border-card-border shadow-sm rounded-xl p-4 w-48 shrink-0 flex flex-col justify-center relative overflow-hidden group hover:border-primary/50 transition-colors">
                    {word.isNew && (
                      <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                        جديد
                      </div>
                    )}
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded w-max mb-2">
                      {word.category}
                    </span>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold text-foreground block" dir="ltr">{word.word}</span>
                      <button
                        onClick={() => speak(word.word, { lang: "sv-SE" })}
                        className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors shrink-0"
                        aria-label="استمع"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground mb-3 font-mono" dir="ltr">/{word.phonetic}/</span>
                    <span className="text-sm font-medium text-foreground/80">{word.translation}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-xl w-full text-center">
                  لم تتعلم كلمات جديدة بعد.
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Quick Access */}
        <motion.section variants={itemVariants} className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            استكشف
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { href: "/pronunciation", label: "النطق", icon: AudioLines, color: "text-purple-500" },
              { href: "/games", label: "الألعاب", icon: Gamepad2, color: "text-emerald-500" },
              { href: "/exams", label: "الاختبارات", icon: ClipboardCheck, color: "text-orange-500" },
              { href: "/translator", label: "المترجم الفوري", icon: Languages, color: "text-blue-500" },
              { href: "/community", label: "المجتمع", icon: Users2, color: "text-pink-500" },
              { href: "/profile", label: "ملفي", icon: UserCircle2, color: "text-slate-500" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-card border border-card-border shadow-sm rounded-xl p-4 flex items-center gap-3 hover:border-primary/40 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section variants={itemVariants} className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            الإحصائيات
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {isLoadingStats ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            ) : (
              <>
                <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <BookOpen className="w-5 h-5 text-blue-500 mb-1" />
                  <span className="text-2xl font-bold">{stats?.lessonsCompleted}</span>
                  <span className="text-xs text-muted-foreground font-medium">دروس مكتملة</span>
                </div>
                <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <MessageSquare className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="text-2xl font-bold">{stats?.wordsLearned}</span>
                  <span className="text-xs text-muted-foreground font-medium">كلمات مكتسبة</span>
                </div>
                <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <Clock className="w-5 h-5 text-purple-500 mb-1" />
                  <span className="text-2xl font-bold">{stats?.minutesThisWeek} <span className="text-sm font-normal text-muted-foreground">/ {stats?.weeklyGoalMinutes} د</span></span>
                  <div className="w-full bg-secondary h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${stats?.weeklyProgress}%` }} />
                  </div>
                </div>
                <div className="bg-card border border-card-border rounded-xl p-4 shadow-sm flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <Target className="w-5 h-5 text-orange-500 mb-1" />
                  <span className="text-2xl font-bold">{stats?.accuracy}%</span>
                  <span className="text-xs text-muted-foreground font-medium">دقة الإجابات</span>
                </div>
              </>
            )}
          </div>
        </motion.section>

        {/* Daily Challenges */}
        <motion.section variants={itemVariants} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              تحديات اليوم
            </h2>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
              يتجدد يومياً
            </span>
          </div>
          
          <div className="flex flex-col gap-3">
            {isLoadingChallenges ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
            ) : challenges && challenges.length > 0 ? (
              challenges.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => handleChallengeComplete(challenge.id, challenge.isCompleted)}
                  disabled={challenge.isCompleted || completeChallenge.isPending}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-right transition-all
                    ${challenge.isCompleted 
                      ? 'bg-muted/50 border-muted opacity-60 cursor-default' 
                      : 'bg-card border-card-border shadow-sm hover:border-primary/40 active:scale-[0.98]'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                      ${challenge.isCompleted ? 'bg-muted' : 'bg-secondary'}`}>
                      {challenge.isCompleted ? <CheckCircle2 className="w-5 h-5 text-muted-foreground" /> : getChallengeIcon(challenge.type)}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-bold text-sm ${challenge.isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {challenge.title}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {challenge.description}
                      </span>
                    </div>
                  </div>
                  {!challenge.isCompleted && (
                    <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-md shrink-0">
                      <span className="text-xs font-bold text-accent-foreground">+{challenge.xpReward}</span>
                      <Star className="w-3 h-3 text-accent fill-accent" />
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center p-6 bg-muted/30 rounded-xl text-sm text-muted-foreground">
                لا توجد تحديات متاحة اليوم.
              </div>
            )}
          </div>
        </motion.section>
      </motion.div>

      {/* Floating CTA for Mobile */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-[64px] left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t border-border z-10 md:static md:bg-transparent md:backdrop-blur-none md:border-t-0 md:mt-8 md:p-0"
      >
        <div className="max-w-2xl mx-auto w-full flex items-center gap-4">
          {isLoadingProgress ? (
            <Skeleton className="h-14 w-full rounded-xl" />
          ) : (
            <div className="w-full">
              <div className="text-xs text-center text-muted-foreground mb-2 md:mb-3 font-medium flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                تعلمت لمدة {formatDuration(userProgress?.totalMinutesLearned || 0)} حتى الآن
              </div>
              <Link href="/lessons" className="w-full">
                <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all bg-gradient-to-r from-primary to-blue-600 border-0">
                  ابدأ التعلم الآن
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Spacer for mobile bottom fixed button */}
      <div className="h-32 md:hidden" />
    </div>
  );
}
