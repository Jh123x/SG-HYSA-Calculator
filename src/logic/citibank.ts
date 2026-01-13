import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

const baseInterest = 0.01;

export const citi_wealth_first_05_2025 = (profile: Profile): ResultInterest => {
  // Minimum 250k savings and 18 year old
  if (profile.Savings < 250_000 || profile.Age < 18)
    return new ResultInterest(0, profile.Savings);

  var ir = baseInterest;
  if (profile.Spending >= 250) ir += 1.5;
  if (profile.Investment >= 50_000) ir += 1.5;
  if (profile.Insurance >= 50_000) ir += 1.5;
  if (profile.OneTimeLoan >= 500_000) ir += 1.5;

  const additionalIr = profile.MonthlyAccIncrease * 0.015;

  const result = calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 250_000, InterestRatePercent: ir }],
    baseRatePercent: 0.01,
  });

  result.addInterest(additionalIr);
  return result;
};

export const citi_wealth_first_10_2025 = (profile: Profile): ResultInterest => {
  // Minimum 250k savings and 18 year old
  if (profile.Savings < 250_000 || profile.Age < 18)
    return new ResultInterest(0, profile.Savings);

  var ir = baseInterest;
  if (profile.Spending >= 250) ir += 1.5;
  if (profile.Investment >= 50_000) ir += 1.5;
  if (profile.Insurance >= 50_000) ir += 1.5;
  if (profile.OneTimeLoan >= 500_000) ir += 1.5;

  if (profile.MonthlyAccIncrease >= 3000) ir += 1.5;

  const result = calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 250_000, InterestRatePercent: ir }],
    baseRatePercent: 0.01,
  });

  return result;
};
