import React from "react";
import { render, screen } from "@testing-library/react";
import { TaskStatusBadge } from "../../components/TaskStatusBadge";

describe("TaskStatusBadge", () => {
  it("renders 'Chưa làm' with gray styles for todo status", () => {
    render(<TaskStatusBadge status="todo" />);
    const badge = screen.getByText("Chưa làm");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-gray-100 text-gray-700");
  });

  it("renders 'Đang làm' with yellow styles for in_progress status", () => {
    render(<TaskStatusBadge status="in_progress" />);
    const badge = screen.getByText("Đang làm");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-yellow-100 text-yellow-700");
  });

  it("renders 'Hoàn thành' with green styles for completed status", () => {
    render(<TaskStatusBadge status="completed" />);
    const badge = screen.getByText("Hoàn thành");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-100 text-green-700");
  });

  it("renders 'Hoàn thành' with green styles when status is undefined or unknown", () => {
    render(<TaskStatusBadge />);
    const badge = screen.getByText("Hoàn thành");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-100 text-green-700");
  });
});
