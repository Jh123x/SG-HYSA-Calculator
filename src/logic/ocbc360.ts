import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

export const ocbc_interest_07_2025 = (profile: Profile): ResultInterest => {
  const {
    Savings,
    Salary,
    MonthlyAccIncrease,
    Spending,
    Insurance,
    Investment,
  } = profile;

  const interest = [0.05, 0.05]; // [1st 75k, next 25k]
  if (Salary >= 1800) {
    interest[0] += 1.6;
    interest[1] += 3.2;
  }

  if (MonthlyAccIncrease >= 500) {
    interest[0] += 0.6;
    interest[1] += 1.2;
  }

  if (Spending >= 500) {
    interest[0] += 0.5;
    interest[1] += 0.5;
  }

  if (Insurance > 0) {
    interest[0] += 1.2;
    interest[1] += 2.4;
  }

  if (Investment > 0) {
    interest[0] += 1.2;
    interest[1] += 2.4;
  }

  if (Savings >= 250000) {
    interest[0] += 2.2;
    interest[1] += 2.2;
  }

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 75000, InterestRatePercent: interest[0] },
      { Cutoff: 25000, InterestRatePercent: interest[1] },
    ],
    baseRatePercent: 0.05,
  });
};

export const ocbc_interest_08_2025 = (profile: Profile): ResultInterest => {
  const {
    Savings,
    Salary,
    MonthlyAccIncrease,
    Spending,
    Insurance,
    Investment,
  } = profile;

  const interest = [0.05, 0.05]; // [1st 75k, next 25k]
  if (Salary >= 1800) {
    interest[0] += 1.2;
    interest[1] += 2.4;
  }

  if (MonthlyAccIncrease >= 500) {
    interest[0] += 0.4;
    interest[1] += 0.8;
  }

  if (Spending >= 500) {
    interest[0] += 0.4;
    interest[1] += 0.4;
  }

  // For 12 months.
  if (Insurance > 0) {
    interest[0] += 1.2;
    interest[1] += 2.4;
  }

  // For 12 months.
  if (Investment > 0) {
    interest[0] += 1.2;
    interest[1] += 2.4;
  }

  if (Savings >= 250000) {
    interest[0] += 2;
    interest[1] += 2;
  }

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 75000, InterestRatePercent: interest[0] },
      { Cutoff: 25000, InterestRatePercent: interest[1] },
    ],
    baseRatePercent: 0.05,
  });
};
