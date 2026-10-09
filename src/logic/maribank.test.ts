import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import {
  maribank_interest_09_2025,
  mariInterestRate_09_2025,
  maribank_interest_08_2026,
} from "./maribank";

describe("MariBank interest rates", () => {
  for (var i = 0; i < 200_000; i += 10000) {
    it(`balance ${i} should be correct`, () => {
      const result = maribank_interest_09_2025(NewProfile({ Savings: i }));
      if (i > 100_000) {
        expect(result).toEqual(
          new ResultInterest((100_000 * mariInterestRate_09_2025) / 100, i),
        );
        return;
      }

      expect(result.toYearlyPercent()).toBeCloseTo(mariInterestRate_09_2025);
      expect(result).toEqual(
        new ResultInterest((i * mariInterestRate_09_2025) / 100, i),
      );
    });
  }
});

describe("MariBank interest rates (Aug 2026)", () => {
  interface testCase {
    name: string;
    savings: number;
    salary?: number;
    shopeeVip?: boolean;
    expectedInterest: number;
  }

  // Bonus rate applies to the first S$100,000 only; nothing above that.
  const testCases: Array<testCase> = [
    {
      name: "base only",
      savings: 100_000,
      // 100k * 0.88 / 100
      expectedInterest: 880,
    },
    {
      name: "base + salary (>= S$500)",
      savings: 100_000,
      salary: 500,
      // 100k * 1.08 / 100
      expectedInterest: 1080,
    },
    {
      name: "salary below S$500 does not qualify",
      savings: 100_000,
      salary: 499,
      // 100k * 0.88 / 100
      expectedInterest: 880,
    },
    {
      name: "base + ShopeeVIP",
      savings: 100_000,
      shopeeVip: true,
      // 100k * 1.28 / 100
      expectedInterest: 1280,
    },
    {
      name: "max: base + salary + ShopeeVIP",
      savings: 100_000,
      salary: 500,
      shopeeVip: true,
      // 100k * 1.48 / 100
      expectedInterest: 1480,
    },
    {
      name: "above S$100K earns nothing (cutoff)",
      savings: 250_000,
      shopeeVip: true,
      // 100k * 1.28 / 100 + 150k * 0 = 1280
      expectedInterest: 1280,
    },
  ];

  for (const tc of testCases) {
    it(tc.name, () => {
      const result = maribank_interest_08_2026(
        NewProfile({
          Savings: tc.savings,
          Salary: tc.salary ?? 0,
          IsShopeeVip: tc.shopeeVip ?? false,
        }),
      );
      expect(result).toEqual(
        new ResultInterest(tc.expectedInterest, tc.savings),
      );
    });
  }
});
