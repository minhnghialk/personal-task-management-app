import React from "react";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FormInput } from "../components/FormInput";
import { Checkbox } from "../components/Checkbox";
import { ButtonLoading } from "../components/ButtonLoading";
import { Toast } from "../components/Toast";
import { registerUser } from "../auth/authSlice";
import {
  emailValidation,
  passwordValidation,
  termsValidation,
} from "../utils/validation";
import { TogglePasswordButton } from "../components/TogglePasswordButton";
import { useNotifyAndNavigate } from "../hooks/useNotifyAndNavigate";

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const notify = useNotifyAndNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );
  const toggleConfirmPassword = useCallback(
    () => setShowConfirmPassword((prev) => !prev),
    []
  );
  const password = watch("password");

  const onSubmit = (data) => {
    dispatch(registerUser({ email: data.email, password: data.password }))
      .unwrap()
      .then(() =>
        notify("Đăng ký thành công! Vui lòng kiểm tra email.", "/login")
      )
      .catch((err) => toast.error(err || "Có lỗi xảy ra. Vui lòng thử lại!"));
  };

  const fields = [
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
      type: "password",
      validation: passwordValidation,
      toggle: togglePassword,
      show: showPassword,
      ariaLabel: showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu",
    },
    {
      name: "confirmPassword",
      label: "Nhập lại mật khẩu",
      placeholder: "Xác nhận mật khẩu",
      type: "password",
      validation: {
        required: "Vui lòng nhập lại mật khẩu",
        validate: (value) =>
          value === password || "Mật khẩu nhập lại không khớp",
      },
      toggle: toggleConfirmPassword,
      show: showConfirmPassword,
      ariaLabel: showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          Đăng ký tài khoản
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          {fields.map((field) => (
            <FormInput
              key={field.name}
              label={field.label}
              type={field.show ? "text" : field.type}
              placeholder={field.placeholder}
              error={errors[field.name]}
              {...register(field.name, field.validation)}
            >
              {field.toggle && (
                <TogglePasswordButton
                  visible={field.show}
                  setVisible={field.toggle}
                  ariaLabel={field.ariaLabel}
                />
              )}
            </FormInput>
          ))}

          <Checkbox
            label={
              <>
                Tôi đồng ý với{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Điều khoản & Chính sách
                </a>
              </>
            }
            error={errors.terms}
            {...register("terms", termsValidation)}
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <ButtonLoading loading={loading}>Đăng ký</ButtonLoading>

          <p className="text-center text-sm text-gray-600">
            Đã có tài khoản?
            <Link to="/login" className="text-blue-600 hover:underline ml-1">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>

      <Toast />
    </div>
  );
};
