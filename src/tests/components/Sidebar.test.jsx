import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Sidebar } from "../../components/Sidebar";
import authReducer from "../../auth/authSlice";
import { BrowserRouter as Router } from "react-router-dom";

// ------------------ Mock Supabase ------------------
jest.mock("../../api/supabaseClient", () => ({
  supabase: { auth: { signOut: jest.fn() } },
}));

// ------------------ Helper render với Redux + Router ------------------
const renderWithStore = (ui, { preloadedState } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });
  return render(
    <Provider store={store}>
      <Router>{ui}</Router>
    </Provider>
  );
};

describe("Sidebar component", () => {
  let setSidebarOpen;
  let handleLogout;

  const preloadedState = {
    auth: { user: { id: "123", email: "test@example.com" } },
  };

  beforeEach(() => {
    setSidebarOpen = jest.fn();
    handleLogout = jest.fn();
  });

  test("renders sidebar and menu items", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={true}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Danh sách Task")).toBeInTheDocument();
    expect(screen.getByText("Thống kê")).toBeInTheDocument();
    expect(screen.getByText("Hồ sơ cá nhân")).toBeInTheDocument();
    expect(screen.getByText("Đăng xuất")).toBeInTheDocument();
  });

  test("click menu item closes sidebar", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={true}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    const menuButton = screen.getByText("Danh sách Task");
    fireEvent.click(menuButton);
    expect(setSidebarOpen).toHaveBeenCalledWith(false);
  });

  test("close button calls setSidebarOpen(false)", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={true}
        setSidebarOpen={setSidebarOpen}
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
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    const logoutButton = screen.getByText("Đăng xuất");
    fireEvent.click(logoutButton);
    expect(handleLogout).toHaveBeenCalled();
  });

  test("sidebar has correct transform class when open", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={true}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("translate-x-0");
    expect(sidebar).not.toHaveClass("-translate-x-full");
  });

  test("sidebar has correct transform class when closed", () => {
    renderWithStore(
      <Sidebar
        sidebarOpen={false}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />,
      { preloadedState }
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("-translate-x-full");
    expect(sidebar).not.toHaveClass("translate-x-0");
  });
});
