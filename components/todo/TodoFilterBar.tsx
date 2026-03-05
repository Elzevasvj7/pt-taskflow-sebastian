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
      className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800"
      role="tablist"
      aria-label="Filtrar tareas"
    >
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          role="tab"
          aria-selected={currentFilter === value}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            currentFilter === value
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
