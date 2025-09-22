import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MainHeader } from "../../components/MainHeader";

const fakeAuthReducer = (state = { user: null }) => state;

const renderWithStore = (ui, { preloadedState } = {}) => {
  const store = configureStore({
    reducer: { auth: fakeAuthReducer },
    preloadedState,
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("MainHeader Component", () => {
  it("renders activeMenu title correctly", () => {
    renderWithStore(
      <MainHeader activeMenu="Dashboard" setSidebarOpen={() => {}} />,
      { preloadedState: { auth: { user: null } } }
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders user avatar and email when user exists", () => {
    const user = { email: "test@example.com" };
    renderWithStore(
      <MainHeader activeMenu="Dashboard" setSidebarOpen={() => {}} />,
      { preloadedState: { auth: { user } } }
    );

    // Kiểm tra chữ cái đầu tiên của email
    expect(screen.getByText("T")).toBeInTheDocument();
    // Kiểm tra email đầy đủ
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("does not render user info when user is null", () => {
    renderWithStore(
      <MainHeader activeMenu="Stats" setSidebarOpen={() => {}} />,
      { preloadedState: { auth: { user: null } } }
    );

    expect(screen.queryByText("T")).not.toBeInTheDocument();
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
  });

  it("calls setSidebarOpen with true when menu button clicked", () => {
    const setSidebarOpenMock = jest.fn();
    renderWithStore(
      <MainHeader activeMenu="Tasks" setSidebarOpen={setSidebarOpenMock} />,
      { preloadedState: { auth: { user: null } } }
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(setSidebarOpenMock).toHaveBeenCalledWith(true);
  });

  it("renders correctly with different activeMenu titles", () => {
    const menus = ["Dashboard", "Stats", "Profile"];
    menus.forEach((menu) => {
      renderWithStore(
        <MainHeader activeMenu={menu} setSidebarOpen={() => {}} />,
        { preloadedState: { auth: { user: null } } }
      );
      expect(screen.getByText(menu)).toBeInTheDocument();
    });
  });
});
