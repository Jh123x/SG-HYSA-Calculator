import { describe, it, expect } from "vitest";
import { jaro, jaroWinkler, findClosestBank } from "./fuzzyMatch";

// ── jaro ─────────────────────────────────────────────────────────────

describe("jaro", () => {
  it("identical strings → 1", () => {
    expect(jaro("uob-one-account", "uob-one-account")).toBe(1);
  });

  it("completely different → 0", () => {
    expect(jaro("abc", "xyz")).toBe(0);
  });

  it("empty string → 0", () => {
    expect(jaro("abc", "")).toBe(0);
    expect(jaro("", "abc")).toBe(0);
    expect(jaro("", "")).toBe(1); // both empty → identical
  });

  it("single char vs single char match", () => {
    expect(jaro("a", "a")).toBe(1);
    expect(jaro("a", "b")).toBe(0);
  });

  it("known example: MARTHA vs MARHTA", () => {
    // All 6 chars match within window, 1 transposition (T↔H).
    // Jaro = (6/6 + 6/6 + (6-1)/6) / 3 = 17/18 ≈ 0.9444
    const score = jaro("MARTHA", "MARHTA");
    expect(score).toBeCloseTo(0.9444, 3);
  });
});

// ── jaroWinkler ──────────────────────────────────────────────────────

describe("jaroWinkler", () => {
  it("identical strings → 1", () => {
    expect(jaroWinkler("uob-one", "uob-one")).toBe(1);
  });

  it("prefix boost: MARTHA vs MARHTA", () => {
    // Jaro ≈ 0.9444, prefix "MAR" = 3, boost = 3*0.1*(1-0.9444) ≈ 0.0167
    // Winkler ≈ 0.9444 + 0.0167 ≈ 0.961
    const score = jaroWinkler("MARTHA", "MARHTA");
    expect(score).toBeCloseTo(0.961, 2);
  });

  it("UOB → uob-one-account (the core use case)", () => {
    const score = jaroWinkler("uob", "uob-one-account");
    // Full prefix "uob" (3 chars) → strong boost
    expect(score).toBeGreaterThan(0.7);
  });

  it("UOB → / (should score near zero)", () => {
    const score = jaroWinkler("uob", "/");
    expect(score).toBe(0);
  });

  it("uob → ocbc-360-account (no prefix, should score low)", () => {
    const score = jaroWinkler("uob", "ocbc-360-account");
    expect(score).toBeLessThan(0.7);
  });

  it("case insensitive prefix boost", () => {
    const upper = jaroWinkler("UOB", "uob-one-account");
    const lower = jaroWinkler("uob", "uob-one-account");
    expect(upper).toBe(lower);
  });

  it("partial prefix: uob-on → uob-one-account", () => {
    const score = jaroWinkler("uob-on", "uob-one-account");
    expect(score).toBeGreaterThan(0.75);
  });
});

// ── findClosestBank ──────────────────────────────────────────────────

describe("findClosestBank", () => {
  it("empty query → null", () => {
    expect(findClosestBank("")).toBeNull();
  });

  it("exact match returns that bank", () => {
    const result = findClosestBank("uob-one-account");
    expect(result).not.toBeNull();
    expect(result!.slug).toBe("uob-one-account");
    expect(result!.bank.name).toBe("UOB One Account");
  });

  it("acronym UOB → uob-one-account", () => {
    const result = findClosestBank("uob");
    expect(result).not.toBeNull();
    expect(result!.slug).toBe("uob-one-account");
  });

  it("acronym DBS → dbs-multiplier-account", () => {
    const result = findClosestBank("dbs");
    expect(result).not.toBeNull();
    expect(result!.slug).toBe("dbs-multiplier-account");
  });

  it("acronym OCBC → ocbc-360-account", () => {
    const result = findClosestBank("ocbc");
    expect(result).not.toBeNull();
    expect(result!.slug).toBe("ocbc-360-account");
  });

  it("gibberish → null (below threshold)", () => {
    const result = findClosestBank("xyznothing");
    expect(result).toBeNull();
  });

  it("partial slug: gxs → gxs-savings-account", () => {
    const result = findClosestBank("gxs");
    expect(result).not.toBeNull();
    expect(result!.slug).toBe("gxs-savings-account");
  });

  it("typo near start: ubb → below threshold (2/3 chars match)", () => {
    // "ubb" has only 2 of 3 chars matching "uob-one-account" (u, b).
    // Jaro ≈ 0.6, below the 0.7 threshold → no match returned.
    const result = findClosestBank("ubb");
    expect(result).toBeNull();
  });

  it("type chocolate → chocolate-finance", () => {
    const result = findClosestBank("choco");
    expect(result).not.toBeNull();
    expect(result!.slug).toBe("chocolate-finance");
  });
});
