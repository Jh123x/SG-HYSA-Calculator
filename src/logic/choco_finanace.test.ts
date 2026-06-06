import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { choco_finance_06_2025, choco_finance_06_2026 } from "./choco_finance";

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
