import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

export const gxs_interest_08_2025 = (profile: Profile): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, 0);

  return calculate_ir(Savings > 95_000 ? 95_000 : Savings, {
    cutoffs: [
      { Cutoff: 85_000, InterestRatePercent: 1.38 }, // Boost Pocket
      { Cutoff: 10_000, InterestRatePercent: 1.08 }, // Base Interest rates
    ],
    baseRatePercent: 0,
  });
};

export const gxs_interest_07_2025 = (profile: Profile): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) {
    return new ResultInterest(0, 0);
  }

  return calculate_ir(Savings > 95_000 ? 95_000 : Savings, {
    cutoffs: [
      { Cutoff: 60_000, InterestRatePercent: 2.58 }, // Boost Pocket
      { Cutoff: 35_000, InterestRatePercent: 1.68 }, // Base Interest rates
    ],
    baseRatePercent: 0,
  });
};
