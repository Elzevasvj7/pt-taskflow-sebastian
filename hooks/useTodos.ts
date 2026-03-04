"use client";

import { useCallback, useEffect, useReducer } from "react";
import { CreateTodoDTO, Todo, TodoFilter, UpdateTodoDTO } from "@/lib/types";
import { getTodos } from "@/lib/actions";
import { filterTodos, getTodoStats, searchTodos } from "@/lib/selectors";
import type { TodoStats } from "@/lib/selectors";
import { createTodo, updateTodo } from "@/lib/actions/todo.actions";
import { toast } from "sonner";

// ─── State ──────────────────────────────────────────────────

interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  total: number;
  limit: number;
  skip: number;
}

const initialState: TodoState = {
  todos: [],
  filter: "all",
  searchQuery: "",
  isLoading: false,
  error: null,
  total: 0,
  limit: 10,
  skip: 0,
};

// ─── Actions ────────────────────────────────────────────────

type TodoAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "SET_TODOS";
      payload: { todos: Todo[]; total: number; limit: number; skip: number };
    }
  | { type: "SET_FILTER"; payload: TodoFilter }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo };

// ─── Reducer ────────────────────────────────────────────────

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_TODOS":
      return {
        ...state,
        todos: action.payload.todos,
        total: action.payload.total,
        limit: action.payload.limit,
        skip: action.payload.skip,
        isLoading: false,
        error: null,
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "ADD_TODO":
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        total: state.total + 1,
      };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    default:
      return state;
  }
}

// ─── Hook ───────────────────────────────────────────────────

export interface UseTodosReturn {
  /** All todos (unfiltered) */
  todos: Todo[];
  /** Filtered and sorted todos ready for display */
  displayTodos: Todo[];
  /** Current filter */
  filter: TodoFilter;
  /** Current search query */
  searchQuery: string;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Current page (1-based) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total items available from server */
  total: number;
  /** Total pages based on total and page size */
  totalPages: number;
  /** Whether a previous page exists */
  hasPrevPage: boolean;
  /** Whether a next page exists */
  hasNextPage: boolean;
  /** Stats computed from all todos */
  stats: TodoStats;
  /** Load todos from the data source */
  loadTodos: () => Promise<void>;
  /** Set filter */
  setFilter: (filter: TodoFilter) => void;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Add a new todo */
  addTodo: (data: CreateTodoDTO) => Promise<void>;
  /** Edit an existing todo */
  editTodo: (id: Todo["id"], data: UpdateTodoDTO) => Promise<void>;
}

export interface UseTodosOptions {
  page?: number;
  pageSize?: number;
}

export function useTodos(options: UseTodosOptions = {}): UseTodosReturn {
  const page = options.page && options.page > 0 ? options.page : 1;
  const pageSize =
    options.pageSize && options.pageSize > 0 ? options.pageSize : 10;
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const isNotFoundError = useCallback((error: unknown): boolean => {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return (
      message.includes("404") ||
      message.includes("not found") ||
      message.includes("no encontrado")
    );
  }, []);

  const createRandomTodoId = useCallback((): number => {
    return Date.now() + Math.floor(Math.random() * 10000);
  }, []);

  const loadTodos = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const skip = (page - 1) * pageSize;
      const data = await getTodos({ limit: pageSize, skip });
      dispatch({
        type: "SET_TODOS",
        payload: {
          todos: data.todos,
          total: data.total,
          limit: data.limit,
          skip: data.skip,
        },
      });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload:
          err instanceof Error ? err.message : "Error al cargar los todos",
      });
    }
  }, [page, pageSize]);

  const addTodo = useCallback(
    async (data: CreateTodoDTO) => {
      try {
        const newTodo = await createTodo(data);
        const localTodo: Todo = { ...newTodo, id: createRandomTodoId() };
        dispatch({ type: "ADD_TODO", payload: localTodo });
        toast.success("Tarea creada correctamente");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al crear el todo";
        toast.error(message);
      }
    },
    [createRandomTodoId],
  );

  const editTodo = useCallback(
    async (id: Todo["id"], data: UpdateTodoDTO) => {
      try {
        const updated = await updateTodo(id, data);
        dispatch({ type: "UPDATE_TODO", payload: updated });
      } catch (err) {
        if (isNotFoundError(err)) {
          dispatch({ type: "UPDATE_TODO", payload: data });
          return;
        }
        toast.error(
          err instanceof Error ? err.message : "Error al actualizar el todo",
        );
      }
    },
    [isNotFoundError],
  );

  const setFilter = useCallback((filter: TodoFilter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Derived state
  const searched = searchTodos(state.todos, state.searchQuery);
  const filtered = filterTodos(searched, state.filter);
  const stats = getTodoStats(state.todos);
  const totalPages = Math.max(1, Math.ceil(state.total / pageSize));
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    todos: state.todos,
    displayTodos: filtered,
    filter: state.filter,
    searchQuery: state.searchQuery,
    isLoading: state.isLoading,
    error: state.error,
    page,
    pageSize,
    total: state.total,
    totalPages,
    hasPrevPage,
    hasNextPage,
    stats,
    loadTodos,
    setFilter,
    setSearchQuery,
    addTodo,
    editTodo,
  };
}
