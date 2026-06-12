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

  return new ResultInterest(s * (rate / 100), s);
};

/**
 * Maybank iSAVvy Savings Plus Account (effective 11 June 2026)
 *
 * Flat tiered base rates:
 *   Below S$5,000:      0.1875% p.a.
 *   S$5,000 to <S$50K:  0.30% p.a.
 *   S$50,000 and above: 0.38% p.a.
 *
 * Bonus rate of 1.52% p.a. applies ONLY if the average daily balance
 * increases every month (proxied by MonthlyAccIncrease > 0).
 * Bonus is paid every 6 months.
 *
 * Rates are NOT additive (not cumulative tiered) — entire daily balance
 * earns the single rate for its tier.
 */
export const maybank_isavvy_plus_06_2026 = (
  profile: Profile,
): ResultInterest => {
  const s = profile.Savings;
  const bonus = profile.MonthlyAccIncrease > 0 ? 1.52 : 0;
  let base: number;

  if (s < 5_000) {
    base = 0.1875;
  } else if (s < 50_000) {
    base = 0.30;
  } else {
    base = 0.38;
  }

  return new ResultInterest(s * ((base + bonus) / 100), s);
};


