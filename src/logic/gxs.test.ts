import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { gxs_interest_07_2025, gxs_interest_06_2026 } from "./gxs";

interface testCase {
  caseName: string;
  savings: number;
  expectedResult: number;
}

describe("GXS Interest rates (Jul 2025)", () => {
  const testCases: Array<testCase> = [
    {
      caseName: "No $$ is empty",
      savings: 0,
      expectedResult: 0,
    },
    {
      caseName: "Max boost pocket",
      savings: 60000,
      expectedResult: 1548,
    },
    {
      caseName: "Max amount deposited",
      savings: 95000,
      expectedResult: 2136,
    },
  ];

  for (const tc of testCases) {
    it(tc.caseName, () => {
      const result = gxs_interest_07_2025(
        NewProfile({
          Savings: tc.savings,
        }),
      );

      expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.savings));
    });
  }
});

describe("GXS Interest rates (Jun 2026)", () => {
  const testCases: Array<testCase> = [
    {
      caseName: "No $$ is empty",
      savings: 0,
      expectedResult: 0,
    },
    {
      caseName: "Full boost pocket (85k)",
      savings: 85000,
      expectedResult: 1037,
    },
    {
      caseName: "Max amount deposited (95k)",
      savings: 95000,
      expectedResult: 1145,
    },
    {
      caseName: "50k in boost pocket",
      savings: 50000,
      expectedResult: 610,
    },
    {
      caseName: "Below 200 should be 0",
      savings: 100,
      expectedResult: 0,
    },
  ];

  for (const tc of testCases) {
    it(tc.caseName, () => {
      const result = gxs_interest_06_2026(
        NewProfile({
          Savings: tc.savings,
        }),
      );
      const expectedSavings = tc.savings < 200 ? 0 : tc.savings;
      expect(result).toEqual(
        new ResultInterest(tc.expectedResult, expectedSavings),
      );
    });
  }
});
