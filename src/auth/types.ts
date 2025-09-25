import * as authApi from '../api/authApi';

export interface RegisterUserRequest {
  email: string;
  password: string;
  confirmPassword?: string;
  terms?: boolean;
}

export interface LoginUserRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export type RestoreSessionRequest = {
  session: Pick<AuthUser, 'access_token' | 'refresh_token'>;
};

export type RegisterUserResponse = Awaited<ReturnType<typeof authApi.register>>;
export type LoginUserResponse = Awaited<ReturnType<typeof authApi.login>>;
export type RestoreSessionResponse = Awaited<ReturnType<typeof authApi.restoreSupabaseSession>>;
