import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import type {Profile} from "../types/profile";
import { calculate_ir } from "./common";

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

export const bocSuperSaverHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-07-01",
    interestFn: bank_of_china_super_saver_07_2025,
    sourceUrl: "https://www.bankofchina.com/sg/bocinfo/bi1/202506/t20250620_25390361.html",
    changeSummary: "1st $20K 1.5%, next $40K 2.2%,\nnext $40K 3.6%, remaining 1.2%",
  },
  {
    effectiveDate: "2025-08-01",
    interestFn: bank_of_china_super_saver_08_2025,
    sourceUrl: "https://www.bankofchina.com/sg/bocinfo/bi1/202506/t20250620_25390361.html",
    changeSummary: "All tiers reduced:\n1.5%→1%, 2.2%→1.2%, 3.6%→1.6%, base 1.2%→0.8%",
  },
  {
    effectiveDate: "2025-11-01",
    interestFn: bank_of_china_super_saver_11_2025,
    sourceUrl: "https://www.bankofchina.com/sg/bocinfo/bi1/202509/t20250929_25516576.html",
    changeSummary: "Further reduced:\n1%→0.5%, 1.2%→0.8%, 1.6%→1%, base 0.8%→0.5%",
  },
];

// ── BOC SmartSaver ────────────────────────────────────────────────────
//
// Bonus interest applies to the first S$100,000 ONLY. Prevailing (base)
// rate applies to the entire balance. Insurance bonus adds 3.00% p.a.
// for eligible financial products (≥ S$12,000 annual premium simplified).
//
// Card spend tiers are NOT additive — S$2,500 gives the higher tier rate
// (not S$750 + S$2,500 stacked).

export const bank_of_china_smart_saver_08_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Insurance, Spending, Salary, GiroTransactions } = profile;

  // Prevailing rate: 0.20% flat on entire balance
  const prevailingRate = 0.2;
  let bonusRate = prevailingRate;

  // Card Spend (tiered — higher tier replaces lower)
  if (Spending >= 2_500) bonusRate += 1.25;
  else if (Spending >= 750) bonusRate += 0.75;

  // Salary Crediting: S$2,000 required
  if (Salary >= 2_000) bonusRate += 0.8;

  // Bill Payments: 3 payments of ≥ S$30 each
  if (GiroTransactions >= 3) bonusRate += 0.1;

  // Financial Products (Insurance): ≥ S$12,000/yr → +3.00%
  if (Insurance >= 12_000) bonusRate += 3.0;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 100_000, InterestRatePercent: bonusRate }],
    baseRatePercent: prevailingRate,
  });
};

export const bank_of_china_smart_saver_11_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Insurance, Spending, Salary, GiroTransactions } = profile;

  // Prevailing rate: 0.10% flat on entire balance
  const prevailingRate = 0.1;
  let bonusRate = prevailingRate;

  // Card Spend (tiered — higher tier replaces lower)
  if (Spending >= 2_500) bonusRate += 0.9;
  else if (Spending >= 750) bonusRate += 0.6;

  // Salary Crediting: S$3,000 required
  if (Salary >= 3_000) bonusRate += 0.5;

  // Bill Payments: 3 payments of ≥ S$30 each
  if (GiroTransactions >= 3) bonusRate += 0.1;

  // Financial Products (Insurance): ≥ S$12,000/yr → +3.00%
  if (Insurance >= 12_000) bonusRate += 3.0;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 100_000, InterestRatePercent: bonusRate }],
    baseRatePercent: prevailingRate,
  });
};

export const bocSmartSaverHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-08-01",
    interestFn: bank_of_china_smart_saver_08_2025,
    sourceUrl:
      "https://sethisfy.com/boc-smartsaver-dropping-interest-by-0-70-p-a-1st-august-2025/",
    changeSummary:
      "Salary cut 1.50%→0.80%, Wealth bonus up 2.75%→3.00%.\nMax 2.35% on S$100K (without insurance).",
  },
  {
    effectiveDate: "2025-11-01",
    interestFn: bank_of_china_smart_saver_11_2025,
    sourceUrl:
      "https://sethisfy.com/boc-smartsaver-getting-up-to-4-60-p-a-with-this-savings-account/",
    changeSummary:
      "Prevailing 0.20%→0.10%, Card 0.75/1.25→0.60/0.90%, Salary 0.80%→0.50% (S$2K→S$3K).\nMax 1.60% on S$100K.",
  },
];
