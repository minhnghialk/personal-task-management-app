import React from "react";
import { render, screen } from "@testing-library/react";
import { ChecklistView } from "../../components/ChecklistView";

describe("ChecklistView component", () => {
  test("renders 'Không có' if checklist is undefined", () => {
    render(<ChecklistView />);
    expect(screen.getByText("Không có")).toBeInTheDocument();
  });

  test("renders 'Không có' if checklist is empty", () => {
    render(<ChecklistView checklist={[]} />);
    expect(screen.getByText("Không có")).toBeInTheDocument();
  });

  test("renders checklist items correctly", () => {
    const checklist = [
      { id: "1", text: "Task 1", done: false },
      { id: "2", text: "Task 2", done: true },
      { id: "3", text: "Task 3", done: false },
    ];

    render(<ChecklistView checklist={checklist} />);

    // Kiểm tra tất cả item hiển thị
    checklist.forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
      if (item.done) {
        expect(screen.getByText(item.text)).toHaveClass(
          "line-through text-gray-400"
        );
      } else {
        expect(screen.getByText(item.text)).not.toHaveClass(
          "line-through text-gray-400"
        );
      }
    });
  });
});
