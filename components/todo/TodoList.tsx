'use client';

import type { Todo, UpdateTodoDTO } from '@/lib/types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
}
export function TodoList({ todos, isLoading, }: TodoListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 text-4xl">📝</div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          No hay tareas por aquí
        </p>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Agrega una nueva tarea para comenzar
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2" role="list" aria-label="Lista de tareas">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
    </ul>
  );
}
