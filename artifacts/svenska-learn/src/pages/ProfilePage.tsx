import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  UserCircle2,
  Award,
  Trophy,
  Flame,
  Languages,
  Settings as SettingsIcon,
  Edit3,
  Check,
  X,
  Lock,
  ChevronRight,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const AVATAR_OPTIONS = ["🧑‍🎓", "👩‍🎓", "🧔", "👩", "🧑", "👱‍♀️", "🧑‍🦱", "👩‍🦰", "🧑‍💼", "🧕"];
const COLOR_OPTIONS: Record<string, string> = {
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
  emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  orange: "from-orange-500/20 to-orange-500/5 border-orange-500/30",
  rose: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
};

interface Profile {
  displayName: string;
  avatarEmoji: string;
  avatarColor: string;
  level: number;
  levelName: string;
  xpPoints: number;
  xpToNextLevel: number;
  streakDays: number;
  totalDaysLearned: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  certifiedLevels: Record<string, { percentage: number; date: string }>;
  languages: { code: string; name: string; isLearning: boolean; level: string }[];
  translatorLanguagesCount: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/user/profile`).then((r) => r.json()).then(setProfile).catch(() => {});
    fetch(`${BASE}/api/achievements`)
      .then((r) => r.json())
      .then((d) => setAchievements(d.achievements))
      .catch(() => {});
  }, []);

  const saveProfile = async (patch: Partial<{ displayName: string; avatarEmoji: string; avatarColor: string }>) => {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/user/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      setProfile((prev) => (prev ? { ...prev, ...data } : prev));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
          <ChevronRight className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <UserCircle2 className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground leading-tight">الملف الشخصي</h1>
      </header>

      {!profile ? (
        <div className="p-4">
          <div className="h-56 bg-muted animate-pulse rounded-2xl" />
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-5">
          {/* Avatar + level card */}
          <section
            className={`rounded-2xl p-5 flex flex-col items-center gap-3 border bg-gradient-to-br ${
              COLOR_OPTIONS[profile.avatarColor] ?? COLOR_OPTIONS.blue
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-card border-2 border-card-border flex items-center justify-center text-4xl shadow-sm">
              {profile.avatarEmoji}
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => saveProfile({ avatarEmoji: emoji })}
                  disabled={saving}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-transform ${
                    profile.avatarEmoji === emoji ? "bg-card border-2 border-primary scale-110" : "bg-card/60 border border-border"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {editing ? (
              <div className="flex items-center gap-2 w-full max-w-xs">
                <input
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  maxLength={40}
                  className="flex-1 text-sm text-center bg-card border border-border rounded-lg px-2 py-1.5 text-foreground"
                  autoFocus
                />
                <button
                  onClick={async () => {
                    await saveProfile({ displayName: nameDraft });
                    setEditing(false);
                  }}
                  className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setNameDraft(profile.displayName);
                  setEditing(true);
                }}
                className="flex items-center gap-1.5 text-base font-bold text-foreground"
              >
                {profile.displayName}
                <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}

            <span className="text-xs font-semibold text-foreground bg-card/70 px-3 py-1 rounded-full">
              المستوى {profile.level} • {profile.levelName}
            </span>

            <div className="w-full max-w-xs">
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span>{profile.xpPoints} XP</span>
                <span>{profile.xpToNextLevel} XP للمستوى التالي</span>
              </div>
              <div className="h-2 bg-card/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min((profile.xpPoints / profile.xpToNextLevel) * 100, 100)}%` }}
                />
              </div>
            </div>
          </section>

          {/* Quick stats */}
          <section className="grid grid-cols-3 gap-2.5">
            <div className="bg-card border border-card-border rounded-2xl p-3 flex flex-col items-center gap-1 text-center">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-base font-black text-foreground">{profile.streakDays}</span>
              <span className="text-[10px] text-muted-foreground">يوم متتالي</span>
            </div>
            <div className="bg-card border border-card-border rounded-2xl p-3 flex flex-col items-center gap-1 text-center">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-base font-black text-foreground">{profile.totalDaysLearned}</span>
              <span className="text-[10px] text-muted-foreground">أيام تعلّم</span>
            </div>
            <div className="bg-card border border-card-border rounded-2xl p-3 flex flex-col items-center gap-1 text-center">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="text-base font-black text-foreground">
                {profile.achievementsUnlocked}/{profile.achievementsTotal}
              </span>
              <span className="text-[10px] text-muted-foreground">إنجاز</span>
            </div>
          </section>

          {/* Achievements */}
          <section className="bg-card border border-card-border rounded-2xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> الإنجازات
            </h3>
            {!achievements ? (
              <div className="h-24 bg-muted animate-pulse rounded-xl" />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className={`p-3 rounded-xl border flex flex-col gap-1 ${
                      a.unlocked ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-border opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {a.unlocked ? <Award className="w-3.5 h-3.5 text-primary" /> : <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                      <span className="text-xs font-semibold text-foreground truncate">{a.title}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-snug">{a.description}</span>
                    {!a.unlocked && (
                      <div className="h-1 bg-muted rounded-full overflow-hidden mt-0.5">
                        <div className="h-full bg-primary/50" style={{ width: `${Math.min((a.progress / a.target) * 100, 100)}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Certificates */}
          <section className="bg-card border border-card-border rounded-2xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" /> الشهادات
            </h3>
            {Object.keys(profile.certifiedLevels).length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <p className="text-xs text-muted-foreground text-center">لم تحصل على شهادات مستوى بعد</p>
                <Link href="/exams" className="text-xs font-semibold text-primary">
                  اذهب لاختبار المستوى
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {Object.entries(profile.certifiedLevels).map(([level, info]) => (
                  <Link
                    key={level}
                    href={`/exams/certificate/${level}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <span className="text-sm font-bold text-foreground">مستوى {level}</span>
                    <span className="text-xs font-semibold text-emerald-700">{info.percentage}%</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Languages */}
          <section className="bg-card border border-card-border rounded-2xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-500" /> اللغات
            </h3>
            <div className="flex flex-col gap-2">
              {profile.languages.map((l) => (
                <div key={l.code} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                  <span className="text-sm text-foreground">🇸🇪 تتعلّم: {l.name}</span>
                  <span className="text-xs text-muted-foreground">{l.level}</span>
                </div>
              ))}
              <Link href="/translator" className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                <span className="text-sm text-foreground">المترجم الفوري</span>
                <span className="text-xs text-muted-foreground">{profile.translatorLanguagesCount}+ لغة مدعومة</span>
              </Link>
            </div>
          </section>

          <Link
            href="/settings"
            className="flex items-center justify-between p-4 rounded-2xl bg-card border border-card-border"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <SettingsIcon className="w-4 h-4 text-muted-foreground" /> الإعدادات
            </span>
            <span className="text-muted-foreground text-xs">›</span>
          </Link>
        </div>
      )}
    </div>
  );
}
