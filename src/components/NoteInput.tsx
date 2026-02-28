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
    <>
      {/* Fixed bottom input bar */}
      <div className="fixed bottom-14 sm:bottom-0 left-0 right-0 z-20 bg-surface border-t border-border px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="rounded-md border border-border px-2 py-2 text-xs bg-input shrink-0 max-w-[100px]"
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="describe task..."
            className="flex-1 rounded-md border border-border px-3 py-2 text-[16px] sm:text-sm bg-input min-w-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            disabled={loading || !text.trim()}
            className="w-10 h-10 flex items-center justify-center bg-accent text-white rounded-md text-lg font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              "+"
            )}
          </button>
        </div>
        {error && (
          <p className="text-danger text-xs mt-1 max-w-5xl mx-auto">{error}</p>
        )}
      </div>

      {/* Suggestion modal overlay */}
      {suggestions.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={handleDiscard} />
          <div className="relative bg-surface rounded-t-xl sm:rounded-xl border border-border p-4 w-full sm:max-w-lg max-h-[80vh] overflow-y-auto mx-0 sm:mx-4">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
              Suggested Tasks
            </h3>
            <div className="space-y-2">
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${
                    s.selected ? "border-accent/30 bg-accent/10" : "border-border bg-surface-hover"
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
                          className="w-14 rounded border border-border px-1.5 py-0.5 text-xs bg-input text-text-main"
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
                className="px-4 py-2 text-text-muted rounded-md text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
