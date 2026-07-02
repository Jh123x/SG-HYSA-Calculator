import { ResultInterest } from "../types/interest_result";
import Profile, { NewProfile } from "../types/profile";
import {
  trust_bank_06_2025,
  trust_bank_signature_06_2026,
  trust_bank_zen_06_2026,
  trust_bank_flex_07_2026,
} from "./trust_bank";

interface testCases {
  name: string;
  profile: Profile;
  expectedInterest: ResultInterest;
}

describe("trust_bank_06_2025", () => {
  const tests: testCases[] = [
    {
      name: "no interest should return empty",
      profile: NewProfile({}),
      expectedInterest: new ResultInterest(0, 0),
    },
    {
      name: "max interest rate",
      profile: NewProfile({
        Savings: 1_200_000,
        Spending: 150,
        Salary: 1500,
        IsNTUCMember: true,
      }),
      expectedInterest: new ResultInterest(27_000, 1_200_000),
    },
    {
      name: "not ntuc member + 100k",
      profile: NewProfile({
        Savings: 100_000,
        Spending: 150,
        Salary: 1500,
        IsNTUCMember: false,
      }),
      expectedInterest: new ResultInterest(2050, 100_000),
    },
    {
      name: "only spending + 100k",
      profile: NewProfile({ Savings: 100_000, Spending: 150 }),
      expectedInterest: new ResultInterest(1550, 100_000),
    },
    {
      name: "only 100k",
      profile: NewProfile({ Savings: 100_000 }),
      expectedInterest: new ResultInterest(1250, 100_000),
    },
    {
      name: "only 50k",
      profile: NewProfile({ Savings: 50_000 }),
      expectedInterest: new ResultInterest(250, 50_000),
    },
  ];

  for (const testCase of tests) {
    it(testCase.name, () => {
      const result = trust_bank_06_2025(testCase.profile);
      expect(result).toEqual(testCase.expectedInterest);
    });
  }
});

describe("trust_bank_signature_06_2026", () => {
  const tests: testCases[] = [
    {
      name: "no conditions (50k, below balance threshold)",
      profile: NewProfile({ Savings: 50_000 }),
      // base 0.05% only
      expectedInterest: new ResultInterest(25, 50_000),
    },
    {
      name: "NTUC member with all conditions",
      profile: NewProfile({
        Savings: 100_000,
        Spending: 150,
        Salary: 1500,
        IsNTUCMember: true,
      }),
      // base 0.05 + spend 0.20 + balance 0.30 + salary 0.45 = 1.00%
      expectedInterest: new ResultInterest(1000, 100_000),
    },
    {
      name: "non-NTUC member with all conditions",
      profile: NewProfile({
        Savings: 100_000,
        Spending: 150,
        Salary: 1500,
        IsNTUCMember: false,
      }),
      // base 0.05 + spend 0.10 + balance 0.30 + salary 0.45 = 0.90%
      expectedInterest: new ResultInterest(900, 100_000),
    },
    {
      name: "NTUC with spend only + 100k (includes balance bonus)",
      profile: NewProfile({
        Savings: 100_000,
        Spending: 150,
        IsNTUCMember: true,
      }),
      // base 0.05 + spend 0.20 + balance 0.30 = 0.55%
      expectedInterest: new ResultInterest(550, 100_000),
    },
    {
      name: "non-NTUC spend only + 100k (includes balance bonus)",
      profile: NewProfile({
        Savings: 100_000,
        Spending: 150,
        IsNTUCMember: false,
      }),
      // base 0.05 + spend 0.10 + balance 0.30 = 0.45%
      expectedInterest: new ResultInterest(450, 100_000),
    },
    {
      name: "max with NTUC + 1.2M",
      profile: NewProfile({
        Savings: 1_200_000,
        Spending: 150,
        Salary: 1500,
        IsNTUCMember: true,
      }),
      // 1.00% on 1.2M = 12,000
      expectedInterest: new ResultInterest(12_000, 1_200_000),
    },
    {
      name: "no money should have no interest",
      profile: NewProfile({}),
      expectedInterest: new ResultInterest(0, 0),
    },
    {
      name: "only salary + 100k (includes balance bonus)",
      profile: NewProfile({
        Savings: 100_000,
        Salary: 1500,
      }),
      // base 0.05 + salary 0.45 + balance 0.30 = 0.80%
      expectedInterest: new ResultInterest(800, 100_000),
    },
    {
      name: "only balance 100k (triggers balance bonus)",
      profile: NewProfile({ Savings: 100_000 }),
      // base 0.05 + balance 0.30 = 0.35%
      expectedInterest: new ResultInterest(350, 100_000),
    },
  ];

  for (const testCase of tests) {
    it(testCase.name, () => {
      const result = trust_bank_signature_06_2026(testCase.profile);
      expect(result).toEqual(testCase.expectedInterest);
    });
  }
});

describe("trust_bank_zen_06_2026", () => {
  const tests: testCases[] = [
    {
      name: "100k flat 0.4%",
      profile: NewProfile({ Savings: 100_000 }),
      expectedInterest: new ResultInterest(400, 100_000),
    },
    {
      name: "1.2M flat 0.4%",
      profile: NewProfile({ Savings: 1_200_000 }),
      expectedInterest: new ResultInterest(4800, 1_200_000),
    },
    {
      name: "0 balance",
      profile: NewProfile({ Savings: 0 }),
      expectedInterest: new ResultInterest(0, 0),
    },
    {
      name: "above 1.2M gets base rate on excess",
      profile: NewProfile({ Savings: 1_300_000 }),
      // 0.4% on 1.2M = 4800 + 0.05% on 100k = 50 → 4850
      expectedInterest: new ResultInterest(4850, 1_300_000),
    },
  ];

  for (const testCase of tests) {
    it(testCase.name, () => {
      const result = trust_bank_zen_06_2026(testCase.profile);
      expect(result).toEqual(testCase.expectedInterest);
    });
  }
});

describe("trust_bank_flex_07_2026", () => {
  const tests: testCases[] = [
    {
      name: "no conditions — just base 0.05%",
      profile: NewProfile({ Savings: 50_000 }),
      expectedInterest: new ResultInterest(25, 50_000),
    },
    {
      name: "salary + spend(NTUC) + $100K = 0.05+0.45+0.20+0.30 = 1.00% on 100K",
      profile: NewProfile({
        Savings: 100_000,
        Salary: 1500,
        Spending: 150,
        IsNTUCMember: true,
      }),
      expectedInterest: new ResultInterest(1000, 100_000),
    },
    {
      name: "salary + spend(non-NTUC) + $100K = 0.05+0.45+0.10+0.30 = 0.90%",
      profile: NewProfile({
        Savings: 100_000,
        Salary: 1500,
        Spending: 150,
        IsNTUCMember: false,
      }),
      expectedInterest: new ResultInterest(900, 100_000),
    },
    {
      name: "invest + salary + $100K = 0.05+0.70+0.45+0.30 = 1.50% (top 3)",
      profile: NewProfile({
        Savings: 100_000,
        Salary: 1500,
        Investment: 20_000,
        Spending: 150,
        IsNTUCMember: true,
      }),
      // scoops: 0.70 (invest), 0.45 (salary), 0.30($100K), 0.20(spend NTUC)
      // top 3: 0.70 + 0.45 + 0.30 = 1.45 + 0.05 base = 1.50%
      expectedInterest: new ResultInterest(1500, 100_000),
    },
    {
      name: "invest + ADB increase + salary = 0.05+0.70+0.20+0.45 = 1.40%",
      profile: NewProfile({
        Savings: 100_000,
        Salary: 1500,
        Investment: 20_000,
        MonthlyAccIncrease: 3_000,
      }),
      // scoops: 0.70 (invest), 0.45 (salary), 0.30($100K), 0.20(ADB inc)
      // top 3: 0.70 + 0.45 + 0.30 = 1.45 + 0.05 = 1.50%
      expectedInterest: new ResultInterest(1500, 100_000),
    },
    {
      name: "max realistic: invest + ADB inc + salary + $100K + spend = top 3 (0.70+0.45+0.30) = 1.50%",
      profile: NewProfile({
        Savings: 1_200_000,
        Salary: 1500,
        Spending: 150,
        Investment: 20_000,
        MonthlyAccIncrease: 3_000,
        IsNTUCMember: true,
      }),
      // scoops: 0.70, 0.45, 0.30, 0.20(spend NTUC), 0.20(ADB inc)
      // top 3: 0.70 + 0.45 + 0.30 = 1.45 + 0.05 = 1.50%
      // 1.50% of 1.2M = 18000
      expectedInterest: new ResultInterest(18_000, 1_200_000),
    },
    {
      name: "only salary + no savings threshold = 0.05+0.45 = 0.50% (only 1 scoop qualifies)",
      profile: NewProfile({
        Savings: 50_000,
        Salary: 1500,
      }),
      expectedInterest: new ResultInterest(250, 50_000),
    },
    {
      name: "zero balance",
      profile: NewProfile({}),
      expectedInterest: new ResultInterest(0, 0),
    },
  ];

  for (const testCase of tests) {
    it(testCase.name, () => {
      const result = trust_bank_flex_07_2026(testCase.profile);
      expect(result).toEqual(testCase.expectedInterest);
    });
  }
});
