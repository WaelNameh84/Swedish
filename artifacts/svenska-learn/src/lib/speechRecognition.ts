// Thin wrapper around the browser's Web Speech API (SpeechRecognition), which
// runs fully client-side (Chrome/Edge/Safari) — no server or API key needed.

export function isRecognitionSupported() {
  return typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export function listenOnce(lang: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) {
      reject(new Error("التعرف على الصوت غير مدعوم في هذا المتصفح"));
      return;
    }
    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript ?? "";
      resolve(text);
    };
    recognition.onerror = (event: any) => {
      reject(new Error(event.error === "no-speech" ? "لم يُسمع أي صوت، حاول مرة أخرى" : "تعذّر التعرف على الصوت"));
    };
    recognition.onend = () => {
      // If onresult never fired (e.g. aborted), resolve with empty to avoid hanging.
    };
    recognition.start();
  });
}
