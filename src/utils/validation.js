export const emailValidation = {
  required: "Vui lòng nhập email",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Email không hợp lệ",
  },
};

export const passwordValidation = {
  required: "Vui lòng nhập mật khẩu",
  minLength: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
  pattern: {
    value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
    message: "Mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt",
  },
};

export const termsValidation = {
  required: "Bạn phải đồng ý điều khoản",
};
