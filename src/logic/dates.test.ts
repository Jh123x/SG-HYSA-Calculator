import { describe, it, expect } from "vitest";
import { parseISODate, formatDate, todayISO, TBD_DATE } from "./dates";

describe("parseISODate", () => {
  it("parses a valid ISO date string", () => {
    const d = parseISODate("2025-03-15");
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(2); // zero-indexed
    expect(d.getDate()).toBe(15);
  });

  it("parses earliest reasonable date", () => {
    const d = parseISODate("2000-01-01");
    expect(isNaN(d.getTime())).toBe(false);
  });

  it("parses far future date", () => {
    const d = parseISODate("2099-12-31");
    expect(isNaN(d.getTime())).toBe(false);
  });

  it("throws on empty string", () => {
    expect(() => parseISODate("")).toThrow("Invalid date string");
  });

  it("throws on gibberish", () => {
    expect(() => parseISODate("not-a-date")).toThrow("Invalid date string");
  });

  it("throws on badly formatted date (slashes)", () => {
    expect(() => parseISODate("2025/03/15")).toThrow("Invalid date string");
  });

  it("throws on partial date", () => {
    expect(() => parseISODate("2025-03")).toThrow("Invalid date string");
  });

  it("throws on non-existent date (Feb 30)", () => {
    expect(() => parseISODate("2025-02-30")).toThrow("Invalid date string");
  });

  it("throws on month 13", () => {
    expect(() => parseISODate("2025-13-01")).toThrow("Invalid date string");
  });

  it("handles leap year date", () => {
    const d = parseISODate("2024-02-29");
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(29);
  });

  it("throws on non-leap-year Feb 29", () => {
    expect(() => parseISODate("2025-02-29")).toThrow("Invalid date string");
  });

  it("throws on day 0", () => {
    expect(() => parseISODate("2025-01-00")).toThrow("Invalid date string");
  });

  it("throws on month 0", () => {
    expect(() => parseISODate("2025-00-15")).toThrow("Invalid date string");
  });
});

describe("formatDate", () => {
  it("formats a Date back to ISO string", () => {
    const d = parseISODate("2025-03-15");
    expect(formatDate(d)).toBe("2025-03-15");
  });

  it("round-trips with parseISODate", () => {
    const input = "2026-06-13";
    expect(formatDate(parseISODate(input))).toBe(input);
  });

  it("pads single-digit month and day", () => {
    const d = parseISODate("2025-01-05");
    expect(formatDate(d)).toBe("2025-01-05");
  });
});

describe("todayISO", () => {
  it("returns a valid ISO date string that parseISODate accepts", () => {
    const today = todayISO();
    expect(() => parseISODate(today)).not.toThrow();
  });

  it("matches YYYY-MM-DD format", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("TBD_DATE", () => {
  it("is the epoch sentinel", () => {
    expect(TBD_DATE.getTime()).toBe(0);
  });

  it("is distinct from a valid parsed date", () => {
    const real = parseISODate("2025-01-15");
    expect(real.getTime()).not.toBe(0);
  });
});
