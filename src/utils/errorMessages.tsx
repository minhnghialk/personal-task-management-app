import React from 'react';

export interface ErrorMessageProps {
  error: string | null;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return;

  let message = '';

  switch (error) {
    case 'Auth session missing!':
      message = null;
      break;
    case 'Invalid login credentials':
      message = 'Email hoặc mật khẩu không đúng!';
      break;
    default:
      message = 'Có lỗi xảy ra!';
  }

  return <p className="text-sm text-red-500 text-center">{message}</p>;
};
