import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import { ButtonLoading } from '../components/ButtonLoading';
import { Checkbox } from '../components/Checkbox';
import { FormInput } from '../components/FormInput';
import { TogglePasswordButton } from '../components/TogglePasswordButton';
import { getRegisterFields } from '../utils/formFields';
import { termsValidation } from '../utils/validation';
import { registerUser } from './actions/register';
import { RegisterUserRequest } from './types';
import { toast } from 'react-toastify';
import { ErrorMessage } from '../utils/errorMessages';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterUserRequest>();
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword((prev) => !prev), []);
  const password = watch('password');

  const onSubmit = (data: RegisterUserRequest) => {
    dispatch(registerUser({ email: data.email, password: data.password }));
  };

  useEffect(() => {
    const registerSuccessToastId = 'register-success';
    if (success && !toast.isActive(registerSuccessToastId)) {
      toast.success(
        <div className="text-center px-4 py-2">
          <div className="font-bold text-lg mb-1 text-green-900">Đăng ký thành công!</div>
          <div className="text-sm text-green-800">
            Vui lòng kiểm tra email và kích hoạt tài khoản trước khi đăng nhập.
          </div>
        </div>,
        {
          toastId: registerSuccessToastId,
        },
      );

      navigate('/login');
    }
  }, [success, navigate]);

  const fields = getRegisterFields(
    password,
    showPassword,
    togglePassword,
    showConfirmPassword,
    toggleConfirmPassword,
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          Đăng ký tài khoản
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
          {fields.map((field) => (
            <FormInput
              key={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              error={errors[field.name as keyof RegisterUserRequest]}
              {...register(field.name as keyof RegisterUserRequest, field.validation)}
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

          <Checkbox
            label={
              <>
                Tôi đồng ý với{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Điều khoản & Chính sách
                </a>
              </>
            }
            error={errors.terms}
            {...register('terms', termsValidation)}
          />

          {error && <ErrorMessage error={error} />}

          <ButtonLoading loading={loading}>Đăng ký</ButtonLoading>

          <p className="text-center text-sm text-gray-600">
            Đã có tài khoản?
            <Link to="/login" className="text-blue-600 hover:underline ml-1">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
