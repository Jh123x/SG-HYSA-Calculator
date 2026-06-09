import { ResultInterest } from "../types/interest_result";
import Profile, { NewProfile } from "../types/profile";
import {
  maybank_save_up_10_2025,
  maybank_save_up_06_2026,
  maybank_isavvy_06_2026,
  maybank_isavvy_plus_06_2026,
  maybank_isavvy_promo_06_2026,
} from "./maybank";

interface testCase {
  caseName: string;
  profile: Profile;
  expectedResult: number;
}

describe("Maybank Save Up Interest rates (Pre 06/26)", () => {
  const testCases: Array<testCase> = [
    {
      caseName: "No $$ is empty",
      profile: NewProfile({}),
      expectedResult: 0,
    },
    {
      caseName: "1k + Save only",
      profile: NewProfile({
        Savings: 1000,
        Salary: 2000,
      }),
      expectedResult: 3.5,
    },
    {
      caseName: "5k + Spending",
      profile: NewProfile({
        Savings: 5000,
        Spending: 500,
      }),
      expectedResult: 21.5,
    },
    {
      caseName: "10k + Invest",
      profile: NewProfile({
        Savings: 10_000,
        Investment: 25_000,
      }),
      expectedResult: 49,
    },
    {
      caseName: "20k + Insure",
      profile: NewProfile({
        Savings: 20_000,
        Insurance: 5000,
      }),
      expectedResult: 104,
    },
    {
      caseName: "30k + Loan",
      profile: NewProfile({
        Savings: 30_000,
        LoanInstallment: 10_000,
      }),
      expectedResult: 159,
    },
    {
      caseName: "50k 2 product",
      profile: NewProfile({
        Savings: 50_000,
        LoanInstallment: 10_000,
        Insurance: 5000,
      }),
      expectedResult: 619,
    },
    {
      caseName: "50k 3 product",
      profile: NewProfile({
        Savings: 50_000,
        LoanInstallment: 10_000,
        Insurance: 5000,
        Salary: 2000,
      }),
      expectedResult: 1494,
    },
    {
      caseName: "75k > 3 products",
      profile: NewProfile({
        Savings: 75_000,
        LoanInstallment: 10_000,
        Spending: 500,
        Insurance: 5000,
        Salary: 2000,
      }),
      expectedResult: 2494,
    },
  ];

  for (const tc of testCases) {
    it(tc.caseName, () => {
      const result = maybank_save_up_10_2025(tc.profile);
      expect(result).toEqual(
        new ResultInterest(tc.expectedResult, tc.profile.Savings),
      );
    });
  }
});

describe("Maybank Save Up Interest rates (Post 06/26)", () => {
  const testCases: Array<testCase> = [
    {
      caseName: "No savings",
      profile: NewProfile({ Savings: 0 }),
      expectedResult: 0,
    },
    {
      caseName: "$1,000",
      profile: NewProfile({ Savings: 1000 }),
      expectedResult: 1.88, // 1000 * 0.1875%
    },
    {
      caseName: "$5,000",
      profile: NewProfile({ Savings: 5000 }),
      expectedResult: 10.63, // 3000*0.1875% + 2000*0.25%
    },
    {
      caseName: "$10,000",
      profile: NewProfile({ Savings: 10_000 }),
      expectedResult: 23.13, // 3000*0.1875% + 7000*0.25%
    },
    {
      caseName: "$50,000",
      profile: NewProfile({ Savings: 50_000 }),
      expectedResult: 123.13, // 3000*0.1875% + 47000*0.25%
    },
    {
      caseName: "$75,000",
      profile: NewProfile({ Savings: 75_000 }),
      expectedResult: 201.25, // 3000*0.1875% + 47000*0.25% + 25000*0.3125%
    },
  ];

  for (const tc of testCases) {
    it(tc.caseName, () => {
      const result = maybank_save_up_06_2026(tc.profile);
      expect(result.toYearly()).toBeCloseTo(tc.expectedResult, 2);
    });
  }
});

describe("Maybank iSAVvy Interest rates (06/26)", () => {
  const testCases: Array<testCase> = [
    {
      caseName: "No savings",
      profile: NewProfile({ Savings: 0 }),
      expectedResult: 0,
    },
    {
      caseName: "$2,000 (below $5K, no bonus)",
      profile: NewProfile({ Savings: 2000 }),
      expectedResult: 3.75, // 2000 * 0.1875%
    },
    {
      caseName: "$10,000 ($5K-$50K, 6% bonus)",
      profile: NewProfile({ Savings: 10_000 }),
      expectedResult: 25.84, // base=24.375 + 6% bonus
    },
    {
      caseName: "$75,000 ($50K-$100K, 6% bonus)",
      profile: NewProfile({ Savings: 75_000 }),
      expectedResult: 253.74, // base=239.375 + 6% bonus
    },
    {
      caseName: "$120,000 (≥$100K, 18% bonus)",
      profile: NewProfile({ Savings: 120_000 }),
      expectedResult: 484.25, // base=410.375 + 18% bonus
    },
  ];

  for (const tc of testCases) {
    it(tc.caseName, () => {
      const result = maybank_isavvy_06_2026(tc.profile);
      expect(result.toYearly()).toBeCloseTo(tc.expectedResult, 2);
    });
  }
});

describe("Maybank iSAVvy Plus Interest rates (06/26)", () => {
  const testCases: Array<testCase> = [
    {
      caseName: "No savings",
      profile: NewProfile({ Savings: 0 }),
      expectedResult: 0,
    },
    {
      caseName: "$2,000 (below $5K tier)",
      profile: NewProfile({ Savings: 2000 }),
      expectedResult: 34.15, // 2000 * 1.7075%
    },
    {
      caseName: "$10,000 ($5K-$50K tier)",
      profile: NewProfile({ Savings: 10_000 }),
      expectedResult: 176.38, // 5000*1.7075% + 5000*1.82%
    },
    {
      caseName: "$75,000 (≥$50K tier)",
      profile: NewProfile({ Savings: 75_000 }),
      expectedResult: 1379.38, // 5000*1.7075% + 45000*1.82% + 25000*1.90%
    },
  ];

  for (const tc of testCases) {
    it(tc.caseName, () => {
      const result = maybank_isavvy_plus_06_2026(tc.profile);
      expect(result.toYearly()).toBeCloseTo(tc.expectedResult, 2);
    });
  }
});

describe("Maybank iSAVvy Promo Interest rates (May–Jun 2026)", () => {
  const testCases: Array<testCase> = [
    {
      caseName: "No savings",
      profile: NewProfile({ Savings: 0 }),
      expectedResult: 0,
    },
    {
      caseName: "$10,000",
      profile: NewProfile({ Savings: 10_000 }),
      expectedResult: 150, // 10000 * 1.50%
    },
    {
      caseName: "$75,000",
      profile: NewProfile({ Savings: 75_000 }),
      expectedResult: 1125, // 75000 * 1.50%
    },
    {
      caseName: "$250,000",
      profile: NewProfile({ Savings: 250_000 }),
      expectedResult: 3750, // 250000 * 1.50%
    },
  ];

  for (const tc of testCases) {
    it(tc.caseName, () => {
      const result = maybank_isavvy_promo_06_2026(tc.profile);
      expect(result.toYearly()).toBeCloseTo(tc.expectedResult, 2);
    });
  }
});
