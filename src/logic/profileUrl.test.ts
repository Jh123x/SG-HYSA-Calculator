import { describe, it, expect } from "vitest";
import { profileToSearch, searchToProfile, profileToUrl } from "./profileUrl";
import { NewProfile } from "../types/profile";

describe("profileToSearch", () => {
  it("returns empty string for default profile", () => {
    const profile = NewProfile({});
    expect(profileToSearch(profile)).toBe("");
  });

  it("serializes non-default numeric fields using field names as keys", () => {
    const profile = NewProfile({ Savings: 50000, Salary: 6000, Spending: 500 });
    const search = profileToSearch(profile);
    expect(search).toContain("Savings=50000");
    expect(search).toContain("Salary=6000");
    expect(search).toContain("Spending=500");
    expect(search.startsWith("?")).toBe(true);
  });

  it("omits fields at their default value", () => {
    const profile = NewProfile({ Savings: 50000 });
    const search = profileToSearch(profile);
    expect(search).not.toContain("Salary=");
    expect(search).not.toContain("Spending=");
    expect(search).not.toContain("Age=");
  });

  it("serializes boolean true fields", () => {
    const profile = NewProfile({ IsNTUCMember: true });
    expect(profileToSearch(profile)).toBe("?IsNTUCMember=1");
  });

  it("omits boolean false (default)", () => {
    const profile = NewProfile({ IsNTUCMember: false });
    expect(profileToSearch(profile)).toBe("");
  });

  it("serializes a fully populated profile", () => {
    const profile = NewProfile({
      Savings: 100000,
      Age: 30,
      Salary: 8000,
      Spending: 2000,
      Investment: 12000,
      Insurance: 5000,
      GiroTransactions: 3,
      MonthlyAccIncrease: 1000,
      LoanInstallment: 1500,
      OneTimeLoan: 10000,
      IsNTUCMember: true,
    });
    const search = profileToSearch(profile);
    // All fields should be present
    expect(search).toContain("Savings=100000");
    expect(search).toContain("Age=30");
    expect(search).toContain("Salary=8000");
    expect(search).toContain("Spending=2000");
    expect(search).toContain("Investment=12000");
    expect(search).toContain("Insurance=5000");
    expect(search).toContain("GiroTransactions=3");
    expect(search).toContain("MonthlyAccIncrease=1000");
    expect(search).toContain("LoanInstallment=1500");
    expect(search).toContain("OneTimeLoan=10000");
    expect(search).toContain("IsNTUCMember=1");
  });
});

describe("searchToProfile", () => {
  it("returns default profile for empty search", () => {
    const result = searchToProfile("");
    const defaults = NewProfile({});
    expect(result).toEqual(defaults);
  });

  it("returns default profile for search with no recognized params", () => {
    const result = searchToProfile("?foo=bar&baz=qux");
    expect(result).toEqual(NewProfile({}));
  });

  it("parses numeric fields from search params", () => {
    const result = searchToProfile("?Savings=50000&Salary=6000&Spending=500");
    expect(result.Savings).toBe(50000);
    expect(result.Salary).toBe(6000);
    expect(result.Spending).toBe(500);
  });

  it("parses boolean fields", () => {
    const withNtuc = searchToProfile("?IsNTUCMember=1");
    expect(withNtuc.IsNTUCMember).toBe(true);

    const withoutNtuc = searchToProfile("?IsNTUCMember=0");
    expect(withoutNtuc.IsNTUCMember).toBe(false);
  });

  it("treats missing fields as defaults", () => {
    const result = searchToProfile("?Savings=50000");
    expect(result.Savings).toBe(50000);
    expect(result.Salary).toBe(0);
    expect(result.Spending).toBe(0);
    expect(result.IsNTUCMember).toBe(false);
  });

  it("ignores negative values", () => {
    const result = searchToProfile("?Savings=-500");
    expect(result.Savings).toBe(0); // default, negative ignored
  });

  it("ignores non-numeric values", () => {
    const result = searchToProfile("?Savings=abc");
    expect(result.Savings).toBe(0); // default, non-numeric ignored
  });

  it("handles search with or without leading ?", () => {
    const withQ = searchToProfile("?Savings=42");
    const withoutQ = searchToProfile("Savings=42");
    expect(withQ.Savings).toBe(42);
    expect(withoutQ.Savings).toBe(42);
  });
});

describe("profileToSearch → searchToProfile round-trip", () => {
  it("preserves all fields for a fully populated profile", () => {
    const original = NewProfile({
      Savings: 75000,
      Age: 28,
      Salary: 5500,
      Spending: 1200,
      Investment: 8000,
      Insurance: 3600,
      GiroTransactions: 2,
      MonthlyAccIncrease: 500,
      LoanInstallment: 2000,
      OneTimeLoan: 5000,
      IsNTUCMember: true,
    });
    const roundTripped = searchToProfile(profileToSearch(original));
    expect(roundTripped).toEqual(original);
  });

  it("preserves profile with only some fields set", () => {
    const original = NewProfile({ Savings: 20000, Salary: 4000 });
    const roundTripped = searchToProfile(profileToSearch(original));
    expect(roundTripped).toEqual(original);
  });
});
