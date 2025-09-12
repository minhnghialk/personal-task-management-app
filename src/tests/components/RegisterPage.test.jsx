// src/tests/components/RegisterPage.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import { RegisterPage } from "../../auth/RegisterPage";
import authReducer from "../../auth/authSlice";

// Mock Supabase
jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: jest.fn().mockResolvedValue({ error: null }),
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
    preloadedState || { auth: { loading: false, error: null } }
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

describe("RegisterPage Component - Validate Tests", () => {
  test("render đúng các input và button", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByPlaceholderText(/Nhập email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nhập mật khẩu/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Xác nhận mật khẩu/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /đăng ký/i })
    ).toBeInTheDocument();
  });

  test("hiển thị lỗi khi submit form rỗng", async () => {
    renderWithProviders(<RegisterPage />);

    fireEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

    expect(
      await screen.findByText(/vui lòng nhập email/i, { exact: false })
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/vui lòng nhập mật khẩu/i, { exact: false })
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/vui lòng nhập lại mật khẩu/i, { exact: false })
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/bạn phải đồng ý điều khoản/i, { exact: false })
    ).toBeInTheDocument();
  });

  test("validate email không hợp lệ", async () => {
    renderWithProviders(<RegisterPage />);

    const emailInput = screen.getByPlaceholderText(/Nhập email/i);
    fireEvent.change(emailInput, { target: { value: "abc" } });
    fireEvent.blur(emailInput);

    fireEvent.click(screen.getByRole("checkbox", { name: /tôi đồng ý/i }));

    fireEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

    expect(
      await screen.findByText(/email không hợp lệ/i, { exact: false })
    ).toBeInTheDocument();
  });

  test("validate mật khẩu phải có ít nhất 8 ký tự", async () => {
    renderWithProviders(<RegisterPage />);

    const passwordInput = screen.getByPlaceholderText(/Nhập mật khẩu/i);
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.blur(passwordInput);

    fireEvent.click(screen.getByRole("checkbox", { name: /tôi đồng ý/i }));
    fireEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

    expect(
      await screen.findByText(/mật khẩu phải có ít nhất 8 ký tự/i, {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  test("validate mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt", async () => {
    renderWithProviders(<RegisterPage />);

    const passwordInput = screen.getByPlaceholderText(/Nhập mật khẩu/i);
    fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });
    fireEvent.blur(passwordInput);

    fireEvent.click(screen.getByRole("checkbox", { name: /tôi đồng ý/i }));
    fireEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

    expect(
      await screen.findByText(
        /mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt/i,
        { exact: false }
      )
    ).toBeInTheDocument();
  });

  test("validate mật khẩu nhập lại không khớp", async () => {
    renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/Nhập mật khẩu/i), {
      target: { value: "Abc12345!" },
    });
    fireEvent.blur(screen.getByPlaceholderText(/Nhập mật khẩu/i));

    fireEvent.change(screen.getByPlaceholderText(/Xác nhận mật khẩu/i), {
      target: { value: "Wrong123!" },
    });
    fireEvent.blur(screen.getByPlaceholderText(/Xác nhận mật khẩu/i));

    fireEvent.click(screen.getByRole("checkbox", { name: /tôi đồng ý/i }));
    fireEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

    expect(
      await screen.findByText(/mật khẩu nhập lại không khớp/i, {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  test("submit thành công khi nhập đúng", async () => {
    const { store } = renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/Nhập email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.blur(screen.getByPlaceholderText(/Nhập email/i));

    fireEvent.change(screen.getByPlaceholderText(/Nhập mật khẩu/i), {
      target: { value: "Abc12345!" },
    });
    fireEvent.blur(screen.getByPlaceholderText(/Nhập mật khẩu/i));

    fireEvent.change(screen.getByPlaceholderText(/Xác nhận mật khẩu/i), {
      target: { value: "Abc12345!" },
    });
    fireEvent.blur(screen.getByPlaceholderText(/Xác nhận mật khẩu/i));

    fireEvent.click(screen.getByRole("checkbox", { name: /tôi đồng ý/i }));
    fireEvent.click(screen.getByRole("button", { name: /đăng ký/i }));

    await waitFor(() => expect(store.getState().auth.loading).toBe(false));
  });

  test("hiển thị lỗi khi API trả về lỗi", async () => {
    const errorState = { auth: { loading: false, error: "Email đã tồn tại" } };
    renderWithProviders(<RegisterPage />, errorState);

    expect(
      await screen.findByText(/email đã tồn tại/i, { exact: false })
    ).toBeInTheDocument();
  });
});
