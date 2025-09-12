import { emailValidation, passwordValidation } from "./validation";

export function getRegisterFields(
  password,
  showPassword,
  togglePassword,
  showConfirmPassword,
  toggleConfirmPassword
) {
  return [
    {
      name: "email",
      label: "Email",
      placeholder: "Nhập email",
      type: "text",
      validation: emailValidation,
    },
    {
      name: "password",
      label: "Mật khẩu",
      placeholder: "Nhập mật khẩu",
      type: showPassword ? "text" : "password",
      validation: passwordValidation,
      toggle: togglePassword,
      show: showPassword,
      ariaLabel: showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu",
    },
    {
      name: "confirmPassword",
      label: "Nhập lại mật khẩu",
      placeholder: "Xác nhận mật khẩu",
      type: showConfirmPassword ? "text" : "password",
      validation: {
        required: "Vui lòng nhập lại mật khẩu",
        validate: (value) =>
          value === password || "Mật khẩu nhập lại không khớp",
      },
      toggle: toggleConfirmPassword,
      show: showConfirmPassword,
      ariaLabel: showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu",
    },
  ];
}
