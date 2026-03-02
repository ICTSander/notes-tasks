"use client";

import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Palette,
  Cloud,
  Download,
  Shield,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AccentTheme = "A" | "B";

export default function SettingsPage() {
  const [theme, setTheme] = useState<AccentTheme>("A");
  const [syncEnabled, setSyncEnabled] = useState(true);

  return (
    <div className="space-y-5">
      <TopBar title="Settings" showAvatar={false} showSearch={false} />

      {/* Account card */}
      <GlassCard className="flex items-center gap-4 p-5" strong>
        <div className="w-14 h-14 rounded-full grad-a flex items-center justify-center text-lg font-bold text-white shrink-0">
          JD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-t1">John Doe</p>
          <p className="text-sm text-t3 truncate">john@example.com</p>
        </div>
        <ChevronRight className="w-5 h-5 text-t3 shrink-0" />
      </GlassCard>

      {/* Theme accent */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-accent/15 flex items-center justify-center">
            <Palette className="w-4.5 h-4.5 text-accent-light" />
          </div>
          <div>
            <p className="text-sm font-semibold text-t1">Theme Accent</p>
            <p className="text-xs text-t3">Choose your gradient style</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme("A")}
            className={cn(
              "flex-1 h-12 rounded-2xl grad-a relative transition-all duration-200",
              theme === "A" ? "ring-2 ring-white/30 scale-[1.02]" : "opacity-60"
            )}
          >
            {theme === "A" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </button>
          <button
            onClick={() => setTheme("B")}
            className={cn(
              "flex-1 h-12 rounded-2xl grad-b relative transition-all duration-200",
              theme === "B" ? "ring-2 ring-white/30 scale-[1.02]" : "opacity-60"
            )}
          >
            {theme === "B" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </button>
        </div>
      </GlassCard>

      {/* Sync */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-cyan/15 flex items-center justify-center">
              <Cloud className="w-4.5 h-4.5 text-cyan" />
            </div>
            <div>
              <p className="text-sm font-semibold text-t1">Cloud Sync</p>
              <p className="text-xs text-t3">
                {syncEnabled ? "Synced 2 minutes ago" : "Sync disabled"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSyncEnabled(!syncEnabled)}
            className={cn(
              "relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0",
              syncEnabled ? "grad-a" : "bg-white/10"
            )}
          >
            <span
              className={cn(
                "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                syncEnabled && "translate-x-5"
              )}
            />
          </button>
        </div>
      </GlassCard>

      {/* Export */}
      <GlassCard className="p-5 flex items-center justify-between group hover:bg-glass-hover transition-colors cursor-pointer" press>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-success/15 flex items-center justify-center">
            <Download className="w-4.5 h-4.5 text-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-t1">Export Data</p>
            <p className="text-xs text-t3">Download all notes and tasks</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-t3" />
      </GlassCard>

      {/* Privacy */}
      <GlassCard className="p-5 flex items-center justify-between group hover:bg-glass-hover transition-colors cursor-pointer" press>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-pink/15 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-pink" />
          </div>
          <div>
            <p className="text-sm font-semibold text-t1">Privacy Policy</p>
            <p className="text-xs text-t3">Read our privacy guidelines</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-t3" />
      </GlassCard>

      <p className="text-center text-xs text-t3 pt-4 pb-2">
        Notes &rarr; Tasks v2.0
      </p>
    </div>
  );
}
