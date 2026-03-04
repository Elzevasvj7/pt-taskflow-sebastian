"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  TodoList,
  TodoFilterBar,
  TodoSearch,
  TodoForm,
} from "@/components/todo";
import { useTodos } from "@/hooks/useTodos";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export function TodoContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parsedPage = Number(searchParams.get("page") ?? DEFAULT_PAGE);
  const page =
    Number.isNaN(parsedPage) || parsedPage < 1 ? DEFAULT_PAGE : parsedPage;

  const {
    displayTodos,
    filter,
    searchQuery,
    isLoading,
    error,
    total,
    totalPages,
    hasPrevPage,
    hasNextPage,
    stats,
    loadTodos,
    addTodo,
    setFilter,
    setSearchQuery,
  } = useTodos({ page, pageSize: DEFAULT_PAGE_SIZE });

  const updateQueryParams = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(nextPage));
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handlePrevPage = useCallback(() => {
    if (hasPrevPage) {
      updateQueryParams(page - 1);
    }
  }, [hasPrevPage, page, updateQueryParams]);

  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      updateQueryParams(page + 1);
    }
  }, [hasNextPage, page, updateQueryParams]);

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Mis Tareas
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Organiza tu día, una tarea a la vez
        </p>
      </div>

      {/* Form */}
      <TodoForm onSubmit={addTodo} />

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          <strong className="font-medium text-zinc-700 dark:text-zinc-300">
            {stats.total}
          </strong>{" "}
          total
        </span>
        <span>
          <strong className="font-medium text-amber-600 dark:text-amber-400">
            {stats.pending}
          </strong>{" "}
          pendientes
        </span>
        <span>
          <strong className="font-medium text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </strong>{" "}
          completadas
        </span>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TodoFilterBar currentFilter={filter} onFilterChange={setFilter} />
        <div className="sm:w-56">
          <TodoSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={loadTodos}
            disabled={isLoading}
            className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
          >
            Reintentar
          </button>
        </div>
      )}
      {/* List */}
      <TodoList todos={displayTodos} isLoading={isLoading} />

      <div className="flex items-center justify-between flex-col md:flex-row gap-3 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
        <div className="text-zinc-600 dark:text-zinc-400">
          Página {page} de {totalPages} · {total} tareas
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={!hasPrevPage || isLoading}
            className="rounded-md border border-zinc-300 px-3 py-1 text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={!hasNextPage || isLoading}
            className="rounded-md border border-zinc-300 px-3 py-1 text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
