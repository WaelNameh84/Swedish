import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Laptop,
  Bell,
  HardDrive,
  KeyRound,
  Shield,
  Volume2,
  Gauge,
  Lock,
  Globe,
  CloudCog
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);

  const fetchSettings = () => {
    fetch(BASE + "/api/settings/user")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    try {
      await fetch(BASE + "/api/settings/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      if (key === "darkMode") {
        if (value === "dark") document.documentElement.classList.add("dark");
        else if (value === "light") document.documentElement.classList.remove("dark");
        else {
          const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          if (systemDark) document.documentElement.classList.add("dark");
          else document.documentElement.classList.remove("dark");
        }
      }
    } catch (e) {
      console.error(e);
      fetchSettings(); // revert
    }
  };

  const handleBackup = async () => {
    try {
      const res = await fetch(BASE + "/api/admin/backup");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `svenska-backup.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  if (!settings) {
    return (
      <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">الإعدادات</h1>
          </div>
        </header>
        <div className="p-4 space-y-4">
          <div className="h-20 bg-muted animate-pulse rounded-2xl" />
          <div className="h-32 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <SettingsIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">الإعدادات</h1>
          <p className="text-xs text-muted-foreground mt-0.5">إدارة تفضيلات التطبيق والذكاء الاصطناعي</p>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-4">
        {/* Language & Theme */}
        <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
            <Globe className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-foreground">اللغة والمظهر</h2>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">لغة التطبيق</span>
              <select
                className="bg-muted text-sm rounded-lg px-3 py-1.5 border-none outline-none"
                value={settings.appLanguage || "ar"}
                onChange={(e) => updateSetting("appLanguage", e.target.value)}
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
                <option value="sv">Svenska</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold mb-1">المظهر</span>
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                <button
                  onClick={() => updateSetting("darkMode", "light")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    settings.darkMode === "light" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Sun className="w-4 h-4" /> فاتح
                </button>
                <button
                  onClick={() => updateSetting("darkMode", "dark")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    settings.darkMode === "dark" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Moon className="w-4 h-4" /> داكن
                </button>
                <button
                  onClick={() => updateSetting("darkMode", "system")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    (!settings.darkMode || settings.darkMode === "system") ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Laptop className="w-4 h-4" /> تلقائي
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
            <Bell className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-foreground">الإشعارات والتذكير</h2>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">تفعيل الإشعارات</span>
              <Switch
                checked={settings.notificationsEnabled ?? true}
                onCheckedChange={(c) => updateSetting("notificationsEnabled", c)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">التذكير اليومي</span>
              <Switch
                checked={settings.dailyReminderEnabled ?? false}
                onCheckedChange={(c) => updateSetting("dailyReminderEnabled", c)}
              />
            </div>
            {(settings.dailyReminderEnabled ?? false) && (
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-semibold">وقت التذكير</span>
                <input
                  type="time"
                  value={settings.reminderTime || "10:00"}
                  onChange={(e) => updateSetting("reminderTime", e.target.value)}
                  className="bg-muted text-sm rounded-lg px-3 py-1.5 outline-none"
                  dir="ltr"
                />
              </div>
            )}
          </div>
        </section>

        {/* AI & API Keys */}
        <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
            <KeyRound className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-foreground">مفاتيح الذكاء الاصطناعي</h2>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold flex items-center justify-between">
                <span>مفتاح Gemini API</span>
                {settings.hasGeminiKey && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">مُتصل</span>}
              </label>
              <input
                type="password"
                placeholder="أدخل مفتاح Gemini..."
                className="bg-muted text-sm rounded-lg px-3 py-2.5 outline-none border border-transparent focus:border-primary w-full"
                onBlur={(e) => {
                  if (e.target.value) updateSetting("geminiApiKey", e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold flex items-center justify-between">
                <span>مفتاح توليد الصور</span>
                {settings.hasImageGenKey && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">مُتصل</span>}
              </label>
              <input
                type="password"
                placeholder="أدخل مفتاح توليد الصور..."
                className="bg-muted text-sm rounded-lg px-3 py-2.5 outline-none border border-transparent focus:border-primary w-full"
                onBlur={(e) => {
                  if (e.target.value) updateSetting("imageGenApiKey", e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold flex items-center justify-between">
                <span>مفتاح الترجمة (Translation API)</span>
                {settings.hasTranslationKey && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">مُتصل</span>}
              </label>
              <input
                type="password"
                placeholder="أدخل مفتاح الترجمة..."
                className="bg-muted text-sm rounded-lg px-3 py-2.5 outline-none border border-transparent focus:border-primary w-full"
                onBlur={(e) => {
                  if (e.target.value) updateSetting("translationApiKey", e.target.value);
                }}
              />
            </div>
          </div>
        </section>

        {/* Audio & Reading */}
        <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
            <Volume2 className="w-5 h-5 text-purple-500" />
            <h2 className="font-bold text-foreground">الصوت والقراءة</h2>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">تفعيل الصوت</span>
              <Switch
                checked={settings.audioEnabled ?? true}
                onCheckedChange={(c) => updateSetting("audioEnabled", c)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">سرعة الصوت</span>
              <select
                className="bg-muted text-sm rounded-lg px-3 py-1.5 border-none outline-none"
                value={settings.audioSpeed || "1.0"}
                onChange={(e) => updateSetting("audioSpeed", e.target.value)}
                dir="ltr"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1.0">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2.0">2.0x</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">سرعة القراءة</span>
              <select
                className="bg-muted text-sm rounded-lg px-3 py-1.5 border-none outline-none"
                value={settings.readingSpeed || "medium"}
                onChange={(e) => updateSetting("readingSpeed", e.target.value)}
              >
                <option value="slow">بطيء</option>
                <option value="medium">متوسط</option>
                <option value="fast">سريع</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
            <Shield className="w-5 h-5 text-rose-500" />
            <h2 className="font-bold text-foreground">الخصوصية والأمان</h2>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">جمع بيانات التعلم</span>
                <span className="text-[10px] text-muted-foreground">لتحسين تجربتك الشخصية</span>
              </div>
              <Switch
                checked={settings.dataCollectionEnabled ?? true}
                onCheckedChange={(c) => updateSetting("dataCollectionEnabled", c)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">التحليلات مجهولة المصدر</span>
                <span className="text-[10px] text-muted-foreground">تساعدنا في تحسين التطبيق</span>
              </div>
              <Switch
                checked={settings.analyticsEnabled ?? true}
                onCheckedChange={(c) => updateSetting("analyticsEnabled", c)}
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-semibold">المصادقة الثنائية (2FA)</span>
              <Switch
                checked={settings.twoFactorEnabled ?? false}
                onCheckedChange={(c) => updateSetting("twoFactorEnabled", c)}
              />
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 mt-2 rounded-xl bg-muted text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
              <Lock className="w-4 h-4" /> تغيير كلمة المرور
            </button>
          </div>
        </section>

        {/* Backup & Sync */}
        <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
            <CloudCog className="w-5 h-5 text-cyan-500" />
            <h2 className="font-bold text-foreground">النسخ والمزامنة</h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">حالة المزامنة</span>
              <span className="text-muted-foreground text-xs" dir="ltr">Last sync: {new Date().toLocaleTimeString('en-GB')}</span>
            </div>
            <Link
              href="/admin/backup"
              className="w-full flex items-center justify-center gap-2 py-3 mt-1 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
            >
              <HardDrive className="w-4 h-4" /> عرض إعدادات النسخ الاحتياطي
            </Link>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
            <SettingsIcon className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-foreground">الإحصائيات والإعدادات</h2>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <Link href="/statistics" className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
              <span className="text-sm font-semibold text-foreground">الإحصائيات</span>
              <span className="text-muted-foreground text-xs">←</span>
            </Link>
            <Link href="/profile" className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
              <span className="text-sm font-semibold text-foreground">الملف الشخصي</span>
              <span className="text-muted-foreground text-xs">←</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
