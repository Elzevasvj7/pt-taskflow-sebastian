"use client";

import type { TodoFilter } from "@/lib/types";

interface TodoFilterBarProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

const filters: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
];

export function TodoFilterBar({
  currentFilter,
  onFilterChange,
}: TodoFilterBarProps) {
  return (
    <div
      className="inline-flex w-full gap-1 rounded-full bg-[var(--panel-strong)] p-1 sm:w-auto"
      role="tablist"
      aria-label="Filtrar tareas"
    >
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          role="tab"
          aria-selected={currentFilter === value}
          className={`flex-1 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition sm:flex-none ${
            currentFilter === value
              ? "bg-[var(--panel)] text-[color:var(--foreground)] shadow-sm"
              : "text-[color:var(--foreground)]/65 hover:text-[color:var(--foreground)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
