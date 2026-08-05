import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import type {Profile} from "../types/profile";
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

export const ocbc_interest_05_2026 = (profile: Profile): ResultInterest => {
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
    interest[0] += 1;
    interest[1] += 2;
  }

  if (MonthlyAccIncrease >= 500) {
    interest[0] += 0.4;
    interest[1] += 0.4;
  }

  if (Spending >= 500) {
    interest[0] += 0.25;
    interest[1] += 0.25;
  }

  // For 12 months.
  if (Insurance > 0) {
    interest[0] += 1;
    interest[1] += 2;
  }

  // For 12 months.
  if (Investment > 0) {
    interest[0] += 1;
    interest[1] += 2;
  }

  if (Savings >= 250000) {
    interest[0] += 1.2;
    interest[1] += 1.2;
  }

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 75000, InterestRatePercent: interest[0] },
      { Cutoff: 25000, InterestRatePercent: interest[1] },
    ],
    baseRatePercent: 0.05,
  });
};

export const ocbcHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-07-01",
    interestFn: ocbc_interest_07_2025,
    changeSummary: "Bonus rates (1st $75K / next $25K):\nSalary: +1.6% / +3.2%\nSave: +0.6% / +1.2%\nSpend: +0.5% (both tiers)\nInsurance: +1.2% / +2.4%\nInvestment: +1.2% / +2.4%\n$250K balance: +2.2% (both tiers)",
    sourceUrl: "https://milelion.com/2025/03/23/ocbc-360-account-cutting-interest-rates-from-may-2025/",
  },
  {
    effectiveDate: "2025-08-01",
    interestFn: ocbc_interest_08_2025,
    changeSummary: "Bonus rates lowered (1st $75K / next $25K):\nSalary: +1.2% / +2.4%\nSave: +0.4% / +0.8%\nSpend: +0.4% (both tiers)\nInsurance: +1.2% / +2.4% (unchanged)\nInvestment: +1.2% / +2.4% (unchanged)\n$250K balance: +2.0% (both tiers)",
    sourceUrl: "https://milelion.com/2025/06/28/ocbc-360-account-cuts-interest-rates-again-from-august-2025/",
  },
  {
    effectiveDate: "2026-05-01",
    interestFn: ocbc_interest_05_2026,
    changeSummary: "Bonus rates lowered (1st $75K / next $25K):\nSalary: +1.0% / +2.0%\nSave: +0.4% (both tiers)\nSpend: +0.25% (both tiers)\nInsurance: +1.0% / +2.0%\nInvestment: +1.0% / +2.0%\n$250K balance: +1.2% (both tiers)",
    sourceUrl: "https://milelion.com/2026/04/01/ocbc-360-account-cuts-interest-rates-from-may-2026/",
  },
];
