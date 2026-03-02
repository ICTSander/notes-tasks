"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import type { SuggestedTask } from "@/lib/types";
import { cn } from "@/lib/utils";

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
      const noteRes = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text.trim(), projectId: projectId || null }),
      });
      if (!noteRes.ok) throw new Error("Failed to save note");
      const note = await noteRes.json();
      setNoteId(note.id);

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
    setSuggestions((prev) => prev.map((s, i) => (i === idx ? { ...s, title } : s)));
  }
  function handleEstimateChange(idx: number, estimateMinutes: number) {
    setSuggestions((prev) => prev.map((s, i) => (i === idx ? { ...s, estimateMinutes } : s)));
  }
  function handleToggle(idx: number) {
    setSuggestions((prev) => prev.map((s, i) => (i === idx ? { ...s, selected: !s.selected } : s)));
  }

  function handleSave() {
    const selected = suggestions.filter((s) => s.selected).map(({ selected: _, ...rest }) => rest);
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
      <div className="fixed left-0 right-0 z-20 bg-bg-0/80 backdrop-blur-xl border-t border-glass-border px-3 py-2" style={{ bottom: 64 }}>
        <div className="max-w-[1000px] mx-auto flex items-center gap-2">
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="rounded-[12px] border border-glass-border px-2 py-2 text-xs bg-glass text-t1 shrink-0 max-w-[100px] backdrop-blur-xl"
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="describe task..."
            className="flex-1 rounded-[12px] border border-glass-border px-3 py-2 text-[16px] sm:text-sm bg-glass text-t1 placeholder:text-t3 backdrop-blur-xl min-w-0"
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          />
          <button
            onClick={handleAdd}
            disabled={loading || !text.trim()}
            className="w-10 h-10 flex items-center justify-center grad-a text-white rounded-[12px] text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 neon-a"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "+"}
          </button>
        </div>
        {error && (
          <p className="text-danger text-xs mt-1 max-w-[1000px] mx-auto">{error}</p>
        )}
      </div>

      {/* Suggestion modal overlay */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <>
            <div className="fixed inset-0" style={{ zIndex: 60 }}>
              <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleDiscard}
              />
            </div>
            <div className="fixed inset-0 flex items-end sm:items-center sm:justify-center" style={{ zIndex: 70 }}>
              <motion.div
                className="w-full sm:max-w-lg mx-0 sm:mx-4"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
              <div className="relative bg-[#0E1338] rounded-t-3xl sm:rounded-2xl border border-white/10 p-5 w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                {/* Handle (mobile) */}
                <div className="w-10 h-1 rounded-full bg-t3/30 mx-auto mb-4 sm:hidden" />

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-[8px] grad-a flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-t1">AI Suggestions</h3>
                  <button onClick={handleDiscard} className="ml-auto w-7 h-7 rounded-full bg-glass flex items-center justify-center text-t3 hover:text-t1 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {suggestions.map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-2xl border transition-all duration-200",
                        s.selected
                          ? "border-accent/30 bg-accent/10"
                          : "border-white/5 bg-white/[0.03]"
                      )}
                    >
                      <button
                        onClick={() => handleToggle(idx)}
                        className={cn(
                          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                          s.selected ? "border-accent bg-accent" : "border-t3/40"
                        )}
                      >
                        {s.selected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={s.title}
                          onChange={(e) => handleTitleChange(idx, e.target.value)}
                          className="w-full text-sm font-medium bg-transparent border-none p-0 text-t1 placeholder:text-t3"
                        />
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-t3">
                          <span className="text-accent-light">{priorityLabel(s.priority ?? 3)}</span>
                          <label className="flex items-center gap-1">
                            <input
                              type="number"
                              value={s.estimateMinutes ?? 30}
                              onChange={(e) => handleEstimateChange(idx, Math.max(5, Math.min(480, Number(e.target.value) || 5)))}
                              min={5}
                              max={480}
                              className="w-14 rounded-[8px] border border-glass-border px-1.5 py-0.5 text-xs bg-glass text-t1"
                            />
                            min
                          </label>
                          {s.dueDate && <span>Due: {new Date(s.dueDate).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={handleSave}
                    disabled={suggestions.filter((s) => s.selected).length === 0}
                    className="flex-1 py-2.5 grad-a text-white rounded-2xl text-sm font-bold neon-a disabled:opacity-40 transition-all"
                  >
                    Add {suggestions.filter((s) => s.selected).length} task
                    {suggestions.filter((s) => s.selected).length !== 1 && "s"}
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="px-4 py-2.5 text-t3 rounded-2xl text-sm font-medium bg-glass border border-glass-border hover:bg-glass-hover transition-all"
                  >
                    Discard
                  </button>
                </div>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
