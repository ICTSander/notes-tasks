"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
    onClose();
  }

  const inputClass = "w-full rounded-[12px] border border-glass-border px-3 py-2 text-sm bg-glass text-t1 backdrop-blur-xl";

  return (
    <AnimatePresence>
      <div className="fixed inset-0" style={{ zIndex: 60 }}>
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      </div>
      <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 70 }}>
        <motion.div
          className="w-full max-w-sm mx-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative bg-[#0E1338] rounded-2xl border border-white/10 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-t2 uppercase tracking-wider">Edit Task</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-glass flex items-center justify-center text-t3 hover:text-t1 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm font-semibold text-t1 mb-1">{task.title}</p>
          {task.details && <p className="text-xs text-t3 mb-4">{task.details}</p>}
          {!task.details && <div className="mb-4" />}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-t3 mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(Number(e.target.value))} className={inputClass}>
                <option value={1}>1 - Low</option>
                <option value={2}>2 - Low-Med</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - High</option>
                <option value={5}>5 - Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-t3 mb-1.5">Estimate (minutes)</label>
              <input type="number" value={estimate} onChange={(e) => setEstimate(Number(e.target.value))} min={5} max={480} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-t3 mb-1.5">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-t3 mb-1.5">Project</label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={inputClass}>
                <option value="">No project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSave}
              className="w-full py-2.5 grad-a text-white rounded-2xl text-sm font-bold neon-a transition-all mt-2"
            >
              Save Changes
            </button>
          </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
