import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskTable } from "../../components/TaskTable";

// Mock các component con
jest.mock("../../components/TaskForm", () => ({
  TaskForm: ({ isOpen, onClose, onTaskCreated }) => (
    <div>
      {isOpen && (
        <>
          <button onClick={onClose}>Close Modal</button>
          <button onClick={() => onTaskCreated({ id: "t1", title: "Task 1" })}>
            Create Task
          </button>
        </>
      )}
    </div>
  ),
}));

jest.mock("../../components/TaskTableHeader", () => ({
  TaskTableHeader: ({ onAdd }) => <button onClick={onAdd}>Add Task</button>,
}));

jest.mock("../../components/TaskTableMobile", () => ({
  TaskTableMobile: ({ tasks, onToggleCompletion }) => (
    <div>
      {tasks.map((t) => (
        <button key={t.id} onClick={() => onToggleCompletion(t.id)}>
          {t.title}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("../../components/TaskTableDesktop", () => ({
  TaskTableDesktop: ({ tasks, onToggleCompletion }) => (
    <div>
      {tasks.map((t) => (
        <button key={t.id} onClick={() => onToggleCompletion(t.id)}>
          {t.title}-desktop
        </button>
      ))}
    </div>
  ),
}));

describe("TaskTable component", () => {
  let onTaskCreated;
  let onToggleCompletion;

  const mockTasks = [
    { id: "t1", title: "Task 1" },
    { id: "t2", title: "Task 2" },
  ];

  beforeEach(() => {
    onTaskCreated = jest.fn();
    onToggleCompletion = jest.fn();
  });

  test("renders TaskTable with tasks", () => {
    render(
      <TaskTable
        tasks={mockTasks}
        onTaskCreated={onTaskCreated}
        onToggleCompletion={onToggleCompletion}
      />
    );

    // Mobile table
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();

    // Desktop table
    expect(screen.getByText("Task 1-desktop")).toBeInTheDocument();
    expect(screen.getByText("Task 2-desktop")).toBeInTheDocument();
  });

  test("click header Add button opens modal", () => {
    render(
      <TaskTable
        tasks={mockTasks}
        onTaskCreated={onTaskCreated}
        onToggleCompletion={onToggleCompletion}
      />
    );

    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Close Modal")).toBeInTheDocument();
    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });

  test("modal onTaskCreated called correctly", () => {
    render(
      <TaskTable
        tasks={mockTasks}
        onTaskCreated={onTaskCreated}
        onToggleCompletion={onToggleCompletion}
      />
    );

    // open modal
    fireEvent.click(screen.getByText("Add Task"));
    fireEvent.click(screen.getByText("Create Task"));
    expect(onTaskCreated).toHaveBeenCalledWith({ id: "t1", title: "Task 1" });
  });

  test("modal onClose closes modal", () => {
    render(
      <TaskTable
        tasks={mockTasks}
        onTaskCreated={onTaskCreated}
        onToggleCompletion={onToggleCompletion}
      />
    );

    // open modal
    fireEvent.click(screen.getByText("Add Task"));
    fireEvent.click(screen.getByText("Close Modal"));
    // modal content no longer in document
    expect(screen.queryByText("Create Task")).not.toBeInTheDocument();
  });

  test("click onToggleCompletion in mobile and desktop calls callback", () => {
    render(
      <TaskTable
        tasks={mockTasks}
        onTaskCreated={onTaskCreated}
        onToggleCompletion={onToggleCompletion}
      />
    );

    // Mobile
    fireEvent.click(screen.getByText("Task 1"));
    expect(onToggleCompletion).toHaveBeenCalledWith("t1");

    // Desktop
    fireEvent.click(screen.getByText("Task 1-desktop"));
    expect(onToggleCompletion).toHaveBeenCalledWith("t1");
  });
});
