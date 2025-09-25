import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginUserRequest, LoginUserResponse } from '../../auth/types';
import * as authApi from '../../api/authApi';

export const loginUser = createAsyncThunk<LoginUserResponse, LoginUserRequest>(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login({ email, password });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
