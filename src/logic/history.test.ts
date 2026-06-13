import { describe, it, expect } from "vitest";
import { resolveHistoryForChart, deriveCurrentFromHistory } from "./history";
import { ResultInterest } from "../types/interest_result";
import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";

function makeResult(yearlyPercent: number): ResultInterest {
  return {
    toYearlyPercent: () => yearlyPercent,
    toYearly: () => 0,
  } as unknown as ResultInterest;
}

const emptyProfile: Profile = {
  Savings: 0,
  Age: 25,
  Salary: 0,
  Spending: 0,
  Investment: 0,
  Insurance: 0,
  GiroTransactions: 0,
  MonthlyAccIncrease: 0,
  LoanInstallment: 0,
  OneTimeLoan: 0,
  IsNTUCMember: false,
};

describe("deriveCurrentFromHistory", () => {
  it("returns last history entry when history has items", () => {
    const history: RateSnapshot[] = [
      { effectiveDate: "2024-06-01", interestFn: () => makeResult(2.0), changeSummary: "Old" },
      { effectiveDate: "2025-03-01", interestFn: () => makeResult(3.0), changeSummary: "New" },
    ];
    const result = deriveCurrentFromHistory(history);
    expect(result.interestFn(emptyProfile).toYearlyPercent()).toBe(3.0);
    expect(result.lastUpdated).toBe("2025-03-01");
  });

  it("works with single-entry history", () => {
    const history: RateSnapshot[] = [
      { effectiveDate: "2026-01-01", interestFn: () => makeResult(4.0), changeSummary: "Only" },
    ];
    const result = deriveCurrentFromHistory(history);
    expect(result.interestFn(emptyProfile).toYearlyPercent()).toBe(4.0);
    expect(result.lastUpdated).toBe("2026-01-01");
  });

  it("returns zero-interest fallback when history is empty", () => {
    const result = deriveCurrentFromHistory([]);
    expect(result.interestFn(emptyProfile).toYearlyPercent()).toBe(0);
    expect(result.lastUpdated).toBe("Coming soon");
  });
});

describe("resolveHistoryForChart", () => {
  it("computes EIR from each RateSnapshot", () => {
    const result = resolveHistoryForChart(
      [
        {
          effectiveDate: "2025-01-01",
          interestFn: () => makeResult(2.5),
          changeSummary: "Base rate increase",
        },
        {
          effectiveDate: "2024-06-01",
          interestFn: () => makeResult(1.8),
          changeSummary: "Initial rate",
        },
      ],
      emptyProfile,
    );
    expect(result).toHaveLength(2);
    expect(result[0].eir).toBe(2.5);
    expect(result[0].changeSummary).toBe("Base rate increase");
    expect(result[1].eir).toBe(1.8);
    expect(result[1].changeSummary).toBe("Initial rate");
  });

  it("rounds EIR to 2 decimal places", () => {
    const result = resolveHistoryForChart(
      [
        {
          effectiveDate: "2026-01-01",
          interestFn: () => makeResult(2.567),
          changeSummary: "Test",
        },
      ],
      emptyProfile,
    );
    expect(result[0].eir).toBe(2.57);
  });

  it("uses profile to compute EIR via interestFn", () => {
    const richProfile: Profile = { ...emptyProfile, Savings: 100000 };
    const result = resolveHistoryForChart(
      [
        {
          effectiveDate: "2026-06-13",
          interestFn: (p) => makeResult(p.Savings > 50000 ? 3.0 : 1.0),
          changeSummary: "Tiered rate",
        },
      ],
      richProfile,
    );
    expect(result[0].eir).toBe(3.0);
  });

  it("returns Coming Soon placeholder when history is empty", () => {
    const result = resolveHistoryForChart([], emptyProfile);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      date: "TBD",
      yearlyInterest: 0,
      eir: 0,
      changeSummary: "Coming soon",
    });
  });
});