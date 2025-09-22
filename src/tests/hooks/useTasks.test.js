import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTasks } from "../../hooks/useTasks";
import { supabase } from "../../api/supabaseClient";

jest.mock("../../api/supabaseClient", () => {
  const mockTasks = [
    { id: "task-1", title: "Task 1", status: "todo", created_at: "2025-01-01" },
    { id: "task-2", title: "Task 2", status: "done", created_at: "2025-01-02" },
  ];
  const order = jest.fn(() =>
    Promise.resolve({ data: mockTasks, error: null })
  );
  const eq = jest.fn(() => ({ order }));
  const select = jest.fn(() => ({ eq }));
  const updateEq = jest.fn(() => Promise.resolve({ error: null }));
  const update = jest.fn(() => ({ eq: updateEq }));
  const from = jest.fn(() => ({ select, update }));
  return { supabase: { from } };
});

const renderUseTasks = (user = { id: "user-1" }) =>
  renderHook(() => useTasks(user));
const toggleTask = async (result, taskId, checked) =>
  act(async () => await result.current.toggleTaskCompletion(taskId, checked));

describe("useTasks Hook", () => {
  let consoleErrorSpy;
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterAll(() => consoleErrorSpy.mockRestore());

  it("fetches tasks successfully", async () => {
    const { result } = renderUseTasks();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0]).toHaveProperty("prevStatus");
  });

  it("handles fetch error", async () => {
    supabase
      .from()
      .select()
      .eq()
      .order.mockResolvedValueOnce({ data: [], error: { message: "Fail" } });
    const { result } = renderUseTasks();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Error fetching tasks:", "Fail");
  });

  it("does not fetch tasks if user is null", () => {
    const { result } = renderUseTasks(null);
    expect(result.current.tasks).toEqual([]);
  });

  it("does not fetch tasks if user is undefined", () => {
    const { result } = renderUseTasks(undefined);
    expect(result.current.tasks).toEqual([]);
  });

  it("handles empty task list correctly", async () => {
    supabase
      .from()
      .select()
      .eq()
      .order.mockResolvedValueOnce({ data: [], error: null });
    const { result } = renderUseTasks();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks).toEqual([]);
  });

  it("toggles task completion successfully", async () => {
    const { result } = renderUseTasks();
    await waitFor(() => expect(result.current.loading).toBe(false));
    const taskId = result.current.tasks[0].id;
    await toggleTask(result, taskId, true);
    expect(result.current.tasks[0].status).toBe("done");
    await toggleTask(result, taskId, false);
    expect(result.current.tasks[0].status).toBe("todo");
  });

  it("reverts task status if update fails", async () => {
    supabase
      .from()
      .update()
      .eq.mockResolvedValueOnce({ error: { message: "Fail" } });
    const { result } = renderUseTasks();
    await waitFor(() => expect(result.current.loading).toBe(false));
    const taskId = result.current.tasks[0].id;
    const prevStatus = result.current.tasks[0].status;
    await toggleTask(result, taskId, prevStatus === "todo");
    await waitFor(() =>
      expect(result.current.tasks[0].status).toBe(prevStatus)
    );
    expect(console.error).toHaveBeenCalledWith("Error updating task:", "Fail");
  });

  it("handles update with no change gracefully", async () => {
    const { result } = renderUseTasks();
    await waitFor(() => expect(result.current.loading).toBe(false));
    const taskId = result.current.tasks[0].id;
    const prevStatus = result.current.tasks[0].status;
    await toggleTask(result, taskId, prevStatus === "todo" ? false : true);
    expect(result.current.tasks[0].status).toBe(prevStatus);
  });

  it("toggle task when task id does not exist", async () => {
    const { result } = renderUseTasks();
    await waitFor(() => expect(result.current.loading).toBe(false));
    await toggleTask(result, "non-existent-id", true);
    expect(result.current.tasks).toHaveLength(2);
  });

  it("does not throw error when tasks array is empty during update", async () => {
    supabase
      .from()
      .update()
      .eq.mockResolvedValueOnce({ error: { message: "Fail" } });
    const { result } = renderUseTasks();
    act(() => result.current.setTasks([]));
    await toggleTask(result, "task-1", true);
    expect(console.error).toHaveBeenCalledWith("Error updating task:", "Fail");
  });
});
