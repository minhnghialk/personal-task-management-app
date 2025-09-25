import { createSlice } from '@reduxjs/toolkit';
import { setUserStorage, STORAGE_PREFIX } from '../utils/auth';
import { forgotPasswordUser } from './actions/forgotPassword';
import { loginUser } from './actions/login';
import { logoutUser } from './actions/logout';
import { registerUser } from './actions/register';
import { resetPasswordUser } from './actions/resetPassword';
import { restoreSession } from './actions/restoreSession';
import { AuthUser } from './types';

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, success: false },
  reducers: {
    resetSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const isRemember = action.meta.arg?.remember ?? false;
        const userInfo: AuthUser = {
          id: action.payload.user.id,
          email: action.payload.user.email,
          access_token: action.payload.session.access_token,
          refresh_token: action.payload.session.refresh_token,
        };
        state.user = userInfo;

        setUserStorage(userInfo, isRemember);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Restore session
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        const userInfo: AuthUser = {
          id: action.payload.user.id,
          email: action.payload.user.email,
          access_token: action.payload.session.access_token,
          refresh_token: action.payload.session.refresh_token,
        };
        state.user = userInfo;
        state.error = null;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.loading = false;
        state.user = null;

        // state.error = { message: 'Khoi phuc phien dang nhap that bai!' };
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.user = null;

        localStorage.removeItem(STORAGE_PREFIX + 'user');
        sessionStorage.removeItem(STORAGE_PREFIX + 'user');
        localStorage.removeItem(STORAGE_PREFIX + 'supabase_session');
        sessionStorage.removeItem(STORAGE_PREFIX + 'supabase_session');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot password
      .addCase(forgotPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset password
      .addCase(resetPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess } = authSlice.actions;
export default authSlice.reducer;
