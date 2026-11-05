import { describe, expect, it } from "vitest";
import {
  millisecondsToMinutes,
  millisecondsToTimeString,
  minutesToMilliseconds,
  timeStringToMilliseconds,
} from "./date";

describe("time conversions", () => {
  it("converts between HH:mm and milliseconds", () => {
    expect(timeStringToMilliseconds("01:30")).toBe(5_400_000);
    expect(millisecondsToTimeString(5_400_000)).toBe("01:30");
  });

  it.each(["", "12", ":30", "12:"])("returns null for the partial time %j", (value) => {
    expect(timeStringToMilliseconds(value)).toBeNull();
  });

  it("wraps a time past midnight", () => {
    expect(millisecondsToTimeString(25 * 60 * 60 * 1000)).toBe("01:00");
  });

  it("gives whole milliseconds for fractional minutes, which the app requires", () => {
    expect(minutesToMilliseconds(1.1)).toBe(66_000);
    expect(Number.isInteger(minutesToMilliseconds(0.07))).toBe(true);
  });

  it("rounds milliseconds to the nearest minute", () => {
    expect(millisecondsToMinutes(90_000)).toBe(2);
  });
});
