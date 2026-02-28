"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/lib/useSettings";
import type { TaskWithProject } from "@/lib/types";

interface DayPlan {
  date: Date;
  dayName: string;
  tasks: TaskWithProject[];
  totalMinutes: number;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function generatePlan(
  tasks: TaskWithProject[],
  dailyMinutes: number,
  workdays: boolean[]
): DayPlan[] {
  const plan: DayPlan[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort: priority DESC, dueDate ASC, createdAt DESC
  const sorted = [...tasks].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const remaining = [...sorted];
  let dayOffset = 0;
  let daysPlanned = 0;

  while (daysPlanned < 7 && dayOffset < 30) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dayOfWeek = date.getDay();

    if (workdays[dayOfWeek]) {
      let minutesLeft = dailyMinutes;
      const dayTasks: TaskWithProject[] = [];

      for (let i = remaining.length - 1; i >= 0; i--) {
        // iterate backwards to safely splice
      }

      // Fill from front
      const toRemove: number[] = [];
      for (let i = 0; i < remaining.length; i++) {
        const est = remaining[i].estimateMinutes || 30;
        if (est <= minutesLeft) {
          dayTasks.push(remaining[i]);
          minutesLeft -= est;
          toRemove.push(i);
        }
      }

      // Remove assigned tasks
      for (let i = toRemove.length - 1; i >= 0; i--) {
        remaining.splice(toRemove[i], 1);
      }

      plan.push({
        date,
        dayName: DAY_NAMES[dayOfWeek],
        tasks: dayTasks,
        totalMinutes: dailyMinutes - minutesLeft,
      });
      daysPlanned++;
    }

    dayOffset++;
  }

  return plan;
}

const priorityColors: Record<number, string> = {
  1: "bg-gray-700 text-gray-300",
  2: "bg-blue-900/50 text-blue-300",
  3: "bg-yellow-900/50 text-yellow-300",
  4: "bg-orange-900/50 text-orange-300",
  5: "bg-red-900/50 text-red-300",
};

export default function PlanPage() {
  const { settings, loaded } = useSettings();
  const [tasks, setTasks] = useState<TaskWithProject[]>([]);
  const [plan, setPlan] = useState<DayPlan[]>([]);

  useEffect(() => {
    fetch("/api/tasks?status=OPEN")
      .then((r) => r.json())
      .then(setTasks);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const p = generatePlan(tasks, settings.dailyMinutes, settings.workdays);
    setPlan(p);
  }, [tasks, settings, loaded]);

  const unplannedCount = (() => {
    const plannedIds = new Set(plan.flatMap((d) => d.tasks.map((t) => t.id)));
    return tasks.filter((t) => !plannedIds.has(t.id)).length;
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-main">7-Day Plan</h1>
        <p className="text-sm text-text-muted mt-1">
          {settings.dailyMinutes} minutes per day &middot;{" "}
          {tasks.length} open tasks
          {unplannedCount > 0 && (
            <span className="text-orange-500"> &middot; {unplannedCount} won&apos;t fit this week</span>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {plan.map((day, idx) => (
          <div key={idx} className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-text-main">
                  {day.dayName}
                  {idx === 0 && " (Today)"}
                </h3>
                <p className="text-xs text-text-muted">
                  {day.date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-main">
                  {day.totalMinutes}m / {settings.dailyMinutes}m
                </p>
                <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (day.totalMinutes / settings.dailyMinutes) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {day.tasks.length === 0 ? (
              <p className="text-sm text-text-muted">No tasks scheduled</p>
            ) : (
              <div className="space-y-1.5">
                {day.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 py-1.5"
                  >
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityColors[task.priority]}`}
                    >
                      P{task.priority}
                    </span>
                    <span className="flex-1 text-sm text-text-main truncate">
                      {task.title}
                    </span>
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
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {task.estimateMinutes || 30}m
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
