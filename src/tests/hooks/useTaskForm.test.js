import React from "react";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../auth/authSlice";
import { useTaskForm } from "../../hooks/useTaskForm";
import { supabase } from "../../api/supabaseClient";
import { toast } from "react-toastify";

// ------------------ Mock Supabase & Toast ------------------
jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// ------------------ Redux wrapper ------------------
const createWrapper = (
  preloadedState = { auth: { user: { id: "user-1" } } }
) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });
  return ({ children }) => <Provider store={store}>{children}</Provider>;
};

// ------------------ Constants ------------------
const DEFAULT_STATE = {
  title: "",
  description: "",
  deadline: "",
  priority: "low",
  status: "todo",
  checklist: [],
  newItem: "",
  errors: {},
  loading: false,
};

// ------------------ Setup Hook ------------------
const setup = (overrides = {}) => {
  const onTaskCreated = jest.fn(),
    onClose = jest.fn();
  const wrapper = createWrapper();
  const hook = renderHook(
    () => useTaskForm({ onTaskCreated, onClose, ...overrides }),
    { wrapper }
  );
  return {
    ...hook,
    onTaskCreated,
    onClose,
    fakeEvent: { preventDefault: jest.fn() },
  };
};

// ------------------ Async helpers ------------------
const addChecklistItem = async (result, text) => {
  act(() => result.current.setNewItem(text));
  await act(async () => result.current.handleAddChecklistItem());
};
const toggleChecklistItem = (result, id) =>
  act(() => result.current.handleToggleChecklist(id));
const removeChecklistItem = (result, id) =>
  act(() => result.current.handleRemoveChecklistItem(id));
const submitTask = async (result, fakeEvent) =>
  await act(async () => result.current.handleSubmit(fakeEvent));

// ------------------ Tests ------------------
describe("useTaskForm Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterAll(() => console.error.mockRestore());

  it("should initialize default state", () => {
    const { result } = setup();
    expect(result.current).toMatchObject(DEFAULT_STATE);
  });

  it("should handle checklist operations: add, toggle, remove", async () => {
    const { result } = setup();
    await addChecklistItem(result, "Item 1");
    const item = result.current.checklist[0];
    expect(item).toMatchObject({ text: "Item 1", done: false });

    toggleChecklistItem(result, item.id);
    expect(result.current.checklist[0].done).toBe(true);
    toggleChecklistItem(result, item.id);
    expect(result.current.checklist[0].done).toBe(false);

    removeChecklistItem(result, item.id);
    expect(result.current.checklist).toHaveLength(0);
  });

  // ------------------ Submit tests (table-driven) ------------------
  describe.each([
    ["success", { data: { id: "task-1" }, error: null }, toast.success, true],
    ["failure", { data: null, error: { message: "Fail" } }, toast.error, false],
  ])("handleSubmit %s", (scenario, mockResponse, toastFn, isSuccess) => {
    it(`should handle ${scenario}`, async () => {
      supabase.single.mockResolvedValue(mockResponse);
      const { result, onTaskCreated, onClose, fakeEvent } = setup();

      act(() => {
        result.current.setTitle("Task Test");
        result.current.setDeadline("2025-12-31");
      });
      await submitTask(result, fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(toastFn).toHaveBeenCalled();
      if (isSuccess) {
        expect(onTaskCreated).toHaveBeenCalledWith(mockResponse.data);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it("should submit task with checklist items", async () => {
      supabase.single.mockResolvedValue({
        data: { id: "task-2" },
        error: null,
      });
      const { result, onTaskCreated, onClose, fakeEvent } = setup();

      act(() => {
        result.current.setTitle("Task with Checklist");
        result.current.setDeadline("2025-12-31");
      });
      await addChecklistItem(result, "C1");
      await addChecklistItem(result, "C2");

      await submitTask(result, fakeEvent);

      expect(result.current.checklist).toHaveLength(0);
      expect(result.current.title).toBe("");
      expect(result.current.deadline).toBe("");
      expect(onTaskCreated).toHaveBeenCalledWith({ id: "task-2" });
      expect(onClose).toHaveBeenCalled();
    });
  });

  // ------------------ Validation tests ------------------
  describe.each([
    [
      "empty title",
      { set: (r) => act(() => r.current.setDeadline("2025-12-31")) },
      "title",
      "Tiêu đề task bắt buộc.",
    ],
    [
      "empty deadline",
      { set: (r) => act(() => r.current.setTitle("Task")) },
      "deadline",
      "Deadline bắt buộc.",
    ],
    [
      "both empty",
      { set: () => {} },
      "both",
      { title: "Tiêu đề task bắt buộc.", deadline: "Deadline bắt buộc." },
    ],
  ])("validation %s", (_, { set }, field, expected) => {
    it(`should validate ${_}`, async () => {
      const { result, fakeEvent } = setup();
      set(result);
      await submitTask(result, fakeEvent);

      if (field === "both") {
        expect(result.current.errors).toMatchObject(expected);
      } else {
        expect(result.current.errors[field]).toBe(expected);
      }
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });
  });

  // ------------------ Reset form test ------------------
  it("should reset form after submit for all priority/status combinations", async () => {
    supabase.single.mockResolvedValue({ data: { id: "task-3" }, error: null });
    const { result, fakeEvent } = setup();

    const priorities = ["low", "medium", "high"];
    const statuses = ["todo", "in-progress", "done"];

    for (const p of priorities)
      for (const s of statuses) {
        act(() => {
          result.current.setTitle("Task");
          result.current.setDeadline("2025-12-31");
          result.current.setPriority(p);
          result.current.setStatus(s);
        });
        await submitTask(result, fakeEvent);
        expect(result.current.title).toBe("");
        expect(result.current.deadline).toBe("");
        expect(result.current.priority).toBe("Thấp");
        expect(result.current.status).toBe("Chưa làm");
      }
  });

  // ------------------ Exception tests ------------------
  it("should not add empty checklist item", async () => {
    const { result } = setup();
    act(() => result.current.setNewItem("  "));
    await act(async () => result.current.handleAddChecklistItem());
    expect(result.current.checklist).toHaveLength(0);
  });

  it("should handle exception in supabase.single", async () => {
    supabase.single.mockImplementation(() => {
      throw new Error("Unexpected error");
    });
    const { result, fakeEvent } = setup();
    act(() => {
      result.current.setTitle("Test");
      result.current.setDeadline("2025-12-31");
    });
    await submitTask(result, fakeEvent);

    expect(console.error).toHaveBeenCalledWith(
      "Error creating task:",
      "Unexpected error"
    );
    expect(toast.error).toHaveBeenCalledWith(
      "Tạo task thất bại. Vui lòng thử lại!"
    );
  });
});
