import { useEffect, useState } from "react";
import { useSignIn } from "@clerk/react/legacy";
import { Fingerprint, Loader2 } from "lucide-react";
import { biometricSupported, loginWithBiometric } from "@/lib/biometric";

// Real device biometric sign-in (Face ID / Touch ID / Windows Hello) shown
// on the sign-in page. Only rendered when the browser/device supports
// platform WebAuthn authenticators.
export default function BiometricLoginButton() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [supported, setSupported] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupported(biometricSupported());
  }, []);

  if (!supported) return null;

  const handleClick = async () => {
    if (!isLoaded) return;
    setBusy(true);
    setError(null);
    try {
      const ticket = await loginWithBiometric();
      const result = await signIn!.create({ strategy: "ticket", ticket });
      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
      } else {
        setError("تعذر إكمال تسجيل الدخول بالبصمة");
      }
    } catch (e: any) {
      if (e?.name !== "NotAllowedError") {
        setError(e?.message || "تعذر الدخول بالبصمة، جرّب كلمة المرور");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-[440px] max-w-full flex flex-col items-center gap-2 mb-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors disabled:opacity-60"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
        الدخول بالبصمة
      </button>
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
      <div className="flex items-center gap-3 w-full">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground">أو</span>
        <div className="h-px bg-border flex-1" />
      </div>
    </div>
  );
}
