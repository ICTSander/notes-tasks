"use client";

import { useState, useEffect, useCallback } from "react";
import { NoteInput } from "@/components/NoteInput";
import { TaskList } from "@/components/TaskList";
import { TaskSidePanel } from "@/components/TaskSidePanel";
import { TaskFilters } from "@/components/TaskFilters";
import { ProjectManager } from "@/components/ProjectManager";
import { useSettings } from "@/lib/useSettings";
import type { TaskWithProject, ProjectWithCount, SuggestedTask } from "@/lib/types";

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

  return (
    <div className="flex flex-col">
      {/* Header: PLAN: + filter icon */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-semibold text-text-main">PLAN:</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-md transition-colors ${
            showFilters ? "bg-accent/20 text-accent" : "text-text-muted hover:text-text-main hover:bg-surface-hover"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
        </button>
      </div>

      {/* Collapsible filter panel */}
      {showFilters && (
        <div className="bg-surface rounded-lg border border-border p-4 mb-4 space-y-4">
          <TaskFilters
            projects={projects}
            selectedProjectIds={filterProjectIds}
            onProjectToggle={handleProjectToggle}
            search={search}
            onSearchChange={setSearch}
            showDone={showDone}
            onShowDoneToggle={() => setShowDone(!showDone)}
          />
          <div className="border-t border-border pt-4">
            <ProjectManager
              projects={projects}
              onCreated={fetchProjects}
              onDeleted={() => {
                fetchProjects();
                fetchTasks();
              }}
            />
          </div>
        </div>
      )}

      {/* Task list — add bottom padding for the fixed input bar */}
      <div className="pb-20">
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onSelect={setSelectedTask}
          selectedId={selectedTask?.id}
        />
      </div>

      {/* Fixed bottom input bar */}
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
