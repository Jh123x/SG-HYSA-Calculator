import { ResultInterest } from "../types/interest_result";
import Profile, { NewProfile } from "../types/profile";
import { cimb_fastsaver_07_2026 } from "./cimb_fastsaver";

interface testCases {
  name: string;
  profile: Profile;
  expectedInterest: ResultInterest;
}

describe("cimb_fastsaver_07_2026", () => {
  const tests: testCases[] = [
    {
      name: "zero balance",
      profile: NewProfile({}),
      expectedInterest: new ResultInterest(0, 0),
    },
    {
      name: "base only: first $25K at 0.50%",
      profile: NewProfile({ Savings: 25_000 }),
      expectedInterest: new ResultInterest(125, 25_000),
    },
    {
      name: "base only: $50K = 0.50%×25K + 1.08%×25K = 125+270=395",
      profile: NewProfile({ Savings: 50_000 }),
      expectedInterest: new ResultInterest(395, 50_000),
    },
    {
      name: "base only: $75K = 125+270+395 = 790",
      profile: NewProfile({ Savings: 75_000 }),
      expectedInterest: new ResultInterest(790, 75_000),
    },
    {
      name: "base only: $100K = 125+270+395+125 = 915",
      profile: NewProfile({ Savings: 100_000 }),
      expectedInterest: new ResultInterest(915, 100_000),
    },
    {
      name: "salary bonus only on $10K: base 0.50%×10K + 0.50% bonus×10K = 50+50=100",
      profile: NewProfile({ Savings: 10_000, Salary: 1000 }),
      expectedInterest: new ResultInterest(100, 10_000),
    },
    {
      name: "salary bonus on $25K: base 125 + bonus 125 = 250",
      profile: NewProfile({ Savings: 25_000, Salary: 1000 }),
      expectedInterest: new ResultInterest(250, 25_000),
    },
    {
      name: "salary bonus on $50K: base 395 + bonus on first $25K=125 = 520",
      profile: NewProfile({ Savings: 50_000, Salary: 1000 }),
      expectedInterest: new ResultInterest(520, 50_000),
    },
    {
      name: "card spend bonus only on $10K: base 50 + 100 = 150",
      profile: NewProfile({ Savings: 10_000, Spending: 800 }),
      expectedInterest: new ResultInterest(150, 10_000),
    },
    {
      name: "max bonuses on $25K: base 125 + salary 125 + card 250 = 500",
      profile: NewProfile({ Savings: 25_000, Salary: 1000, Spending: 800 }),
      expectedInterest: new ResultInterest(500, 25_000),
    },
    {
      name: "max bonuses on $100K: base 915 + salary 125 + card 250 = 1290",
      profile: NewProfile({
        Savings: 100_000,
        Salary: 1000,
        Spending: 800,
      }),
      expectedInterest: new ResultInterest(1290, 100_000),
    },
    {
      name: "salary 999 (below threshold) on $25K: base only 125",
      profile: NewProfile({ Savings: 25_000, Salary: 999 }),
      expectedInterest: new ResultInterest(125, 25_000),
    },
    {
      name: "spending 799 (below threshold) on $25K: base only 125",
      profile: NewProfile({ Savings: 25_000, Spending: 799 }),
      expectedInterest: new ResultInterest(125, 25_000),
    },
  ];

  for (const testCase of tests) {
    it(testCase.name, () => {
      const result = cimb_fastsaver_07_2026(testCase.profile);
      expect(result).toEqual(testCase.expectedInterest);
    });
  }
});
