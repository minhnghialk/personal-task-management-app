// src/tests/pages/ForgotPasswordPage.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import { ForgotPasswordPage } from "../../auth/ForgotPasswordPage";
import authReducer from "../../auth/authSlice";

const mockResetPassword = jest.fn();

jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: (...args) => mockResetPassword(...args),
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
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("ForgotPasswordPage Component - Full Coverage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("render đúng UI", () => {
    renderWithProviders(<ForgotPasswordPage />);
    expect(
      screen.getByRole("heading", { name: /quên mật khẩu/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /gửi liên kết đặt lại/i })
    ).toBeInTheDocument();
  });

  test("hiển thị lỗi khi submit form rỗng", async () => {
    renderWithProviders(<ForgotPasswordPage />);
    fireEvent.click(screen.getByRole("button", { name: /gửi liên kết/i }));
    expect(await screen.findByText(/vui lòng nhập email/i)).toBeInTheDocument();
  });

  test("validate email không hợp lệ", async () => {
    renderWithProviders(<ForgotPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/nhập email/i), {
      target: { value: "abc" },
    });
    fireEvent.click(screen.getByRole("button", { name: /gửi liên kết/i }));
    expect(await screen.findByText(/email không hợp lệ/i)).toBeInTheDocument();
  });

  test("submit thành công hiển thị popup", async () => {
    mockResetPassword.mockResolvedValue({ error: null });

    renderWithProviders(<ForgotPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/nhập email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /gửi liên kết/i }));

    expect(
      await screen.findByText(/liên kết khôi phục mật khẩu/i)
    ).toBeInTheDocument();
  });

  test("API trả về lỗi hiển thị thông báo lỗi", async () => {
    mockResetPassword.mockResolvedValue({
      error: { message: "Email không tồn tại" },
    });

    renderWithProviders(<ForgotPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/nhập email/i), {
      target: { value: "notfound@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /gửi liên kết/i }));

    expect(await screen.findByText(/email không tồn tại/i)).toBeInTheDocument();
  });
});
