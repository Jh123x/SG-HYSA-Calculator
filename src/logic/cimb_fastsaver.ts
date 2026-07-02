import type { RateSnapshot } from "../types/history";
import { calculate_ir } from "./common";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";

/**
 * CIMB FastSaver — tiered base rates with optional bonuses on first S$25,000.
 *
 * Base rates (tiered, cumulative):
 *   First S$25,000      — 0.50% p.a.
 *   Next  S$25,000      — 1.08% p.a.
 *   Next  S$25,000      — 1.58% p.a.
 *   Above S$75,000      — 0.50% p.a.
 *
 * Optional bonuses (applied only to first S$25,000):
 *   Salary/GIRO ≥S$1,000 — +0.50% p.a.
 *   Card spend ≥S$800    — +1.00% p.a.
 *
 * Fresh funds promo (Jul 2026): +0.70% on incremental ≥S$10K (not modelled).
 *
 * Source: https://www.cimb.com.sg/en/personal/banking-with-us/accounts/savings-accounts/cimb-fastsaver-account.html
 */

const BASE_TIERED = {
  cutoffs: [
    { Cutoff: 25_000, InterestRatePercent: 0.50 },
    { Cutoff: 25_000, InterestRatePercent: 1.08 },
    { Cutoff: 25_000, InterestRatePercent: 1.58 },
  ],
  baseRatePercent: 0.50,
};

/**
 * CIMB FastSaver (effective 2026-07-01).
 *
 * Tiered base rates plus optional bonuses:
 * - Salary credit / GIRO standing instruction ≥S$1,000 → +0.50% p.a. on first S$25K
 * - Card spend ≥S$800 on CIMB Visa Signature → +1.00% p.a. on first S$25K
 *
 * Fresh funds promo (+0.70% on incremental ≥S$10K) is not modelled here;
 * see the remarks in the bank registry entry.
 */
export const cimb_fastsaver_07_2026 = (profile: Profile): ResultInterest => {
  const { Savings, Salary, Spending } = profile;
  const result = calculate_ir(Savings, BASE_TIERED);

  // Bonuses are flat rates applied ONLY to the first S$25,000
  const bonusBalance = Math.min(Savings, 25_000);

  // Salary credit or GIRO standing instruction ≥S$1,000 → +0.50% p.a.
  if (Salary >= 1000) {
    result.addInterest(bonusBalance * 0.005);
  }

  // Card spend ≥S$800 on CIMB Visa Signature → +1.00% p.a.
  if (Spending >= 800) {
    result.addInterest(bonusBalance * 0.01);
  }

  return result;
};

export const cimbFastSaverHistory: RateSnapshot[] = [
  {
    effectiveDate: "2026-07-01",
    interestFn: cimb_fastsaver_07_2026,
    sourceUrl:
      "https://www.cimb.com.sg/en/personal/banking-with-us/accounts/savings-accounts/cimb-fastsaver-account.html",
    changeSummary:
      "Tiered base (0.50%→1.08%→1.58%→0.50%) + salary/GIRO $1K (+0.50%) + card $800 (+1.00%) on first $25K. Fresh funds promo +0.70% also available.",
  },
];
