import { ResultInterest } from "../types/interest_result";
import Profile, { NewProfile } from "../types/profile";
import {
  cimb_fastsaver_pre_04_2025,
  cimb_fastsaver_04_2025,
  cimb_fastsaver_08_2025,
  cimb_fastsaver_10_2025,
} from "./cimb_fastsaver";

interface testCases {
  name: string;
  profile: Profile;
  expectedInterest: ResultInterest;
}

/**
 * Helper: compute expected interest for tiered rates with bonuses.
 *
 * Tiers are cumulative: t1 on first $25K, t2 on next $25K, t3 on next $25K,
 * t4 on anything above $75K. Bonuses apply only to min(savings, $25K).
 */
function expectedYearly(
  savings: number,
  tiers: [number, number, number, number],
  salary: number,
  cardSpend: number,
): number {
  let total = 0;
  let remaining = savings;

  const tierAmounts = [25_000, 25_000, 25_000];
  for (let i = 0; i < 3; i++) {
    const amt = Math.min(remaining, tierAmounts[i]);
    total += (amt * tiers[i]) / 100;
    remaining -= amt;
  }
  total += (remaining * tiers[3]) / 100;

  const bonusBalance = Math.min(savings, 25_000);
  if (salary >= 1000) total += (bonusBalance * 0.50) / 100;
  if (cardSpend >= 800) total += (bonusBalance * 1.00) / 100;

  return total;
}

// ── Pre-April 2025 (tiers: 0.80 / 1.80 / 3.30 / 0.80) ──────────────

const PRE_TIERS: [number, number, number, number] = [0.80, 1.80, 3.30, 0.80];

describe("cimb_fastsaver_pre_04_2025", () => {
  const tests: testCases[] = [
    {
      name: "zero balance",
      profile: NewProfile({}),
      expectedInterest: new ResultInterest(0, 0),
    },
    {
      name: "$25K base only",
      profile: NewProfile({ Savings: 25_000 }),
      expectedInterest: new ResultInterest(expectedYearly(25_000, PRE_TIERS, 0, 0), 25_000),
    },
    {
      name: "$75K with all bonuses",
      profile: NewProfile({ Savings: 75_000, Salary: 1000, Spending: 800 }),
      expectedInterest: new ResultInterest(expectedYearly(75_000, PRE_TIERS, 1000, 800), 75_000),
    },
    {
      name: "$100K with salary only",
      profile: NewProfile({ Savings: 100_000, Salary: 1000 }),
      expectedInterest: new ResultInterest(expectedYearly(100_000, PRE_TIERS, 1000, 0), 100_000),
    },
  ];

  for (const tc of tests) {
    it(tc.name, () => {
      expect(cimb_fastsaver_pre_04_2025(tc.profile)).toEqual(tc.expectedInterest);
    });
  }
});

// ── April 2025 (tiers: 0.80 / 1.80 / 2.70 / 0.80) ────────────────────

const APR_TIERS: [number, number, number, number] = [0.80, 1.80, 2.70, 0.80];

describe("cimb_fastsaver_04_2025", () => {
  const tests: testCases[] = [
    {
      name: "$50K with all bonuses",
      profile: NewProfile({ Savings: 50_000, Salary: 1000, Spending: 800 }),
      expectedInterest: new ResultInterest(expectedYearly(50_000, APR_TIERS, 1000, 800), 50_000),
    },
    {
      name: "$100K no bonuses",
      profile: NewProfile({ Savings: 100_000 }),
      expectedInterest: new ResultInterest(expectedYearly(100_000, APR_TIERS, 0, 0), 100_000),
    },
  ];

  for (const tc of tests) {
    it(tc.name, () => {
      expect(cimb_fastsaver_04_2025(tc.profile)).toEqual(tc.expectedInterest);
    });
  }
});

// ── August 2025 (tiers: 0.65 / 1.40 / 2.20 / 0.65) ───────────────────

const AUG_TIERS: [number, number, number, number] = [0.65, 1.40, 2.20, 0.65];

describe("cimb_fastsaver_08_2025", () => {
  const tests: testCases[] = [
    {
      name: "$25K base only",
      profile: NewProfile({ Savings: 25_000 }),
      expectedInterest: new ResultInterest(expectedYearly(25_000, AUG_TIERS, 0, 0), 25_000),
    },
    {
      name: "$50K with salary",
      profile: NewProfile({ Savings: 50_000, Salary: 1000 }),
      expectedInterest: new ResultInterest(expectedYearly(50_000, AUG_TIERS, 1000, 0), 50_000),
    },
  ];

  for (const tc of tests) {
    it(tc.name, () => {
      expect(cimb_fastsaver_08_2025(tc.profile)).toEqual(tc.expectedInterest);
    });
  }
});

// ── October 2025 (current: 0.50 / 1.08 / 1.58 / 0.50) ────────────────

const OCT_TIERS: [number, number, number, number] = [0.50, 1.08, 1.58, 0.50];

describe("cimb_fastsaver_10_2025", () => {
  const tests: testCases[] = [
    {
      name: "zero balance",
      profile: NewProfile({}),
      expectedInterest: new ResultInterest(0, 0),
    },
    {
      name: "base only: first $25K at 0.50%",
      profile: NewProfile({ Savings: 25_000 }),
      expectedInterest: new ResultInterest(expectedYearly(25_000, OCT_TIERS, 0, 0), 25_000),
    },
    {
      name: "base only: $50K = 0.50%×25K + 1.08%×25K = 125+270=395",
      profile: NewProfile({ Savings: 50_000 }),
      expectedInterest: new ResultInterest(expectedYearly(50_000, OCT_TIERS, 0, 0), 50_000),
    },
    {
      name: "base only: $75K = 125+270+395 = 790",
      profile: NewProfile({ Savings: 75_000 }),
      expectedInterest: new ResultInterest(expectedYearly(75_000, OCT_TIERS, 0, 0), 75_000),
    },
    {
      name: "base only: $100K = 125+270+395+125 = 915",
      profile: NewProfile({ Savings: 100_000 }),
      expectedInterest: new ResultInterest(expectedYearly(100_000, OCT_TIERS, 0, 0), 100_000),
    },
    {
      name: "salary bonus only on $10K: base 0.50%×10K + 0.50% bonus×10K = 50+50=100",
      profile: NewProfile({ Savings: 10_000, Salary: 1000 }),
      expectedInterest: new ResultInterest(expectedYearly(10_000, OCT_TIERS, 1000, 0), 10_000),
    },
    {
      name: "salary bonus on $25K: base 125 + bonus 125 = 250",
      profile: NewProfile({ Savings: 25_000, Salary: 1000 }),
      expectedInterest: new ResultInterest(expectedYearly(25_000, OCT_TIERS, 1000, 0), 25_000),
    },
    {
      name: "salary bonus on $50K: base 395 + bonus on first $25K=125 = 520",
      profile: NewProfile({ Savings: 50_000, Salary: 1000 }),
      expectedInterest: new ResultInterest(expectedYearly(50_000, OCT_TIERS, 1000, 0), 50_000),
    },
    {
      name: "card spend bonus only on $10K: base 50 + 100 = 150",
      profile: NewProfile({ Savings: 10_000, Spending: 800 }),
      expectedInterest: new ResultInterest(expectedYearly(10_000, OCT_TIERS, 0, 800), 10_000),
    },
    {
      name: "max bonuses on $25K: base 125 + salary 125 + card 250 = 500",
      profile: NewProfile({ Savings: 25_000, Salary: 1000, Spending: 800 }),
      expectedInterest: new ResultInterest(expectedYearly(25_000, OCT_TIERS, 1000, 800), 25_000),
    },
    {
      name: "max bonuses on $100K: base 915 + salary 125 + card 250 = 1290",
      profile: NewProfile({
        Savings: 100_000,
        Salary: 1000,
        Spending: 800,
      }),
      expectedInterest: new ResultInterest(expectedYearly(100_000, OCT_TIERS, 1000, 800), 100_000),
    },
    {
      name: "salary 999 (below threshold) on $25K: base only 125",
      profile: NewProfile({ Savings: 25_000, Salary: 999 }),
      expectedInterest: new ResultInterest(expectedYearly(25_000, OCT_TIERS, 0, 0), 25_000),
    },
    {
      name: "spending 799 (below threshold) on $25K: base only 125",
      profile: NewProfile({ Savings: 25_000, Spending: 799 }),
      expectedInterest: new ResultInterest(expectedYearly(25_000, OCT_TIERS, 0, 0), 25_000),
    },
  ];

  for (const tc of tests) {
    it(tc.name, () => {
      const result = cimb_fastsaver_10_2025(tc.profile);
      expect(result).toEqual(tc.expectedInterest);
    });
  }
});
