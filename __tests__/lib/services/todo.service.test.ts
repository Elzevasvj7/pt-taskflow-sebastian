import {
  filterTodos,
  searchTodos,
  getTodoStats,
} from '@/lib/selectors/todo.selectors';
import type { Todo } from '@/lib/types';

// ─── Test fixtures ──────────────────────────────────────────

const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 255,
  todo: 'Test todo',
  completed: false,
  ...overrides,
});

const mockTodos: Todo[] = [
  createTodo({ id: '1', todo: 'Pending task', completed: false }),
  createTodo({ id: '2', todo: 'Completed task', completed: true }),
  createTodo({ id: '3', todo: 'Another pending', completed: false, }),
];

// ─── filterTodos ────────────────────────────────────────────

describe('filterTodos', () => {
  it('returns only pending todos when filter is "pending"', () => {
    const result = filterTodos(mockTodos, 'pending');
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.completed === false)).toBe(true);
  });

  it('returns only completed todos when filter is "completed"', () => {
    const result = filterTodos(mockTodos, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(true);
  });

});


// ─── searchTodos ────────────────────────────────────────────

describe('searchTodos', () => {
  it('searches by title (case-insensitive)', () => {
    const result = searchTodos(mockTodos, 'PENDING');
    expect(result).toHaveLength(2);
  });

  it('returns empty array when no match', () => {
    expect(searchTodos(mockTodos, 'nonexistent')).toEqual([]);
  });
});

// ─── getTodoStats ───────────────────────────────────────────

describe('getTodoStats', () => {
  it('calculates correct stats', () => {
    const stats = getTodoStats(mockTodos);
    expect(stats.total).toBe(3);
    expect(stats.pending).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.completionRate).toBe(33);
  });

});


