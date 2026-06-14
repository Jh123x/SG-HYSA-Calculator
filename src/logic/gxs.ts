import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
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
      { Cutoff: 10_000, InterestRatePercent: 1.08 }, // Saving Pockets (Main Account: 0.88%)
    ],
    baseRatePercent: 0,
  });
};

export const gxsHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-07-01",
    interestFn: gxs_interest_07_2025,
    changeSummary: "Boost Pocket: $60K at 2.58%, Saving Pockets: $35K at 1.68%. Source: https://sethisfy.com/nerfed-gxs-trust-bank-and-chocolate-finance-announce-drop-in-rates/",
  },
  {
    effectiveDate: "2025-08-01",
    interestFn: gxs_interest_08_2025,
    changeSummary: "Boost Pocket: $85K at 1.38% (reduced from 2.58%). Saving Pockets: $10K at 1.08%. Source: https://sethisfy.com/nerfed-gxs-slashes-interest-1-38-p-a-6th-august-2025/",
  },
  {
    effectiveDate: "2026-06-05",
    interestFn: gxs_interest_06_2026,
    changeSummary: "Boost Pocket: $85K at 1.22% (reduced from 1.38%). Saving Pockets unchanged. Source: https://growbeansprout.com/gxs-bank-savings-account-review",
  },
];
