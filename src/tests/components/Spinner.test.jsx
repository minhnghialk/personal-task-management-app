import React from "react";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../../components/Spinner";

describe("Spinner", () => {
  it("renders with default size 10", () => {
    render(<Spinner />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      "w-10 h-10 animate-spin rounded-full border-2 border-t-blue-500 border-gray-200"
    );
  });

  it("renders correct class for size 4", () => {
    render(<Spinner size="4" />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveClass("w-4 h-4");
  });

  it("renders correct class for size 5", () => {
    render(<Spinner size="5" />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveClass("w-5 h-5");
  });

  it("renders correct class for size 6", () => {
    render(<Spinner size="6" />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveClass("w-6 h-6");
  });

  it("renders correct class for size 8", () => {
    render(<Spinner size="8" />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveClass("w-8 h-8");
  });

  it("renders correct class for size 10", () => {
    render(<Spinner size="10" />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveClass("w-10 h-10");
  });

  it("renders fallback to undefined size class if size is unknown", () => {
    render(<Spinner size="12" />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveClass(
      "animate-spin rounded-full border-2 border-t-blue-500 border-gray-200"
    );
  });
});
