import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import {
  choco_finance_06_2025,
  choco_finance_06_2026,
  choco_finance_11_2026,
} from "./choco_finance";

interface TestCase {
  name: string;
  savings: number;
  expected_ir: number;
}

describe("Choco Finance (Jun 2025)", () => {
  const tests: Array<TestCase> = [
    {
      name: "should return the correct i/r for < 20k",
      savings: 1000,
      expected_ir: 30,
    },
    {
      name: "should return the correct i/r for 20k",
      savings: 20000,
      expected_ir: 600,
    },
    {
      name: "should return the correct i/r for > 20k and < 50k",
      savings: 30000,
      expected_ir: 870,
    },
    {
      name: "should return the correct i/r for 50k",
      savings: 50000,
      expected_ir: 1410,
    },
    {
      name: "should return the i/r for 50k for > 50k",
      savings: 100000,
      expected_ir: 1410,
    },
  ];

  for (const test of tests) {
    it(test.name, () => {
      const result = choco_finance_06_2025(
        NewProfile({ Savings: test.savings }),
      );
      expect(result).toEqual(
        new ResultInterest(test.expected_ir, test.savings),
      );
    });
  }
});

describe("Choco Finance (Jun 2026)", () => {
  const tests: Array<TestCase> = [
    {
      name: "should return correct i/r for 1k",
      savings: 1000,
      expected_ir: 20,
    },
    {
      name: "should return correct i/r for 20k",
      savings: 20000,
      expected_ir: 400,
    },
    {
      name: "should return correct i/r for 30k",
      savings: 30000,
      expected_ir: 580,
    },
    {
      name: "should return correct i/r for 100k",
      savings: 100000,
      expected_ir: 1840,
    },
    {
      name: "should return correct i/r for 150k (above 100k)",
      savings: 150000,
      expected_ir: 1840,
    },
    {
      name: "should return correct i/r for 200k",
      savings: 200000,
      expected_ir: 1840,
    },
  ];

  for (const test of tests) {
    it(test.name, () => {
      const result = choco_finance_06_2026(
        NewProfile({ Savings: test.savings }),
      );
      expect(result).toEqual(
        new ResultInterest(test.expected_ir, test.savings),
      );
    });
  }
});

describe("Choco Finance (Nov 2026)", () => {
  const tests: Array<TestCase> = [
    {
      name: "should return correct i/r for 1k",
      savings: 1000,
      expected_ir: 22,
    },
    {
      name: "should return correct i/r for 20k",
      savings: 20000,
      expected_ir: 440,
    },
    {
      name: "should return correct i/r for 30k",
      // 20k * 2.2% + 10k * 1.9% = 440 + 190 = 630
      savings: 30000,
      expected_ir: 630,
    },
    {
      name: "should return correct i/r for 100k",
      // 20k * 2.2% + 80k * 1.9% = 440 + 1520 = 1960
      savings: 100000,
      expected_ir: 1960,
    },
    {
      name: "should return correct i/r for 150k",
      // 20k * 2.2% + 130k * 1.9% = 440 + 2470 = 2910
      savings: 150000,
      expected_ir: 2910,
    },
    {
      name: "should return correct i/r for 200k (above guaranteed cap)",
      // Only the first 150k earns: 20k * 2.2% + 130k * 1.9% = 440 + 2470 = 2910
      savings: 200000,
      expected_ir: 2910,
    },
    {
      name: "should return correct i/r for 300k (excess earns 0%)",
      // Same as 150k: 20k * 2.2% + 130k * 1.9% = 2910
      savings: 300000,
      expected_ir: 2910,
    },
  ];

  for (const test of tests) {
    it(test.name, () => {
      const result = choco_finance_11_2026(
        NewProfile({ Savings: test.savings }),
      );
      expect(result).toEqual(
        new ResultInterest(test.expected_ir, test.savings),
      );
    });
  }
});
