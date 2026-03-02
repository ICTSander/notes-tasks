"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Pin, Share2, MoreHorizontal } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { mockNotes, mockTasks } from "@/lib/mock";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const note = mockNotes.find((n) => n.id === params.id);

  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [pinned, setPinned] = useState(note?.pinned ?? false);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-t3">Note not found</p>
      </div>
    );
  }

  // Related tasks (mock: first 2 tasks)
  const relatedTasks = mockTasks.slice(0, 2);

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <IconButton variant="glass" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </IconButton>
        <div className="flex items-center gap-2">
          <IconButton
            variant={pinned ? "gradient-a" : "glass"}
            size="sm"
            onClick={() => setPinned(!pinned)}
          >
            <Pin className="w-4 h-4" />
          </IconButton>
          <IconButton variant="glass" size="sm">
            <Share2 className="w-4 h-4" />
          </IconButton>
          <IconButton variant="glass" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </IconButton>
        </div>
      </div>

      {/* Editable title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-bold text-t1 bg-transparent border-none outline-none placeholder:text-t3"
        placeholder="Note title..."
      />

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {note.tags.map((tag) => (
          <Chip key={tag} size="sm">{tag}</Chip>
        ))}
      </div>

      {/* Body editor */}
      <GlassCard className="p-0 min-h-[200px]">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full min-h-[200px] bg-transparent border-none outline-none resize-none p-5 text-sm text-t1 leading-relaxed placeholder:text-t3"
          placeholder="Start writing..."
        />
      </GlassCard>

      {/* Related tasks */}
      {relatedTasks.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-t2 mb-3">Related Tasks</h3>
          <div className="space-y-2">
            {relatedTasks.map((task) => (
              <GlassCard key={task.id} className="p-3 flex items-center gap-3" press>
                <div className="w-4 h-4 rounded-full border-2 border-t3/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-t1 truncate">{task.title}</p>
                  <p className="text-[11px] text-t3">{task.project} &middot; {task.estimateMinutes}m</p>
                </div>
                <Chip variant="colored" color={task.projectColor} size="sm">
                  P{task.priority}
                </Chip>
              </GlassCard>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
