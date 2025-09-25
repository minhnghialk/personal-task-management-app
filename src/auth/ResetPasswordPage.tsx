import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../app/store';
import { ButtonLoading } from '../components/ButtonLoading';
import { FormInput } from '../components/FormInput';
import { TogglePasswordButton } from '../components/TogglePasswordButton';
import { getResetPasswordFields } from '../utils/formFields';
import { ResetPasswordRequest } from './types';
import { resetPasswordUser } from './actions/resetPassword';

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordRequest>();

  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword((prev) => !prev), []);

  const password = watch('password');

  const onSubmit = (data: ResetPasswordRequest) => {
    dispatch(resetPasswordUser(data));
  };

  const fields = getResetPasswordFields(
    password,
    showPassword,
    togglePassword,
    showConfirmPassword,
    toggleConfirmPassword,
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          Đặt lại mật khẩu
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              error={errors[field.name as keyof ResetPasswordRequest]}
              {...register(field.name as keyof ResetPasswordRequest, field.validation)}
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

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          {success && (
            <p className="text-center text-sm text-green-600">
              Mật khẩu đã được cập nhật thành công!
            </p>
          )}

          <ButtonLoading loading={loading}>Cập nhật mật khẩu</ButtonLoading>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
