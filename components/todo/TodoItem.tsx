"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Trash2, Pin } from "lucide-react";
import type { Todo, UpdateTodoDTO } from "@/lib/types";
import {
  DEFAULT_NOTE_COLOR,
  NOTE_COLOR_IDS,
  NOTE_COLOR_STYLES,
  type NoteColorId,
} from "@/lib/note-colors";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeToTheme,
} from "@/lib/theme";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TodoItemProps {
  todo: Todo;
  onEdit: (id: Todo["id"], data: UpdateTodoDTO) => Promise<void>;
  onDelete: (id: Todo["id"]) => Promise<void>;
}

function getStickyColor(color: NoteColorId | undefined, isDark: boolean) {
  const resolvedColor = color ?? DEFAULT_NOTE_COLOR;
  const palette = NOTE_COLOR_STYLES[resolvedColor] ?? NOTE_COLOR_STYLES.yellow;
  return isDark ? palette.dark : palette.light;
}

export function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const isCompleted = todo.completed;
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const isDark = theme === "dark";
  const fallbackColor =
    NOTE_COLOR_IDS[parseInt(String(todo.id), 36) % NOTE_COLOR_IDS.length] ??
    DEFAULT_NOTE_COLOR;
  const stickyColor = getStickyColor(todo.color ?? fallbackColor, isDark);

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      await onEdit(todo.id, { completed: !todo.completed });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError(null);
    setIsProcessing(true);

    try {
      await onDelete(todo.id);
      setIsDeleteModalOpen(false);
    } catch {
      setDeleteError("No se pudo eliminar la tarea. Intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <li
      className={`group relative min-h-[20rem] rounded-[1.9rem] border p-7 transition-all hover:-translate-y-1.5 ${stickyColor.bg} ${stickyColor.border} ${stickyColor.shadow} ${
        isCompleted ? "opacity-70" : ""
      } ${isProcessing ? "opacity-60" : ""}`}
    >
      <div className="absolute bottom-6 right-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--foreground)] text-[var(--panel)] shadow-[0_16px_28px_-20px_rgba(0,0,0,0.75)]">
          <Pin className="h-5 w-5" strokeWidth={2.3} />
        </div>
      </div>

      <div className="flex h-full flex-col gap-6">
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white/55 transition-all ${
              isCompleted
                ? "border-[var(--success)] bg-[var(--success)] text-white scale-90"
                : "border-[color:var(--foreground)]/18 hover:scale-110"
            }`}
            style={
              !isCompleted ? { borderColor: stickyColor.accent } : undefined
            }
            aria-label={
              isCompleted ? "Marcar como pendiente" : "Marcar como completado"
            }
          >
            {isCompleted && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </button>

          <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <AlertDialog
              open={isDeleteModalOpen}
              onOpenChange={(open) => {
                setIsDeleteModalOpen(open);
                if (open) setDeleteError(null);
              }}
            >
              <AlertDialogTrigger asChild>
                <button
                  disabled={isProcessing}
                  className="rounded-full p-2 text-[color:var(--foreground)]/55 transition hover:bg-black/6 hover:text-[var(--danger)]"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. La tarea será eliminada de
                    forma permanente.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {deleteError && (
                  <p className="text-sm text-red-500">{deleteError}</p>
                )}

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isProcessing}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isProcessing}
                    onClick={(event) => {
                      event.preventDefault();
                      void handleDelete();
                    }}
                  >
                    {isProcessing ? "Eliminando..." : "Eliminar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="min-w-0 pt-3">
          <p
            className={`max-w-[18ch] text-[2rem] leading-[1.12] font-medium tracking-[-0.05em] ${
              isCompleted
                ? "text-[color:var(--foreground)]/45 line-through"
                : "text-[color:var(--foreground)]"
            }`}
          >
            {todo.todo}
          </p>
        </div>

        <div className="mt-auto pt-6 text-sm text-[color:var(--foreground)]/62">
          {isCompleted ? "Completada" : "Pendiente"}
        </div>
      </div>
    </li>
  );
}
