import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../api/supabaseClient";

// Đăng ký
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return rejectWithValue(error.message);
    return data.user;
  }
);

// Đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, remember }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return rejectWithValue(error.message);

    const session = data.session;

    // Lưu session theo remember
    if (remember) {
      localStorage.setItem("supabaseSession", JSON.stringify(session));
    } else {
      sessionStorage.setItem("supabaseSession", JSON.stringify(session));
    }

    return data.user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("supabaseSession");
      sessionStorage.removeItem("supabaseSession");
      supabase.auth.signOut();
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
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
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
