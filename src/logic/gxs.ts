import { ResultInterest } from "../types/interest_result";
import type {Profile} from "../types/profile";
import { calculate_ir } from "./common";
import type { RateSnapshot } from "../types/history";

export const gxs_interest_08_2025 = (profile: Profile): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, 0);

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 85_000, InterestRatePercent: 1.38 }, // Boost Pocket
      { Cutoff: 10_000, InterestRatePercent: 1.08 }, // Base Interest rates
    ],
    baseRatePercent: 0,
  });
};

export const gxs_interest_07_2025 = (profile: Profile): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) {
    return new ResultInterest(0, 0);
  }

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 60_000, InterestRatePercent: 2.58 }, // Boost Pocket
      { Cutoff: 35_000, InterestRatePercent: 1.68 }, // Base Interest rates
    ],
    baseRatePercent: 0,
  });
};

export const gxs_interest_06_2026 = (profile: Profile): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, 0);

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 85_000, InterestRatePercent: 1.22 }, // Boost Pocket (3-month)
      { Cutoff: 10_000, InterestRatePercent: 1.08 }, // Saving Pockets
    ],
    baseRatePercent: 0,
  });
};

/**
 * From Oct 2026 GXS no longer publishes a standing Saving Pockets rate — it is
 * now a limited-time promo, and the only standing rate outside Boost Pocket is
 * the Main Account at 0.88%. The calculator still models the 3-month Boost
 * Pocket (1.22%) on the first $85K, joined by the Main Account 0.88% above it.
 */
export const gxs_interest_10_2026 = (profile: Profile): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, 0);

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 85_000, InterestRatePercent: 1.22 }, // Boost Pocket (3-month)
      { Cutoff: 10_000, InterestRatePercent: 0.88 }, // Main Account (Saving Pockets is a limited-time promo, no standing rate)
    ],
    baseRatePercent: 0,
  });
};

export const gxsHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-07-01",
    interestFn: gxs_interest_07_2025,
    sourceUrl: "https://sethisfy.com/nerfed-gxs-trust-bank-and-chocolate-finance-announce-drop-in-rates/",
    changeSummary: "Boost Pocket: $60K at 2.58%,\nSaving Pockets: $35K at 1.68%",
  },
  {
    effectiveDate: "2025-08-01",
    interestFn: gxs_interest_08_2025,
    sourceUrl: "https://sethisfy.com/nerfed-gxs-slashes-interest-1-38-p-a-6th-august-2025/",
    changeSummary: "Boost Pocket: $85K at 1.38% (reduced from 2.58%).\nSaving Pockets: $10K at 1.08%",
  },
  {
    effectiveDate: "2026-06-05",
    interestFn: gxs_interest_06_2026,
    changeSummary: "Boost Pocket: $85K at 1.22% (reduced from 1.38%).\nSaving Pockets unchanged",
  },
  {
    effectiveDate: "2026-10-01",
    interestFn: gxs_interest_10_2026,
    sourceUrl: "https://www.gxs.com.sg/savings-account",
    changeSummary:
      "New scheme: Saving Pockets becomes a limited-time promo (no standing rate).\nBalance above Boost Pocket now earns Main Account 0.88% (was Saving Pockets 1.08%).\nBoost Pocket 3-month unchanged at 1.22%.",
  },
];
