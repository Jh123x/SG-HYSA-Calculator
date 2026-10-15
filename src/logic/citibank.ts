import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import type {Profile }from "../types/profile";
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

export const citi_wealth_first_10_2026 = (profile: Profile): ResultInterest => {
  // Minimum 250k savings and 18 year old
  if (profile.Savings < 250_000 || profile.Age < 18)
    return new ResultInterest(0, profile.Savings);

  var ir = baseInterest;
  if (profile.Spending >= 750) ir += 1.5;
  if (profile.Investment >= 50_000) ir += 1.5;
  if (profile.Insurance >= 50_000) ir += 1.5;
  if (profile.OneTimeLoan >= 500_000) ir += 1.5;
  if (profile.Salary >= 5_000) ir += 1.0;
  if (profile.MonthlyAccIncrease >= 3000) ir += 0.5;

  const result = calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 250_000, InterestRatePercent: ir }],
    baseRatePercent: 0.01,
  });

  return result;
};

/**
 * Citi Interest Booster Account — the mass-market (Citi Plus) savings account,
 * NOT restricted to Citigold. Base 1.50% p.a. on the first S$50,000 (0.01% above),
 * with six stackable bonus missions (bonus interest capped at the first S$50,000):
 *   - Spend:  +0.2% (>= S$500 eligible retail spend/mo)
 *   - Invest: +0.6% (3 investment transactions >= S$1,000/mo)
 *   - Insure: +0.6% (new regular-premium policy >= S$5,000/yr)
 *   - Borrow: +0.8% (new home loan >= S$500,000)
 *   - Save:   +0.2% (increase ADB by >= S$1,500/mo)
 *   - Birthday month: +0.1%
 * Max 4.0% p.a.
 */
export const citi_interest_booster_11_2025 = (profile: Profile): ResultInterest => {
  if (profile.Age < 18) return new ResultInterest(0, profile.Savings);

  const bonus = 0.01; // base above S$50K
  let ir = 1.5; // upsized base on first S$50K

  if (profile.Spending >= 500) ir += 0.2;
  if (profile.Investment >= 1_000) ir += 0.6;
  if (profile.Insurance >= 5_000) ir += 0.6;
  if (profile.OneTimeLoan >= 500_000) ir += 0.8;
  if (profile.MonthlyAccIncrease >= 1_500) ir += 0.2;
  if (profile.Age >= 18) ir += 0.1; // birthday month (every account holder has one)

  return calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 50_000, InterestRatePercent: ir }],
    baseRatePercent: bonus,
  });
};

export const citiInterestBoosterHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-11-01",
    interestFn: citi_interest_booster_11_2025,
    sourceUrl:
      "https://www.citibank.com.sg/pdf/0923/citi-interest-booster-account-terms-and-conditions.pdf",
    changeSummary:
      "Base: 1.5% on first S$50K (0.01% above)\nSpend ≥S$500: +0.2%\nInvest ≥S$1K: +0.6%\nInsurance ≥S$5K: +0.6%\nLoan ≥S$500K: +0.8%\nSave (ADB +S$1.5K): +0.2%\nBirthday month: +0.1%\nCap: first S$50K\nMax 4.0% p.a.",
  },
];

export const citiHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-05-01",
    interestFn: citi_wealth_first_05_2025,
    sourceUrl: "https://sethisfy.com/citigold-access-citibanks-priority-tier-and-stack-bonus-gifts-from-singsaver-sign-up-rewards-from-citibank/",
    changeSummary: "Base: 0.01%\nSpend $250: +1.5%\nInvest $50K: +1.5%\nInsurance $50K: +1.5%\nLoan $500K: +1.5%\nMonthly Acc Increase: ×0.015 bonus\nCap: $250K",
  },
  {
    effectiveDate: "2025-10-01",
    interestFn: citi_wealth_first_10_2025,
    sourceUrl: "https://www.citibank.com.sg/pdf/1223/citi-wealth-first-account-tnc.pdf",
    changeSummary: "Monthly Acc Increase bonus replaced:\nS$3K+ adds +1.5% tier (was 0.015 × amount)",
  },
  {
    effectiveDate: "2026-06-05",
    interestFn: citi_wealth_first_06_2026,
    sourceUrl: "https://www.citibank.com.sg/personal-banking/deposits/citi-wealth-first-saving-account",
    changeSummary: "Cap increased: $250K → $500K",
  },
  {
    effectiveDate: "2026-10-01",
    interestFn: citi_wealth_first_10_2026,
    sourceUrl: "https://www.citibank.com.sg/content/dam/cgcpc/sg/prelogin/www-citibank-com-sg/pdf/global_docs/pdf/cg-wf-wef-oct26.pdf",
    changeSummary: "Revised T&Cs (Citigold):\nSpend threshold S$250 → S$750 (bonus unchanged at +1.5%)\nSave (ADB increase ≥S$3K): +1.5% → +0.5%\nNew Salary category: +1.0% (min S$5,000)\nCap: Bonus Interest capped at first S$250K for Citigold (S$500K only for Citigold Private Client)",
  },
];
