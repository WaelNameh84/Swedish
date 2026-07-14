import { startRegistration, startAuthentication, browserSupportsWebAuthn } from "@simplewebauthn/browser";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function biometricSupported() {
  return browserSupportsWebAuthn();
}

async function postJson(path: string, body?: unknown) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "حدث خطأ غير متوقع");
  return data;
}

// Registers this device's platform authenticator (Face ID / Touch ID /
// Windows Hello) for the currently signed-in Clerk user.
export async function registerBiometric(deviceLabel?: string) {
  const options = await postJson("/api/webauthn/register-options");
  const attResp = await startRegistration({ optionsJSON: options });
  return postJson("/api/webauthn/register-verify", { ...attResp, deviceLabel });
}

// Runs a biometric assertion on this device and, on success, returns a
// Clerk sign-in ticket the caller exchanges via signIn.create({ strategy:
// "ticket", ticket }).
export async function loginWithBiometric(): Promise<string> {
  const options = await postJson("/api/webauthn/login-options");
  const authResp = await startAuthentication({ optionsJSON: options });
  const { ticket } = await postJson("/api/webauthn/login-verify", authResp);
  return ticket as string;
}

export async function getBiometricStatus(): Promise<{
  enabled: boolean;
  devices: { id: number; label: string; createdAt: string }[];
}> {
  const res = await fetch(BASE + "/api/webauthn/status", { credentials: "include" });
  if (!res.ok) return { enabled: false, devices: [] };
  return res.json();
}

export async function removeBiometricDevice(id: number) {
  const res = await fetch(BASE + `/api/webauthn/${id}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error("تعذر حذف الجهاز");
}
