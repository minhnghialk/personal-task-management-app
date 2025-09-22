import React from "react";
import { getRegisterFields } from "../../utils/formFields";

describe("getRegisterFields full coverage", () => {
  const password = "123456";

  it("covers both showPassword and showConfirmPassword true/false branches", () => {
    const togglePassword = jest.fn();
    const toggleConfirmPassword = jest.fn();

    let fields = getRegisterFields(
      password,
      false,
      togglePassword,
      false,
      toggleConfirmPassword
    );
    expect(fields[1].type).toBe("password");
    expect(fields[2].type).toBe("password");

    fields = getRegisterFields(
      password,
      true,
      togglePassword,
      true,
      toggleConfirmPassword
    );
    expect(fields[1].type).toBe("text");
    expect(fields[2].type).toBe("text");
  });
});
