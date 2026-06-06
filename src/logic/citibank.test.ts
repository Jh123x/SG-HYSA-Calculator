import { ResultInterest } from "../types/interest_result";
import Profile, { NewProfile } from "../types/profile";
import { citi_wealth_first_05_2025, citi_wealth_first_06_2026 } from "./citibank";

interface TestCase {
  name: string;
  profile: Profile;
  expected_ir: number;
}

describe("Citibank (May 2025)", () => {
  const tests: Array<TestCase> = [
    {
      name: "empty should be empty",
      profile: NewProfile({ Age: 20 }),
      expected_ir: 0,
    },
    {
      name: "not enough min value",
      profile: NewProfile({
        Savings: 150_000,
        Spending: 300,
        Age: 20,
        OneTimeLoan: 1_000_000,
      }),
      expected_ir: 0,
    },
    {
      name: "not old enough",
      profile: NewProfile({
        Savings: 350_000,
        Spending: 300,
        Age: 17,
        OneTimeLoan: 1_000_000,
      }),
      expected_ir: 0,
    },
    {
      name: "Only hit minimum savings amt",
      profile: NewProfile({
        Savings: 250_000,
        Age: 20,
      }),
      expected_ir: 25,
    },
    {
      name: "Spending",
      profile: NewProfile({
        Savings: 250_000,
        Age: 20,
        Spending: 300,
      }),
      expected_ir: 3775,
    },
    {
      name: "Spending + Invest",
      profile: NewProfile({
        Savings: 250_000,
        Age: 20,
        Spending: 300,
        Investment: 50_000,
      }),
      expected_ir: 7525,
    },
    {
      name: "Spending + Invest + Insurance",
      profile: NewProfile({
        Savings: 250_000,
        Age: 20,
        Spending: 300,
        Investment: 50_000,
        Insurance: 50_000,
      }),
      expected_ir: 11275,
    },
    {
      name: "Spending + Invest + Insurance + One time loan",
      profile: NewProfile({
        Savings: 250_000,
        Age: 20,
        Spending: 300,
        Investment: 50_000,
        Insurance: 50_000,
        OneTimeLoan: 500_000,
      }),
      expected_ir: 15025,
    },
    {
      name: "Spending + Invest + Insurance + One time loan + Salary",
      profile: NewProfile({
        Savings: 250_000,
        Age: 20,
        Spending: 300,
        Investment: 50_000,
        Insurance: 50_000,
        OneTimeLoan: 500_000,
        MonthlyAccIncrease: 3_000,
      }),
      expected_ir: 15070,
    },
  ];

  for (const test of tests) {
    it(test.name, () => {
      const result = citi_wealth_first_05_2025(test.profile);
      expect(result).toEqual(
        new ResultInterest(test.expected_ir, test.profile.Savings),
      );
    });
  }
});

describe("Citibank (Jun 2026, 500k cap)", () => {
  const tests: Array<TestCase> = [
    {
      name: "empty should be empty",
      profile: NewProfile({ Age: 20 }),
      expected_ir: 0,
    },
    {
      name: "Only hit minimum savings amt",
      profile: NewProfile({
        Savings: 250_000,
        Age: 20,
      }),
      expected_ir: 25,
    },
    {
      name: "All categories with 500k",
      profile: NewProfile({
        Savings: 500_000,
        Age: 20,
        Spending: 300,
        Investment: 50_000,
        Insurance: 50_000,
        OneTimeLoan: 500_000,
        MonthlyAccIncrease: 3_000,
      }),
      // 500k * (0.01 + 5*1.5) / 100 = 500k * 7.51 / 100 = 37550
      expected_ir: 37550,
    },
    {
      name: "All categories with 250k",
      profile: NewProfile({
        Savings: 250_000,
        Age: 20,
        Spending: 300,
        Investment: 50_000,
        Insurance: 50_000,
        OneTimeLoan: 500_000,
        MonthlyAccIncrease: 3_000,
      }),
      // 250k * 7.51 / 100 = 18775
      expected_ir: 18775,
    },
    {
      name: "All categories with 600k (cap applies)",
      profile: NewProfile({
        Savings: 600_000,
        Age: 20,
        Spending: 300,
        Investment: 50_000,
        Insurance: 50_000,
        OneTimeLoan: 500_000,
        MonthlyAccIncrease: 3_000,
      }),
      // 500k * 7.51/100 + 100k * 0.01/100 = 37550 + 10 = 37560
      expected_ir: 37560,
    },
    {
      name: "Spending only on 250k",
      profile: NewProfile({
        Savings: 250_000,
        Age: 20,
        Spending: 300,
      }),
      // 250k * (0.01 + 1.5) / 100 = 250k * 1.51 / 100 = 3775
      expected_ir: 3775,
    },
  ];

  for (const test of tests) {
    it(test.name, () => {
      const result = citi_wealth_first_06_2026(test.profile);
      expect(result).toEqual(
        new ResultInterest(test.expected_ir, test.profile.Savings),
      );
    });
  }
});
