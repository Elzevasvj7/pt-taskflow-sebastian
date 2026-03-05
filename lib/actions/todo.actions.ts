"use server";

import {
  Todo,
  CreateTodoDTO,
  UpdateTodoDTO,
  PaginationParams,
  PaginatedResponse,
} from "@/lib/types";
import { request, ApiError } from "@/lib/api";

export async function getTodos(
  params: PaginationParams = {},
): Promise<PaginatedResponse<Todo>> {
  const searchParams = new URLSearchParams();

  if (params.limit !== undefined) {
    searchParams.set("limit", params.limit.toString());
  }
  if (params.skip !== undefined) {
    searchParams.set("skip", params.skip.toString());
  }

  const queryString = searchParams.toString();
  const path = queryString ? `/todos?${queryString}` : "/todos";

  return request<PaginatedResponse<Todo>>(path, {
    method: "GET",
  });
}

export async function getTodoById(id: string | number): Promise<Todo | null> {
  try {
    return await request<Todo>(`/todos/${id}`, {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) {
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

export async function deleteTodo(id: string | number): Promise<void> {
  await request<void>(`/todos/${id}`, {
    method: "DELETE",
  });
}
