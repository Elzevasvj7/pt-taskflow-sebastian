/**
 * Todo Selectors
 *
 * Pure functions for transforming and querying todo data.
 * These functions have no side effects and are easy to test.
 */

import { Todo, TodoFilter, TodoStatus } from "@/lib/types";

type CompatibleTodo = Todo & {
  title?: string;
  description?: string;
  status?: TodoStatus;
  createdAt?: string;
};

function isCompleted(todo: CompatibleTodo): boolean {
  if (typeof todo.completed === "boolean") return todo.completed;
  return todo.status === "completed";
}

function isPending(todo: CompatibleTodo): boolean {
  return !isCompleted(todo);
}

function getSearchableText(todo: CompatibleTodo): string {
  return [todo.todo, todo.title, todo.description]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case "pending":
      return todos.filter((todo) => isPending(todo));
    case "completed":
      return todos.filter((todo) => isCompleted(todo));
    case "all":
    default:
      return todos;
  }
}

export function searchTodos(todos: Todo[], query: string): Todo[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return todos;

  return todos.filter((todo) =>
    getSearchableText(todo).includes(normalizedQuery),
  );
}
export interface TodoStats {
  total: number;
  pending: number;
  completed: number;
  completionRate: number;
}

export function getTodoStats(todos: Todo[]): TodoStats {
  const total = todos.length;
  const completed = todos.filter((t) => isCompleted(t)).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, pending, completed, completionRate };
}

export function isTodoOverdue(
  todo: CompatibleTodo,
  now: Date = new Date(),
  maxPendingDays = 7,
): boolean {
  if (!todo.createdAt || isCompleted(todo)) return false;

  const createdAt = new Date(todo.createdAt).getTime();
  if (Number.isNaN(createdAt)) return false;

  const diffInMs = now.getTime() - createdAt;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays > maxPendingDays;
}
