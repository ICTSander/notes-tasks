"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  variant?: "default" | "gradient-a" | "gradient-b" | "colored";
  color?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function Chip({
  children,
  active = false,
  variant = "default",
  color,
  onClick,
  className,
  size = "sm",
}: ChipProps) {
  const base = cn(
    "inline-flex items-center rounded-full font-medium transition-all duration-200",
    size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
    onClick && "cursor-pointer"
  );

  if (variant === "gradient-a") {
    return (
      <span className={cn(base, "grad-a text-white", className)} onClick={onClick}>
        {children}
      </span>
    );
  }
  if (variant === "gradient-b") {
    return (
      <span className={cn(base, "grad-b text-white", className)} onClick={onClick}>
        {children}
      </span>
    );
  }
  if (variant === "colored" && color) {
    return (
      <span
        className={cn(base, className)}
        style={{ backgroundColor: color + "20", color }}
        onClick={onClick}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        base,
        active
          ? "bg-accent/20 text-accent-light border border-accent/30"
          : "bg-glass text-t2 border border-glass-border hover:bg-glass-hover",
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
