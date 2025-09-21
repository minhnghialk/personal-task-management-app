import { renderHook } from "@testing-library/react";
import { useSupabaseSession } from "../../hooks/useSupabaseSession";
import { supabase } from "../../api/supabaseClient";
import { loginUser } from "../../auth/authSlice";
import { useDispatch } from "react-redux";

jest.mock("../../api/supabaseClient", () => ({
  supabase: {
    auth: { setSession: jest.fn() },
  },
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

describe("useSupabaseSession Hook", () => {
  let dispatchMock;
  let alertSpy;
  let consoleSpy;

  const mockUser = { id: "user1", email: "a@b.com" };
  const mockSession = { user: mockUser, access_token: "token" };

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    localStorage.clear();
    sessionStorage.clear();
  });

  test("restores session from localStorage and dispatches loginUser", async () => {
    localStorage.setItem("supabaseSession", JSON.stringify(mockSession));

    renderHook(() => useSupabaseSession());

    // Wait a tick for useEffect async
    await Promise.resolve();

    expect(supabase.auth.setSession).toHaveBeenCalledWith(mockSession);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: loginUser.fulfilled.type,
      payload: mockUser,
    });
  });

  test("restores session from sessionStorage if localStorage empty", async () => {
    sessionStorage.setItem("supabaseSession", JSON.stringify(mockSession));

    renderHook(() => useSupabaseSession());

    await Promise.resolve();

    expect(supabase.auth.setSession).toHaveBeenCalledWith(mockSession);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: loginUser.fulfilled.type,
      payload: mockUser,
    });
  });

  test("does nothing if no session in storage", async () => {
    renderHook(() => useSupabaseSession());

    await Promise.resolve();

    expect(supabase.auth.setSession).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  test("handles error when setSession throws", async () => {
    localStorage.setItem("supabaseSession", JSON.stringify(mockSession));
    supabase.auth.setSession.mockRejectedValueOnce(new Error("fail"));

    renderHook(() => useSupabaseSession());

    await Promise.resolve();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error restoring Supabase session:",
      "fail"
    );
    expect(alertSpy).toHaveBeenCalledWith(
      "Không thể restore session. Vui lòng đăng nhập lại."
    );
  });
});
