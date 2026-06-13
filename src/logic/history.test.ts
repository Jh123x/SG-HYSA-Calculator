import { describe, it, expect } from "vitest";
import { resolveHistoryForChart, deriveCurrentFromHistory } from "./history";
import { ResultInterest } from "../types/interest_result";
import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";
import { bankInfo } from "./constants";

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
      {
        effectiveDate: "2024-06-01",
        interestFn: () => makeResult(2.0),
        changeSummary: "Old",
      },
      {
        effectiveDate: "2025-03-01",
        interestFn: () => makeResult(3.0),
        changeSummary: "New",
      },
    ];
    const result = deriveCurrentFromHistory(history);
    expect(result.interestFn(emptyProfile).toYearlyPercent()).toBe(3.0);
    expect(result.lastUpdated).toBe("2025-03-01");
  });

  it("works with single-entry history", () => {
    const history: RateSnapshot[] = [
      {
        effectiveDate: "2026-01-01",
        interestFn: () => makeResult(4.0),
        changeSummary: "Only",
      },
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

  it("skips future-dated entries and returns latest effective one", () => {
    const history: RateSnapshot[] = [
      {
        effectiveDate: "2024-06-01",
        interestFn: () => makeResult(2.0),
        changeSummary: "Old",
      },
      {
        effectiveDate: "2025-03-01",
        interestFn: () => makeResult(3.0),
        changeSummary: "Current",
      },
      {
        effectiveDate: "2035-01-01",
        interestFn: () => makeResult(5.0),
        changeSummary: "Future",
      },
      {
        effectiveDate: "2036-06-01",
        interestFn: () => makeResult(7.0),
        changeSummary: "Far future",
      },
    ];
    const result = deriveCurrentFromHistory(history);
    expect(result.interestFn(emptyProfile).toYearlyPercent()).toBe(3.0);
    expect(result.lastUpdated).toBe("2025-03-01");
  });

  it("returns zero-interest with 'Effective' message when all entries are future-dated", () => {
    const history: RateSnapshot[] = [
      {
        effectiveDate: "2030-01-01",
        interestFn: () => makeResult(4.0),
        changeSummary: "Not yet",
      },
    ];
    const result = deriveCurrentFromHistory(history);
    expect(result.interestFn(emptyProfile).toYearlyPercent()).toBe(0);
    expect(result.lastUpdated).toBe("Effective 2030-01-01");
  });

  // ── Date validation tests ──

  it("throws on malformed effectiveDate (empty string)", () => {
    const history: RateSnapshot[] = [
      {
        effectiveDate: "",
        interestFn: () => makeResult(3.0),
        changeSummary: "bad",
      },
    ];
    expect(() => deriveCurrentFromHistory(history)).toThrow(
      "Invalid date string",
    );
  });

  it("throws on malformed effectiveDate (gibberish)", () => {
    const history: RateSnapshot[] = [
      {
        effectiveDate: "not-a-date",
        interestFn: () => makeResult(3.0),
        changeSummary: "bad",
      },
    ];
    expect(() => deriveCurrentFromHistory(history)).toThrow(
      "Invalid date string",
    );
  });

  it("throws on malformed effectiveDate (wrong format)", () => {
    const history: RateSnapshot[] = [
      {
        effectiveDate: "2025/03/15",
        interestFn: () => makeResult(3.0),
        changeSummary: "bad",
      },
    ];
    expect(() => deriveCurrentFromHistory(history)).toThrow(
      "Invalid date string",
    );
  });

  it("throws on non-existent date (Feb 30)", () => {
    const history: RateSnapshot[] = [
      {
        effectiveDate: "2025-02-30",
        interestFn: () => makeResult(3.0),
        changeSummary: "bad",
      },
    ];
    expect(() => deriveCurrentFromHistory(history)).toThrow(
      "Invalid date string",
    );
  });

  it("accepts valid leap year date", () => {
    const history: RateSnapshot[] = [
      {
        effectiveDate: "2024-02-29",
        interestFn: () => makeResult(2.0),
        changeSummary: "leap day",
      },
    ];
    // Should not throw
    const result = deriveCurrentFromHistory(history);
    expect(result.lastUpdated).toBe("2024-02-29");
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
    expect(result[0].date).toBeInstanceOf(Date);
    expect(result[1].eir).toBe(1.8);
    expect(result[1].changeSummary).toBe("Initial rate");
    expect(result[1].date).toBeInstanceOf(Date);
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
    expect(result[0].date.getTime()).toBe(0); // epoch
    expect(result[0].yearlyInterest).toBe(0);
    expect(result[0].eir).toBe(0);
    expect(result[0].changeSummary).toBe("Coming soon");
  });

  // ── Date validation tests ──

  it("throws on malformed effectiveDate", () => {
    expect(() =>
      resolveHistoryForChart(
        [
          {
            effectiveDate: "bad-date",
            interestFn: () => makeResult(2.0),
            changeSummary: "nope",
          },
        ],
        emptyProfile,
      ),
    ).toThrow("Invalid date string");
  });

  it("throws on empty effectiveDate string", () => {
    expect(() =>
      resolveHistoryForChart(
        [
          {
            effectiveDate: "",
            interestFn: () => makeResult(2.0),
            changeSummary: "nope",
          },
        ],
        emptyProfile,
      ),
    ).toThrow("Invalid date string");
  });

  it("throws on non-existent date", () => {
    expect(() =>
      resolveHistoryForChart(
        [
          {
            effectiveDate: "2025-13-01",
            interestFn: () => makeResult(2.0),
            changeSummary: "nope",
          },
        ],
        emptyProfile,
      ),
    ).toThrow("Invalid date string");
  });

  it("throws when one entry has bad date among good ones", () => {
    expect(() =>
      resolveHistoryForChart(
        [
          {
            effectiveDate: "2025-01-01",
            interestFn: () => makeResult(2.0),
            changeSummary: "good",
          },
          {
            effectiveDate: "invalid!",
            interestFn: () => makeResult(3.0),
            changeSummary: "bad",
          },
        ],
        emptyProfile,
      ),
    ).toThrow("Invalid date string");
  });

  // ── Sorted-order tests ──

  it("preserves chronological order from input", () => {
    const result = resolveHistoryForChart(
      [
        {
          effectiveDate: "2024-01-15",
          interestFn: () => makeResult(1.0),
          changeSummary: "First",
        },
        {
          effectiveDate: "2024-06-01",
          interestFn: () => makeResult(2.0),
          changeSummary: "Second",
        },
        {
          effectiveDate: "2025-03-01",
          interestFn: () => makeResult(3.0),
          changeSummary: "Third",
        },
      ],
      emptyProfile,
    );
    expect(result[0].date.getTime()).toBeLessThan(result[1].date.getTime());
    expect(result[1].date.getTime()).toBeLessThan(result[2].date.getTime());
  });

  it("all bankInfo histories are chronologically sorted (oldest first)", () => {
    const invalid: string[] = [];
    for (const [name, info] of Object.entries(bankInfo)) {
      const dates = info.history.map((h) => h.effectiveDate);
      for (let i = 1; i < dates.length; i++) {
        if (dates[i] < dates[i - 1]) {
          invalid.push(`${name}: ${dates[i - 1]} > ${dates[i]}`);
        }
      }
    }
    expect(invalid).toEqual([]);
  });
});
