import { calculate_ir } from "./common";
import { Interest } from "../types/interest";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";

const ir_2024_05_cutoff: Array<Interest> = [
  // Spend 500 + Salary Credit
  {
    cutoffs: [
      { Cutoff: 30000, InterestRatePercent: 3 },
      { Cutoff: 30000, InterestRatePercent: 3 },
      { Cutoff: 15000, InterestRatePercent: 3 },
      { Cutoff: 25000, InterestRatePercent: 4.5 },
      { Cutoff: 25000, InterestRatePercent: 4.5 },
      { Cutoff: 25000, InterestRatePercent: 6 },
    ],
    baseRatePercent: 0.05,
  },
  // Spend 500 + 3 Giro Txns
  {
    cutoffs: [
      { Cutoff: 30000, InterestRatePercent: 2 },
      { Cutoff: 30000, InterestRatePercent: 2 },
      { Cutoff: 15000, InterestRatePercent: 2 },
      { Cutoff: 25000, InterestRatePercent: 3 },
      { Cutoff: 25000, InterestRatePercent: 3 },
      { Cutoff: 25000, InterestRatePercent: 0.05 },
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

export const uob_interest_2024_05 = (profile: Profile): ResultInterest => {
  const { Savings, Spending, GiroTransactions, Salary } = profile;

  if (Spending >= 500 && Salary >= 1600) {
    return calculate_ir(Savings, ir_2024_05_cutoff[0]);
  }

  if (Spending >= 500 && GiroTransactions >= 3) {
    return calculate_ir(Savings, ir_2024_05_cutoff[1]);
  }

  if (Spending >= 500) {
    return calculate_ir(Savings, ir_2024_05_cutoff[2]);
  }

  return calculate_ir(Savings, ir_2024_05_cutoff[3]);
};

const ir_2025_05_cutoff: Array<Interest> = [
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

export const uob_interest_2025_05 = (profile: Profile): ResultInterest => {
  const { Savings, Spending, GiroTransactions, Salary } = profile;

  if (Spending >= 500 && Salary >= 1600) {
    return calculate_ir(Savings, ir_2025_05_cutoff[0]);
  }

  if (Spending >= 500 && GiroTransactions >= 3) {
    return calculate_ir(Savings, ir_2025_05_cutoff[1]);
  }

  if (Spending >= 500) {
    return calculate_ir(Savings, ir_2025_05_cutoff[2]);
  }

  return calculate_ir(Savings, ir_2025_05_cutoff[3]);
};

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

export const uobHistory: RateSnapshot[] = [
  {
    effectiveDate: "2024-05-01",
    interestFn: uob_interest_2024_05,
    changeSummary:
      "EIR cut from 5% to 4% p.a. Cap raised from $100K to $150K. New 6-tier structure: 1st $30K 3.85%→3%, next $30K 3.9%→3%, next $15K 4.85%→3%, next $25K 7.8%→4.5%, next $25K 0.05%→4.5%, new top tier $25K at 6%. Giros tier also restructured to 6 tiers. Source: https://milelion.com/2024/04/01/uob-one-account-cutting-interest-rates-to-4-p-a-from-may-2024/",
  },
  {
    effectiveDate: "2025-05-01",
    interestFn: uob_interest_2025_05,
    changeSummary:
      "EIR cut from 4% to 3.3% p.a. Top tier (Spend $500 + Salary): 1st $75K 3%→2.3%, next $50K 4.5%→3.8%, next $25K 6%→5.3%. Giros tier: 1st $75K 2%→1.5%, next $50K 3%→2.5%. Source: https://milelion.com/2025/04/01/uob-one-account-nerfing-interest-rates-to-3-3-p-a-from-may-2025/",
  },
  {
    effectiveDate: "2025-09-01",
    interestFn: uob_interest_2025_09,
    changeSummary:
      "Top tier (Spend $500 + Salary): 1st $25K 5.3%→3.4%, next $50K 3.8%→2.5%, next $75K 2.3%→1%. Giros tier: 1st $50K 2.5%→1.5%. Source: https://milelion.com/2025/08/01/uob-one-account-nerfing-interest-rates-to-2-5-p-a-from-september-2025/",
  },
  {
    effectiveDate: "2025-10-15",
    interestFn: uob_interest_10_2025,
    changeSummary:
      "Top tier partially restored: 1st $25K 3.4%→4.5%, next $50K 2.5%→3%, next $75K 1%→1.5%. Source: https://www.businesstimes.com.sg/companies-markets/uob-trims-one-account-interest-rate-again-maximum-2-5-annum-first-s150000",
  },
  {
    effectiveDate: "2025-12-01",
    interestFn: uob_interest_2025_12,
    changeSummary:
      "Top tier cut again: 1st $25K 4.5%→3.4%, next $50K 3%→2.5%. Source: https://milelion.com/2025/11/01/uob-one-account-nerfing-interest-rates-to-1-9-p-a-from-december-2025/",
  },
];
