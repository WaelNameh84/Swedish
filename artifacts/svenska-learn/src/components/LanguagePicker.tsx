import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getLanguages, type Language } from "@/lib/translate";

export default function LanguagePicker({
  value,
  onChange,
  excludeAuto,
}: {
  value: string;
  onChange: (code: string) => void;
  excludeAuto?: boolean;
}) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getLanguages().then(setLanguages);
  }, []);

  const current = languages.find((l) => l.code === value);
  const list = languages
    .filter((l) => !excludeAuto || l.code !== "auto")
    .filter((l) => l.name.includes(query) || l.code.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 text-sm font-bold text-foreground hover:bg-muted transition-colors"
      >
        {current?.name ?? "اختر لغة"}
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[75vh] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-border text-right">
            <SheetTitle>اختر اللغة</SheetTitle>
          </SheetHeader>
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن لغة..."
                className="w-full bg-muted/50 border border-border rounded-xl py-2.5 pr-9 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {list.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onChange(lang.code); setOpen(false); setQuery(""); }}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  lang.code === value ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
