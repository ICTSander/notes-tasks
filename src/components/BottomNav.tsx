"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, StickyNote, CheckSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/notes", label: "Notes", Icon: StickyNote },
  // gap for floating add button
  { href: "/tasks", label: "Tasks", Icon: CheckSquare },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]">
      {/* Glass background */}
      <div className="absolute inset-0 bg-bg-0/80 backdrop-blur-xl border-t border-glass-border" />

      <div className="relative max-w-lg mx-auto flex items-center justify-around h-16">
        {links.map((l, i) => {
          const active = pathname === l.href;
          return (
            <span key={l.href} className={cn("contents", i === 2 && "ml-12")}>
              {/* Spacer for floating button */}
              {i === 2 && <div className="w-16" />}
              <Link
                href={l.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-16 h-full relative transition-colors duration-200",
                  active ? "text-accent-light" : "text-t3"
                )}
              >
                <l.Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{l.label}</span>
                {active && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full grad-a" />
                )}
              </Link>
            </span>
          );
        })}
      </div>
    </nav>
  );
}
