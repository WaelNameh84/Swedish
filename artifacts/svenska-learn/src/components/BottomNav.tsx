import { Link, useLocation } from "wouter";
import { Home, MessageSquare, Bot, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/lessons", label: "الدروس", icon: BookOpen },
    { href: "/conversations", label: "المحادثات", icon: MessageSquare },
    { href: "/chat", label: "تدرب", icon: Bot },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-background/95 backdrop-blur-md border-t border-border z-[60] pb-safe">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = location === tab.href || (tab.href !== "/" && location.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <Link 
              key={tab.href} 
              href={tab.href} 
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive ? "bg-primary/15" : "bg-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
              </div>
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}