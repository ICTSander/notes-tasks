"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, StickyNote, CheckSquare, CalendarDays, Bell } from "lucide-react";
import { GlassInput } from "@/components/ui/GlassInput";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

interface QuickCreateSheetProps {
  open: boolean;
  onClose: () => void;
}

type CreateMode = "note" | "task";

export function QuickCreateSheet({ open, onClose }: QuickCreateSheetProps) {
  const [mode, setMode] = useState<CreateMode>("task");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminder, setReminder] = useState(false);

  function handleCreate() {
    // Mock: just close the sheet
    setTitle("");
    setTag("");
    setDueDate("");
    setReminder(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[70] max-w-lg mx-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-[#0E1338] border border-white/10 border-b-0 shadow-2xl">
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-t3/30 mx-auto mb-5" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-t1">Create</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-glass flex items-center justify-center text-t3 hover:text-t1 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setMode("note")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
                    mode === "note"
                      ? "grad-b text-white neon-b"
                      : "bg-glass border border-glass-border text-t2 hover:bg-glass-hover"
                  )}
                >
                  <StickyNote className="w-4 h-4" />
                  New Note
                </button>
                <button
                  onClick={() => setMode("task")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
                    mode === "task"
                      ? "grad-a text-white neon-a"
                      : "bg-glass border border-glass-border text-t2 hover:bg-glass-hover"
                  )}
                >
                  <CheckSquare className="w-4 h-4" />
                  New Task
                </button>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <GlassInput
                  placeholder={mode === "note" ? "Note title..." : "Task title..."}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                {/* Tag */}
                <GlassInput
                  placeholder="Add tag (optional)"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />

                {mode === "task" && (
                  <div className="flex gap-3">
                    {/* Due date */}
                    <div className="flex-1 relative">
                      <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-[12px] border border-glass-border bg-glass px-4 py-3 pl-10 text-sm text-t1 backdrop-blur-xl transition-all duration-200"
                      />
                    </div>
                    {/* Reminder toggle */}
                    <button
                      onClick={() => setReminder(!reminder)}
                      className={cn(
                        "w-12 h-12 rounded-[12px] flex items-center justify-center transition-all duration-200",
                        reminder
                          ? "bg-accent/20 text-accent-light border border-accent/30"
                          : "bg-glass border border-glass-border text-t3"
                      )}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleCreate}
                disabled={!title.trim()}
                className={cn(
                  "w-full mt-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  mode === "task" ? "grad-a neon-a" : "grad-b neon-b"
                )}
              >
                {mode === "note" ? "Create Note" : "Create Task"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
