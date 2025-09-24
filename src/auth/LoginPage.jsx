import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormInput } from "../components/FormInput";
import { Checkbox } from "../components/Checkbox";
import { ButtonLoading } from "../components/ButtonLoading";
import { Toast } from "../components/Toast";
import { TogglePasswordButton } from "../components/TogglePasswordButton";
import { useNotifyAndNavigate } from "../hooks/useNotifyAndNavigate";
import { loginUser } from "../auth/AuthSlice";
import { getLoginFields } from "../utils/formFields";

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const notify = useNotifyAndNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const onSubmit = (data) => {
    dispatch(
      loginUser({
        email: data.email,
        password: data.password,
        remember: data.remember,
      })
    )
      .unwrap()
      .then(() => notify("Đăng nhập thành công!", "/dashboard"))
      .catch(() => console.error("Login failed"));
  };

  const fields = getLoginFields(showPassword, togglePassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          Đăng nhập tài khoản
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
              type={field.type}
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
              {field.icon && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <field.icon className="w-4 h-4" />{" "}
                </span>
              )}
            </FormInput>
          ))}

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <Checkbox label="Nhớ đăng nhập" {...register("remember")} />
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error === "Invalid login credentials"
                ? "Email hoặc mật khẩu không đúng"
                : error}
            </p>
          )}

          <ButtonLoading loading={loading}>Đăng nhập</ButtonLoading>

          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?
            <Link to="/register" className="text-blue-600 hover:underline ml-1">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>

      <Toast />
    </div>
  );
};
