import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../api/authApi';

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await authApi.logoutApi();
    return null;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});
