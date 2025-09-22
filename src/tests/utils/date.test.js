// src/tests/utils/date.test.js
import { formatDate } from "../../utils/date";

describe("formatDate", () => {
  it("should return empty string if input is undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("should return empty string if input is null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("should return empty string if input is empty string", () => {
    expect(formatDate("")).toBe("");
  });

  it("should return formatted date for valid ISO string", () => {
    const isoString = "2025-09-20T10:15:30Z";
    expect(formatDate(isoString)).toBe("20/09/2025");
  });

  it("should handle invalid date string gracefully", () => {
    const invalidDate = "not-a-date";
    // new Date("not-a-date") => Invalid Date, getDate() returns NaN
    expect(formatDate(invalidDate)).toBe("NaN/NaN/NaN");
  });

  it("should pad single digit day and month with 0", () => {
    const isoString = "2025-01-05T00:00:00Z"; // 5th Jan 2025
    expect(formatDate(isoString)).toBe("05/01/2025");
  });
});
