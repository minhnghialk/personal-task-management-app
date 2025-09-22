import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Sidebar } from "../../components/Sidebar";
import authReducer from "../../auth/authSlice";

// ------------------ Mock Supabase ------------------
jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    auth: { signOut: jest.fn() },
  },
}));

// ------------------ Helper render với Redux ------------------
const renderWithStore = (ui, { preloadedState } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("Sidebar component", () => {
  let setActiveMenu;
  let setSidebarOpen;
  let handleLogout;

  const preloadedState = {
    auth: { user: { id: "123", email: "test@example.com" } },
  };

  beforeEach(() => {
    setActiveMenu = jest.fn();
    setSidebarOpen = jest.fn();
    handleLogout = jest.fn();
  });

  test("renders sidebar and menu items", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={true}
        setSidebarOpen={setSidebarOpen}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    // Kiểm tra menu items
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Danh sách Task")).toBeInTheDocument();
    expect(screen.getByText("Thống kê")).toBeInTheDocument();
    expect(screen.getByText("Hồ sơ cá nhân")).toBeInTheDocument();
    // Kiểm tra nút Logout
    expect(screen.getByText("Đăng xuất")).toBeInTheDocument();
  });

  test("click menu item calls setActiveMenu and closes sidebar", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={true}
        setSidebarOpen={setSidebarOpen}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    const listButton = screen.getByText("Danh sách Task");
    fireEvent.click(listButton);
    expect(setActiveMenu).toHaveBeenCalledWith("Danh sách Task");
    expect(setSidebarOpen).toHaveBeenCalledWith(false);
  });

  test("close button calls setSidebarOpen(false)", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={true}
        setSidebarOpen={setSidebarOpen}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    const closeButton = screen.getByLabelText("Close sidebar");
    fireEvent.click(closeButton);
    expect(setSidebarOpen).toHaveBeenCalledWith(false);
  });

  test("logout button calls handleLogout", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={true}
        setSidebarOpen={setSidebarOpen}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    const logoutButton = screen.getByText("Đăng xuất");
    fireEvent.click(logoutButton);
    expect(handleLogout).toHaveBeenCalled();
  });

  // ------------------ Responsive / Mobile view ------------------
  test("sidebar is open by default (translate-x-0)", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={true}
        setSidebarOpen={setSidebarOpen}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveClass("translate-x-0");
    expect(sidebar).not.toHaveClass("-translate-x-full");
  });

  test("sidebar is closed on mobile (translate-x-full) when sidebarOpen=false", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={false}
        setSidebarOpen={setSidebarOpen}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveClass("-translate-x-full");
    expect(sidebar).not.toHaveClass("translate-x-0");
  });
});
