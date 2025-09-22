// src/auth/ResetPasswordPage.jsx
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../api/supabaseClient";
import { FormInput } from "../components/FormInput";
import { ButtonLoading } from "../components/ButtonLoading";
import { TogglePasswordButton } from "../components/TogglePasswordButton";
import { getResetPasswordFields } from "../utils/formFields";

export const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Mật khẩu đã được cập nhật thành công. Vui lòng đăng nhập lại."
        );
      }
    } catch (err) {
      setMessage(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fields = getResetPasswordFields(
    password,
    showPassword,
    togglePassword,
    showConfirmPassword,
    toggleConfirmPassword
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          Đặt lại mật khẩu
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden username field for accessibility */}
          <input
            type="email"
            name="username"
            autoComplete="username"
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
          />

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
                  <field.icon className="w-4 h-4" />
                </span>
              )}
            </FormInput>
          ))}

          <ButtonLoading loading={loading}>Cập nhật mật khẩu</ButtonLoading>
        </form>

        {message && (
          <p className="text-center text-sm text-green-600 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};
