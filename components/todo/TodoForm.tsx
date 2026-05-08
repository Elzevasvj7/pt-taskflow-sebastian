"use client";

import { FormEvent, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import type { CreateTodoDTO } from "@/lib/types";
import {
  DEFAULT_NOTE_COLOR,
  NOTE_COLOR_IDS,
  NOTE_COLOR_STYLES,
  type NoteColorId,
} from "@/lib/note-colors";

interface TodoFormProps {
  onSubmit: (data: CreateTodoDTO) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TodoForm({ onSubmit, isOpen, onOpenChange }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] =
    useState<NoteColorId>(DEFAULT_NOTE_COLOR);
  const inputId = "todo-create-input";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        todo: trimmedTitle,
        completed: false,
        userId: 5,
        color: selectedColor,
      });
      setTitle("");
      setSelectedColor(DEFAULT_NOTE_COLOR);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] bg-[var(--panel)] p-6 shadow-[0_28px_80px_-28px_rgba(0,0,0,0.55)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground)]/45">
              Nueva nota
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[color:var(--foreground)]">
              Crear tarea
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--panel-strong)] text-[color:var(--foreground)]/75 transition hover:bg-[var(--accent-soft)]"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-[color:var(--foreground)]/72"
            >
              Contenido de la nota
            </label>
            <input
              id={inputId}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe tu tarea..."
              disabled={isSubmitting}
              className="flex-1 rounded-[1.5rem] border border-[var(--border)] bg-[var(--panel-strong)] px-5 py-4 text-base text-[color:var(--foreground)] placeholder:text-[color:var(--foreground)]/38 outline-none transition focus:border-[var(--accent)] disabled:opacity-50"
              aria-label="Título del todo"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-[color:var(--foreground)]/72">
              Color de la nota
            </p>
            <div className="flex flex-wrap gap-3">
              {NOTE_COLOR_IDS.map((colorId) => {
                const color = NOTE_COLOR_STYLES[colorId];
                const isSelected = selectedColor === colorId;

                return (
                  <button
                    key={colorId}
                    type="button"
                    onClick={() => setSelectedColor(colorId)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "border-[color:var(--foreground)] bg-[var(--panel-strong)] text-[color:var(--foreground)]"
                        : "border-[var(--border)] bg-transparent text-[color:var(--foreground)]/68 hover:bg-[var(--panel-strong)]"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full ${color.swatch}`}
                      aria-hidden="true"
                    />
                    <span>{color.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-[var(--border)] bg-[var(--panel-strong)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[var(--accent-soft)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--panel)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Agregar todo"
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? "Agregando..." : "Crear nota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
