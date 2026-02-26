"use client";

import type { TaskWithProject } from "@/lib/types";

interface Props {
  tasks: TaskWithProject[];
  onToggle: (id: string, status: string) => void;
  onSelect: (task: TaskWithProject) => void;
  selectedId?: string;
}

const priorityColors: Record<number, string> = {
  1: "bg-gray-200 text-gray-600",
  2: "bg-blue-100 text-blue-700",
  3: "bg-yellow-100 text-yellow-700",
  4: "bg-orange-100 text-orange-700",
  5: "bg-red-100 text-red-700",
};

const priorityLabels: Record<number, string> = {
  1: "P1", 2: "P2", 3: "P3", 4: "P4", 5: "P5",
};

export function TaskList({ tasks, onToggle, onSelect, selectedId }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p className="text-lg">No tasks yet</p>
        <p className="text-sm mt-1">Add a note above to create tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onSelect(task)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group ${
            selectedId === task.id ? "bg-blue-50 border border-accent/20" : "hover:bg-gray-50"
          } ${task.status === "DONE" ? "opacity-60" : ""}`}
        >
          <input
            type="checkbox"
            checked={task.status === "DONE"}
            onChange={(e) => {
              e.stopPropagation();
              onToggle(task.id, task.status === "DONE" ? "OPEN" : "DONE");
            }}
            className="h-4 w-4 rounded accent-accent shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium truncate ${
                task.status === "DONE" ? "line-through text-text-muted" : "text-text-main"
              }`}
            >
              {task.title}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityColors[task.priority] || priorityColors[3]}`}
            >
              {priorityLabels[task.priority] || "P3"}
            </span>
            <span className="text-xs text-text-muted whitespace-nowrap">
              {task.estimateMinutes}m
            </span>
            {task.dueDate && (
              <span className="text-xs text-text-muted whitespace-nowrap">
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
