// src/tests/components/TaskPriorityBadge.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { TaskPriorityBadge } from "../../components/TaskPriorityBadge";

describe("TaskPriorityBadge", () => {
  it("renders 'Cao' with red styles for high priority", () => {
    render(<TaskPriorityBadge priority="high" />);
    const badge = screen.getByText("Cao");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-red-100 text-red-700");
  });

  it("renders 'Trung bình' with yellow styles for medium priority", () => {
    render(<TaskPriorityBadge priority="medium" />);
    const badge = screen.getByText("Trung bình");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-yellow-100 text-yellow-700");
  });

  it("renders 'Thấp' with green styles for low priority", () => {
    render(<TaskPriorityBadge priority="low" />);
    const badge = screen.getByText("Thấp");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-100 text-green-700");
  });

  it("renders 'Thấp' with green styles when priority is undefined", () => {
    render(<TaskPriorityBadge />);
    const badge = screen.getByText("Thấp");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-100 text-green-700");
  });
});
