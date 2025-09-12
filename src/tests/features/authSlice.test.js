// src/tests/features/authSlice.test.js
import authReducer, { registerUser } from "../../auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { supabase } from "../../api/supabaseClient";

// Mock supabase
jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: () => {} } },
      })),
    },
  },
}));

describe("authSlice", () => {
  const initialState = { user: null, loading: false, error: null };

  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
    });
  });

  test("should handle initial state", () => {
    const state = store.getState().auth;
    expect(state).toEqual(initialState);
  });

  test("should handle registerUser success", async () => {
    supabase.auth.signUp.mockResolvedValue({ error: null, user: { id: "1" } });

    await store.dispatch(
      registerUser({ email: "a@b.com", password: "12345678!" })
    );

    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.user).toEqual({ id: "1" });
  });

  test("should handle registerUser failure", async () => {
    supabase.auth.signUp.mockResolvedValue({
      error: { message: "Email exists" },
      user: null,
    });

    await store.dispatch(
      registerUser({ email: "a@b.com", password: "12345678!" })
    );

    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Email exists");
    expect(state.user).toBeNull();
  });
});
