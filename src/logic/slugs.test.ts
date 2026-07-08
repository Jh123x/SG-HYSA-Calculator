import { describe, it, expect } from "vitest";
import {
  slugToBankName,
  ERROR_SLUG,
  isValidSlug,
} from "./slugs";
import { banks } from "../data/banks";

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
