"use client";

import { useState, useEffect } from "react";
import type { TaskWithProject } from "@/lib/types";

interface Props {
  task: TaskWithProject;
  projects: { id: string; name: string; color: string | null }[];
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onClose: () => void;
}

export function TaskSidePanel({ task, projects, onUpdate, onClose }: Props) {
  const [priority, setPriority] = useState(task.priority);
  const [estimate, setEstimate] = useState(task.estimateMinutes);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [projectId, setProjectId] = useState(task.projectId || "");

  useEffect(() => {
    setPriority(task.priority);
    setEstimate(task.estimateMinutes);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    setProjectId(task.projectId || "");
  }, [task]);

  function handleSave() {
    onUpdate(task.id, {
      priority,
      estimateMinutes: estimate,
      dueDate: dueDate || null,
      projectId: projectId || null,
    });
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
          Edit Task
        </h3>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-main text-lg leading-none"
        >
          &times;
        </button>
      </div>

      <p className="text-sm font-medium text-text-main mb-4">{task.title}</p>
      {task.details && (
        <p className="text-sm text-text-muted mb-4">{task.details}</p>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full rounded-md border border-border px-3 py-1.5 text-sm bg-white"
          >
            <option value={1}>1 - Low</option>
            <option value={2}>2 - Low-Med</option>
            <option value={3}>3 - Medium</option>
            <option value={4}>4 - High</option>
            <option value={5}>5 - Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Estimate (minutes)
          </label>
          <input
            type="number"
            value={estimate}
            onChange={(e) => setEstimate(Number(e.target.value))}
            min={5}
            max={480}
            className="w-full rounded-md border border-border px-3 py-1.5 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-1.5 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-1.5 text-sm bg-white"
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
