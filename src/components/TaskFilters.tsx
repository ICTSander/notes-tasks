"use client";

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
        className="rounded-md border border-border px-3 py-1.5 text-sm bg-input w-full sm:w-56"
      />
      <div className="flex gap-1.5 flex-wrap">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onProjectToggle(p.id)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors border ${
              selectedProjectIds.includes(p.id)
                ? "border-transparent text-white"
                : "border-border text-text-muted hover:text-text-main"
            }`}
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
      <label className="flex items-center gap-1.5 text-xs text-text-muted ml-auto cursor-pointer whitespace-nowrap">
        <input
          type="checkbox"
          checked={showDone}
          onChange={onShowDoneToggle}
          className="accent-accent"
        />
        Show done
      </label>
    </div>
  );
}
