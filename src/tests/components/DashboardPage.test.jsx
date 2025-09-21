import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import { DashboardPage } from "../../pages/Dashboard";
import authReducer from "../../auth/authSlice";
import { useTasks } from "../../hooks/useTasks";
import { useSupabaseSession } from "../../hooks/useSupabaseSession";
import { supabase } from "../../api/supabaseClient";
import { toast } from "react-toastify";

// ---------- Mock ResizeObserver ----------
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// ---------- Mock Supabase ----------
jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}));

// ---------- Mock toast ----------
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// ---------- Mock hooks ----------
jest.mock("../../hooks/useTasks");
jest.mock("../../hooks/useSupabaseSession");

// ---------- Helper render with Redux ----------
const renderWithProviders = (ui, preloadedState) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: preloadedState || {
      auth: {
        user: { email: "test@example.com" },
        loading: false,
        error: null,
      },
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    ),
  };
};

// ---------- Initial mock tasks ----------
const initialTasks = [
  { id: 1, title: "Task One", status: "todo" },
  { id: 2, title: "Task Two", status: "done" },
];

describe("DashboardPage Component - Full Coverage", () => {
  let tasks, setTasksMock, toggleTaskCompletionMock;

  beforeEach(() => {
    // reset tasks state for each test
    tasks = initialTasks.map((t) => ({ ...t }));

    setTasksMock = jest.fn();
    toggleTaskCompletionMock = jest.fn(async (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = task.status === "todo" ? "done" : "todo";
      }
      return task;
    });

    useTasks.mockReturnValue({
      tasks,
      loading: false,
      setTasks: setTasksMock,
      toggleTaskCompletion: toggleTaskCompletionMock,
    });

    useSupabaseSession.mockReturnValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("render sidebar, header, main content", () => {
    renderWithProviders(<DashboardPage />);
    const sidebar = screen.getByRole("navigation");
    expect(within(sidebar).getByText("Dashboard")).toBeInTheDocument();
    expect(within(sidebar).getByText("Danh sách Task")).toBeInTheDocument();
    expect(within(sidebar).getByText("Thống kê")).toBeInTheDocument();
    expect(within(sidebar).getByText("Hồ sơ cá nhân")).toBeInTheDocument();

    const logoutBtns = screen.getAllByRole("button", { name: /Đăng xuất/i });
    expect(logoutBtns.length).toBeGreaterThan(0);

    const taskSection = screen.getByRole("main");
    expect(
      within(taskSection).getByTestId("desktop-checkbox-1")
    ).toBeInTheDocument();
    expect(
      within(taskSection).getByTestId("desktop-checkbox-2")
    ).toBeInTheDocument();
    expect(
      within(taskSection).getByTestId("mobile-checkbox-1")
    ).toBeInTheDocument();
    expect(
      within(taskSection).getByTestId("mobile-checkbox-2")
    ).toBeInTheDocument();
  });

  test("toggle task completion updates UI and calls DB (desktop)", async () => {
    renderWithProviders(<DashboardPage />);
    const desktopCheckbox = screen.getByTestId("desktop-checkbox-1");

    expect(tasks[0].status).toBe("todo");
    fireEvent.click(desktopCheckbox);

    await waitFor(() => {
      expect(toggleTaskCompletionMock).toHaveBeenCalledWith(
        1,
        expect.anything()
      );
      expect(tasks[0].status).toBe("done");
    });
  });

  test("toggle task completion updates UI and calls DB (mobile)", async () => {
    renderWithProviders(<DashboardPage />);
    const mobileCheckbox = screen.getByTestId("mobile-checkbox-1");

    tasks[0].status = "todo"; // reset
    fireEvent.click(mobileCheckbox);

    await waitFor(() => {
      expect(toggleTaskCompletionMock).toHaveBeenCalledWith(
        1,
        expect.anything()
      );
      expect(tasks[0].status).toBe("done");
    });
  });

  test("logout works correctly and shows success toast", async () => {
    const { store } = renderWithProviders(<DashboardPage />);
    const logoutBtns = screen.getAllByRole("button", { name: /Đăng xuất/i });
    fireEvent.click(logoutBtns[0]);

    await waitFor(() => {
      expect(store.getState().auth.user).toBeNull();
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Đăng xuất thành công");
    });
  });

  test("logout shows error toast when supabase.signOut fails", async () => {
    supabase.auth.signOut.mockRejectedValueOnce(new Error("Logout failed"));
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<DashboardPage />);
    const logoutBtns = screen.getAllByRole("button", { name: /Đăng xuất/i });
    fireEvent.click(logoutBtns[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Không thể đăng xuất.");
    });

    consoleErrorMock.mockRestore();
  });

  test("main header displays user email initial and full email", () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText("T")).toBeInTheDocument(); // initial từ email
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  test("show loading spinner when tasks are loading", () => {
    useTasks.mockReturnValue({
      tasks: [],
      loading: true,
      setTasks: jest.fn(),
      toggleTaskCompletion: jest.fn(),
    });

    renderWithProviders(<DashboardPage />);
    const spinners = screen.getAllByRole("status");
    expect(spinners.length).toBeGreaterThan(0);
  });
});
