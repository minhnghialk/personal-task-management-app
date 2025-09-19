import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskForm } from "../../components/TaskForm";
import { useTaskForm } from "../../hooks/useTaskForm";

// Mock hook
jest.mock("../../hooks/useTaskForm", () => ({
  useTaskForm: jest.fn(),
}));

describe("TaskForm Component - Full Coverage", () => {
  const mockOnClose = jest.fn();
  const mockOnTaskCreated = jest.fn();

  const baseHookReturn = {
    title: "",
    setTitle: jest.fn(),
    description: "",
    setDescription: jest.fn(),
    deadline: "",
    setDeadline: jest.fn(),
    priority: "medium",
    setPriority: jest.fn(),
    status: "todo",
    setStatus: jest.fn(),
    checklist: [],
    newItem: "",
    setNewItem: jest.fn(),
    errors: {},
    loading: false,
    handleAddChecklistItem: jest.fn(),
    handleRemoveChecklistItem: jest.fn(),
    handleToggleChecklist: jest.fn(),
    handleSubmit: jest.fn((e) => e.preventDefault()),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useTaskForm.mockReturnValue({ ...baseHookReturn });
  });

  test("render tất cả field và button cơ bản", () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );

    expect(
      screen.getByPlaceholderText(/Nhập tiêu đề task/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Mô tả chi tiết công việc/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Deadline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ưu tiên/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Trạng thái/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo mới" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Huỷ" })).toBeInTheDocument();
  });

  test("submit form calls handleSubmit", async () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Tạo mới" }));
    await waitFor(() => expect(baseHookReturn.handleSubmit).toHaveBeenCalled());
  });

  test("hiển thị lỗi validation khi có errors", () => {
    useTaskForm.mockReturnValue({
      ...baseHookReturn,
      errors: {
        title: "Vui lòng nhập tiêu đề",
        deadline: "Vui lòng chọn deadline",
      },
    });

    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );
    expect(screen.getByText(/Vui lòng nhập tiêu đề/i)).toBeInTheDocument();
    expect(screen.getByText(/Vui lòng chọn deadline/i)).toBeInTheDocument();
  });

  test("thay đổi input gọi setter tương ứng", () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Nhập tiêu đề task/i), {
      target: { value: "Task 1" },
    });
    expect(baseHookReturn.setTitle).toHaveBeenCalledWith("Task 1");

    fireEvent.change(screen.getByPlaceholderText(/Mô tả chi tiết công việc/i), {
      target: { value: "Desc" },
    });
    expect(baseHookReturn.setDescription).toHaveBeenCalledWith("Desc");

    fireEvent.change(screen.getByLabelText(/Deadline/i), {
      target: { value: "2025-12-31" },
    });
    expect(baseHookReturn.setDeadline).toHaveBeenCalledWith("2025-12-31");
  });

  test("thay đổi priority và status gọi setter", () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );

    fireEvent.change(screen.getByLabelText(/Ưu tiên/i), {
      target: { value: "high" },
    });
    expect(baseHookReturn.setPriority).toHaveBeenCalledWith("high");

    fireEvent.change(screen.getByLabelText(/Trạng thái/i), {
      target: { value: "done" },
    });
    expect(baseHookReturn.setStatus).toHaveBeenCalledWith("done");
  });

  test("checklist add, toggle, remove hoạt động", () => {
    useTaskForm.mockReturnValue({
      ...baseHookReturn,
      checklist: [{ id: "1", text: "Item 1", done: false }],
      newItem: "New Item",
    });

    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );

    // Add
    const addBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector("svg.lucide-plus"));
    fireEvent.click(addBtn);
    expect(baseHookReturn.handleAddChecklistItem).toHaveBeenCalled();

    // Toggle
    const checkbox = screen.getByRole("checkbox", { name: "Item 1" });
    fireEvent.click(checkbox);
    expect(baseHookReturn.handleToggleChecklist).toHaveBeenCalledWith("1");

    // Remove
    const removeBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector("svg.lucide-trash2"));
    fireEvent.click(removeBtn);
    expect(baseHookReturn.handleRemoveChecklistItem).toHaveBeenCalledWith("1");
  });

  test("gõ vào ô checklist gọi setNewItem", () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );

    const input = screen.getByPlaceholderText(/Thêm checklist/i);
    fireEvent.change(input, { target: { value: "Work item" } });
    expect(baseHookReturn.setNewItem).toHaveBeenCalledWith("Work item");
  });

  test("bấm Huỷ gọi onClose", () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Huỷ" }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("loading state hiển thị 'Đang tạo...' và disabled", () => {
    useTaskForm.mockReturnValue({
      ...baseHookReturn,
      loading: true,
    });

    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );
    const submitBtn = screen.getByRole("button", { name: "Đang tạo..." });
    expect(submitBtn).toBeDisabled();
  });

  test("không render form khi isOpen=false", () => {
    render(
      <TaskForm
        isOpen={false}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );
    expect(
      screen.queryByPlaceholderText(/Nhập tiêu đề task/i)
    ).not.toBeInTheDocument();
  });

  test("onTaskCreated được gọi sau khi submit", async () => {
    const customHandleSubmit = jest.fn((e) => {
      e.preventDefault();
      mockOnTaskCreated({ id: "123", title: "New Task" });
    });

    useTaskForm.mockReturnValue({
      ...baseHookReturn,
      handleSubmit: customHandleSubmit,
    });

    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Tạo mới" }));

    await waitFor(() =>
      expect(mockOnTaskCreated).toHaveBeenCalledWith({
        id: "123",
        title: "New Task",
      })
    );
  });
});
