import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

const chocoFinanceInterest =
  (cutoffs: { Cutoff: number; InterestRatePercent: number }[]) =>
  (profile: Profile): ResultInterest =>
    calculate_ir(profile.Savings, {
      cutoffs,
      baseRatePercent: 0,
    });

export const choco_finance_05_2025 = chocoFinanceInterest([
  { Cutoff: 20000, InterestRatePercent: 3.3 },
  { Cutoff: 30000, InterestRatePercent: 3 },
]);

export const choco_finance_06_2025 = chocoFinanceInterest([
  { Cutoff: 20000, InterestRatePercent: 3 },
  { Cutoff: 30000, InterestRatePercent: 2.7 },
]);

export const choco_finance_10_2025 = chocoFinanceInterest([
  { Cutoff: 20000, InterestRatePercent: 2.5 },
  { Cutoff: 30000, InterestRatePercent: 2.2 },
]);

export const choco_finance_12_2025 = chocoFinanceInterest([
  { Cutoff: 20000, InterestRatePercent: 2 },
  { Cutoff: 30000, InterestRatePercent: 1.8 },
]);

export const choco_finance_06_2026 = chocoFinanceInterest([
  { Cutoff: 20000, InterestRatePercent: 2 },
  { Cutoff: 80000, InterestRatePercent: 1.8 },
]);

export const chocoFinanceHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-05-01",
    interestFn: choco_finance_05_2025,
    sourceUrl: "https://sethisfy.com/nerfed-chocolate-finance-drops-top-up-rate-to-3-and-3-3-p-a-on-first-s50000-from-1st-february-2025/",
    changeSummary: "First S$20K: 3.3% p.a.\nNext S$30K: 3% p.a.",
  },
  {
    effectiveDate: "2025-06-01",
    interestFn: choco_finance_06_2025,
    sourceUrl: "https://sethisfy.com/nerfed-gxs-trust-bank-and-chocolate-finance-announce-drop-in-rates/",
    changeSummary: "First S$20K: 3% p.a. (was 3.3%)\nNext S$30K: 2.7% p.a. (was 3%)",
  },
  {
    effectiveDate: "2025-10-01",
    interestFn: choco_finance_10_2025,
    sourceUrl: "https://sethisfy.com/nerfed-chocolate-finance-drops-rate-1st-september-2025/",
    changeSummary: "First S$20K: 2.5% p.a. (was 3%)\nNext S$30K: 2.2% p.a. (was 2.7%)",
  },
  {
    effectiveDate: "2025-12-01",
    interestFn: choco_finance_12_2025,
    sourceUrl: "https://sethisfy.com/nerfed-maribank-and-chocolate-finance-dropping-rates-from-1st-december-2025/",
    changeSummary: "First S$20K: 2% p.a. (was 2.5%)\nNext S$30K: 1.8% p.a. (was 2.2%)",
  },
  {
    effectiveDate: "2026-06-05",
    interestFn: choco_finance_06_2026,
    sourceUrl: "https://www.chocolatefinance.com/how-it-works",
    changeSummary: "First S$20K unchanged at 2% p.a.\nNext S$80K: 1.8% p.a. (tier expanded, was $30K)",
  },
];
