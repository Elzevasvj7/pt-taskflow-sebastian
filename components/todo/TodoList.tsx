"use client";

import type { Todo, UpdateTodoDTO } from "@/lib/types";
import { ClipboardList } from "lucide-react";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onEdit: (id: Todo["id"], data: UpdateTodoDTO) => Promise<void>;
  onDelete: (id: Todo["id"]) => Promise<void>;
}
export function TodoList({
  todos,
  isLoading,
  onEdit,
  onDelete,
}: TodoListProps) {
  if (isLoading) {
    const skeletonColors = [
      "bg-[#ffcf73] border-[#f3c568]",
      "bg-[#ff9a74] border-[#f58a63]",
      "bg-[#dedad3] border-[#cec8bf]",
      "bg-[#b591ff] border-[#a886ef]",
      "bg-[#dceb75] border-[#d0dd67]",
      "bg-[#ffc8dd] border-[#f1bad0]",
    ];
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
        {[1, 2, 3,4].map((i) => (
          <div
            key={i}
            className={`h-[20rem] animate-pulse rounded-[1.9rem] border ${skeletonColors[(i - 1) % skeletonColors.length]}`}
          />
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
        {[
          {
            bg: "bg-[#ffcf73]",
            border: "border-[#f3c568]",
            icon: "text-[#f1b53d]",
          },
          {
            bg: "bg-[#ff9a74]",
            border: "border-[#f58a63]",
            icon: "text-[#ef774e]",
          },
            {
              bg: "bg-[#b591ff]",
              border: "border-[#a886ef]",
              icon: "text-[#9c78e8]",
            },
            {
              bg: "bg-[#dceb75]",
              border: "border-[#d0dd67]",
              icon: "text-[#b0c34d]",
            },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex min-h-[20rem] flex-col items-center justify-center rounded-[1.9rem] border p-8 text-center ${item.bg} ${item.border}`}
          >
            <ClipboardList
              className={`mb-4 h-8 w-8 ${item.icon}`}
              aria-hidden="true"
            />
            {i === 0 && (
              <>
                <p className="text-2xl font-medium tracking-[-0.04em] text-[color:var(--foreground)]/85">
                  No hay tareas por aquí
                </p>
                <p className="mt-3 max-w-[20ch] text-sm text-[color:var(--foreground)]/55">
                  Agrega una nueva tarea para comenzar
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4"
      role="list"
      aria-label="Lista de tareas"
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
