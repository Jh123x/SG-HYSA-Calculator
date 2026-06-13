import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

const table_1st_50k = [0, 0.3, 1, 2.75];
const table_nxt_25k = [0, 1, 1.5, 3.75];

export const maybank_save_up_10_2025 = (profile: Profile): ResultInterest => {
  var count = 0;

  // Giro / Salary
  if (
    (profile.GiroTransactions >= 1 && profile.Spending >= 300) ||
    profile.Salary >= 2000
  )
    count += 1;

  // Car Spend
  if (profile.Spending >= 500) count += 1;

  // Invest
  if (profile.Investment >= 25000) count += 1;

  // Insurance
  if (profile.Insurance >= 5000) count += 1;

  // Loans
  if (profile.LoanInstallment >= 10_000) count += 1;

  if (count > 3) count = 3;

  return calculate_ir(profile.Savings, {
    cutoffs: [
      {
        Cutoff: 3000,
        InterestRatePercent: 0.05 + table_1st_50k[count],
      },
      {
        Cutoff: 47_000,
        InterestRatePercent: 0.25 + table_1st_50k[count],
      },
      {
        Cutoff: 25_000,
        InterestRatePercent: 0.25 + table_nxt_25k[count],
      },
    ],
    baseRatePercent: 0.25,
  });
};

/**
 * Maybank SaveUp Account (effective 11 June 2026)
 *
 * No more category-based bonus system. Flat tiered rates:
 *   First S$3,000:    0.1875% p.a.
 *   Next S$47,000:     0.25% p.a.
 *   Above S$50,000:    0.3125% p.a.
 */
export const maybank_save_up_06_2026 = (profile: Profile): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      { Cutoff: 3000, InterestRatePercent: 0.1875 },
      { Cutoff: 47_000, InterestRatePercent: 0.25 },
    ],
    baseRatePercent: 0.3125,
  });
};

/**
 * Maybank iSAVvy Savings Account (effective 11 June 2026)
 *
 * Flat tiered rates — entire daily balance earns the rate of its tier:
 *   Below S$5,000:             0.1875% p.a.
 *   S$5,000 to below S$50,000: 0.30% p.a.
 *   S$50,000 and above:        0.38% p.a.
 *
 * Rates are NOT additive (not cumulative tiered).
 */
export const maybank_isavvy_06_2026 = (profile: Profile): ResultInterest => {
  const s = profile.Savings;
  let rate: number;

  if (s < 5_000) {
    rate = 0.1875;
  } else if (s < 50_000) {
    rate = 0.30;
  } else {
    rate = 0.38;
  }

  return calculate_ir(s, {
    cutoffs: [],
    baseRatePercent: rate,
  });
};

/**
 * Maybank iSAVvy Savings Plus Account (effective 11 June 2026)
 *
 * Flat tiered base rates:
 *   Below S$5,000:      0.1875% p.a.
 *   S$5,000 to <S$50K:  0.30% p.a.
 *   S$50,000 and above: 0.38% p.a.
 *
 * Rates are NOT additive (not cumulative tiered) — entire daily balance
 * earns the single rate for its tier.
 *
 * Note: A +1.52% p.a. bonus is available (paid every 6 months) but is
 * not included here — see constants.tsx remarks for details.
 */
export const maybank_isavvy_plus_06_2026 = (
  profile: Profile,
): ResultInterest => {
  const s = profile.Savings;
  let rate: number;

  if (s < 5_000) {
    rate = 0.1875;
  } else if (s < 50_000) {
    rate = 0.30;
  } else {
    rate = 0.38;
  }

  return calculate_ir(s, {
    cutoffs: [],
    baseRatePercent: rate,
  });
};



export const maybankSaveUpHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-10-01",
    interestFn: maybank_save_up_10_2025,
    changeSummary: "Category bonus: up to 3 categories (Giro/Salary, Spend $500, Invest $25K, Insurance $5K, Loan $10K). Max bonus: 2.75% (1st $50K) + 3.75% (next $25K).",
  },
  {
    effectiveDate: "2026-06-11",
    interestFn: maybank_save_up_06_2026,
    changeSummary: "Category bonus removed. Flat tiered: 0.1875% (<$3K), 0.25% ($3K–$50K), 0.3125% (>$50K).",
  },
];

export const maybankIsavvyHistory: RateSnapshot[] = [
  {
    effectiveDate: "2026-06-11",
    interestFn: maybank_isavvy_06_2026,
    changeSummary:
      "Simplified tiered rates: 0.1875% (<$5K), 0.30% ($5K–$50K), 0.38% (≥$50K)",
  },
];

export const maybankIsavvyPlusHistory: RateSnapshot[] = [
  {
    effectiveDate: "2026-06-11",
    interestFn: maybank_isavvy_plus_06_2026,
    changeSummary:
      "Flat tiered base (0.1875%–0.38%) + 1.52% top-up bonus with monthly ADB increment",
  },
];
