import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { ocbc_interest_07_2025, ocbc_interest_05_2026 } from "./ocbc360";

interface testCase {
  caseName: string;

  savings: number;
  salary: number;
  balanceIncrease: number;
  spending: number;
  insurance: boolean;
  investment: boolean;

  expectedResult: number;
}

describe("OCBC Interest rates", () => {
  const testCases: Array<testCase> = [
    {
      caseName: "250k and all criteria",
      savings: 250_000,
      salary: 1800,
      balanceIncrease: 500,
      spending: 500,
      insurance: true,
      investment: true,

      expectedResult: 8575,
    },
    {
      caseName: "100k and all criteria",

      savings: 100_000,
      salary: 1800,
      balanceIncrease: 500,
      spending: 500,
      insurance: true,
      investment: true,

      expectedResult: 6300,
    },
    {
      caseName: "100k + salary + save",

      savings: 100_000,
      salary: 1800,
      balanceIncrease: 500,
      spending: 500,
      insurance: false,
      investment: false,

      expectedResult: 3300,
    },
    {
      caseName: "0 should return 0",
      savings: 0,
      salary: 1800,
      balanceIncrease: 500,
      spending: 500,
      insurance: true,
      investment: true,

      expectedResult: 0,
    },
  ];
  for (const tc of testCases) {
    it(tc.caseName, () => {
      const result = ocbc_interest_07_2025(
        NewProfile({
          Savings: tc.savings,
          Salary: tc.salary,
          Spending: tc.spending,
          Investment: tc.investment ? 100 : 0,
          Insurance: tc.insurance ? 100 : 0,
          MonthlyAccIncrease: tc.balanceIncrease,
        }),
      );

      expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.savings));
    });
  }
});

describe("OCBC 360 — May 2026 rates (golden tests)", () => {
  /**
   * Manually verified expected values for ocbc_interest_05_2026.
   *
   * Rate structure (effective 2026-04-05):
   *   Base: 0.05% on all tiers
   *   Salary (≥$1,800):  +1.00% first $75K / +2.00% next $25K
   *   Save (ADB +$500):   +0.40% first $75K / +0.40% next $25K
   *   Spend (≥$500):      +0.25% first $75K / +0.25% next $25K
   *   Insure (>$0):       +1.00% first $75K / +2.00% next $25K
   *   Invest (>$0):       +1.00% first $75K / +2.00% next $25K
   *   Balance ≥$250K:     +1.20% first $75K / +1.20% next $25K
   *   Above $100K:        0.05% base rate (no bonus)
   */
  const cases: Array<testCase & { eir: number }> = [
    {
      caseName: "$100K with all 5 criteria (no $250K bonus)",
      savings: 100_000,
      salary: 5_000,
      balanceIncrease: 1_000,
      spending: 1_000,
      insurance: true,
      investment: true,
      // T1: 0.05+1.0+0.4+0.25+1.0+1.0 = 3.70% → $75K * 0.037 = $2,775
      // T2: 0.05+2.0+0.4+0.25+2.0+2.0 = 6.70% → $25K * 0.067 = $1,675
      // Total = $4,450
      expectedResult: 4450,
      eir: 4.45,
    },
    {
      caseName: "$250K with all 6 criteria",
      savings: 250_000,
      salary: 5_000,
      balanceIncrease: 1_000,
      spending: 1_000,
      insurance: true,
      investment: true,
      // T1: 3.70 + 1.20 = 4.90% → $75K * 0.049 = $3,675
      // T2: 6.70 + 1.20 = 7.90% → $25K * 0.079 = $1,975
      // Remaining $150K at 0.05% base = $75
      // Total = $5,725
      expectedResult: 5725,
      eir: 2.29,
    },
    {
      caseName: "$100K salary + save + spend only (no Insure/Invest)",
      savings: 100_000,
      salary: 5_000,
      balanceIncrease: 1_000,
      spending: 1_000,
      insurance: false,
      investment: false,
      // T1: 0.05+1.0+0.4+0.25 = 1.70% → $75K * 0.017 = $1,275
      // T2: 0.05+2.0+0.4+0.25 = 2.70% → $25K * 0.027 = $675
      // Total = $1,950
      expectedResult: 1950,
      eir: 1.95,
    },
    {
      caseName: "$50K salary only",
      savings: 50_000,
      salary: 5_000,
      balanceIncrease: 0,
      spending: 0,
      insurance: false,
      investment: false,
      // T1: 0.05+1.0 = 1.05% → $50K * 0.0105 = $525
      expectedResult: 525,
      eir: 1.05,
    },
    {
      caseName: "$10K no criteria met",
      savings: 10_000,
      salary: 0,
      balanceIncrease: 0,
      spending: 0,
      insurance: false,
      investment: false,
      // T1: 0.05% → $10K * 0.0005 = $5
      expectedResult: 5,
      eir: 0.05,
    },
  ];

  for (const tc of cases) {
    it(tc.caseName, () => {
      const result = ocbc_interest_05_2026(
        NewProfile({
          Savings: tc.savings,
          Salary: tc.salary,
          Spending: tc.spending,
          Investment: tc.investment ? 100 : 0,
          Insurance: tc.insurance ? 100 : 0,
          MonthlyAccIncrease: tc.balanceIncrease,
        }),
      );

      expect(result.toYearly()).toBe(tc.expectedResult);
      expect(result.toYearlyPercent()).toBeCloseTo(tc.eir, 1);
    });
  }
});
