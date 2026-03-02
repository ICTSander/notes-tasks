"use client";

import { cn } from "@/lib/utils";

interface Props {
  projects: { id: string; name: string; color: string | null }[];
  selectedProjectIds: string[];
  onProjectToggle: (id: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  showDone: boolean;
  onShowDoneToggle: () => void;
}

export function TaskFilters({
  projects,
  selectedProjectIds,
  onProjectToggle,
  search,
  onSearchChange,
  showDone,
  onShowDoneToggle,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
        className="rounded-[12px] border border-glass-border px-3 py-2 text-sm bg-glass text-t1 placeholder:text-t3 backdrop-blur-xl w-full sm:w-56"
      />
      <div className="flex gap-1.5 flex-wrap">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onProjectToggle(p.id)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-200 border",
              selectedProjectIds.includes(p.id)
                ? "border-transparent text-white"
                : "border-glass-border text-t3 hover:text-t1"
            )}
            style={
              selectedProjectIds.includes(p.id)
                ? { backgroundColor: p.color || "#6b7280" }
                : {}
            }
          >
            {p.name}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-1.5 text-xs text-t3 ml-auto cursor-pointer whitespace-nowrap">
        <input
          type="checkbox"
          checked={showDone}
          onChange={onShowDoneToggle}
          className="accent-[#7C3AED]"
        />
        Show done
      </label>
    </div>
  );
}
