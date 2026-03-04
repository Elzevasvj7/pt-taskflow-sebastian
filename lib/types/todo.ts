export type TodoStatus = 'pending' | 'completed';

export interface Todo {
  id: string | number;
  todo: string;
  completed: boolean;
}

export interface CreateTodoDTO {
  todo: string;
  completed?: boolean;
  userId: number;
}

export interface UpdateTodoDTO {
  id: string | number;
  todo: string;
  completed: boolean;
}

export type TodoFilter = 'all' | 'pending' | 'completed';

export interface PaginationParams {
  limit?: number;
  skip?: number;
}

export interface PaginatedResponse<T> {
  todos: T[];
  total: number;
  skip: number;
  limit: number;
}
