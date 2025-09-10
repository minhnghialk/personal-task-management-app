import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../api/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const { email, password } = data;
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setServerError(error.message);
      } else {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.",
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          Đăng ký tài khoản
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <label className="block">
            <span className="text-gray-700 text-sm font-medium">Email</span>
            <input
              type="email"
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </label>

          {/* Mật khẩu */}
          <label className="block">
            <span className="text-gray-700 text-sm font-medium">Mật khẩu</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự",
                  },
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                    message:
                      "Mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt",
                  },
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </label>

          {/* Nhập lại mật khẩu */}
          <label className="block">
            <span className="text-gray-700 text-sm font-medium">
              Nhập lại mật khẩu
            </span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Vui lòng nhập lại mật khẩu",
                  validate: (value) =>
                    value === password || "Mật khẩu nhập lại không khớp",
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Xác nhận mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>

          {/* Checkbox điều khoản */}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              {...register("terms", { required: "Bạn phải đồng ý điều khoản" })}
              className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
            />
            Tôi đồng ý với
            <a href="#" className="text-blue-600 hover:underline">
              Điều khoản & Chính sách
            </a>
          </label>
          {errors.terms && (
            <p className="text-sm text-red-500 mt-1">{errors.terms.message}</p>
          )}

          {/* Server error */}
          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          {/* Nút đăng ký */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>

          {/* Link đăng nhập */}
          <p className="text-center text-sm text-gray-600">
            Đã có tài khoản?
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};
