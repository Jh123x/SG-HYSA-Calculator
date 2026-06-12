import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

export const choco_finance_05_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      { Cutoff: 20000, InterestRatePercent: 3.3 },
      { Cutoff: 30000, InterestRatePercent: 3 },
    ],
    baseRatePercent: 0,
  });
};

export const choco_finance_06_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      { Cutoff: 20000, InterestRatePercent: 3 },
      { Cutoff: 30000, InterestRatePercent: 2.7 },
    ],
    baseRatePercent: 0,
  });
};

export const choco_finance_10_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      { Cutoff: 20000, InterestRatePercent: 2.5 },
      { Cutoff: 30000, InterestRatePercent: 2.2 },
    ],
    baseRatePercent: 0,
  });
};

export const choco_finance_12_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      { Cutoff: 20000, InterestRatePercent: 2 },
      { Cutoff: 30000, InterestRatePercent: 1.8 },
    ],
    baseRatePercent: 0,
  });
};

export const choco_finance_06_2026 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      { Cutoff: 20000, InterestRatePercent: 2 },
      { Cutoff: 80000, InterestRatePercent: 1.8 },
    ],
    baseRatePercent: 0, // 0 for remaining as the rest is investment
  });
};

export const chocoFinanceHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-05-01",
    interestFn: choco_finance_05_2025,
    changeSummary: "First $20K 3.3%, next $30K 3%.",
  },
  {
    effectiveDate: "2025-06-01",
    interestFn: choco_finance_06_2025,
    changeSummary: "First $20K ↓3%, next $30K ↓2.7%.",
  },
  {
    effectiveDate: "2025-10-01",
    interestFn: choco_finance_10_2025,
    changeSummary: "First $20K ↓2.5%, next $30K ↓2.2%.",
  },
  {
    effectiveDate: "2025-12-01",
    interestFn: choco_finance_12_2025,
    changeSummary: "First $20K ↓2%, next $30K ↓1.8%.",
  },
  {
    effectiveDate: "2026-06-05",
    interestFn: choco_finance_06_2026,
    changeSummary: "First $20K unchanged 2%, next tier expanded to $80K at 1.8% (was $30K).",
  },
];
