import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../api/authApi';
import { RestoreSessionRequest, RestoreSessionResponse } from 'auth/types';

export const restoreSession = createAsyncThunk<RestoreSessionResponse, RestoreSessionRequest>(
  'auth/restoreSession',
  async (restoreSessionParams, { rejectWithValue }) => {
    try {
      const data = await authApi.restoreSupabaseSession(restoreSessionParams);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
