import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoFilterBar } from "@/components/todo/TodoFilterBar";

describe("TodoFilterBar", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders all filter options", () => {
    render(<TodoFilterBar currentFilter="all" onFilterChange={mockOnChange} />);
    expect(screen.getByText("Todas")).toBeInTheDocument();
    expect(screen.getByText("Pendientes")).toBeInTheDocument();
    expect(screen.getByText("Completadas")).toBeInTheDocument();
  });

  it("calls onFilterChange when a filter is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoFilterBar currentFilter="all" onFilterChange={mockOnChange} />);

    await user.click(screen.getByText("Completadas"));
    expect(mockOnChange).toHaveBeenCalledWith("completed");
  });
});
