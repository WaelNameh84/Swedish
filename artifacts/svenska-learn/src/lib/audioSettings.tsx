import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AudioSettings {
  speed: number; // 0.5 - 2.0
  autoTranslate: boolean;
  backgroundPlay: boolean;
  /** Use the AI (human-sounding) voice instead of the browser's built-in voice. Requires an OpenAI key. */
  useAiVoice: boolean;
  /** A specific browser SpeechSynthesisVoice.voiceURI to prefer, or null to auto-pick the best available voice. */
  voiceURI: string | null;
}

const DEFAULT_SETTINGS: AudioSettings = {
  speed: 0.9,
  autoTranslate: true,
  backgroundPlay: false,
  useAiVoice: false,
  voiceURI: null,
};

// Shared with lib/speech.ts, which reads this same key directly (it isn't a
// React module, so it can't use this context) — keep both in sync if renamed.
const STORAGE_KEY = "svenska_audio_settings";

interface AudioSettingsContextValue extends AudioSettings {
  setSpeed: (speed: number) => void;
  setAutoTranslate: (value: boolean) => void;
  setBackgroundPlay: (value: boolean) => void;
  setUseAiVoice: (value: boolean) => void;
  setVoiceURI: (value: string | null) => void;
}

const AudioSettingsContext = createContext<AudioSettingsContextValue | null>(null);

function loadSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const value: AudioSettingsContextValue = {
    ...settings,
    setSpeed: (speed) => setSettings((s) => ({ ...s, speed })),
    setAutoTranslate: (autoTranslate) => setSettings((s) => ({ ...s, autoTranslate })),
    setBackgroundPlay: (backgroundPlay) => setSettings((s) => ({ ...s, backgroundPlay })),
    setUseAiVoice: (useAiVoice) => setSettings((s) => ({ ...s, useAiVoice })),
    setVoiceURI: (voiceURI) => setSettings((s) => ({ ...s, voiceURI })),
  };

  return <AudioSettingsContext.Provider value={value}>{children}</AudioSettingsContext.Provider>;
}

export function useAudioSettings() {
  const ctx = useContext(AudioSettingsContext);
  if (!ctx) throw new Error("useAudioSettings must be used within AudioSettingsProvider");
  return ctx;
}
