import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";
import { calculate_ir } from "./common.ts";

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
