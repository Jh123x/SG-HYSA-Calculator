import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

const baseInterest = 0.05;

export const stand_chart_interest_10_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Salary, Spending, Insurance, Investment } = profile;
  var interest = baseInterest;

  if (Salary >= 3000) interest += 1.5;
  if (Spending >= 1000) interest += 1.5;
  if (Insurance >= 12000) interest += 2.5;
  if (Investment >= 20000) interest += 2.5;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 100_000, InterestRatePercent: interest }],
    baseRatePercent: baseInterest,
  });
};

export const stand_chart_interest_06_2026 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Salary, Spending, Insurance, Investment } = profile;
  var interest = baseInterest;

  if (Salary >= 3000) interest += 0.9;
  if (Spending >= 1000) interest += 0.9;
  if (Insurance >= 24000) interest += 2;
  if (Investment >= 30000) interest += 2;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 100_000, InterestRatePercent: interest }],
    baseRatePercent: baseInterest,
  });
};

export const stand_chart_interest_before_06_25 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Salary, Spending, Insurance, Investment } = profile;
  var interest = baseInterest;

  if (Salary >= 3000) interest += 1;
  if (Spending >= 1000) interest += 1;
  if (Insurance >= 12000) interest += 2;
  if (Investment >= 30000) interest += 2;

  return calculate_ir(Savings, {
    cutoffs: [{ Cutoff: 100_000, InterestRatePercent: interest }],
    baseRatePercent: baseInterest,
  });
};

export const standChartHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-06-01",
    interestFn: stand_chart_interest_before_06_25,
    sourceUrl: "https://www.sc.com/sg/important-information/bonussaver-revision/",
    changeSummary: "Salary 1% / Spend 1% / Insurance 2% / Investment 2% on first $100K",
  },
  {
    effectiveDate: "2025-10-01",
    interestFn: stand_chart_interest_10_2025,
    sourceUrl: "https://sethisfy.com/buffed-bonussaver-increases-rates-3-05-2-5-p-a-possible/",
    changeSummary: "Salary ↑1.5%, Spend ↑1.5%, Insurance ↑2.5%, Investment ↑2.5%",
  },
  {
    effectiveDate: "2026-06-05",
    interestFn: stand_chart_interest_06_2026,
    sourceUrl: "https://www.sc.com/sg/important-information/revision-of-bonusaver-myway-jumpstartaccount/",
    changeSummary: "Salary ↓0.9%, Spend ↓0.9%. Insurance ($12K→$24K threshold) 2%, Investment ($20K→$30K threshold) 2%",
  },
];
