import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskTableMobile } from "../../components/TaskTableMobile";
import { TaskCardMobile } from "../../components/TaskCardMobile";

jest.mock("../../components/TaskCardMobile", () => ({
  TaskCardMobile: jest.fn(({ task, onToggleCompletion }) => (
    <div data-testid="task-card">
      <span>{task.title}</span>
      <button onClick={() => onToggleCompletion(task.id)}>Toggle</button>
    </div>
  )),
}));

describe("TaskTableMobile", () => {
  const mockTasks = [
    { id: "1", title: "Task 1", completed: false },
    { id: "2", title: "Task 2", completed: true },
  ];

  const onToggleCompletion = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders task cards when tasks are provided", () => {
    render(
      <TaskTableMobile
        tasks={mockTasks}
        onToggleCompletion={onToggleCompletion}
      />
    );

    const taskCards = screen.getAllByTestId("task-card");
    expect(taskCards).toHaveLength(mockTasks.length);

    mockTasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText(/Toggle/i)[0]);
    expect(onToggleCompletion).toHaveBeenCalledWith("1");
  });

  it("renders fallback message when tasks array is empty", () => {
    render(
      <TaskTableMobile tasks={[]} onToggleCompletion={onToggleCompletion} />
    );
    expect(screen.getByText("Chưa có task nào.")).toBeInTheDocument();
  });
});
