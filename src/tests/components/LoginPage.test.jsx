import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import { LoginPage } from "../../auth/LoginPage";
import authReducer from "../../auth/authSlice";

// Mock Supabase
jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        error: null,
        data: {
          user: { email: "test@example.com" },
          session: { user: { email: "test@example.com" }, access_token: "abc" },
        },
      }),
    },
  },
}));

const createTestStore = (preloadedState) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

const renderWithProviders = (ui, preloadedState) => {
  const store = createTestStore(
    preloadedState || { auth: { loading: false, error: null, user: null } }
  );
  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    ),
  };
};

describe("LoginPage Component - Full Coverage Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("render đúng các input, button và checkbox", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByPlaceholderText(/Nhập email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nhập mật khẩu/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /đăng nhập/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Nhớ đăng nhập/i)).toBeInTheDocument();
  });

  test("hiển thị lỗi khi submit form rỗng", async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    expect(
      await screen.findByText(/vui lòng nhập email/i, { exact: false })
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/vui lòng nhập mật khẩu/i, { exact: false })
    ).toBeInTheDocument();
  });

  test("validate email không hợp lệ", async () => {
    renderWithProviders(<LoginPage />);
    const emailInput = screen.getByPlaceholderText(/Nhập email/i);
    fireEvent.change(emailInput, { target: { value: "abc" } });
    fireEvent.blur(emailInput);
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    expect(
      await screen.findByText(/email không hợp lệ/i, { exact: false })
    ).toBeInTheDocument();
  });

  test("validate mật khẩu phải có ít nhất 8 ký tự", async () => {
    renderWithProviders(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText(/Nhập mật khẩu/i);
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    expect(
      await screen.findByText(/mật khẩu phải có ít nhất 8 ký tự/i, {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  test("submit thành công khi nhập đúng", async () => {
    const { store } = renderWithProviders(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Nhập email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nhập mật khẩu/i), {
      target: { value: "Abc12345!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => expect(store.getState().auth.loading).toBe(false));
    expect(store.getState().auth.user.email).toBe("test@example.com");
  });

  test("hiển thị lỗi khi API trả về lỗi", async () => {
    const errorState = {
      auth: {
        loading: false,
        error: "Email hoặc mật khẩu không đúng",
        user: null,
      },
    };
    renderWithProviders(<LoginPage />, errorState);
    expect(
      await screen.findByText(/email hoặc mật khẩu không đúng/i, {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  test("toggle password hiển thị/ẩn mật khẩu", async () => {
    renderWithProviders(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText(/Nhập mật khẩu/i);
    const toggleBtn = screen.getByLabelText(/hiện mật khẩu|ẩn mật khẩu/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("checkbox 'Nhớ đăng nhập' lưu session vào localStorage", async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/Nhập email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nhập mật khẩu/i), {
      target: { value: "Abc12345!" },
    });

    fireEvent.click(screen.getByLabelText(/Nhớ đăng nhập/i));
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("supabaseSession"));
      expect(saved).not.toBeNull();
      expect(saved.user.email).toBe("test@example.com");
    });
  });
});
