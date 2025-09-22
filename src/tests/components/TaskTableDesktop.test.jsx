import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskTableDesktop } from "../../components/TaskTableDesktop";
import { TaskRowDesktop } from "../../components/TaskRowDesktop";

jest.mock("../../components/TaskRowDesktop", () => ({
  TaskRowDesktop: jest.fn(({ task, onToggleCompletion }) => (
    <tr data-testid="task-row">
      <td>{task.title}</td>
      <td>
        <button onClick={() => onToggleCompletion(task.id)}>Toggle</button>
      </td>
    </tr>
  )),
}));

describe("TaskTableDesktop", () => {
  const mockTasks = [
    { id: "1", title: "Task 1", completed: false },
    { id: "2", title: "Task 2", completed: true },
  ];

  const onToggleCompletion = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders task rows when tasks are provided", () => {
    render(
      <TaskTableDesktop
        tasks={mockTasks}
        onToggleCompletion={onToggleCompletion}
      />
    );

    const taskRows = screen.getAllByTestId("task-row");
    expect(taskRows).toHaveLength(mockTasks.length);

    mockTasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText(/Toggle/i)[0]);
    expect(onToggleCompletion).toHaveBeenCalledWith("1");
  });

  it("renders fallback message when tasks array is empty", () => {
    render(
      <TaskTableDesktop tasks={[]} onToggleCompletion={onToggleCompletion} />
    );
    expect(screen.getByText("Chưa có task nào.")).toBeInTheDocument();
  });
});
