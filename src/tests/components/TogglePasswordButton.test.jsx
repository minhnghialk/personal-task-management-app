import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TogglePasswordButton } from "../../components/TogglePasswordButton";

describe("TogglePasswordButton component", () => {
  test("renders with correct aria-label", () => {
    const mockSetVisible = jest.fn();
    render(
      <TogglePasswordButton
        visible={false}
        setVisible={mockSetVisible}
        ariaLabel="Toggle password visibility"
      />
    );

    const button = screen.getByLabelText("Toggle password visibility");
    expect(button).toBeInTheDocument();
  });

  test("shows Eye icon when visible is false and toggles on click", () => {
    let visible = false;
    const mockSetVisible = jest.fn((fn) => {
      visible = fn(visible);
    });

    render(
      <TogglePasswordButton
        visible={visible}
        setVisible={mockSetVisible}
        ariaLabel="Toggle password visibility"
      />
    );

    const button = screen.getByLabelText("Toggle password visibility");

    expect(screen.getByTestId("lucide-eye")).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockSetVisible).toHaveBeenCalledTimes(1);
  });

  test("shows EyeOff icon when visible is true", () => {
    const mockSetVisible = jest.fn();

    render(
      <TogglePasswordButton
        visible={true}
        setVisible={mockSetVisible}
        ariaLabel="Toggle password visibility"
      />
    );

    expect(screen.getByTestId("lucide-eye-off")).toBeInTheDocument();
  });
});
