import { useEffect, useState } from "react";
import { Share2, Copy, Check, Trophy, Award, Flame } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface ProfileData {
  displayName: string;
  level: number;
  levelName: string;
  xpPoints: number;
  streakDays: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  certifiedLevels: Record<string, unknown>;
}

export default function ShareAchievementsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/user/profile`).then((r) => r.json()).then(setProfile).catch(() => {});
    fetch(`${BASE}/api/achievements`)
      .then((r) => r.json())
      .then((d) => setAchievements(d.achievements))
      .catch(() => {});
  }, []);

  const unlocked = achievements?.filter((a) => a.unlocked) ?? [];
  const certLevels = profile ? Object.keys(profile.certifiedLevels) : [];

  const shareText = profile
    ? `🇸🇪 تقدّمي في تعلم السويدية على Svenska:\n` +
      `المستوى ${profile.level} (${profile.levelName}) — ${profile.xpPoints} نقطة خبرة\n` +
      `🔥 سلسلة ${profile.streakDays} يوماً متتالية\n` +
      `🏅 ${profile.achievementsUnlocked}/${profile.achievementsTotal} إنجاز مفتوح` +
      (certLevels.length > 0 ? `\n📜 شهادات: ${certLevels.join(", ")}` : "")
    : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: "إنجازاتي في تعلم السويدية" });
        setShared(true);
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="مشاركة الإنجازات" subtitle="من بياناتك الحقيقية" backHref="/community" />
      <div className="p-4 flex flex-col gap-4">
        {!profile ? (
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
        ) : (
          <>
            <div className="bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">{profile.displayName}</span>
                <span className="text-[11px] font-semibold text-primary bg-primary/15 px-2 py-1 rounded-full">
                  المستوى {profile.level} • {profile.levelName}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-black text-foreground">{profile.xpPoints}</span>
                  <span className="text-[10px] text-muted-foreground">نقطة خبرة</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-black text-foreground">{profile.streakDays}</span>
                  <span className="text-[10px] text-muted-foreground">يوم متتالي</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-black text-foreground">
                    {profile.achievementsUnlocked}/{profile.achievementsTotal}
                  </span>
                  <span className="text-[10px] text-muted-foreground">إنجاز</span>
                </div>
              </div>
              {unlocked.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {unlocked.slice(0, 5).map((a) => (
                    <span key={a.id} className="text-[10px] bg-card border border-card-border px-2 py-1 rounded-full text-foreground">
                      🏅 {a.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                <Share2 className="w-4 h-4" /> {shared ? "تمت المشاركة" : "مشاركة"}
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-foreground text-sm font-semibold"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "تم النسخ" : "نسخ النص"}
              </button>
            </div>

            <div className="bg-muted/40 border border-border rounded-xl p-3 text-[11px] text-muted-foreground whitespace-pre-line leading-relaxed" dir="rtl">
              {shareText}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
