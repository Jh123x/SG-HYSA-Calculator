import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

const baseInterest = 0.01;

export const citi_wealth_first_05_2025 = (profile: Profile): ResultInterest => {
  // Minimum 250k savings and 18 year old
  if (profile.Savings < 250_000 || profile.Age < 18)
    return new ResultInterest(0, profile.Savings);

  var ir = baseInterest;
  if (profile.Spending >= 250) ir += 1.5;
  if (profile.Investment >= 50_000) ir += 1.5;
  if (profile.Insurance >= 50_000) ir += 1.5;
  if (profile.OneTimeLoan >= 500_000) ir += 1.5;

  const additionalIr = profile.MonthlyAccIncrease * 0.015;

  const result = calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 250_000, InterestRatePercent: ir }],
    baseRatePercent: 0.01,
  });

  result.addInterest(additionalIr);
  return result;
};

export const citi_wealth_first_10_2025 = (profile: Profile): ResultInterest => {
  // Minimum 250k savings and 18 year old
  if (profile.Savings < 250_000 || profile.Age < 18)
    return new ResultInterest(0, profile.Savings);

  var ir = baseInterest;
  if (profile.Spending >= 250) ir += 1.5;
  if (profile.Investment >= 50_000) ir += 1.5;
  if (profile.Insurance >= 50_000) ir += 1.5;
  if (profile.OneTimeLoan >= 500_000) ir += 1.5;

  if (profile.MonthlyAccIncrease >= 3000) ir += 1.5;

  const result = calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 250_000, InterestRatePercent: ir }],
    baseRatePercent: 0.01,
  });

  return result;
};

export const citi_wealth_first_06_2026 = (profile: Profile): ResultInterest => {
  // Minimum 250k savings and 18 year old
  if (profile.Savings < 250_000 || profile.Age < 18)
    return new ResultInterest(0, profile.Savings);

  var ir = baseInterest;
  if (profile.Spending >= 250) ir += 1.5;
  if (profile.Investment >= 50_000) ir += 1.5;
  if (profile.Insurance >= 50_000) ir += 1.5;
  if (profile.OneTimeLoan >= 500_000) ir += 1.5;
  if (profile.MonthlyAccIncrease >= 3000) ir += 1.5;

  const result = calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 500_000, InterestRatePercent: ir }],
    baseRatePercent: 0.01,
  });

  return result;
};

export const citiHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-05-01",
    interestFn: citi_wealth_first_05_2025,
    changeSummary: "Base 0.01%. Spend $250 +1.5%, Invest $50K +1.5%, Insurance $50K +1.5%, Loan $500K +1.5%. MonthlyAccIncrease × 0.015 bonus. Cap $250K.\nSource: https://sethisfy.com/citigold-access-citibanks-priority-tier-and-stack-bonus-gifts-from-singsaver-sign-up-rewards-from-citibank/",
  },
  {
    effectiveDate: "2025-10-01",
    interestFn: citi_wealth_first_10_2025,
    changeSummary: "MonthlyAccIncrease bonus replaced: $3K+ adds +1.5% tier (was 0.015×amount).\nSource: https://www.citibank.com.sg/pdf/1223/citi-wealth-first-account-tnc.pdf",
  },
  {
    effectiveDate: "2026-06-05",
    interestFn: citi_wealth_first_06_2026,
    changeSummary: "Cap increased: $250K→$500K.\nSource: https://www.citibank.com.sg/personal-banking/deposits/citi-wealth-first-saving-account",
  },
];
