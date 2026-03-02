"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/TopBar";
import { GlassInput } from "@/components/ui/GlassInput";
import { Chip } from "@/components/ui/Chip";
import { NoteCard } from "@/components/NoteCard";
import { mockNotes } from "@/lib/mock";

const FILTERS = ["All", "Pinned", "Recent"] as const;
type Filter = (typeof FILTERS)[number];

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    let notes = [...mockNotes];

    if (search.trim()) {
      const q = search.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.preview.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filter === "Pinned") {
      notes = notes.filter((n) => n.pinned);
    }

    // Sort: pinned first, then by updatedAt desc
    notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    return notes;
  }, [search, filter]);

  return (
    <div className="space-y-5">
      <TopBar title="Notes" showAvatar={false} />

      {/* Search */}
      <GlassInput
        icon
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter chips */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Chip
            key={f}
            active={filter === f}
            onClick={() => setFilter(f)}
            size="md"
          >
            {f}
          </Chip>
        ))}
      </div>

      {/* Notes grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-t3 text-sm">No notes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((note, i) => (
            <NoteCard key={note.id} note={note} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
