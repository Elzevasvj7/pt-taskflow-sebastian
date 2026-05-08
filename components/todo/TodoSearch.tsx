"use client";

import { Search } from "lucide-react";

interface TodoSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TodoSearch({ value, onChange }: TodoSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--foreground)]/28" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar tareas..."
        className="w-full rounded-full border border-[var(--border)] bg-transparent py-3 pl-11 pr-4 text-base text-[color:var(--foreground)] placeholder:text-[color:var(--foreground)]/32 outline-none transition focus:border-[var(--accent)] focus:ring-0"
        aria-label="Buscar tareas"
      />
    </div>
  );
}
