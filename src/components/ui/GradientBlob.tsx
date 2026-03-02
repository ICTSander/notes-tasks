"use client";

import { cn } from "@/lib/utils";

interface GradientBlobProps {
  variant?: "a" | "b";
  className?: string;
  size?: number;
}

export function GradientBlob({
  variant = "a",
  className,
  size = 200,
}: GradientBlobProps) {
  const gradient =
    variant === "a"
      ? "from-[#7C3AED] to-[#06B6D4]"
      : "from-[#EC4899] to-[#8B5CF6]";

  return (
    <div
      className={cn(
        "absolute rounded-full blur-3xl opacity-30 animate-blob pointer-events-none",
        `bg-gradient-to-br ${gradient}`,
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
