"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Circle, CircleCheckBig, CircleDashed, Notebook, Plus } from "lucide-react";
import {
  TodoList,
  TodoFilterBar,
  TodoSearch,
  TodoForm,
} from "@/components/todo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTodos } from "@/hooks/useTodos";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export function TodoContainer() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
    editTodo,
    removeTodo,
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

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  return (
    <div className="relative z-10 flex w-full max-w-500 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] shadow-[0_30px_80px_-45px_rgba(33,24,18,0.35)]">
      <aside className="hidden w-44 shrink-0 border-r border-[var(--border)] bg-[var(--panel)] px-10 py-10 md:flex md:flex-col">
        <div className="flex items-center justify-center">
          <p className="text-[2rem] font-semibold tracking-tight text-[color:var(--foreground)]">
            <Notebook className="" height={40} width={40} />
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="mt-14">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--foreground)] text-[var(--panel)] shadow-[0_14px_35px_-24px_rgba(0,0,0,0.8)] transition hover:scale-[1.03]"
              aria-label="Crear nueva tarea"
            >
              <Plus className="h-8 w-8" />
            </button>
          </div>
          <span className="h-7 w-7 rounded-full bg-[#d8d8d8]" />
          <span className="h-7 w-7 rounded-full bg-[#ffbf60]" />
          <span className="h-7 w-7 rounded-full bg-[#ff9d7b]" />
          <span className="h-7 w-7 rounded-full bg-[#a98bff]" />
          <span className="h-7 w-7 rounded-full bg-[#34c9ef]" />
          <span className="h-7 w-7 rounded-full bg-[#dce96c]" />
        </div>

        <div className="mt-auto flex items-center justify-center">
          <ThemeToggle />
        </div>
      </aside>

      <section className="min-w-0 flex-1 px-6 py-6 sm:px-10 sm:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-sm">
              <TodoSearch value={searchQuery} onChange={setSearchQuery} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <TodoFilterBar
                currentFilter={filter}
                onFilterChange={setFilter}
              />
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-6xl font-semibold tracking-[-0.06em] text-[color:var(--foreground)] sm:text-7xl">
              Notes
            </h1>
            <p className="mt-3 max-w-xl text-base text-[color:var(--foreground)]/58">
              Tareas pensadas como notas adhesivas: grandes, visibles y faciles
              de recorrer.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-[2rem] bg-[var(--panel-strong)] p-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground)]/45">
                Board info
              </p>
              <p className="mt-2 text-sm text-[color:var(--foreground)]/62">
                Usa el boton + para crear una nota con color personalizado.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-[1.6rem] bg-[#ffd06e] px-4 py-4 text-center text-[color:var(--foreground)]">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-55">
                  Total
                </p>
                <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
              </div>
              <div className="rounded-[1.6rem] bg-[#ffad8d] px-4 py-4 text-center text-[color:var(--foreground)]">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-55">
                  Pending
                </p>
                <p className="mt-2 text-2xl font-semibold">{stats.pending}</p>
              </div>
              <div className="rounded-[1.6rem] bg-[#bca2ff] px-4 py-4 text-center text-[color:var(--foreground)]">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-55">
                  Done
                </p>
                <p className="mt-2 text-2xl font-semibold">{stats.completed}</p>
              </div>
            </div>

            <div className="rounded-[1.6rem] bg-[var(--panel)] px-5 py-4 text-sm text-[color:var(--foreground)]/65">
              Pagina {page} de {totalPages} · {total} tareas
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={!hasPrevPage || isLoading}
                className="flex-1 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-medium text-[color:var(--foreground)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={!hasNextPage || isLoading}
                className="flex-1 rounded-full bg-[color:var(--foreground)] px-4 py-3 text-sm font-medium text-[var(--panel)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="flex items-center gap-2 rounded-full bg-[var(--panel)] px-3 py-2 text-xs text-[color:var(--foreground)]/70">
                <Circle className="h-3.5 w-3.5 fill-[#ffd06e] text-[#ffd06e]" />
                Idea
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[var(--panel)] px-3 py-2 text-xs text-[color:var(--foreground)]/70">
                <CircleDashed className="h-3.5 w-3.5 text-[#ffad8d]" />
                Pendiente
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[var(--panel)] px-3 py-2 text-xs text-[color:var(--foreground)]/70">
                <CircleCheckBig className="h-3.5 w-3.5 text-[#8ecf9d]" />
                Completa
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)]">
            <div>
              {error && (
                <div
                  className="mb-5 flex items-center justify-between gap-3 rounded-3xl border border-[var(--danger)]/35 bg-[var(--danger)]/10 px-5 py-4 text-sm text-[var(--danger)]"
                  role="alert"
                >
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={loadTodos}
                    disabled={isLoading}
                    className="rounded-full border border-[var(--danger)]/40 px-4 py-2 text-xs font-medium text-[var(--danger)] transition hover:bg-[var(--danger)]/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              <TodoList
                todos={displayTodos}
                isLoading={isLoading}
                onEdit={editTodo}
                onDelete={removeTodo}
              />
            </div>
          </div>
        </div>
      </section>

      <TodoForm
        onSubmit={addTodo}
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
