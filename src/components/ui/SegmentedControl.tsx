"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SegmentedControlProps {
  items: string[];
  active: string;
  onChange: (item: string) => void;
}

export function SegmentedControl({ items, active, onChange }: SegmentedControlProps) {
  return (
    <div className="inline-flex rounded-[12px] bg-glass border border-glass-border p-1 gap-0.5">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={cn(
            "relative px-4 py-1.5 text-sm font-medium rounded-[10px] transition-colors duration-200",
            active === item ? "text-white" : "text-t3 hover:text-t2"
          )}
        >
          {active === item && (
            <motion.div
              layoutId="segment-active"
              className="absolute inset-0 rounded-[10px] grad-a"
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{item}</span>
        </button>
      ))}
    </div>
  );
}
