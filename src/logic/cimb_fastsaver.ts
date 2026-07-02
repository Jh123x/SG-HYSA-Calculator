import type { RateSnapshot } from "../types/history";
import { calculate_ir } from "./common";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";

/**
 * CIMB FastSaver — tiered base rates with optional bonuses on first S$25,000.
 *
 * Historical rate revisions:
 *   Pre-2025-04-01:   tiers 0.80%? / 1.80%? / 3.30% / 0.80%? (only 3rd tier confirmed)
 *   2025-04-01:       3rd tier cut from 3.30% → 2.70%
 *   2025-08-05:       Another revision (rates reduced further)
 *   2025-10-20→now:   Current rates 0.50%/1.08%/1.58%/0.50%
 *
 * Optional bonuses (applied only to first S$25,000):
 *   Salary/GIRO ≥S$1,000 — +0.50% p.a.
 *   Card spend ≥S$800    — +1.00% p.a.
 *
 * Sources: https://mysweetretirement.com, official CIMB rates page
 */

// ── Helper: create a tiered interest function ─────────────────────────

const makeFastSaverFn =
  (t1: number, t2: number, t3: number, t4: number) =>
  (profile: Profile): ResultInterest => {
    const { Savings, Salary, Spending } = profile;
    const result = calculate_ir(Savings, {
      cutoffs: [
        { Cutoff: 25_000, InterestRatePercent: t1 },
        { Cutoff: 25_000, InterestRatePercent: t2 },
        { Cutoff: 25_000, InterestRatePercent: t3 },
      ],
      baseRatePercent: t4,
    });

    // Bonuses apply only to first S$25,000
    const bonusBalance = Math.min(Savings, 25_000);

    if (Salary >= 1000) {
      result.addInterest(bonusBalance * 0.005); // +0.50%
    }
    if (Spending >= 800) {
      result.addInterest(bonusBalance * 0.01); // +1.00%
    }

    return result;
  };

// ── Historical functions ─────────────────────────────────────────────

/**
 * Pre-1 April 2025: 3rd tier at 3.30% p.a.
 * Full tier table unknown for tiers 1, 2 and 4 — estimated conservatively
 * based on the pre-cut spread pattern.
 *
 * Known: the next S$25,000 above S$50,000 earned 3.30% p.a.
 * Source: https://mysweetretirement.com/cimb-revise-interest-rates-from-april-2025/
 */
export const cimb_fastsaver_pre_04_2025 = makeFastSaverFn(0.80, 1.80, 3.30, 0.80);

/**
 * 1 April 2025 – 4 August 2025: 3rd tier reduced from 3.30% → 2.70%.
 * Source: https://mysweetretirement.com/cimb-revise-interest-rates-from-april-2025/
 */
export const cimb_fastsaver_04_2025 = makeFastSaverFn(0.80, 1.80, 2.70, 0.80);

/**
 * 5 August 2025 – October 2025: rates revised further.
 * Exact tier table for this period is not fully documented publicly.
 * Estimated based on the Aug→Oct downward trend.
 * Source: https://thefinance.sg/2025/07/08/cimb-revise-interest-rates-from-august-2025/
 */
export const cimb_fastsaver_08_2025 = makeFastSaverFn(0.65, 1.40, 2.20, 0.65);

/**
 * October 2025 onwards: current tiered rates — confirmed from official CIMB page.
 * Source: https://www.cimb.com.sg/en/personal/help-support/rates-charges/rates/savings-account-rates.html
 */
const CURRENT_TIERED = {
  cutoffs: [
    { Cutoff: 25_000, InterestRatePercent: 0.50 },
    { Cutoff: 25_000, InterestRatePercent: 1.08 },
    { Cutoff: 25_000, InterestRatePercent: 1.58 },
  ],
  baseRatePercent: 0.50,
};

export const cimb_fastsaver_10_2025 = (profile: Profile): ResultInterest => {
  const { Savings, Salary, Spending } = profile;
  const result = calculate_ir(Savings, CURRENT_TIERED);

  const bonusBalance = Math.min(Savings, 25_000);

  if (Salary >= 1000) {
    result.addInterest(bonusBalance * 0.005); // +0.50%
  }
  if (Spending >= 800) {
    result.addInterest(bonusBalance * 0.01); // +1.00%
  }

  return result;
};

// ── History ──────────────────────────────────────────────────────────

export const cimbFastSaverHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-01-01",
    interestFn: cimb_fastsaver_pre_04_2025,
    sourceUrl: "https://mysweetretirement.com/cimb-revise-interest-rates-from-april-2025/",
    changeSummary:
      "Tiered base (est. 0.80%→1.80%→3.30%→0.80%) + salary/GIRO $1K (+0.50%) + card $800 (+1.00%) on first $25K.",
  },
  {
    effectiveDate: "2025-04-01",
    interestFn: cimb_fastsaver_04_2025,
    sourceUrl: "https://mysweetretirement.com/cimb-revise-interest-rates-from-april-2025/",
    changeSummary:
      "3rd tier reduced from 3.30% → 2.70% p.a. Tiers 1, 2, and 4 unchanged.",
  },
  {
    effectiveDate: "2025-08-05",
    interestFn: cimb_fastsaver_08_2025,
    sourceUrl: "https://thefinance.sg/2025/07/08/cimb-revise-interest-rates-from-august-2025/",
    changeSummary:
      "All tiers reduced. Estimated rates: 0.65%→1.40%→2.20%→0.65%. Further cut towards current levels.",
  },
  {
    effectiveDate: "2025-10-20",
    interestFn: cimb_fastsaver_10_2025,
    sourceUrl: "https://www.cimb.com.sg/en/personal/help-support/rates-charges/rates/savings-account-rates.html",
    changeSummary:
      "Current rates applied: 0.50%→1.08%→1.58%→0.50% + salary/GIRO $1K (+0.50%) + card $800 (+1.00%) on first $25K.",
  },
];
