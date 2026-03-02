"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { type InputHTMLAttributes } from "react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
}

export function GlassInput({ icon = false, className, ...props }: GlassInputProps) {
  return (
    <div className="relative">
      {icon && (
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
      )}
      <input
        className={cn(
          "w-full rounded-[12px] border border-glass-border bg-glass px-4 py-3 text-sm text-t1",
          "placeholder:text-t3 backdrop-blur-xl",
          "focus:border-accent focus:shadow-[0_0_0_2px_rgba(124,58,237,0.25)]",
          "transition-all duration-200",
          icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
}
