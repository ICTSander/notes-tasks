"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Flag } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { cn, formatTime } from "@/lib/utils";
import type { MockTask } from "@/lib/mock";

interface TaskCardProps {
  task: MockTask;
  onToggle?: (id: string) => void;
  index?: number;
}

const priorityColors: Record<number, string> = {
  1: "text-t3",
  2: "text-cyan",
  3: "text-accent-light",
  4: "text-warning",
  5: "text-danger",
};

const priorityLabels: Record<number, string> = {
  1: "Low", 2: "Med", 3: "Mid", 4: "High", 5: "Urgent",
};

export function TaskCard({ task, onToggle, index = 0 }: TaskCardProps) {
  const [checking, setChecking] = useState(false);

  function handleCheck() {
    setChecking(true);
    setTimeout(() => {
      onToggle?.(task.id);
      setChecking(false);
    }, 300);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className={cn(
        "glass press flex items-start gap-3 p-4 group hover:bg-glass-hover transition-all duration-200",
        task.done && "opacity-50"
      )}
    >
      {/* Custom checkbox with neon ring */}
      <button
        onClick={handleCheck}
        className={cn(
          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
          task.done
            ? "border-accent bg-accent"
            : "border-t3/40 hover:border-accent/60",
          checking && "animate-check"
        )}
      >
        {(task.done || checking) && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium leading-snug",
          task.done ? "line-through text-t3" : "text-t1"
        )}>
          {task.title}
        </p>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <Chip variant="colored" color={task.projectColor} size="sm">
            {task.project}
          </Chip>

          {task.dueDate && (
            <span className="flex items-center gap-1 text-[11px] text-t3">
              <Clock className="w-3 h-3" />
              {formatTime(task.dueDate)}
            </span>
          )}

          <span className="flex items-center gap-1 text-[11px] text-t3">
            {task.estimateMinutes}m
          </span>
        </div>
      </div>

      {/* Priority badge */}
      <div className={cn("flex items-center gap-1 shrink-0", priorityColors[task.priority])}>
        <Flag className="w-3 h-3" />
        <span className="text-[11px] font-semibold">{priorityLabels[task.priority]}</span>
      </div>
    </motion.div>
  );
}
