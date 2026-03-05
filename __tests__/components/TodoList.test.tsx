import React from 'react';
import { render, screen } from '@testing-library/react';
import { TodoList } from '@/components/todo/TodoList';
import type { Todo } from '@/lib/types';

const mockTodos: Todo[] = [
  {
    id: '1',
    todo: 'First task',
    completed: false,
  },
  {
    id: '2',
    todo: 'Second task',
    completed: true,
  },
];

describe('TodoList', () => {
  const noop = jest.fn().mockResolvedValue(undefined);

  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(
      <TodoList todos={[]} isLoading={true} onDelete={noop} onEdit={noop} />,
    );
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('renders empty state when there are no todos', () => {
    render(
      <TodoList todos={[]} isLoading={false} onDelete={noop} onEdit={noop} />,
    );
    expect(screen.getByText('No hay tareas por aquí')).toBeInTheDocument();
  });

  it('renders all todo items', () => {
    render(
      <TodoList todos={mockTodos} isLoading={false} onDelete={noop} onEdit={noop} />,
    );
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });
});
