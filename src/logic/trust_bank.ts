import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

const baseInterest = 0.75;

export const trust_bank_05_2025 = (profile: Profile): ResultInterest => {
  const { Savings, Salary, Spending, IsNTUCMember } = profile;

  var currentInterest = baseInterest;

  if (Spending >= 150) currentInterest += 0.4;
  if (Spending >= 150 && IsNTUCMember) currentInterest += 0.35;
  if (Savings >= 100_000) currentInterest += 0.5;
  if (Salary >= 1500) currentInterest += 0.75;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 800_000, InterestRatePercent: currentInterest }],
    baseRatePercent: baseInterest,
  });
};

const newbaseInterest = 0.5;

export const trust_bank_06_2025 = (profile: Profile): ResultInterest => {
  const { Savings, Salary, Spending, IsNTUCMember } = profile;

  var currentInterest = newbaseInterest;

  if (Spending >= 150) currentInterest += 0.3;
  if (Spending >= 150 && IsNTUCMember) currentInterest += 0.2;
  if (Savings >= 100_000) currentInterest += 0.75;
  if (Salary >= 1500) currentInterest += 0.5;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: currentInterest }],
    baseRatePercent: 0.05,
  });
};

export const trust_bank_08_2025 = (profile: Profile): ResultInterest => {
  const { Savings, Salary, Spending, IsNTUCMember } = profile;

  var currentInterest = newbaseInterest;

  if (Spending >= 150) currentInterest += 0.3;
  if (Spending >= 150 && IsNTUCMember) currentInterest += 0.2;
  if (Savings >= 100_000) currentInterest += 0.5;
  if (Salary >= 1500) currentInterest += 0.5;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: currentInterest }],
    baseRatePercent: 0.05,
  });
};

export const trust_bank_signature_10_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Salary, Spending, IsNTUCMember } = profile;

  var currentInterest = 0.1;

  if (Spending >= 150) currentInterest += 0.2;
  if (Spending >= 150 && IsNTUCMember) currentInterest += 0.1;
  if (Savings >= 100_000) currentInterest += 0.4;
  if (Salary >= 1500) currentInterest += 0.5;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: currentInterest }],
    baseRatePercent: 0.05,
  });
};

export const trust_bank_flex_12_2025 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: 0.5 }],
    baseRatePercent: 0.05,
  });
};

// === June 2026 Rates ===

export const trust_bank_signature_06_2026 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Salary, Spending, IsNTUCMember } = profile;

  var currentInterest = 0.05;

  // 5 x $30 card spends (modeled as Spending >= 150)
  if (Spending >= 150) {
    currentInterest += IsNTUCMember ? 0.2 : 0.1;
  }
  if (Savings >= 100_000) currentInterest += 0.3;
  if (Salary >= 1500) currentInterest += 0.45;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: currentInterest }],
    baseRatePercent: 0.05,
  });
};

export const trust_bank_zen_06_2026 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: 0.4 }],
    baseRatePercent: 0.05,
  });
};

// === Trust Bank Flex Plan (Trust+ required, min S$100K) ===

export const trust_bank_flex_07_2026 = (profile: Profile): ResultInterest => {
  const { Savings, Salary, Spending, Investment, IsNTUCMember, MonthlyAccIncrease } = profile;

  // Collect all qualifying bonus scoops (each is a percentage number)
  const scoops: number[] = [];

  // Salary credit: min S$1,500 via GIRO → +0.45%
  if (Salary >= 1500) scoops.push(0.45);

  // Card spend: 5 × S$30 (modeled as Spending >= 150)
  if (Spending >= 150) {
    scoops.push(IsNTUCMember ? 0.20 : 0.10);
  }

  // Maintain S$100K ADB → +0.30%
  if (Savings >= 100_000) scoops.push(0.30);

  // Invest S$20K in TrustInvest → +0.70%
  if (Investment >= 20_000) scoops.push(0.70);

  // Increase ADB by S$3K from previous month → +0.20%
  if (MonthlyAccIncrease >= 3_000) scoops.push(0.20);

  // Sort descending and pick top 3 (or all if fewer than 3)
  scoops.sort((a, b) => b - a);
  const top3 = scoops.slice(0, 3);
  const bonusSum = top3.reduce((sum, v) => sum + v, 0);

  const currentInterest = 0.05 + bonusSum;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: currentInterest }],
    baseRatePercent: 0.05,
  });
};

export const trustBankZenHistory: RateSnapshot[] = [
  {
    effectiveDate: "2026-06-05",
    interestFn: trust_bank_zen_06_2026,
    sourceUrl: "https://growbeansprout.com/trust-bank-singapore-review",
    changeSummary: "Flat 0.4% p.a. up to S$1.2 million",
  },
];

export const trustBankSignatureHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-05-01",
    interestFn: trust_bank_05_2025,
    sourceUrl: "https://sethisfy.com/nerfed-gxs-trust-bank-and-chocolate-finance-announce-drop-in-rates/",
    changeSummary: "Base 0.75%. Spend $150 +0.4%, NTUC +0.35%, $100K +0.5%, Salary $1.5K +0.75%. Cap $800K",
  },
  {
    effectiveDate: "2025-06-01",
    interestFn: trust_bank_06_2025,
    sourceUrl: "https://sethisfy.com/nerfed-gxs-trust-bank-and-chocolate-finance-announce-drop-in-rates/",
    changeSummary: "Base ↓0.5%. Spend ↓0.3%, NTUC ↓0.2%, $100K ↑0.75%, Salary ↓0.5%. Cap ↑$1.2M",
  },
  {
    effectiveDate: "2025-08-01",
    interestFn: trust_bank_08_2025,
    sourceUrl: "https://sethisfy.com/nerfed-gxs-trust-bank-and-chocolate-finance-announce-drop-in-rates/",
    changeSummary: "$100K tier ↓0.5% (0.75%→0.5%)",
  },
  {
    effectiveDate: "2025-10-01",
    interestFn: trust_bank_signature_10_2025,
    sourceUrl: "https://sethisfy.com/nerfed-trust-bank-and-maribank-slash-interest-rates-from-1st-september-2025/",
    changeSummary: "Base ↓0.1%. Spend ↓0.2%, NTUC ↓0.1%, $100K ↓0.4%, Salary unchanged",
  },
  {
    effectiveDate: "2026-06-05",
    interestFn: trust_bank_signature_06_2026,
    sourceUrl: "https://growbeansprout.com/trust-bank-singapore-review",
    changeSummary: "Base ↓0.05%. Spend (non-NTUC) ↓0.1%, $100K ↓0.3%, Salary ↓0.45%. Spend (NTUC) unchanged at +0.2%",
  },
];

export const trustBankFlexHistory: RateSnapshot[] = [
  {
    effectiveDate: "2026-06-05",
    interestFn: trust_bank_flex_07_2026,
    sourceUrl: "https://trustbank.sg/trust-plus/",
    changeSummary: "Flex Plan: pick 3 bonus scoops from salary (+0.45%), spend (+0.20% NTUC/+0.10%), $100K ADB (+0.30%), Invest $20K (+0.70%), ADB increase $3K (+0.20%). Up to 2.40% p.a. on S$1.2M. Trust+ required.",
  },
];
