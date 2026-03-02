"use client";

import { useState, useEffect, useCallback } from "react";
import { NoteInput } from "@/components/NoteInput";
import { TaskList } from "@/components/TaskList";
import { TaskSidePanel } from "@/components/TaskSidePanel";
import { TaskFilters } from "@/components/TaskFilters";
import { ProjectManager } from "@/components/ProjectManager";
import { TopBar } from "@/components/TopBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { Chip } from "@/components/ui/Chip";
import { Sparkline } from "@/components/ui/Sparkline";
import { IconButton } from "@/components/ui/IconButton";
import { useSettings } from "@/lib/useSettings";
import { Filter, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { TaskWithProject, ProjectWithCount, SuggestedTask } from "@/lib/types";
import { sparklineData } from "@/lib/mock";

export default function Home() {
  const { settings } = useSettings();
  const [projects, setProjects] = useState<ProjectWithCount[]>([]);
  const [tasks, setTasks] = useState<TaskWithProject[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskWithProject | null>(null);
  const [filterProjectIds, setFilterProjectIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showDone, setShowDone] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }, []);

  const fetchTasks = useCallback(async () => {
    const params = new URLSearchParams();
    if (!showDone) params.set("status", "OPEN");
    else params.set("status", "ALL");
    if (filterProjectIds.length > 0) params.set("projectIds", filterProjectIds.join(","));
    if (search.trim()) params.set("search", search.trim());

    const res = await fetch(`/api/tasks?${params}`);
    const data = await res.json();
    setTasks(data);
  }, [showDone, filterProjectIds, search]);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  async function handleTasksReviewed(
    suggestedTasks: SuggestedTask[],
    projectId: string | null,
    noteId: string
  ) {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tasks: suggestedTasks.map((t) => ({
          ...t,
          projectId,
          sourceNoteId: noteId,
        })),
      }),
    });
    fetchTasks();
    fetchProjects();
  }

  async function handleToggle(id: string, status: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  }

  async function handleUpdateTask(id: string, data: Record<string, unknown>) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setSelectedTask(updated);
    fetchTasks();
    fetchProjects();
  }

  function handleProjectToggle(id: string) {
    setFilterProjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Stats
  const openTasks = tasks.filter((t) => t.status === "OPEN");
  const doneTasks = tasks.filter((t) => t.status === "DONE");
  const totalMinutes = openTasks.reduce((sum, t) => sum + t.estimateMinutes, 0);

  return (
    <div className="space-y-5">
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
              {openTasks.length} open
            </Chip>
            <Chip size="md">
              {doneTasks.length} done
            </Chip>
            <Chip size="md">
              {totalMinutes}m planned
            </Chip>
          </div>

          {/* Mini sparkline */}
          <Sparkline data={sparklineData} width={200} height={24} className="opacity-60" />
        </div>
      </GlassCard>

      {/* Filter toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-t1">Tasks</h2>
        <IconButton
          variant={showFilters ? "gradient-a" : "glass"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
        </IconButton>
      </div>

      {/* Collapsible filter panel */}
      {showFilters && (
        <div className="glass p-4 space-y-4">
          <TaskFilters
            projects={projects}
            selectedProjectIds={filterProjectIds}
            onProjectToggle={handleProjectToggle}
            search={search}
            onSearchChange={setSearch}
            showDone={showDone}
            onShowDoneToggle={() => setShowDone(!showDone)}
          />
          <div className="border-t border-glass-border pt-4">
            <ProjectManager
              projects={projects}
              onCreated={fetchProjects}
              onDeleted={() => { fetchProjects(); fetchTasks(); }}
            />
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="pb-20">
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onSelect={setSelectedTask}
          selectedId={selectedTask?.id}
        />
      </div>

      {/* Fixed bottom input bar (real API) */}
      <NoteInput
        projects={projects}
        mockAi={settings.mockAi}
        onTasksReviewed={handleTasksReviewed}
      />

      {/* Task edit modal */}
      {selectedTask && (
        <TaskSidePanel
          task={selectedTask}
          projects={projects}
          onUpdate={handleUpdateTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
