import type { RateSnapshot } from "../types/history";
import { calculate_ir } from "./common";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";

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

export const maribankHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-05-01",
    interestFn: maribank_interest_05_2025,
    changeSummary: "Flat 2.28% p.a. on first $100K. Source: https://sethisfy.com/nerfed-rates-drop-for-mari-savings-account-and-gxs-boost-pockets/",
  },
  {
    effectiveDate: "2025-06-01",
    interestFn: maribank_interest_06_2025,
    changeSummary: "Reduced to 1.88% p.a. (from 2.28%). Source: https://sethisfy.com/nerfed-mari-savings-account-drops-rate-to-1-88-from-16th-june-2025/",
  },
  {
    effectiveDate: "2025-09-01",
    interestFn: maribank_interest_09_2025,
    changeSummary: "Reduced to 1.28% p.a. (from 1.88%). Source: https://sethisfy.com/nerfed-trust-bank-and-maribank-slash-interest-rates-from-1st-september-2025/",
  },
  {
    effectiveDate: "2025-12-27",
    interestFn: maribank_interest_12_2025,
    changeSummary: "Reduced to 0.88% p.a. (from 1.28%). Source: https://sethisfy.com/nerfed-maribank-and-chocolate-finance-dropping-rates-from-1st-december-2025/",
  },
];
