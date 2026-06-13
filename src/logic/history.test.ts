import { describe, it, expect } from "vitest";
import { resolveHistoryForChart, deriveCurrentFromHistory } from "./history";
import type Profile from "../types/profile";
import type { ResultInterest } from "../types/interest_result";
import type { RateSnapshot } from "../types/history";

function makeResult(yearlyPercent: number): ResultInterest {
  return {
    total: yearlyPercent,
    details: [],
    toYearlyPercent: () => yearlyPercent,
  };
}

const emptyProfile: Profile = {
  Savings: 0,
  Income: 0,
  Spending: 0,
  Insure: 0,
  Invest: 0,
  Save: 0,
  Bills: [],
  Age: 25,
  Giro: 0,
  CardSpend: 0,
  DailyAverageBalance: 0,
};

describe("deriveCurrentFromHistory", () => {
  const fallbackFn = () => makeResult(1.0);
  const fallbackDate = "2025-01-01";

  it("returns fallback when history is empty", () => {
    const result = deriveCurrentFromHistory([], fallbackFn, fallbackDate);
    expect(result.interestFn(emptyProfile).toYearlyPercent()).toBe(1.0);
    expect(result.lastUpdated).toBe("2025-01-01");
  });

  it("returns last history entry when history has items", () => {
    const history: RateSnapshot[] = [
      { effectiveDate: "2024-06-01", interestFn: () => makeResult(2.0), changeSummary: "Old" },
      { effectiveDate: "2025-03-01", interestFn: () => makeResult(3.0), changeSummary: "New" },
    ];
    const result = deriveCurrentFromHistory(history, fallbackFn, fallbackDate);
    expect(result.interestFn(emptyProfile).toYearlyPercent()).toBe(3.0);
    expect(result.lastUpdated).toBe("2025-03-01");
  });

  it("ignores fallback when history is present", () => {
    const history: RateSnapshot[] = [
      { effectiveDate: "2026-01-01", interestFn: () => makeResult(4.0), changeSummary: "Only" },
    ];
    const result = deriveCurrentFromHistory(history, fallbackFn, fallbackDate);
    expect(result.interestFn(emptyProfile).toYearlyPercent()).toBe(4.0);
    expect(result.lastUpdated).toBe("2026-01-01");
  });
});

describe("resolveHistoryForChart", () => {
  it("returns synthetic current-rate entry when history is empty", () => {
    const result = resolveHistoryForChart(
      [],
      () => makeResult(0.4),
      "2026-06-05",
      emptyProfile,
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      date: "2026-06-05",
      eir: 0.4,
      changeSummary: "Current rate",
    });
  });

  it("computes EIR from each RateSnapshot when history is present", () => {
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
      () => makeResult(2.5),
      "2025-01-01",
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
      [],
      () => makeResult(2.567),
      "2026-01-01",
      emptyProfile,
    );
    expect(result[0].eir).toBe(2.57);
  });

  it("uses profile to compute EIR via interestFn", () => {
    const richProfile: Profile = { ...emptyProfile, Savings: 100000 };
    const result = resolveHistoryForChart(
      [],
      (p) => makeResult(p.Savings > 50000 ? 3.0 : 1.0),
      "2026-06-13",
      richProfile,
    );
    expect(result[0].eir).toBe(3.0);
  });
});
