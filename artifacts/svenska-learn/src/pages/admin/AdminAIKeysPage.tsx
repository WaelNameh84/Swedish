import { useEffect, useState } from "react";
import { KeyRound, Lock, CheckCircle2, XCircle, HelpCircle, LogOut } from "lucide-react";
import GameHeader from "@/components/GameHeader";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type KeyField = "openaiApiKey" | "geminiApiKey" | "imageGenApiKey" | "translationApiKey";

const FIELDS: { field: KeyField; label: string; hasFlag: string }[] = [
  { field: "openaiApiKey", label: "مفتاح OpenAI API", hasFlag: "hasOpenaiKey" },
  { field: "geminiApiKey", label: "مفتاح Gemini API", hasFlag: "hasGeminiKey" },
  { field: "imageGenApiKey", label: "مفتاح توليد الصور", hasFlag: "hasImageGenKey" },
  { field: "translationApiKey", label: "مفتاح الترجمة (Translation API)", hasFlag: "hasTranslationKey" },
];

type VerifyResult = { ok: boolean | null; message: string } | null;

export default function AdminAIKeysPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [keyMeta, setKeyMeta] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [verifyResults, setVerifyResults] = useState<Record<string, VerifyResult>>({});
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const checkSession = async () => {
    try {
      const r = await fetch(BASE + "/api/admin/auth/session");
      const d = await r.json();
      setAuthenticated(!!d.authenticated);
    } catch {
      setAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const fetchKeys = async () => {
    const r = await fetch(BASE + "/api/admin/keys");
    if (r.status === 401) {
      setAuthenticated(false);
      return;
    }
    const d = await r.json();
    setKeyMeta(d);
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (authenticated) fetchKeys();
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const r = await fetch(BASE + "/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setLoginError(d.error || "تعذر تسجيل الدخول");
        return;
      }
      setPassword("");
      setAuthenticated(true);
    } catch {
      setLoginError("تعذر الاتصال بالخادم");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch(BASE + "/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    setAuthenticated(false);
    setInputs({});
    setVerifyResults({});
  };

  const handleVerify = async (field: KeyField) => {
    const apiKey = inputs[field];
    if (!apiKey?.trim()) return;
    setVerifying((s) => ({ ...s, [field]: true }));
    setVerifyResults((s) => ({ ...s, [field]: null }));
    try {
      const r = await fetch(BASE + "/api/admin/keys/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: field, apiKey }),
      });
      const d = await r.json();
      setVerifyResults((s) => ({ ...s, [field]: { ok: d.ok, message: d.message } }));
    } catch {
      setVerifyResults((s) => ({ ...s, [field]: { ok: false, message: "تعذر الاتصال بالخادم للتحقق" } }));
    } finally {
      setVerifying((s) => ({ ...s, [field]: false }));
    }
  };

  const handleSaveAll = async () => {
    const updates: Record<string, string> = {};
    for (const { field } of FIELDS) {
      if (inputs[field]?.trim()) updates[field] = inputs[field].trim();
    }
    if (Object.keys(updates).length === 0) return;
    setSaving(true);
    setSaveMessage("");
    try {
      const r = await fetch(BASE + "/api/admin/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (r.status === 401) {
        setAuthenticated(false);
        return;
      }
      const d = await r.json();
      setKeyMeta(d);
      setInputs({});
      setVerifyResults({});
      setSaveMessage("تم حفظ المفاتيح بنجاح");
    } catch {
      setSaveMessage("فشل حفظ المفاتيح");
    } finally {
      setSaving(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
        <GameHeader title="مفاتيح الذكاء الاصطناعي" backHref="/admin" />
        <div className="p-4"><div className="h-32 bg-muted animate-pulse rounded-2xl" /></div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
        <GameHeader title="مفاتيح الذكاء الاصطناعي" backHref="/admin" />
        <div className="p-4">
          <div className="bg-card border border-card-border rounded-2xl p-6 flex flex-col items-center gap-4 text-center mt-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">هذه الصفحة للمسؤول فقط</h2>
              <p className="text-sm text-muted-foreground mt-1">أدخل كلمة مرور المسؤول لعرض مفاتيح الذكاء الاصطناعي وتعديلها</p>
            </div>
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة مرور المسؤول"
                className="bg-muted text-sm rounded-lg px-3 py-2.5 outline-none border border-transparent focus:border-primary w-full text-center"
                dir="ltr"
              />
              {loginError && <p className="text-xs text-destructive">{loginError}</p>}
              <button
                type="submit"
                disabled={loggingIn || !password}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 active:scale-[0.98] transition-transform"
              >
                {loggingIn ? "جارٍ التحقق..." : "تسجيل الدخول"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24" dir="rtl">
      <GameHeader title="مفاتيح الذكاء الاصطناعي" backHref="/admin" />
      <div className="p-4 flex flex-col gap-4">
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-emerald-500" />
              <h2 className="font-bold text-foreground">مفاتيح مزودي الذكاء الاصطناعي</h2>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <LogOut className="w-3.5 h-3.5" /> تسجيل الخروج
            </button>
          </div>

          <div className="p-4 flex flex-col gap-5">
            {FIELDS.map(({ field, label, hasFlag }) => {
              const result = verifyResults[field];
              return (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold flex items-center justify-between">
                    <span>{label}</span>
                    {keyMeta[hasFlag] && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">محفوظ</span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={inputs[field] || ""}
                      onChange={(e) => {
                        setInputs((s) => ({ ...s, [field]: e.target.value }));
                        setVerifyResults((s) => ({ ...s, [field]: null }));
                      }}
                      placeholder={keyMeta[hasFlag] ? "•••••••• (اتركه فارغاً للحفاظ على القيمة الحالية)" : "أدخل المفتاح..."}
                      className="flex-1 bg-muted text-sm rounded-lg px-3 py-2.5 outline-none border border-transparent focus:border-primary"
                      dir="ltr"
                    />
                    <button
                      onClick={() => handleVerify(field)}
                      disabled={!inputs[field]?.trim() || verifying[field]}
                      className="px-3 rounded-lg bg-muted text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-40 transition-colors whitespace-nowrap"
                    >
                      {verifying[field] ? "..." : "تحقق"}
                    </button>
                  </div>
                  {result && (
                    <div
                      className={`flex items-start gap-1.5 text-xs rounded-lg px-3 py-2 ${
                        result.ok === true
                          ? "bg-emerald-500/10 text-emerald-600"
                          : result.ok === false
                          ? "bg-destructive/10 text-destructive"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {result.ok === true ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      ) : result.ok === false ? (
                        <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      ) : (
                        <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      )}
                      <span>{result.message}</span>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={handleSaveAll}
              disabled={saving || Object.values(inputs).every((v) => !v?.trim())}
              className="w-full flex items-center justify-center gap-2 py-3 mt-1 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              {saving ? "جارٍ الحفظ..." : "حفظ المفاتيح"}
            </button>
            {saveMessage && <p className="text-xs text-center text-muted-foreground">{saveMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
