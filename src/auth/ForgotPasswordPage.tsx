import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import { ButtonLoading } from '../components/ButtonLoading';
import { FormInput } from '../components/FormInput';
import { SuccessPopup } from '../components/SuccessPopup';
import { getForgotPasswordFields } from '../utils/formFields';
import { forgotPasswordUser } from './actions/forgotPassword';
import { ForgotPasswordRequest } from './types';
import { resetSuccess } from './AuthSlice';
import { forgotPasswordEmailValidation } from '../utils/validation';

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>();

  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.auth);

  const onSubmit = async (data: ForgotPasswordRequest) => {
    dispatch(forgotPasswordUser(data));
  };

  const fields = getForgotPasswordFields();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">
          Quên mật khẩu
        </h1>
        <p className="text-center text-gray-600 mb-6">Nhập email đã đăng ký để đặt lại mật khẩu.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => (
            <FormInput
              key={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              error={errors[field.name as keyof ForgotPasswordRequest]}
              {...register(
                field.name as keyof ForgotPasswordRequest,
                forgotPasswordEmailValidation,
              )}
            >
              {field.icon && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <field.icon className="w-5 h-5" />
                </span>
              )}
            </FormInput>
          ))}

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <ButtonLoading loading={loading}>Gửi liên kết đặt lại</ButtonLoading>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline text-sm">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>

      {/* Popup thông báo */}
      <SuccessPopup
        open={success}
        onClose={() => dispatch(resetSuccess())}
        message="Liên kết khôi phục mật khẩu đã được gửi tới email của bạn."
        subMessage="Vui lòng kiểm tra hộp thư."
      />
    </div>
  );
};

export default ForgotPasswordPage;
