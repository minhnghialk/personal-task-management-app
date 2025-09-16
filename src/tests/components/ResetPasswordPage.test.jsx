// src/tests/pages/ResetPasswordPage.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import { ResetPasswordPage } from "../../auth/ResetPasswordPage";
import authReducer from "../../auth/authSlice";

const mockUpdateUser = jest.fn();

jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      updateUser: (...args) => mockUpdateUser(...args),
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

describe("ResetPasswordPage Component - Full Coverage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("render đúng UI", () => {
    renderWithProviders(<ResetPasswordPage />);
    expect(
      screen.getByRole("heading", { name: /đặt lại mật khẩu/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cập nhật mật khẩu/i })
    ).toBeInTheDocument();
  });

  test("hiển thị lỗi khi submit form rỗng", async () => {
    renderWithProviders(<ResetPasswordPage />);
    fireEvent.click(screen.getByRole("button", { name: /cập nhật mật khẩu/i }));

    expect(
      await screen.findAllByText(/vui lòng nhập mật khẩu/i)
    ).not.toHaveLength(0);
  });

  test("validate mật khẩu không khớp", async () => {
    renderWithProviders(<ResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/nhập mật khẩu mới/i), {
      target: { value: "Abc12345!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/xác nhận mật khẩu/i), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cập nhật mật khẩu/i }));

    expect(
      await screen.findByText(/mật khẩu nhập lại không khớp/i)
    ).toBeInTheDocument();
  });

  test("submit thành công hiển thị thông báo", async () => {
    mockUpdateUser.mockResolvedValue({ error: null });

    renderWithProviders(<ResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/nhập mật khẩu mới/i), {
      target: { value: "Abc12345!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/xác nhận mật khẩu/i), {
      target: { value: "Abc12345!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cập nhật mật khẩu/i }));

    expect(
      await screen.findByText(/mật khẩu đã được cập nhật thành công/i)
    ).toBeInTheDocument();
  });

  test("API trả về lỗi hiển thị thông báo lỗi", async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: "Token hết hạn" } });

    renderWithProviders(<ResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/nhập mật khẩu mới/i), {
      target: { value: "Abc12345!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/xác nhận mật khẩu/i), {
      target: { value: "Abc12345!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cập nhật mật khẩu/i }));

    expect(await screen.findByText(/token hết hạn/i)).toBeInTheDocument();
  });

  test("toggle hiển thị/ẩn mật khẩu", () => {
    renderWithProviders(<ResetPasswordPage />);
    const passwordInput = screen.getByPlaceholderText(/nhập mật khẩu mới/i);
    const toggleBtn = screen.getAllByLabelText(/hiện mật khẩu|ẩn mật khẩu/i)[0];

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
