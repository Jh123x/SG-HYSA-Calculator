import { calculate_ir } from "./common";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";

const table: Array<Array<number>> = [
  [1.8, 2.1, 2.4],
  [1.9, 2.2, 2.5],
  [2.2, 3.0, 4.1],
];

export const dbs_multiplier_interest = (profile: Profile): ResultInterest => {
  if (profile.Age < 18)
    return calculate_ir(profile.Savings, { cutoffs: [], baseRatePercent: 0 });

  if (profile.Salary <= 0) {
    if (profile.Age <= 29)
      return calculate_ir(profile.Savings, {
        cutoffs: [{ Cutoff: 50000, InterestRatePercent: 1.5 }],
        baseRatePercent: 0.05,
      });
    return calculate_ir(profile.Savings, { cutoffs: [], baseRatePercent: 0.5 });
  }

  const categories = Math.min(get_categories(profile), 3);
  const eligible_txn = get_eligible_txn(profile);
  if (categories < 1 || eligible_txn < 1)
    return calculate_ir(profile.Savings, { cutoffs: [], baseRatePercent: 0.5 });

  const i_r = table[eligible_txn - 1][categories - 1];
  const cut_off = categories === 1 ? 50_000 : 100_000;

  return calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: cut_off, InterestRatePercent: i_r }],
    baseRatePercent: 0.05,
  });
};

const get_eligible_txn = (profile: Profile): number => {
  const total = [
    profile.Salary,
    profile.LoanInstallment,
    profile.Spending,
    profile.Insurance,
    profile.Investment,
  ].reduce((a, b) => a + b);

  if (total < 500) return 0;
  if (total >= 500 && total < 15_000) return 1;
  if (total >= 15_000 && total < 30_000) return 2;
  return 3;
};

const get_categories = (profile: Profile): number => {
  return [
    profile.Insurance > 0,
    profile.Spending > 0,
    profile.Investment > 0,
    profile.LoanInstallment > 0,
  ]

    .map((b: boolean) => (b ? 1 : 0))
    .reduce((a: number, b: number) => a + b, 0);
};

export const dbsMultiplierHistory: RateSnapshot[] = [
  {
    effectiveDate: "2023-08-01",
    interestFn: dbs_multiplier_interest,
    sourceUrl: "https://growbeansprout.com/dbs-multiplier-account-review",
    changeSummary:
      "Simplified structure: lowered eligible transaction threshold from S$2,000 to S$500, streamlined tiers (3×3 table), introduced age-based rules (under-29 bonus without salary). Max 4.10% p.a. on first S$100,000.\n",
  },
  {
    effectiveDate: "2025-10-14",
    interestFn: dbs_multiplier_interest,
    sourceUrl: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
    changeSummary:
      "Multiplier rates based on eligible transaction categories.\n",
  },
];
