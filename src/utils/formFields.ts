// src/utils/formFields.ts
import { RegisterOptions } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { RegisterUserRequest } from '../auth/types';
import { emailValidation, passwordValidation } from './validation';

export interface FieldProps<T extends keyof RegisterUserRequest> {
  name: T;
  label: string;
  placeholder: string;
  type: string;
  validation?: RegisterOptions<RegisterUserRequest, T>;
  toggle?: () => void;
  show?: boolean;
  ariaLabel?: string;
  icon?: React.ElementType;
}

export function getRegisterFields(
  password: string,
  showPassword: boolean,
  togglePassword: () => void,
  showConfirmPassword: boolean,
  toggleConfirmPassword: () => void,
): FieldProps<keyof RegisterUserRequest>[] {
  return [
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Nhập email',
      type: 'text',
      validation: emailValidation as RegisterOptions<RegisterUserRequest, 'email'>,
      icon: Mail,
    },
    {
      name: 'password',
      label: 'Mật khẩu',
      placeholder: 'Nhập mật khẩu',
      type: showPassword ? 'text' : 'password',
      validation: passwordValidation as RegisterOptions<RegisterUserRequest, 'password'>,
      toggle: togglePassword,
      show: showPassword,
      ariaLabel: showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu',
      icon: Lock,
    },
    {
      name: 'confirmPassword',
      label: 'Nhập lại mật khẩu',
      placeholder: 'Xác nhận mật khẩu',
      type: showConfirmPassword ? 'text' : 'password',
      validation: {
        required: 'Vui lòng nhập lại mật khẩu',
        validate: (value) => value === password || 'Mật khẩu nhập lại không khớp',
      } as RegisterOptions<RegisterUserRequest, 'confirmPassword'>,
      toggle: toggleConfirmPassword,
      show: showConfirmPassword,
      ariaLabel: showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu',
      icon: Lock,
    },
  ];
}

export function getLoginFields(
  showPassword: boolean,
  togglePassword: () => void,
): FieldProps<'email' | 'password'>[] {
  return [
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Nhập email',
      type: 'text',
      validation: emailValidation as RegisterOptions<RegisterUserRequest, 'email'>,
      icon: Mail,
    },
    {
      name: 'password',
      label: 'Mật khẩu',
      placeholder: 'Nhập mật khẩu',
      type: showPassword ? 'text' : 'password',
      validation: passwordValidation as RegisterOptions<RegisterUserRequest, 'password'>,
      toggle: togglePassword,
      show: showPassword,
      ariaLabel: showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu',
      icon: Lock,
    },
  ];
}

export function getForgotPasswordFields(): FieldProps<'email'>[] {
  return [
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Nhập email của bạn',
      type: 'text',
      validation: emailValidation as RegisterOptions<RegisterUserRequest, 'email'>,
      icon: Mail,
    },
  ];
}

export function getResetPasswordFields(
  password: string,
  showPassword: boolean,
  togglePassword: () => void,
  showConfirmPassword: boolean,
  toggleConfirmPassword: () => void,
): FieldProps<'password' | 'confirmPassword'>[] {
  return [
    {
      name: 'password',
      label: 'Mật khẩu mới',
      placeholder: 'Nhập mật khẩu mới',
      type: showPassword ? 'text' : 'password',
      validation: passwordValidation as RegisterOptions<RegisterUserRequest, 'password'>,
      toggle: togglePassword,
      show: showPassword,
      ariaLabel: showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu',
      icon: Lock,
    },
    {
      name: 'confirmPassword',
      label: 'Nhập lại mật khẩu mới',
      placeholder: 'Xác nhận mật khẩu mới',
      type: showConfirmPassword ? 'text' : 'password',
      validation: {
        required: 'Vui lòng nhập lại mật khẩu',
        validate: (value) => value === password || 'Mật khẩu nhập lại không khớp',
      } as RegisterOptions<RegisterUserRequest, 'confirmPassword'>,
      toggle: toggleConfirmPassword,
      show: showConfirmPassword,
      ariaLabel: showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu',
      icon: Lock,
    },
  ];
}
