import { useEffect, useState } from "react";

export interface RadioWord {
  word: string;
  translation: string;
  example?: { sv: string; ar: string };
}

/**
 * Fetches a batch of dictionary words to cycle through in the audio-learning
 * features (radio, sleep mode, repetition, offline caching). Falls back to a
 * cached offline package (see OfflineDownloadPage) if the network request
 * fails, so the audio features keep working without a connection.
 */
export function useRadioWords(limit = 40) {
  const [words, setWords] = useState<RadioWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const base = import.meta.env.BASE_URL;
        const res = await fetch(`${base}api/dictionary/search?limit=${limit}`);
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        const items: RadioWord[] = (data.words ?? []).map((w: any) => ({
          word: w.word,
          translation: w.translation,
          example: w.examples?.[0],
        }));
        if (!cancelled && items.length > 0) {
          setWords(items);
          setLoading(false);
          return;
        }
        throw new Error("empty");
      } catch {
        // Fallback to offline-cached package
        try {
          const raw = localStorage.getItem("svenska_offline_words");
          if (raw) {
            const cached = JSON.parse(raw);
            if (!cancelled) setWords(cached.words ?? []);
          }
        } catch {
          // ignore
        }
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { words, loading };
}
