import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "../../pages/DashboardLayout";
import { useDispatch } from "react-redux";
import { supabase } from "../../api/supabaseClient";
import { toast } from "react-toastify";
import { Sidebar } from "../../components/Sidebar";
import { logout } from "../../auth/authSlice";

// ------------------ Mock Redux ------------------
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

// ------------------ Mock Supabase ------------------
jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

// ------------------ Mock toast ------------------
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// ------------------ Mock Components ------------------
jest.mock("../../components/Sidebar", () => ({
  Sidebar: jest.fn(({ sidebarOpen, setSidebarOpen, handleLogout }) => (
    <div data-testid="sidebar">
      <button data-testid="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <button
        data-testid="toggle-sidebar-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        Toggle Sidebar
      </button>
    </div>
  )),
}));

jest.mock("../../components/MainHeader", () => ({
  MainHeader: jest.fn(({ setSidebarOpen }) => (
    <div data-testid="main-header">
      <button
        data-testid="header-toggle-btn"
        onClick={() => setSidebarOpen(true)}
      >
        Open Sidebar
      </button>
    </div>
  )),
}));

// ------------------ Integration Test ------------------
describe("DashboardLayout Integration", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  it("should render Sidebar, MainHeader and nested Outlet content", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/test"]}>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              path="test"
              element={<div data-testid="nested-route">Nested Content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Sidebar và MainHeader render
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("main-header")).toBeInTheDocument();

    // Nội dung nested route render
    expect(screen.getByTestId("nested-route")).toBeInTheDocument();
    expect(screen.getByText("Nested Content")).toBeInTheDocument();
  });

  it("should toggle sidebar via MainHeader button", () => {
    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("header-toggle-btn"));
    const lastCall = Sidebar.mock.calls[Sidebar.mock.calls.length - 1][0];
    expect(lastCall.sidebarOpen).toBe(true);
  });

  it("should toggle sidebar via Sidebar toggle button", () => {
    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("toggle-sidebar-btn"));
    const lastCall = Sidebar.mock.calls[Sidebar.mock.calls.length - 1][0];
    expect(lastCall.sidebarOpen).toBe(true);
  });

  it("should call supabase signOut, dispatch logout, and toast.success on logout", async () => {
    supabase.auth.signOut.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByTestId("logout-btn");
    await fireEvent.click(logoutBtn);

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(logout());
    expect(toast.success).toHaveBeenCalledWith("Đăng xuất thành công");
  });

  it("should call toast.error if logout fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const error = new Error("Logout failed");
    supabase.auth.signOut.mockRejectedValueOnce(error);

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByTestId("logout-btn");
    await fireEvent.click(logoutBtn);

    expect(toast.error).toHaveBeenCalledWith("Không thể đăng xuất.");

    consoleErrorSpy.mockRestore();
  });
});
