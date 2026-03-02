"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  strong?: boolean;
  glow?: "a" | "b";
  press?: boolean;
}

export function GlassCard({
  children,
  className,
  strong = false,
  glow,
  press = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        strong ? "glass-strong" : "glass",
        glow === "a" && "neon-a",
        glow === "b" && "neon-b",
        press && "press",
        "p-5",
        className
      )}
      whileTap={press ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
