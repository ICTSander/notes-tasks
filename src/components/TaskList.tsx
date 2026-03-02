"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Flag } from "lucide-react";
import type { TaskWithProject } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  tasks: TaskWithProject[];
  onToggle: (id: string, status: string) => void;
  onSelect: (task: TaskWithProject) => void;
  selectedId?: string;
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

export function TaskList({ tasks, onToggle, onSelect, selectedId }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-t2">No tasks yet</p>
        <p className="text-sm text-t3 mt-1">Add a note below to create tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task, i) => (
        <TaskRow
          key={task.id}
          task={task}
          index={i}
          selected={selectedId === task.id}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function TaskRow({
  task,
  index,
  selected,
  onToggle,
  onSelect,
}: {
  task: TaskWithProject;
  index: number;
  selected: boolean;
  onToggle: (id: string, status: string) => void;
  onSelect: (task: TaskWithProject) => void;
}) {
  const [checking, setChecking] = useState(false);

  function handleCheck(e: React.MouseEvent) {
    e.stopPropagation();
    setChecking(true);
    setTimeout(() => {
      onToggle(task.id, task.status === "DONE" ? "OPEN" : "DONE");
      setChecking(false);
    }, 250);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      onClick={() => onSelect(task)}
      className={cn(
        "glass press flex items-start gap-3 p-4 cursor-pointer group hover:bg-glass-hover transition-all duration-200",
        selected && "border-accent/30 bg-accent/10",
        task.status === "DONE" && "opacity-50"
      )}
    >
      {/* Neon ring checkbox */}
      <button
        onClick={handleCheck}
        className={cn(
          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
          task.status === "DONE" ? "border-accent bg-accent" : "border-t3/40 hover:border-accent/60",
          checking && "animate-check"
        )}
      >
        {(task.status === "DONE" || checking) && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium leading-snug",
          task.status === "DONE" ? "line-through text-t3" : "text-t1"
        )}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {task.project && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: (task.project.color || "#6b7280") + "20",
                color: task.project.color || "#6b7280",
              }}
            >
              {task.project.name}
            </span>
          )}
          <span className="text-[11px] text-t3">{task.estimateMinutes}m</span>
          {task.dueDate && (
            <span className="text-[11px] text-t3">
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>

      {/* Priority */}
      <div className={cn("flex items-center gap-1 shrink-0", priorityColors[task.priority] || priorityColors[3])}>
        <Flag className="w-3 h-3" />
        <span className="text-[11px] font-semibold">{priorityLabels[task.priority] || "Mid"}</span>
      </div>
    </motion.div>
  );
}
