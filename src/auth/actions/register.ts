import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterUserRequest, RegisterUserResponse } from '../../auth/types';
import * as authApi from '../../api/authApi';

export const registerUser = createAsyncThunk<RegisterUserResponse, RegisterUserRequest>(
  'auth/registerUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.register({ email, password });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
