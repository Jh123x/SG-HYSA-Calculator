import type { RateSnapshot } from "../types/history";
import { calculate_ir } from "./common";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";

export const mariInterestRate_05_2025 = 2.28;

export const maribank_interest_05_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      {
        Cutoff: 100_000,
        InterestRatePercent: mariInterestRate_05_2025,
      },
    ],
    baseRatePercent: 0,
  });
};

export const mariInterestRate_06_2025 = 1.88;

export const maribank_interest_06_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      {
        Cutoff: 100_000,
        InterestRatePercent: mariInterestRate_06_2025,
      },
    ],
    baseRatePercent: 0,
  });
};

export const mariInterestRate_09_2025 = 1.28;

export const maribank_interest_09_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      {
        Cutoff: 100_000,
        InterestRatePercent: mariInterestRate_09_2025,
      },
    ],
    baseRatePercent: 0,
  });
};

export const mariInterestRate_12_2025 = 0.88;

export const maribank_interest_12_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      {
        Cutoff: 100_000,
        InterestRatePercent: mariInterestRate_12_2025,
      },
    ],
    baseRatePercent: 0,
  });
};

export const maribankHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-05-01",
    interestFn: maribank_interest_05_2025,
    changeSummary: "Flat 2.28% p.a. on first $100K.",
  },
  {
    effectiveDate: "2025-06-01",
    interestFn: maribank_interest_06_2025,
    changeSummary: "Reduced to 1.88% p.a. (from 2.28%).",
  },
  {
    effectiveDate: "2025-09-01",
    interestFn: maribank_interest_09_2025,
    changeSummary: "Reduced to 1.28% p.a. (from 1.88%).",
  },
  {
    effectiveDate: "2025-12-27",
    interestFn: maribank_interest_12_2025,
    changeSummary: "Reduced to 0.88% p.a. (from 1.28%).",
  },
];
