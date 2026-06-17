import { describe, it, expect } from "vitest";
import { bankNameToSlug, slugToBankName, ERROR_SLUG, isValidSlug } from "./slugs";
import { banks } from "../data/banks";

describe("bankNameToSlug (deprecated — kept for migration)", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(bankNameToSlug("UOB One Account")).toBe("uob-one-account");
  });

  it("handles parentheses", () => {
    expect(bankNameToSlug("Trust Bank (Zen)")).toBe("trust-bank-zen");
  });

  it("handles multiple special characters", () => {
    expect(bankNameToSlug("Citi Wealth First Account")).toBe(
      "citi-wealth-first-account",
    );
  });

  it("strips leading/trailing hyphens", () => {
    expect(bankNameToSlug("  Spaces  ")).toBe("spaces");
  });

  it("maps dollar sign to s", () => {
    expect(bankNameToSlug("Standard Chartered Bonus$aver")).toBe(
      "standard-chartered-bonus-saver",
    );
  });

  it("reverse-lookups from bank registry for exact names", () => {
    for (const [, data] of Object.entries(banks)) {
      expect(bankNameToSlug(data.name)).toBeTruthy();
      expect(bankNameToSlug(data.name).length).toBeGreaterThan(0);
    }
  });
});

describe("slugToBankName", () => {
  it("maps slugs to display names", () => {
    for (const [slug, data] of Object.entries(banks)) {
      expect(slugToBankName(slug)).toBe(data.name);
    }
  });

  it("returns ERROR_SLUG sentinel for unknown slug", () => {
    expect(slugToBankName("nonexistent-bank")).toBe(ERROR_SLUG);
  });

  it("returns ERROR_SLUG for empty slug", () => {
    expect(slugToBankName("")).toBe(ERROR_SLUG);
  });

  it("ERROR_SLUG cannot collide with real slugs", () => {
    const allSlugs = Object.keys(banks);
    expect(allSlugs).not.toContain(ERROR_SLUG);
  });
});

describe("isValidSlug", () => {
  it("returns true for known slugs", () => {
    expect(isValidSlug("uob-one-account")).toBe(true);
    expect(isValidSlug("gxs-savings-account")).toBe(true);
  });

  it("returns false for unknown slugs", () => {
    expect(isValidSlug("fake-bank")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});
