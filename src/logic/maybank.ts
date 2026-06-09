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
 * Maybank SaveUp Account (effective 9 June 2026)
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
 * Maybank iSAVvy Savings Account (effective 9 June 2026)
 *
 * Tiered rates with interest-on-interest bonus:
 *   Below S$5,000:                 0.1875% p.a. (no bonus)
 *   S$5,000 to below S$50,000:     0.30% p.a. + 6% interest-on-interest → effective ~0.31%
 *   S$50,000 to below S$100,000:   0.38% p.a. + 6% interest-on-interest → effective ~0.39%
 *   S$100,000 and above:           0.38% p.a. + 18% interest-on-interest → effective ~0.42%
 *
 * Interest-on-interest requires average monthly balance ≥ S$5,000 (6%) or ≥ S$100,000 (18%).
 * Interest-on-interest is paid every 6 months on the interest earned.
 */
export const maybank_isavvy_06_2026 = (profile: Profile): ResultInterest => {
  const result = calculate_ir(profile.Savings, {
    cutoffs: [
      { Cutoff: 5000, InterestRatePercent: 0.1875 },
      { Cutoff: 45_000, InterestRatePercent: 0.3 },
    ],
    baseRatePercent: 0.38,
  });

  // Apply interest-on-interest multiplier
  // ≥S$100K gets 18%, ≥S$5K gets 6%, below S$5K gets 0%
  if (profile.Savings >= 100_000) {
    result.addInterest(result.toYearly() * 0.18);
  } else if (profile.Savings >= 5_000) {
    result.addInterest(result.toYearly() * 0.06);
  }

  return result;
};

/**
 * Maybank iSAVvy Savings Plus Account (effective 9 June 2026)
 *
 * Same base tiers as iSAVvy plus 1.52% p.a. bonus interest paid every 6 months.
 *   Below S$5,000:      0.1875% p.a.
 *   S$5,000 to S$50,000: 0.30% + 1.52% = 1.82% p.a.
 *   S$50,000 and above:  0.38% + 1.52% = 1.90% p.a.
 */
export const maybank_isavvy_plus_06_2026 = (
  profile: Profile,
): ResultInterest => {
  const bonusRate = 1.52;

  return calculate_ir(profile.Savings, {
    cutoffs: [
      { Cutoff: 5000, InterestRatePercent: 0.1875 + bonusRate },
      { Cutoff: 45_000, InterestRatePercent: 0.3 + bonusRate },
    ],
    baseRatePercent: 0.38 + bonusRate,
  });
};

/**
 * Maybank iSAVvy Promo (1 May – 30 June 2026)
 *
 * Up to 1.50% p.a. on incremental deposits (fresh funds ≥ S$20,000 vs April 2026 balance).
 *   S$20K–S$200K incremental: 0.20% base + 1.30% bonus = 1.50%
 *   Above S$200K incremental:  0.80% base + 0.70% bonus = 1.50%
 *
 * Note: This promo applies only to NEW funds above your April 2026 balance.
 * The calculator assumes ALL your savings qualify as incremental deposits.
 */
export const maybank_isavvy_promo_06_2026 = (
  profile: Profile,
): ResultInterest => {
  return calculate_ir(profile.Savings, {
    cutoffs: [
      { Cutoff: 200_000, InterestRatePercent: 1.5 },
    ],
    baseRatePercent: 1.5,
  });
};
