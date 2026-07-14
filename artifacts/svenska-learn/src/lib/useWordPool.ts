import { useEffect, useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface PoolWord {
  id: number;
  word: string;
  translation: string;
  phonetic: string;
  level: string;
  category: string;
  imageUrl: string | null;
  examples: Array<{ sv: string; ar: string }>;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Fetches a pool of dictionary words (shuffled client-side) to power games. */
export function useWordPool(limit = 100) {
  const [words, setWords] = useState<PoolWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE}/api/dictionary/search?limit=${limit}`)
      .then((r) => r.json())
      .then((d) => setWords(shuffle(d.words || [])))
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return { words, loading, reshuffle: () => setWords((w) => shuffle(w)) };
}

export { shuffle };
