"use server";

import {
  Todo,
  CreateTodoDTO,
  UpdateTodoDTO,
  PaginationParams,
  PaginatedResponse,
} from "@/lib/types";

const API_BASE_URL = process.env.API_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = (await response.json()) as { message?: string };
      if (payload?.message) {
        message = payload.message;
      }
    } catch {
      // Ignore JSON parsing errors and fallback to generic message
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getTodos(
  params: PaginationParams = {},
): Promise<PaginatedResponse<Todo>> {
  try {
    const searchParams = new URLSearchParams();

    if (params.limit !== undefined) {
      searchParams.set("limit", params.limit.toString());
    }
    if (params.skip !== undefined) {
      searchParams.set("skip", params.skip.toString());
    }

    const queryString = searchParams.toString();
    const path = queryString ? `/todos?${queryString}` : "/todos";

    return await request<PaginatedResponse<Todo>>(path, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

export async function getTodoById(id: string | number): Promise<Todo | null> {
  try {
    return await request<Todo>(`/todos/${id}`, {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("status 404")) {
      return null;
    }

    throw error;
  }
}

export async function createTodo(data: CreateTodoDTO): Promise<Todo> {
  return request<Todo>("/todos/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTodo(
  id: string | number,
  data: UpdateTodoDTO,
): Promise<Todo> {
  return request<Todo>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
