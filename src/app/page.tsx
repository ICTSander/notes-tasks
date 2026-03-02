"use client";

import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { Chip } from "@/components/ui/Chip";
import { Sparkline } from "@/components/ui/Sparkline";
import { TaskCard } from "@/components/TaskCard";
import { TrendingUp, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  mockTasks,
  getTaskStats,
  sparklineData,
} from "@/lib/mock";

export default function HomePage() {
  const [tasks, setTasks] = useState(mockTasks);
  const stats = getTaskStats(tasks);
  const upcomingTasks = tasks.filter((t) => !t.done).slice(0, 3);
  const progress = stats.totalToday > 0
    ? Math.round((stats.doneToday / stats.totalToday) * 100)
    : 0;

  function handleToggle(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <div className="space-y-6">
      <TopBar title="Dashboard" />

      {/* Hero Glass Card */}
      <GlassCard className="relative overflow-hidden p-6">
        <GradientBlob variant="a" size={180} className="-top-10 -right-10" />
        <GradientBlob variant="b" size={120} className="bottom-0 -left-8" />

        <div className="relative z-10">
          <p className="text-sm text-t3 font-medium mb-1">Today</p>
          <h2 className="text-3xl font-bold text-t1 mb-4">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>

          <div className="flex flex-wrap gap-2 mb-5">
            <Chip variant="gradient-a" size="md">
              {stats.totalToday} tasks
            </Chip>
            <Chip size="md">
              {stats.openNotes} notes
            </Chip>
            {stats.dueSoon > 0 && (
              <Chip variant="gradient-b" size="md">
                {stats.dueSoon} due soon
              </Chip>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-t3">Daily progress</span>
              <span className="text-t2 font-semibold">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full grad-a transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Upcoming Tasks */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-t1">Upcoming</h2>
          <Link href="/tasks" className="flex items-center gap-1 text-xs text-accent-light hover:text-accent transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {upcomingTasks.map((task, i) => (
            <TaskCard key={task.id} task={task} onToggle={handleToggle} index={i} />
          ))}
        </div>
      </section>

      {/* Focus Stats */}
      <section>
        <h2 className="text-lg font-bold text-t1 mb-3">Focus</h2>
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4" strong>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-[8px] bg-accent/15 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-accent-light" />
              </div>
              <span className="text-xs text-t3 font-medium">Productivity</span>
            </div>
            <p className="text-2xl font-bold text-t1 mb-1">
              {stats.doneToday}/{stats.totalToday}
            </p>
            <p className="text-[11px] text-t3">tasks completed today</p>
          </GlassCard>

          <GlassCard className="p-4" strong>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-[8px] bg-cyan/15 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-cyan" />
              </div>
              <span className="text-xs text-t3 font-medium">Activity</span>
            </div>
            <Sparkline data={sparklineData} width={100} height={28} className="mb-1" />
            <p className="text-[11px] text-t3">28 day trend</p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
