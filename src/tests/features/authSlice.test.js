import React from "react";
import authReducer, {
  registerUser,
  loginUser,
  logout,
} from "../../auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { supabase } from "../../api/supabaseClient";

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
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: { auth: authReducer } });
    localStorage.clear();
    sessionStorage.clear();
  });

  const initialState = { user: null, loading: false, error: null };

  test("should handle initial state", () => {
    expect(store.getState().auth).toEqual(initialState);
  });

  // ---------------- Register ----------------
  test("registerUser success", async () => {
    supabase.auth.signUp.mockResolvedValue({
      error: null,
      data: { user: { id: "1" } },
    });

    await store.dispatch(
      registerUser({ email: "a@b.com", password: "12345678!" })
    );

    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.user).toEqual({ id: "1" });
  });

  test("registerUser failure", async () => {
    supabase.auth.signUp.mockResolvedValue({
      error: { message: "Email exists" },
      data: { user: null },
    });

    await store.dispatch(
      registerUser({ email: "a@b.com", password: "12345678!" })
    );

    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Email exists");
    expect(state.user).toBeNull();
  });

  // ---------------- Login ----------------
  test("loginUser success with remember=true saves to localStorage", async () => {
    const mockUser = { email: "test@example.com" };
    const mockSession = { user: mockUser, access_token: "abc" };
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: null,
      data: { user: mockUser, session: mockSession },
    });

    await store.dispatch(
      loginUser({
        email: "test@example.com",
        password: "Abc12345!",
        remember: true,
      })
    );

    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.user).toEqual(mockUser);

    const saved = JSON.parse(localStorage.getItem("supabaseSession"));
    expect(saved.user.email).toBe("test@example.com");
  });

  test("loginUser success with remember=false saves to sessionStorage", async () => {
    const mockUser = { email: "test2@example.com" };
    const mockSession = { user: mockUser, access_token: "xyz" };
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: null,
      data: { user: mockUser, session: mockSession },
    });

    await store.dispatch(
      loginUser({
        email: "test2@example.com",
        password: "Abc12345!",
        remember: false,
      })
    );

    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);

    const saved = JSON.parse(sessionStorage.getItem("supabaseSession"));
    expect(saved.user.email).toBe("test2@example.com");
  });

  test("loginUser failure", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid credentials" },
      data: null,
    });

    await store.dispatch(
      loginUser({
        email: "wrong@example.com",
        password: "12345678!",
        remember: true,
      })
    );

    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Invalid credentials");
    expect(state.user).toBeNull();
  });

  // ---------------- logout ----------------
  test("logout clears user and storage", () => {
    localStorage.setItem(
      "supabaseSession",
      JSON.stringify({ user: { email: "a@b.com" } })
    );
    sessionStorage.setItem(
      "supabaseSession",
      JSON.stringify({ user: { email: "a@b.com" } })
    );

    store.dispatch(logout());

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(localStorage.getItem("supabaseSession")).toBeNull();
    expect(sessionStorage.getItem("supabaseSession")).toBeNull();
  });
});
