import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import {
  bank_of_china_super_saver_07_2025,
  bank_of_china_smart_saver_08_2025,
  bank_of_china_smart_saver_11_2025,
} from "./bank_of_china";

describe("BOC SuperSaver", () => {
  it("should return correct interest based on their example", () => {
    const profile = NewProfile({ Savings: 100_000 });
    const result = bank_of_china_super_saver_07_2025(profile);
    expect(result).toEqual(new ResultInterest(300 + 880 + 1440, 100_000));
  });
});

describe("BOC SmartSaver — Aug 2025", () => {
  const fullBonus = NewProfile({
    Savings: 100_000,
    Salary: 2_000,
    Spending: 2_500,
    Insurance: 200_000,
    GiroTransactions: 3,
  });

  it("prevailing 0.20% on any amount — no minimum", () => {
    const profile = NewProfile({ Savings: 500 });
    const result = bank_of_china_smart_saver_08_2025(profile);
    // 500 × 0.20% = 1.00
    expect(result.toYearly()).toBe(1);
  });

  it("prevailing rate only with no bonuses met", () => {
    const profile = NewProfile({ Savings: 100_000 });
    const result = bank_of_china_smart_saver_08_2025(profile);
    expect(result.toYearlyPercent().toFixed(2)).toBe("0.20");
  });

  it("max without insurance: 0.20 + 1.25 + 0.80 + 0.10 = 2.35%", () => {
    const profile = NewProfile({
      Savings: 100_000,
      Salary: 2_000,
      Spending: 2_500,
      GiroTransactions: 3,
    });
    const result = bank_of_china_smart_saver_08_2025(profile);
    expect(result.toYearlyPercent().toFixed(2)).toBe("2.35");
  });

  it("full bonus with insurance: 0.20 + 1.25 + 0.80 + 0.10 + 3.00 = 5.35%", () => {
    const result = bank_of_china_smart_saver_08_2025(fullBonus);
    expect(result.toYearlyPercent().toFixed(2)).toBe("5.35");
  });

  it("card spend tier: S$750 → 0.75% (not S$2,500)", () => {
    const profile = NewProfile({
      Savings: 100_000,
      Spending: 1_000,
      Salary: 2_000,
      GiroTransactions: 3,
    });
    // 0.20 + 0.75 + 0.80 + 0.10 = 1.85%
    const result = bank_of_china_smart_saver_08_2025(profile);
    expect(result.toYearlyPercent().toFixed(2)).toBe("1.85");
  });

  it("bonus only applies to first S$100K", () => {
    const profile = NewProfile({
      Savings: 150_000,
      Salary: 2_000,
      Spending: 2_500,
      GiroTransactions: 3,
    });
    const result = bank_of_china_smart_saver_08_2025(profile);
    // First 100K: 2.35% → 2,350
    // Next 50K: 0.20% → 100
    // Total: 2,450, EIR: 2,450/150,000 = 1.6333...%
    expect(result.toYearly()).toBe(2450);
  });
});

describe("BOC SmartSaver — Nov 2025", () => {
  const fullBonus = NewProfile({
    Savings: 100_000,
    Salary: 3_000,
    Spending: 2_500,
    Insurance: 200_000,
    GiroTransactions: 3,
  });

  it("prevailing 0.10% on any amount — no minimum", () => {
    const profile = NewProfile({ Savings: 500 });
    const result = bank_of_china_smart_saver_11_2025(profile);
    // 500 × 0.10% = 0.50
    expect(result.toYearly()).toBe(0.5);
  });

  it("prevailing rate only with no bonuses met", () => {
    const profile = NewProfile({ Savings: 100_000 });
    const result = bank_of_china_smart_saver_11_2025(profile);
    expect(result.toYearlyPercent().toFixed(2)).toBe("0.10");
  });

  it("max without insurance: 0.10 + 0.90 + 0.50 + 0.10 = 1.60%", () => {
    const profile = NewProfile({
      Savings: 100_000,
      Salary: 3_000,
      Spending: 2_500,
      GiroTransactions: 3,
    });
    const result = bank_of_china_smart_saver_11_2025(profile);
    expect(result.toYearlyPercent().toFixed(2)).toBe("1.60");
  });

  it("full bonus with insurance: 0.10 + 0.90 + 0.50 + 0.10 + 3.00 = 4.60%", () => {
    const result = bank_of_china_smart_saver_11_2025(fullBonus);
    expect(result.toYearlyPercent().toFixed(2)).toBe("4.60");
  });

  it("card spend tier: S$750 → 0.60% (not S$2,500)", () => {
    const profile = NewProfile({
      Savings: 100_000,
      Spending: 1_000,
      Salary: 3_000,
      GiroTransactions: 3,
    });
    // 0.10 + 0.60 + 0.50 + 0.10 = 1.30%
    const result = bank_of_china_smart_saver_11_2025(profile);
    expect(result.toYearlyPercent().toFixed(2)).toBe("1.30");
  });

  it("Salary threshold is S$3K — S$2.5K does not trigger", () => {
    const notEnough = NewProfile({
      ...fullBonus,
      Salary: 2_500,
    });
    const result = bank_of_china_smart_saver_11_2025(notEnough);
    // 0.10 + 0.90 + 0.10 + 3.00 = 4.10%
    expect(result.toYearlyPercent().toFixed(2)).toBe("4.10");
  });

  it("bonus only applies to first S$100K", () => {
    const profile = NewProfile({
      Savings: 150_000,
      Salary: 3_000,
      Spending: 2_500,
      GiroTransactions: 3,
    });
    const result = bank_of_china_smart_saver_11_2025(profile);
    // First 100K: 1.60% → 1,600
    // Next 50K: 0.10% → 50
    // Total: 1,650, EIR: 1,650/150,000 = 1.10%
    expect(result.toYearly()).toBe(1650);
  });
});
