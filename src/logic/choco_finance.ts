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
    changeSummary: "First $20K 3.3%, next $30K 3%. Source: https://sethisfy.com/nerfed-chocolate-finance-drops-top-up-rate-to-3-and-3-3-p-a-on-first-s50000-from-1st-february-2025/",
  },
  {
    effectiveDate: "2025-06-01",
    interestFn: choco_finance_06_2025,
    changeSummary: "First $20K ↓3%, next $30K ↓2.7%. Source: https://sethisfy.com/nerfed-gxs-trust-bank-and-chocolate-finance-announce-drop-in-rates/",
  },
  {
    effectiveDate: "2025-10-01",
    interestFn: choco_finance_10_2025,
    changeSummary: "First $20K ↓2.5%, next $30K ↓2.2%. Source: https://sethisfy.com/nerfed-chocolate-finance-drops-rate-1st-september-2025/",
  },
  {
    effectiveDate: "2025-12-01",
    interestFn: choco_finance_12_2025,
    changeSummary: "First $20K ↓2%, next $30K ↓1.8%. Source: https://sethisfy.com/nerfed-maribank-and-chocolate-finance-dropping-rates-from-1st-december-2025/",
  },
  {
    effectiveDate: "2026-06-05",
    interestFn: choco_finance_06_2026,
    changeSummary: "First $20K unchanged 2%, next tier expanded to $80K at 1.8% (was $30K). Source: https://www.chocolatefinance.com/how-it-works",
  },
];
