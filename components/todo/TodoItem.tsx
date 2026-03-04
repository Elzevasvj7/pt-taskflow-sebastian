"use client";

import { useState } from "react";
import type { Todo, UpdateTodoDTO } from "@/lib/types";
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
  onEdit: (id: Todo['id'], data: UpdateTodoDTO) => Promise<void>;
  onDelete: (id: Todo['id']) => Promise<void>;
}

export function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const isCompleted = todo.completed;

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      await onEdit(todo.id, { ...todo, completed: !todo.completed });
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
      className={`group rounded-lg border bg-white p-4 transition-all hover:shadow-sm dark:bg-zinc-800 ${
        isCompleted
          ? "border-zinc-100 dark:border-zinc-800"
          : "border-zinc-200 dark:border-zinc-700"
      } ${isProcessing ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleSave}
          disabled={isProcessing}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isCompleted
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
          }`}
          aria-label={
            isCompleted ? "Marcar como pendiente" : "Marcar como completado"
          }
        >
          {isCompleted && (
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium leading-snug ${
              isCompleted
                ? "text-zinc-400 line-through dark:text-zinc-500"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {todo.todo}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
                className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                aria-label="Eliminar"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La tarea será eliminada de forma permanente.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
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
    </li>
  );
}
