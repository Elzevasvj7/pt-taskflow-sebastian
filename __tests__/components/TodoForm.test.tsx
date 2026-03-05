import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "@/components/todo/TodoForm";

describe("TodoForm", () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders the form with title input and submit button", () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText("Título del todo")).toBeInTheDocument();
    expect(screen.getByLabelText("Agregar todo")).toBeInTheDocument();
  });

  it("submit button is disabled when title is empty", () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText("Agregar todo")).toBeDisabled();
  });

  it("calls onSubmit with title and clears the form", async () => {
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText("Título del todo");
    await user.type(titleInput, "New task");
    await user.click(screen.getByLabelText("Agregar todo"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        todo: "New task",
        completed: false,
        userId: 5,
      });
    });

    expect(titleInput).toHaveValue("");
  });

  it("does not submit when title is whitespace only", async () => {
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText("Título del todo");
    await user.type(titleInput, "   ");

    // Button should still be disabled (trim check)
    expect(screen.getByLabelText("Agregar todo")).toBeDisabled();
  });
});
