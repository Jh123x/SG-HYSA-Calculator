import { describe, it, expect } from "vitest";
import { bankNameToSlug, slugToBankName } from "./slugs";
import { bankInfo } from "./constants";

describe("bankNameToSlug", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(bankNameToSlug("UOB Bank")).toBe("uob-bank");
  });

  it("handles parentheses", () => {
    expect(bankNameToSlug("Trust Bank (Zen)")).toBe("trust-bank-zen");
  });

  it("handles multiple special characters", () => {
    expect(bankNameToSlug("Citi Wealth first Account")).toBe(
      "citi-wealth-first-account",
    );
  });

  it("strips leading/trailing hyphens", () => {
    expect(bankNameToSlug("  Spaces  ")).toBe("spaces");
  });

  it("produces unique slugs for all bankInfo entries", () => {
    const slugs = Object.keys(bankInfo).map(bankNameToSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("slugToBankName", () => {
  it("round-trips correctly", () => {
    for (const name of Object.keys(bankInfo)) {
      const slug = bankNameToSlug(name);
      expect(slugToBankName(slug)).toBe(name);
    }
  });

  it("returns undefined for unknown slug", () => {
    expect(slugToBankName("nonexistent-bank")).toBeUndefined();
  });
});
