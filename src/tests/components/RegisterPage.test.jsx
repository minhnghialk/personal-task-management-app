import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RegisterPage } from "../../auth/RegisterPage";

// Mock supabase client
jest.mock("../../api/supabaseClient.js", () => ({
  supabase: {
    auth: {
      signUp: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}));

describe("RegisterPage", () => {
  test("render đúng các input và button", () => {
    render(<RegisterPage />);

    expect(screen.getByText("Đăng ký tài khoản")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập mật khẩu")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Xác nhận mật khẩu")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Đăng ký/i })
    ).toBeInTheDocument();
  });

  test("hiển thị lỗi khi submit form rỗng", async () => {
    render(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: /Đăng ký/i }));

    expect(await screen.findByText("Vui lòng nhập email")).toBeInTheDocument();
    expect(
      await screen.findByText("Vui lòng nhập mật khẩu")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Vui lòng nhập lại mật khẩu")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Bạn phải đồng ý điều khoản")
    ).toBeInTheDocument();
  });

  test("validate mật khẩu nhập lại không khớp", async () => {
    render(<RegisterPage />);

    fireEvent.input(screen.getByPlaceholderText("Nhập email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Nhập mật khẩu"), {
      target: { value: "12345678" },
    });
    fireEvent.input(screen.getByPlaceholderText("Xác nhận mật khẩu"), {
      target: { value: "12345679" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /Đăng ký/i }));

    expect(
      await screen.findByText("Mật khẩu nhập lại không khớp")
    ).toBeInTheDocument();
  });

  test("validate email không hợp lệ", async () => {
    render(<RegisterPage />);

    fireEvent.input(screen.getByPlaceholderText("Nhập email"), {
      target: { value: "abc@" },
    });
    fireEvent.input(screen.getByPlaceholderText("Nhập mật khẩu"), {
      target: { value: "12345678" },
    });
    fireEvent.input(screen.getByPlaceholderText("Xác nhận mật khẩu"), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /Đăng ký/i }));

    expect(await screen.findByText("Email không hợp lệ")).toBeInTheDocument();
  });

  test("validate mật khẩu phải có ít nhất 8 ký tự", async () => {
    render(<RegisterPage />);

    fireEvent.input(screen.getByPlaceholderText("Nhập email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Nhập mật khẩu"), {
      target: { value: "12345" },
    });
    fireEvent.input(screen.getByPlaceholderText("Xác nhận mật khẩu"), {
      target: { value: "12345" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /Đăng ký/i }));

    expect(
      await screen.findByText("Mật khẩu phải có ít nhất 8 ký tự")
    ).toBeInTheDocument();
  });

  test("validate mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt", async () => {
    render(<RegisterPage />);

    fireEvent.input(screen.getByPlaceholderText("Nhập email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Nhập mật khẩu"), {
      target: { value: "abcdefgh" },
    });
    fireEvent.input(screen.getByPlaceholderText("Xác nhận mật khẩu"), {
      target: { value: "abcdefgh" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /Đăng ký/i }));

    expect(
      await screen.findByText(
        "Mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt"
      )
    ).toBeInTheDocument();
  });

  test("submit thành công khi nhập đúng", async () => {
    render(<RegisterPage />);

    fireEvent.input(screen.getByPlaceholderText("Nhập email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Nhập mật khẩu"), {
      target: { value: "12345678" },
    });
    fireEvent.input(screen.getByPlaceholderText("Xác nhận mật khẩu"), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /Đăng ký/i }));

    await waitFor(() => {
      expect(screen.queryByText("Vui lòng nhập email")).not.toBeInTheDocument();
    });
  });

  test("hiển thị lỗi khi chưa tick checkbox Điều khoản", async () => {
    render(<RegisterPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const confirmPasswordInput = screen.getByLabelText(/Nhập lại mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /Đăng ký/i });

    fireEvent.change(emailInput, { target: { value: "abc@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "12345678" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Bạn phải đồng ý điều khoản")
      ).toBeInTheDocument();
    });
  });
});
