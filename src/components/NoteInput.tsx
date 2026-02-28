"use client";

import { useState } from "react";
import type { SuggestedTask } from "@/lib/types";

interface Props {
  projects: { id: string; name: string; color: string | null }[];
  mockAi: boolean;
  onTasksReviewed: (tasks: SuggestedTask[], projectId: string | null, noteId: string) => void;
}

export function NoteInput({ projects, mockAi, onTasksReviewed }: Props) {
  const [text, setText] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<(SuggestedTask & { selected: boolean })[]>([]);
  const [noteId, setNoteId] = useState<string | null>(null);

  async function handleAdd() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      // Save note
      const noteRes = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text.trim(), projectId: projectId || null }),
      });
      if (!noteRes.ok) throw new Error("Failed to save note");
      const note = await noteRes.json();
      setNoteId(note.id);

      // Rewrite
      const projectName = projects.find((p) => p.id === projectId)?.name;
      const rewriteRes = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(mockAi && { "x-mock-ai": "true" }),
        },
        body: JSON.stringify({ text: text.trim(), projectName }),
      });
      if (!rewriteRes.ok) throw new Error("Failed to rewrite note");
      const data = await rewriteRes.json();

      setSuggestions(data.tasks.map((t: SuggestedTask) => ({ ...t, selected: true })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleTitleChange(idx: number, title: string) {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, title } : s))
    );
  }

  function handleEstimateChange(idx: number, estimateMinutes: number) {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, estimateMinutes } : s))
    );
  }

  function handleToggle(idx: number) {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, selected: !s.selected } : s))
    );
  }

  function handleSave() {
    const selected = suggestions
      .filter((s) => s.selected)
      .map(({ selected: _, ...rest }) => rest);
    if (selected.length === 0 || !noteId) return;
    onTasksReviewed(selected, projectId || null, noteId);
    setText("");
    setSuggestions([]);
    setNoteId(null);
  }

  function handleDiscard() {
    setSuggestions([]);
    setNoteId(null);
  }

  const priorityLabel = (p: number) => {
    const labels: Record<number, string> = { 1: "Low", 2: "Low-Med", 3: "Medium", 4: "High", 5: "Urgent" };
    return labels[p] || "Medium";
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          Quick Note
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your messy note here... e.g. 'need to call dentist, buy groceries, and finish report by tomorrow'"
            className="flex-1 rounded-md border border-border px-3 py-2.5 text-[16px] sm:text-sm resize-none bg-white"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd();
            }}
          />
          <div className="flex sm:flex-col gap-2">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="rounded-md border border-border px-3 py-2.5 text-[16px] sm:text-sm bg-white min-h-[44px]"
            >
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              disabled={loading || !text.trim()}
              className="px-4 py-2.5 bg-accent text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              {loading ? "Processing..." : "Add"}
            </button>
          </div>
        </div>
        {error && <p className="text-danger text-sm mt-2">{error}</p>}
      </div>

      {suggestions.length > 0 && (
        <div className="bg-surface rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            Suggested Tasks
          </h3>
          <div className="space-y-2">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${
                  s.selected ? "border-accent/30 bg-blue-50/50" : "border-border bg-gray-50/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={s.selected}
                  onChange={() => handleToggle(idx)}
                  className="mt-1 h-4 w-4 rounded accent-accent"
                />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={s.title}
                    onChange={(e) => handleTitleChange(idx, e.target.value)}
                    className="w-full text-sm font-medium bg-transparent border-none p-0"
                  />
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                    <span>{priorityLabel(s.priority ?? 3)}</span>
                    <label className="flex items-center gap-1">
                      <input
                        type="number"
                        value={s.estimateMinutes ?? 30}
                        onChange={(e) => handleEstimateChange(idx, Math.max(5, Math.min(480, Number(e.target.value) || 5)))}
                        min={5}
                        max={480}
                        className="w-14 rounded border border-border px-1.5 py-0.5 text-xs bg-white text-text-main"
                      />
                      min
                    </label>
                    {s.dueDate && (
                      <span>Due: {new Date(s.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={suggestions.filter((s) => s.selected).length === 0}
              className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              Add {suggestions.filter((s) => s.selected).length} task
              {suggestions.filter((s) => s.selected).length !== 1 && "s"}
            </button>
            <button
              onClick={handleDiscard}
              className="px-4 py-2 text-text-muted rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
