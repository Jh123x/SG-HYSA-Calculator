import { calculate_ir } from "./common";
import { Interest } from "../types/interest";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";

const ir_cutoff: Array<Interest> = [
  // Spend 500 + Salary Credit
  {
    cutoffs: [
      { Cutoff: 75000, InterestRatePercent: 1.5 },
      { Cutoff: 50000, InterestRatePercent: 3 },
      { Cutoff: 25000, InterestRatePercent: 4.5 },
    ],
    baseRatePercent: 0.05,
  },
  // Spend 500 + 3 Giro Txns
  {
    cutoffs: [
      { Cutoff: 75000, InterestRatePercent: 1 },
      { Cutoff: 50000, InterestRatePercent: 2 },
    ],
    baseRatePercent: 0.05,
  },
  // Only spend 500
  {
    cutoffs: [{ Cutoff: 75000, InterestRatePercent: 0.65 }],
    baseRatePercent: 0.05,
  },
  // Does not fulfil any criteria
  {
    cutoffs: [],
    baseRatePercent: 0.05,
  },
];

export const uob_interest_10_2025 = (profile: Profile): ResultInterest => {
  const { Savings, Spending, GiroTransactions, Salary } = profile;

  if (Spending >= 500 && Salary >= 1600) {
    return calculate_ir(Savings, ir_cutoff[0]);
  }

  if (Spending >= 500 && GiroTransactions >= 3) {
    return calculate_ir(Savings, ir_cutoff[1]);
  }

  if (Spending >= 500) {
    return calculate_ir(Savings, ir_cutoff[2]);
  }

  return calculate_ir(Savings, ir_cutoff[3]);
};

const old_ir_cutoff: Array<Interest> = [
  // Spend 500 + Salary Credit
  {
    cutoffs: [
      { Cutoff: 75000, InterestRatePercent: 2.3 },
      { Cutoff: 50000, InterestRatePercent: 3.8 },
      { Cutoff: 25000, InterestRatePercent: 5.3 },
    ],
    baseRatePercent: 0.05,
  },
  // Spend 500 + 3 Giro Transactions
  {
    cutoffs: [
      { Cutoff: 75000, InterestRatePercent: 1.5 },
      { Cutoff: 50000, InterestRatePercent: 2.5 },
    ],
    baseRatePercent: 0.05,
  },
  // Only Spend 500
  {
    cutoffs: [{ Cutoff: 75000, InterestRatePercent: 0.65 }],
    baseRatePercent: 0.05,
  },
  // Does not fulfill any criteria
  {
    cutoffs: [],
    baseRatePercent: 0.05,
  },
];

export const uob_interest_2025_09 = (profile: Profile): ResultInterest => {
  const { Savings, Spending, GiroTransactions, Salary } = profile;

  if (Spending >= 500 && Salary >= 1600) {
    return calculate_ir(Savings, old_ir_cutoff[0]);
  }

  if (Spending >= 500 && GiroTransactions >= 3) {
    return calculate_ir(Savings, old_ir_cutoff[1]);
  }

  if (Spending >= 500) {
    return calculate_ir(Savings, old_ir_cutoff[2]);
  }

  return calculate_ir(Savings, old_ir_cutoff[3]);
};

const ir_2025_12_cutoff: Array<Interest> = [
  // Spend 500 + Salary Credit
  {
    cutoffs: [
      { Cutoff: 75000, InterestRatePercent: 1 },
      { Cutoff: 50000, InterestRatePercent: 2.5 },
      { Cutoff: 25000, InterestRatePercent: 3.4 },
    ],
    baseRatePercent: 0.05,
  },
  // Spend 500 + 3 Giro Transactions
  {
    cutoffs: [
      { Cutoff: 75000, InterestRatePercent: 1.5 },
      { Cutoff: 50000, InterestRatePercent: 2.5 },
    ],
    baseRatePercent: 0.05,
  },
  // Only Spend 500
  {
    cutoffs: [{ Cutoff: 75000, InterestRatePercent: 0.65 }],
    baseRatePercent: 0.05,
  },
  // Does not fulfill any criteria
  {
    cutoffs: [],
    baseRatePercent: 0.05,
  },
];

export const uob_interest_2025_12 = (profile: Profile): ResultInterest => {
  const { Savings, Spending, GiroTransactions, Salary } = profile;

  if (Spending >= 500 && Salary >= 1600) {
    return calculate_ir(Savings, ir_2025_12_cutoff[0]);
  }

  if (Spending >= 500 && GiroTransactions >= 3) {
    return calculate_ir(Savings, ir_2025_12_cutoff[1]);
  }

  if (Spending >= 500) {
    return calculate_ir(Savings, ir_2025_12_cutoff[2]);
  }

  return calculate_ir(Savings, ir_2025_12_cutoff[3]);
};
