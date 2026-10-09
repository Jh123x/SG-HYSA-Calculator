import type { RateSnapshot } from "../types/history";
import { calculate_ir } from "./common";
import { ResultInterest } from "../types/interest_result";
import type {Profile}from "../types/profile";

const maribankInterest =
  (rate: number) =>
  (profile: Profile): ResultInterest =>
    calculate_ir(profile.Savings, {
      cutoffs: [{ Cutoff: 100_000, InterestRatePercent: rate }],
      baseRatePercent: 0,
    });

export const mariInterestRate_05_2025 = 2.28;
export const maribank_interest_05_2025 = maribankInterest(mariInterestRate_05_2025);

export const mariInterestRate_06_2025 = 1.88;
export const maribank_interest_06_2025 = maribankInterest(mariInterestRate_06_2025);

export const mariInterestRate_09_2025 = 1.28;
export const maribank_interest_09_2025 = maribankInterest(mariInterestRate_09_2025);

export const mariInterestRate_12_2025 = 0.88;
export const maribank_interest_12_2025 = maribankInterest(mariInterestRate_12_2025);

/**
 * Mari Savings Account — from 17 Aug 2026 the base rate (0.88% p.a.) is joined
 * by two bonus tiers, applied to the first S$100,000 (nothing above that):
 *   - Salary Crediting Bonus: +0.20% p.a. when salary ≥ S$500/mo is credited.
 *   - ShopeeVIP Bonus: +0.40% p.a. for active ShopeeVIP members linked on Shopee.
 * The +1.60% new-user welcome bonus is a 30-day promo and is not modelled.
 * Max standing EIR = 0.88 + 0.20 + 0.40 = 1.48% p.a.
 */
export const maribank_interest_08_2026 = (profile: Profile): ResultInterest => {
  let rate = mariInterestRate_12_2025;
  if (profile.Salary >= 500) rate += 0.2;
  if (profile.IsShopeeVip) rate += 0.4;

  return calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 100_000, InterestRatePercent: rate }],
    baseRatePercent: 0,
  });
};

export const maribankHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-05-01",
    interestFn: maribank_interest_05_2025,
    sourceUrl: "https://sethisfy.com/nerfed-rates-drop-for-mari-savings-account-and-gxs-boost-pockets/",
    changeSummary: "Flat 2.28% p.a. on first $100K",
  },
  {
    effectiveDate: "2025-06-01",
    interestFn: maribank_interest_06_2025,
    sourceUrl: "https://sethisfy.com/nerfed-mari-savings-account-drops-rate-to-1-88-from-16th-june-2025/",
    changeSummary: "Reduced to 1.88% p.a. (from 2.28%)",
  },
  {
    effectiveDate: "2025-09-01",
    interestFn: maribank_interest_09_2025,
    sourceUrl: "https://sethisfy.com/nerfed-trust-bank-and-maribank-slash-interest-rates-from-1st-september-2025/",
    changeSummary: "Reduced to 1.28% p.a. (from 1.88%)",
  },
  {
    effectiveDate: "2025-12-27",
    interestFn: maribank_interest_12_2025,
    sourceUrl: "https://sethisfy.com/nerfed-maribank-and-chocolate-finance-dropping-rates-from-1st-december-2025/",
    changeSummary: "Reduced to 0.88% p.a. (from 1.28%)",
  },
  {
    effectiveDate: "2026-08-17",
    interestFn: maribank_interest_08_2026,
    sourceUrl: "https://www.maribank.sg/product/mari-savings-account/",
    changeSummary:
      "Base 0.88% p.a. now stacks with bonus tiers (no cap):\nSalary ≥ S$500/mo: +0.20% p.a.\nShopeeVIP member: +0.40% p.a.\n(New-user +1.60% for first 30 days is a promo, not modelled)\nMax 1.48% p.a.",
  },
];
