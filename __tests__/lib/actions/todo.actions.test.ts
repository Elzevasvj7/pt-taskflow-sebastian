import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '@/lib/actions/todo.actions';
import type { Todo, PaginatedResponse } from '@/lib/types';

// ─── Mock Setup ─────────────────────────────────────────────

const mockFetch = jest.fn();
global.fetch = mockFetch;

// ─── Helpers ────────────────────────────────────────────────

const seedTodos: Todo[] = [
  {
    id: '1',
    todo: 'First todo',
    completed: false,
  },
  {
    id: '2',
    todo: 'Second todo',
    completed: true,
  },
];

const paginatedResponse: PaginatedResponse<Todo> = {
  todos: seedTodos,
  total: 2,
  skip: 0,
  limit: 10,
};

function mockResponse<T>(data: T, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as Response;
}

function mockErrorResponse(status: number, message?: string): Response {
  return {
    ok: false,
    status,
    json: async () => (message ? { message } : {}),
  } as Response;
}

beforeEach(() => {
  mockFetch.mockReset();
});

// ─── getTodos ───────────────────────────────────────────────

describe('getTodos', () => {
  it('returns paginated response with todos', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(paginatedResponse));

    const result = await getTodos();
    expect(result.todos).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.skip).toBe(0);
    expect(result.limit).toBe(10);
  });
  it('includes pagination params in query string', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(paginatedResponse));

    await getTodos({ limit: 5, skip: 10 });

    const callUrl = mockFetch.mock.calls[0][0] as string;
    expect(callUrl).toContain('limit=5');
    expect(callUrl).toContain('skip=10');
  });
});

// ─── getTodoById ────────────────────────────────────────────

describe('getTodoById', () => {
  it('returns the todo by id', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(seedTodos[0]));

    const todo = await getTodoById('1');
    expect(todo).not.toBeNull();
    expect(todo?.todo).toBe('First todo');
  });

  it('returns null for nonexistent id', async () => {
    mockFetch.mockResolvedValueOnce(mockErrorResponse(404));

    const todo = await getTodoById('nonexistent');
    expect(todo).toBeNull();
  });

});

// ─── createTodo ─────────────────────────────────────────────

describe('createTodo', () => {
  it('creates a new todo and sends expected payload', async () => {
    const createdTodo: Todo = {
      id: '3',
      todo: 'New task',
      completed: false,
    };
    mockFetch.mockResolvedValueOnce(mockResponse(createdTodo));

    const newTodo = await createTodo({ todo: 'New task', userId: 5 });

    expect(newTodo.todo).toBe('New task');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/todos/add'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ todo: 'New task', userId: 5 }),
      }),
    );
  });
});

// ─── updateTodo ─────────────────────────────────────────────

describe('updateTodo', () => {
  it('updates completed status', async () => {
    const updatedTodo: Todo = {
      ...seedTodos[0],
      completed: true,
    };
    mockFetch.mockResolvedValueOnce(mockResponse(updatedTodo));

    const updated = await updateTodo('1', { completed: true});
    expect(updated.completed).toBe(true);
  });

   it('throws for nonexistent id', async () => {
    mockFetch.mockResolvedValueOnce(mockErrorResponse(404));

    await expect(updateTodo('nonexistent', {completed: true})).rejects.toThrow();
  });


});

// ─── deleteTodo ─────────────────────────────────────────────

describe('deleteTodo', () => {
  it('calls DELETE endpoint successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => undefined,
    } as Response);

    await expect(deleteTodo('1')).resolves.toBeUndefined();
  });

  it('throws for nonexistent id', async () => {
    mockFetch.mockResolvedValueOnce(
      mockErrorResponse(404, 'Todo with id "nonexistent" not found'),
    );

    await expect(deleteTodo('nonexistent')).rejects.toThrow(
      'Todo with id "nonexistent" not found',
    );
  });

});
