import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

export const bank_of_china_smart_saver_08_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Insurance, Spending, Salary, GiroTransactions } = profile;
  if (Savings < 1_500) return new ResultInterest(0, Savings);

  const baseInterest = getBaseInterest(Savings);
  var hasExtraSavingsInterest = false;
  var interest = baseInterest;

  if (Insurance > 150_000) interest += 2.75;

  if (Spending >= 750) interest += 0.75;

  if (Spending > 2500) {
    interest += 0.5;
    hasExtraSavingsInterest = true;
  }

  if (Salary >= 2000) {
    interest += 1.5;
    hasExtraSavingsInterest = true;
  }

  if (Spending >= 90 && GiroTransactions >= 3) {
    interest += 0.1;
    hasExtraSavingsInterest = true;
  }

  return calculate_ir(Savings, {
    cutoffs: [
      {
        Cutoff: 100_000,
        InterestRatePercent: interest,
      },
      {
        Cutoff: 1_000_000,
        InterestRatePercent: hasExtraSavingsInterest
          ? baseInterest + 0.6
          : baseInterest,
      },
    ],
    baseRatePercent: baseInterest,
  });
};

export const bank_of_china_smart_saver_11_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Insurance, Spending, Salary, GiroTransactions } = profile;
  if (Savings < 1_500) return new ResultInterest(0, Savings);

  const baseInterest = getBaseInterest(Savings);
  var hasExtraSavingsInterest = false;
  var interest = baseInterest;

  if (Insurance > 150_000) interest += 2.75;

  if (Spending >= 750) interest += 0.75;

  if (Spending > 2500) {
    interest += 0.5;
    hasExtraSavingsInterest = true;
  }

  if (Salary >= 3000) {
    interest += 1.5;
    hasExtraSavingsInterest = true;
  }

  if (Spending >= 90 && GiroTransactions >= 3) {
    interest += 0.1;
    hasExtraSavingsInterest = true;
  }

  return calculate_ir(Savings, {
    cutoffs: [
      {
        Cutoff: 100_000,
        InterestRatePercent: interest,
      },
      {
        Cutoff: 1_000_000,
        InterestRatePercent: hasExtraSavingsInterest
          ? baseInterest + 0.6
          : baseInterest,
      },
    ],
    baseRatePercent: baseInterest,
  });
};

const getBaseInterest = (savings: number): number => {
  if (savings < 5000) return 0.15;
  if (savings < 20_000) return 0.2;
  if (savings < 100_000) return 0.3;
  return 0.4;
};

export const bank_of_china_super_saver_07_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, Savings);

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 20_000, InterestRatePercent: 1.5 },
      { Cutoff: 40_000, InterestRatePercent: 2.2 },
      { Cutoff: 40_000, InterestRatePercent: 3.6 },
    ],
    baseRatePercent: 1.2,
  });
};

export const bank_of_china_super_saver_08_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, Savings);

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 20_000, InterestRatePercent: 1 },
      { Cutoff: 40_000, InterestRatePercent: 1.2 },
      { Cutoff: 40_000, InterestRatePercent: 1.6 },
    ],
    baseRatePercent: 0.8,
  });
};

export const bank_of_china_super_saver_11_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, Savings);

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 20_000, InterestRatePercent: 0.5 },
      { Cutoff: 40_000, InterestRatePercent: 0.8 },
      { Cutoff: 40_000, InterestRatePercent: 1 },
    ],
    baseRatePercent: 0.5,
  });
};
