import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MainHeader } from "../../components/MainHeader";
import { MemoryRouter } from "react-router-dom";

const fakeAuthReducer = (state = { user: null }) => state;

const renderWithStoreAndRouter = (
  ui,
  { preloadedState = {}, route = "/dashboard" } = {}
) => {
  const store = configureStore({
    reducer: { auth: fakeAuthReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("MainHeader Component (dynamic title)", () => {
  it("renders dynamic title based on pathname", () => {
    renderWithStoreAndRouter(<MainHeader setSidebarOpen={() => {}} />, {
      route: "/dashboard/tasks",
    });

    expect(screen.getByText("Danh sách Task")).toBeInTheDocument();
  });

  it("renders user avatar and email when user exists", () => {
    const user = { email: "test@example.com" };
    renderWithStoreAndRouter(<MainHeader setSidebarOpen={() => {}} />, {
      preloadedState: { auth: { user } },
      route: "/dashboard",
    });

    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("does not render user info when user is null", () => {
    renderWithStoreAndRouter(<MainHeader setSidebarOpen={() => {}} />, {
      preloadedState: { auth: { user: null } },
      route: "/dashboard",
    });

    expect(screen.queryByText("T")).not.toBeInTheDocument();
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
  });

  it("calls setSidebarOpen with true when menu button clicked", () => {
    const setSidebarOpenMock = jest.fn();
    renderWithStoreAndRouter(
      <MainHeader setSidebarOpen={setSidebarOpenMock} />,
      { route: "/dashboard" }
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(setSidebarOpenMock).toHaveBeenCalledWith(true);
  });

  it("renders default title 'Dashboard' when pathname does not match", () => {
    renderWithStoreAndRouter(<MainHeader setSidebarOpen={() => {}} />, {
      route: "/unknown-path",
    });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
