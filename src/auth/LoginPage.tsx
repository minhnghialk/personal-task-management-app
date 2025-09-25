import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../app/store';
import { ButtonLoading } from '../components/ButtonLoading';
import { Checkbox } from '../components/Checkbox';
import { FormInput } from '../components/FormInput';
import { TogglePasswordButton } from '../components/TogglePasswordButton';
import { ErrorMessage } from '../utils/errorMessages';
import { getLoginFields } from '../utils/formFields';
import { loginUser } from './actions/login';
import { LoginUserRequest } from './types';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  const onSubmit = (data: LoginUserRequest) => {
    dispatch(
      loginUser({
        email: data.email,
        password: data.password,
        remember: data.remember,
      }),
    );
  };

  const fields = getLoginFields(showPassword, togglePassword);

  useEffect(() => {
    const loginSuccessToastId = 'login-success';

    if (user && !toast.isActive(loginSuccessToastId)) {
      toast.success(
        <div className="text-center px-4 py-2">
          <div className="font-bold text-lg mb-1 text-green-900">Đăng nhập thành công!</div>
          <div className="text-sm text-green-800">Chào mừng bạn trở lại.</div>
        </div>,
        {
          onClose: () => {
            navigate('/dashboard');
          },
          toastId: loginSuccessToastId,
        },
      );
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          Đăng nhập tài khoản
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
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
                  <field.icon className="w-4 h-4" />{' '}
                </span>
              )}
            </FormInput>
          ))}

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <Checkbox label="Nhớ đăng nhập" {...register('remember')} />
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          {error && <ErrorMessage error={error} />}

          <ButtonLoading loading={loading}>Đăng nhập</ButtonLoading>

          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?
            <Link to="/register" className="text-blue-600 hover:underline ml-1">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
