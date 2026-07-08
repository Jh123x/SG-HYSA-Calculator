import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import {
  bank_of_china_super_saver_07_2025,
  bank_of_china_smart_saver_11_2025,
} from "./bank_of_china";

describe("BOC SuperSaver", () => {
  it("should return correct interest based on their example", () => {
    const profile = NewProfile({ Savings: 100_000 });
    const result = bank_of_china_super_saver_07_2025(profile);
    expect(result).toEqual(new ResultInterest(300 + 880 + 1440, 100_000));
  });
});

describe("BOC SmartSaver", () => {
  const fullBonus = NewProfile({
    Savings: 100_000,
    Salary: 3_000,
    Spending: 2_500,
    Insurance: 200_000,
    GiroTransactions: 3,
  });

  it("returns 0 for savings below $1.5K", () => {
    const profile = NewProfile({ Savings: 500 });
    const result = bank_of_china_smart_saver_11_2025(profile);
    expect(result).toEqual(new ResultInterest(0, 500));
  });

  it("returns base interest only with no bonuses met", () => {
    const profile = NewProfile({ Savings: 100_000 });
    // baseInterest = 0.4% (Savings ≥ 100K)
    const result = bank_of_china_smart_saver_11_2025(profile);
    expect(result.toYearlyPercent().toFixed(2)).toBe("0.40");
  });

  it("applies all bonus categories with full qualification", () => {
    const result = bank_of_china_smart_saver_11_2025(fullBonus);
    // baseInterest 0.4% + Insurance 2.75% + Spend 0.75% + Spend_extra 0.5%
    // + Salary 1.5% + Giro 0.1% = 6.0% on first 100K
    expect(result.toYearlyPercent().toFixed(2)).toBe("5.50");
  });

  it("Salary threshold is $3K (Nov 2025 change)", () => {
    // Salary at $2,500 (< $3K) should NOT trigger salary bonus
    const notEnough = NewProfile({
      ...fullBonus,
      Salary: 2_500,
    });
    const result = bank_of_china_smart_saver_11_2025(notEnough);
    // Without salary bonus: base 0.4% + Insurance 2.75% + Spend 0.75%
    // + Spend_extra 0.5% + Giro 0.1% = 4.5% on first 100K
    expect(result.toYearlyPercent().toFixed(2)).toBe("4.00");
  });
});
