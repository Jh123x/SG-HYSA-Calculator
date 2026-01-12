import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

const table_1st_50k = [0, 0.3, 1, 2.75];
const table_nxt_25k = [0, 1, 1.5, 3.75];

export const maybank_save_up_10_2025 = (profile: Profile): ResultInterest => {
  var count = 0;

  // Giro / Salary
  if (
    (profile.GiroTransactions >= 1 && profile.Spending >= 300) ||
    profile.Salary >= 2000
  )
    count += 1;

  // Car Spend
  if (profile.Spending >= 500) count += 1;

  // Invest
  if (profile.Investment >= 25000) count += 1;

  // Insurance
  if (profile.Insurance >= 5000) count += 1;

  // Loans
  if (profile.LoanInstallment >= 10_000) count += 1;

  if (count > 3) count = 3;

  return calculate_ir(profile.Savings, {
    cutoffs: [
      {
        Cutoff: 3000,
        InterestRatePercent: 0.05 + table_1st_50k[count],
      },
      {
        Cutoff: 47_000,
        InterestRatePercent: 0.25 + table_1st_50k[count],
      },
      {
        Cutoff: 25_000,
        InterestRatePercent: 0.25 + table_nxt_25k[count],
      },
    ],
    baseRatePercent: 0.25,
  });
};
