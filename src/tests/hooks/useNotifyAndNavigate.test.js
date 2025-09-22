import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useNotifyAndNavigate } from "../../hooks/useNotifyAndNavigate";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("useNotifyAndNavigate hook", () => {
  let navigateMock;

  beforeEach(() => {
    jest.useFakeTimers();
    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("notify calls toast.success with correct message", () => {
    const { result } = renderHook(() => useNotifyAndNavigate());

    act(() => {
      result.current("Success message", "/dashboard");
    });

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Success message");
  });

  test("notify calls navigate with correct path after delay", () => {
    const { result } = renderHook(() => useNotifyAndNavigate());

    act(() => {
      result.current("Success message", "/dashboard", 5000);
    });

    expect(navigateMock).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5000);

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });

  test("notify uses default delay if not provided", () => {
    const { result } = renderHook(() => useNotifyAndNavigate());

    act(() => {
      result.current("Default delay message", "/home");
    });

    jest.advanceTimersByTime(4000);

    expect(navigateMock).toHaveBeenCalledWith("/home");
  });
});
