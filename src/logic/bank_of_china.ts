import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

export const bank_of_china_super_saver_07_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, Savings);

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 20_000, InterestRatePercent: 1.5 },
      { Cutoff: 40_000, InterestRatePercent: 2.2 },
      { Cutoff: 40_000, InterestRatePercent: 3.6 },
    ],
    baseRatePercent: 1.2,
  });
};

export const bank_of_china_super_saver_08_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, Savings);

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 20_000, InterestRatePercent: 1 },
      { Cutoff: 40_000, InterestRatePercent: 1.2 },
      { Cutoff: 40_000, InterestRatePercent: 1.6 },
    ],
    baseRatePercent: 0.8,
  });
};

export const bank_of_china_super_saver_11_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings } = profile;
  if (Savings < 200) return new ResultInterest(0, Savings);

  return calculate_ir(Savings, {
    cutoffs: [
      { Cutoff: 20_000, InterestRatePercent: 0.5 },
      { Cutoff: 40_000, InterestRatePercent: 0.8 },
      { Cutoff: 40_000, InterestRatePercent: 1 },
    ],
    baseRatePercent: 0.5,
  });
};

export const bocSuperSaverHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-07-01",
    interestFn: bank_of_china_super_saver_07_2025,
    sourceUrl: "https://www.bankofchina.com/sg/bocinfo/bi1/202506/t20250620_25390361.html",
    changeSummary: "1st $20K 1.5%, next $40K 2.2%, next $40K 3.6%, remaining 1.2%",
  },
  {
    effectiveDate: "2025-08-01",
    interestFn: bank_of_china_super_saver_08_2025,
    sourceUrl: "https://www.bankofchina.com/sg/bocinfo/bi1/202506/t20250620_25390361.html",
    changeSummary: "All tiers reduced: 1.5%→1%, 2.2%→1.2%, 3.6%→1.6%, base 1.2%→0.8%",
  },
  {
    effectiveDate: "2025-11-01",
    interestFn: bank_of_china_super_saver_11_2025,
    sourceUrl: "https://www.bankofchina.com/sg/bocinfo/bi1/202509/t20250929_25516576.html",
    changeSummary: "Further reduced: 1%→0.5%, 1.2%→0.8%, 1.6%→1%, base 0.8%→0.5%",
  },
];
