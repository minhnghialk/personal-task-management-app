import { createAsyncThunk } from '@reduxjs/toolkit';
import { ResetPasswordRequest } from '../types';
import * as authApi from '../../api/authApi';

export const resetPasswordUser = createAsyncThunk<
  boolean,
  ResetPasswordRequest,
  { rejectValue: string }
>('auth/resetPasswordUser', async (data, { rejectWithValue }) => {
  try {
    return await authApi.resetPassword(data);
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
  }
});
