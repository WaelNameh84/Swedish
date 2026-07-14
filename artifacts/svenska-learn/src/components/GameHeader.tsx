import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export default function GameHeader({
  title,
  subtitle,
  right,
  backHref = "/games",
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
      <Link
        href={backHref}
        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0"
        aria-label="رجوع"
      >
        <ChevronRight className="w-4.5 h-4.5" />
      </Link>
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-foreground leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
