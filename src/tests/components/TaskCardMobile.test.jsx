// src/tests/components/TaskCardMobile.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCardMobile } from "../../components/TaskCardMobile";

// Mock các component con
jest.mock("../../components/TaskPriorityBadge", () => ({
  TaskPriorityBadge: ({ priority }) => (
    <div data-testid="priority-badge">{priority}</div>
  ),
}));

jest.mock("../../components/TaskStatusBadge", () => ({
  TaskStatusBadge: ({ status }) => (
    <div data-testid="status-badge">{status}</div>
  ),
}));

jest.mock("../../components/ChecklistView", () => ({
  ChecklistView: ({ checklist }) => (
    <ul data-testid="checklist-view">
      {checklist.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  ),
}));

describe("TaskCardMobile", () => {
  const defaultTask = {
    id: "1",
    title: "Test Task",
    status: "todo",
    priority: "high",
    deadline: "2025-09-22",
    checklist: ["Item 1", "Item 2"],
  };

  it("renders task title, priority, status, deadline and checklist", () => {
    render(<TaskCardMobile task={defaultTask} onToggleCompletion={() => {}} />);

    // Title
    expect(screen.getByText(defaultTask.title)).toBeInTheDocument();

    // Checkbox
    const checkbox = screen.getByTestId(`mobile-checkbox-${defaultTask.id}`);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // Priority badge
    expect(screen.getByTestId("priority-badge")).toHaveTextContent(
      defaultTask.priority
    );

    // Status badge
    expect(screen.getByTestId("status-badge")).toHaveTextContent(
      defaultTask.status
    );

    // Deadline
    expect(screen.getByText("22/09/2025")).toBeInTheDocument(); // formatDate mocked format: dd/mm/yyyy

    // Checklist
    expect(screen.getByTestId("checklist-view")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("calls onToggleCompletion when checkbox is clicked", () => {
    const mockToggle = jest.fn();
    render(
      <TaskCardMobile task={defaultTask} onToggleCompletion={mockToggle} />
    );

    const checkbox = screen.getByTestId(`mobile-checkbox-${defaultTask.id}`);
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledWith(defaultTask.id, true);
  });

  it("renders title with line-through when status is done", () => {
    const doneTask = { ...defaultTask, status: "done" };
    render(<TaskCardMobile task={doneTask} onToggleCompletion={() => {}} />);

    const title = screen.getByText(doneTask.title);
    expect(title).toHaveClass("line-through text-gray-400");

    const checkbox = screen.getByTestId(`mobile-checkbox-${doneTask.id}`);
    expect(checkbox).toBeChecked();
  });

  it("renders 'Xem' button", () => {
    render(<TaskCardMobile task={defaultTask} onToggleCompletion={() => {}} />);
    const button = screen.getByText("Xem");
    expect(button).toBeInTheDocument();
  });
});
