import { describe, expect, it } from "vitest";
import { csvEscape } from "./csv";

describe("csvEscape", () => {
  it.each(["-12.5", "+3", "1e-5", "-1.5E+10", "-.5", "-Infinity", "0", "", "hello", "2026-11-05 10:00:00+00"])(
    "leaves %j unchanged",
    (value) => {
      expect(csvEscape(value)).toBe(value);
    },
  );

  it.each([
    ["=1+1", "'=1+1"],
    ["+1+1", "'+1+1"],
    ["-1+1", "'-1+1"],
    ["@SUM(A1)", "'@SUM(A1)"],
    ["  =1+1", "'  =1+1"],
    ["\t=1", "'\t=1"],
  ])("makes %j safe to open in a spreadsheet", (value, expected) => {
    expect(csvEscape(value)).toBe(expected);
  });

  it.each([
    ["a,b", '"a,b"'],
    ['say "hi"', '"say ""hi"""'],
    ["a\nb", '"a\nb"'],
    ["a\rb", '"a\rb"'],
  ])("quotes %j", (value, expected) => {
    expect(csvEscape(value)).toBe(expected);
  });

  it("both neutralizes and quotes a formula with a comma", () => {
    expect(csvEscape('=HYPERLINK("http://x","a")')).toBe(`"'=HYPERLINK(""http://x"",""a"")"`);
  });
});
