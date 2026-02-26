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
    <div className="space-y-6">
      <NoteInput
        projects={projects}
        mockAi={settings.mockAi}
        onTasksReviewed={handleTasksReviewed}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <TaskFilters
            projects={projects}
            selectedProjectIds={filterProjectIds}
            onProjectToggle={handleProjectToggle}
            search={search}
            onSearchChange={setSearch}
            showDone={showDone}
            onShowDoneToggle={() => setShowDone(!showDone)}
          />
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onSelect={setSelectedTask}
            selectedId={selectedTask?.id}
          />
        </div>
        <div className="w-full lg:w-72 space-y-4">
          {selectedTask && (
            <TaskSidePanel
              task={selectedTask}
              projects={projects}
              onUpdate={handleUpdateTask}
              onClose={() => setSelectedTask(null)}
            />
          )}
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
    </div>
  );
}
