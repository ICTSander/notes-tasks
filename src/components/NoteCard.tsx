"use client";

import Link from "next/link";
import { Pin } from "lucide-react";
import { motion } from "framer-motion";
import { Chip } from "@/components/ui/Chip";
import { formatRelativeDate } from "@/lib/utils";
import type { MockNote } from "@/lib/mock";

interface NoteCardProps {
  note: MockNote;
  index?: number;
}

export function NoteCard({ note, index = 0 }: NoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/notes/${note.id}`}>
        <div className="glass press p-4 h-full flex flex-col gap-2.5 group hover:bg-glass-hover transition-colors duration-200">
          {/* Top row: pin + time */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-t3">{formatRelativeDate(note.updatedAt)}</span>
            {note.pinned && <Pin className="w-3 h-3 text-accent-light fill-accent-light" />}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-t1 line-clamp-1 group-hover:text-accent-light transition-colors">
            {note.title}
          </h3>

          {/* Preview */}
          <p className="text-xs text-t3 line-clamp-2 leading-relaxed">{note.preview}</p>

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex gap-1.5 mt-auto pt-1">
              {note.tags.map((tag) => (
                <Chip key={tag} size="sm">{tag}</Chip>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
