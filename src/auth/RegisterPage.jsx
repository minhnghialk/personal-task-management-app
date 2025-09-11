import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password");

  const toggleShow = (type) => {
    if (type === "password") setShowPassword((prev) => !prev);
    else setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = (data) => {
    dispatch(registerUser({ email: data.email, password: data.password }))
      .unwrap()
      .then(() => {
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email.");
        setTimeout(() => navigate("/login"), 4000);
      })
      .catch((err) => toast.error(err || "Có lỗi xảy ra. Vui lòng thử lại!"));
  };

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
          <FormInput
            label="Email"
            name="email"
            placeholder="Nhập email"
            error={errors.email}
            {...register("email", emailValidation)}
          />

          <FormInput
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Nhập mật khẩu"
            error={errors.password}
            {...register("password", passwordValidation)}
          >
            <button
              type="button"
              onClick={() => toggleShow("password")}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </FormInput>

          <FormInput
            label="Nhập lại mật khẩu"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            error={errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Vui lòng nhập lại mật khẩu",
              validate: (value) =>
                value === password || "Mật khẩu nhập lại không khớp",
            })}
          >
            <button
              type="button"
              onClick={() => toggleShow("confirm")}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </FormInput>

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
