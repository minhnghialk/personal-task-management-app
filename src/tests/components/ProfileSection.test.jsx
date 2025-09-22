import React from "react";
import { render, screen } from "@testing-library/react";
import { ProfileSection } from "../../components/ProfileSection";

describe("ProfileSection component", () => {
  test("renders title and description", () => {
    render(<ProfileSection />);

    expect(screen.getByText("Hồ sơ cá nhân")).toBeInTheDocument();
    expect(
      screen.getByText("Đây là màn hình hồ sơ cá nhân chi tiết.")
    ).toBeInTheDocument();
  });
});
