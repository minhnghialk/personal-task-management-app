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

// ------------------ Helper setup ------------------
const setup = (overrides = {}) => {
  const onTaskCreated = jest.fn();
  const onClose = jest.fn();
  const wrapper = createWrapper();
  const hook = renderHook(
    () => useTaskForm({ onTaskCreated, onClose, ...overrides }),
    { wrapper }
  );

  // global preventDefault mock
  const fakeEvent = { preventDefault: jest.fn() };

  return { ...hook, onTaskCreated, onClose, fakeEvent };
};

// ------------------ Async utilities ------------------
const addChecklistItem = async (result, text) => {
  act(() => result.current.setNewItem(text));
  await act(async () => result.current.handleAddChecklistItem());
};

const toggleChecklistItem = (result, id) => {
  act(() => result.current.handleToggleChecklist(id));
};

const removeChecklistItem = (result, id) => {
  act(() => result.current.handleRemoveChecklistItem(id));
};

const submitTask = async (result, fakeEvent) => {
  await act(async () => result.current.handleSubmit(fakeEvent));
};

// ------------------ Tests ------------------
describe("useTaskForm Hook (Polished Senior-level)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => console.error.mockRestore());

  it("should initialize default state correctly", () => {
    const { result } = setup();
    expect(result.current).toMatchObject(DEFAULT_STATE);
  });

  it("should handle checklist operations: add, toggle, remove", async () => {
    const { result } = setup();

    await addChecklistItem(result, "Task Item");
    const item = result.current.checklist[0];

    expect(result.current.checklist).toHaveLength(1);
    expect(item.text).toBe("Task Item");
    expect(item.done).toBe(false);

    toggleChecklistItem(result, item.id);
    expect(result.current.checklist[0].done).toBe(true);

    toggleChecklistItem(result, item.id);
    expect(result.current.checklist[0].done).toBe(false);

    removeChecklistItem(result, item.id);
    expect(result.current.checklist).toHaveLength(0);
  });

  describe.each([
    [
      "success",
      { data: { id: "task-1", title: "Test Task" }, error: null },
      "Tạo task thành công!",
      toast.success,
    ],
    [
      "failure",
      { data: null, error: { message: "Fail" } },
      "Tạo task thất bại. Vui lòng thử lại!",
      toast.error,
    ],
  ])("handleSubmit %s", (scenario, mockResponse, expectedMessage, toastFn) => {
    it(`should call correct handlers and toast on ${scenario}`, async () => {
      supabase.single.mockResolvedValue(mockResponse);

      const { result, onTaskCreated, onClose, fakeEvent } = setup();

      act(() => {
        result.current.setTitle("Test Task");
        result.current.setDeadline("2025-12-31");
      });

      await submitTask(result, fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(toastFn).toHaveBeenCalledWith(expectedMessage);

      if (!mockResponse.error) {
        expect(onTaskCreated).toHaveBeenCalledWith(mockResponse.data);
        expect(onClose).toHaveBeenCalled();
      }
    });
  });
});
