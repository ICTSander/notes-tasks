"use client";

import { useState } from "react";
import type { ProjectWithCount } from "@/lib/types";

const PRESET_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

interface Props {
  projects: ProjectWithCount[];
  onCreated: () => void;
  onDeleted: () => void;
}

export function ProjectManager({ projects, onCreated, onDeleted }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), color }),
    });
    setName("");
    setShowForm(false);
    onCreated();
  }

  async function handleRename(id: string) {
    if (!editName.trim()) return;
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    });
    setEditId(null);
    onCreated();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    onDeleted();
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
          Projects
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs text-accent hover:text-blue-600 font-medium"
        >
          {showForm ? "Cancel" : "+ New"}
        </button>
      </div>

      {showForm && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="flex-1 rounded-md border border-border px-3 py-1.5 text-sm bg-input"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <div className="flex gap-1 items-center">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  color === c ? "border-text-main scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button
            onClick={handleCreate}
            className="px-3 py-1.5 bg-accent text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-1">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-2 py-1.5 group">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: p.color || "#6b7280" }}
            />
            {editId === p.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleRename(p.id)}
                onKeyDown={(e) => e.key === "Enter" && handleRename(p.id)}
                className="flex-1 text-sm border border-border rounded px-2 py-0.5 bg-input"
                autoFocus
              />
            ) : (
              <span className="flex-1 text-sm text-text-main">{p.name}</span>
            )}
            <span className="text-xs text-text-muted">{p._count.tasks}</span>
            <div className="hidden group-hover:flex gap-1">
              <button
                onClick={() => {
                  setEditId(p.id);
                  setEditName(p.name);
                }}
                className="text-xs text-text-muted hover:text-text-main"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-danger hover:text-red-600"
              >
                Del
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-xs text-text-muted py-1">No projects yet</p>
        )}
      </div>
    </div>
  );
}
