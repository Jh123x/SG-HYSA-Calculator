import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

const baseInterest = 0.05;

export const stand_chart_interest = (profile: Profile): ResultInterest => {
  const { Savings, Salary, Spending, Insurance, Investment } = profile;
  var interest = baseInterest;

  if (Salary >= 3000) interest += 1.5;
  if (Spending >= 1000) interest += 1.5;
  if (Insurance >= 12000) interest += 2.5;
  if (Investment >= 20000) interest += 2.5;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 100_000, InterestRatePercent: interest }],
    baseRatePercent: baseInterest,
  });
};

export const stand_chart_interest_before_06_25 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Salary, Spending, Insurance, Investment } = profile;
  var interest = baseInterest;

  if (Salary >= 3000) interest += 1;
  if (Spending >= 1000) interest += 1;
  if (Insurance >= 12000) interest += 2;
  if (Investment >= 30000) interest += 2;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 100_000, InterestRatePercent: interest }],
    baseRatePercent: baseInterest,
  });
};
