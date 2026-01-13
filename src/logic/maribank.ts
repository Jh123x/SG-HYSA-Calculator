import { calculate_ir } from "./common";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";

export const mariInterestRate_05_2025 = 2.28;

export const maribank_interest_05_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(Math.min(profile.Savings, 100_000), {
    cutoffs: [],
    baseRatePercent: mariInterestRate_05_2025,
  });
};

export const mariInterestRate_06_2025 = 1.88;

export const maribank_interest_06_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(Math.min(profile.Savings, 100_000), {
    cutoffs: [],
    baseRatePercent: mariInterestRate_06_2025,
  });
};

export const mariInterestRate_09_2025 = 1.28;

export const maribank_interest_09_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(Math.min(profile.Savings, 100_000), {
    cutoffs: [],
    baseRatePercent: mariInterestRate_09_2025,
  });
};

export const mariInterestRate_12_2025 = 0.88;

export const maribank_interest_12_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(Math.min(profile.Savings, 100_000), {
    cutoffs: [],
    baseRatePercent: mariInterestRate_12_2025,
  });
};
