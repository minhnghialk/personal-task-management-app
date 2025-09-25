import { createAsyncThunk } from '@reduxjs/toolkit';
import { ForgotPasswordRequest } from '../../auth/types';
import * as authApi from '../../api/authApi';

export const forgotPasswordUser = createAsyncThunk<
  boolean,
  ForgotPasswordRequest,
  { rejectValue: string }
>('auth/forgotPasswordUser', async ({ email }, { rejectWithValue }) => {
  try {
    return await authApi.forgotPassword({ email });
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
  }
});
