import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common";

export const bank_of_china_smart_saver_08_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Insurance, Spending, Salary, GiroTransactions } = profile;
  if (Savings < 1_500) return new ResultInterest(0, Savings);

  const baseInterest = getBaseInterest(Savings);
  var hasExtraSavingsInterest = false;
  var interest = baseInterest;

  if (Insurance > 150_000) interest += 2.75;

  if (Spending >= 750) interest += 0.75;

  if (Spending > 2500) {
    interest += 0.5;
    hasExtraSavingsInterest = true;
  }

  if (Salary >= 2000) {
    interest += 1.5;
    hasExtraSavingsInterest = true;
  }

  if (Spending >= 90 && GiroTransactions >= 3) {
    interest += 0.1;
    hasExtraSavingsInterest = true;
  }

  return calculate_ir(Savings, {
    cutoffs: [
      {
        Cutoff: 100_000,
        InterestRatePercent: interest,
      },
      {
        Cutoff: 1_000_000,
        InterestRatePercent: hasExtraSavingsInterest
          ? baseInterest + 0.6
          : baseInterest,
      },
    ],
    baseRatePercent: baseInterest,
  });
};

export const bank_of_china_smart_saver_11_2025 = (
  profile: Profile,
): ResultInterest => {
  const { Savings, Insurance, Spending, Salary, GiroTransactions } = profile;
  if (Savings < 1_500) return new ResultInterest(0, Savings);

  const baseInterest = getBaseInterest(Savings);
  var hasExtraSavingsInterest = false;
  var interest = baseInterest;

  if (Insurance > 150_000) interest += 2.75;

  if (Spending >= 750) interest += 0.75;

  if (Spending > 2500) {
    interest += 0.5;
    hasExtraSavingsInterest = true;
  }

  if (Salary >= 3000) {
    interest += 1.5;
    hasExtraSavingsInterest = true;
  }

  if (Spending >= 90 && GiroTransactions >= 3) {
    interest += 0.1;
    hasExtraSavingsInterest = true;
  }

  return calculate_ir(Savings, {
    cutoffs: [
      {
        Cutoff: 100_000,
        InterestRatePercent: interest,
      },
      {
        Cutoff: 1_000_000,
        InterestRatePercent: hasExtraSavingsInterest
          ? baseInterest + 0.6
          : baseInterest,
      },
    ],
    baseRatePercent: baseInterest,
  });
};

const getBaseInterest = (savings: number): number => {
  if (savings < 5000) return 0.15;
  if (savings < 20_000) return 0.2;
  if (savings < 100_000) return 0.3;
  return 0.4;
};

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

export const bocSmartSaverHistory: RateSnapshot[] = [
  {
    effectiveDate: "2025-08-01",
    interestFn: bank_of_china_smart_saver_08_2025,
    sourceUrl: "https://sethisfy.com/boc-smartsaver-dropping-interest-by-0-70-p-a-1st-august-2025/",
    changeSummary: "Salary $2K +1.5%, Insurance $150K +2.75%, Spend $750 +0.75%, Spend $2.5K +0.5%, Giro 3×$90 +0.1%",
  },
  {
    effectiveDate: "2025-11-01",
    interestFn: bank_of_china_smart_saver_11_2025,
    sourceUrl: "https://sethisfy.com/boc-smartsaver-getting-up-to-4-60-p-a-with-this-savings-account/",
    changeSummary: "Salary threshold raised: $2K→$3K",
  },
];

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
