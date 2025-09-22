import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectField } from "../../components/SelectField";

describe("SelectField component", () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ];

  it("renders select with given options", () => {
    render(
      <SelectField
        id="test-select"
        value="option1"
        onChange={() => {}}
        options={options}
        error={false}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("option1");

    options.forEach((opt) => {
      expect(screen.getByText(opt.label)).toBeInTheDocument();
    });
  });

  it("calls onChange when value changes", () => {
    const handleChange = jest.fn();
    render(
      <SelectField
        id="test-select"
        value="option1"
        onChange={handleChange}
        options={options}
        error={false}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "option2" } });
    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  it("applies error class when error prop is true", () => {
    render(
      <SelectField
        id="test-select"
        value="option1"
        onChange={() => {}}
        options={options}
        error={true}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("border-red-500");
  });

  it("applies normal border class when error prop is false", () => {
    render(
      <SelectField
        id="test-select"
        value="option1"
        onChange={() => {}}
        options={options}
        error={false}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("border-gray-300");
  });
});
