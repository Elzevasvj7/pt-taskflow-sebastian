"use client";

import { useState } from "react";
import type { Todo } from "@/lib/types";


interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo,  }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.todo);
  const [editDescription, setEditDescription] = useState(todo.todo ?? "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const isCompleted = todo.completed;




  const handleSave = async () => {
    setIsProcessing(true);
    try {
      setIsEditing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.todo);
    setEditDescription(todo.todo ?? "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            aria-label="Editar título"
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            aria-label="Editar descripción"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="rounded px-3 py-1 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing || !editTitle.trim()}
              className="rounded bg-zinc-900 px-3 py-1 text-xs text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Guardar
            </button>
          </div>
        </div>
      </li>
    );
  }

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
        </div>
      </div>
    </li>
  );
}
