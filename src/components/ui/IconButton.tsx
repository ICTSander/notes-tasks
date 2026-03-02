"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "glass" | "gradient-a" | "gradient-b";
  size?: "sm" | "md" | "lg";
}

export function IconButton({
  children,
  className,
  variant = "ghost",
  size = "md",
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[12px] transition-all duration-200",
        sizeClasses[size],
        variant === "ghost" && "text-t2 hover:text-t1 hover:bg-glass-hover",
        variant === "glass" && "bg-glass border border-glass-border text-t1 hover:bg-glass-hover",
        variant === "gradient-a" && "grad-a text-white shadow-lg neon-a",
        variant === "gradient-b" && "grad-b text-white shadow-lg neon-b",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
