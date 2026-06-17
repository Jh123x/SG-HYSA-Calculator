import { ResultInterest } from "./interest_result";

describe("ResultInterest precision", () => {
  it("preserves sub-cent precision through construction", () => {
    // 0.1875% rates produce values like 1.875 that require >2 decimal places
    const r = new ResultInterest(1.875, 1000);
    expect(r.toYearly()).toBe(1.875);
  });

  it("preserves precision through addInterest", () => {
    // Citibank flow: calculate_ir returns full precision, then addInterest
    const r = new ResultInterest(5.625, 3000);
    r.addInterest(45);
    expect(r.toYearly()).toBe(50.625);
  });

  it("preserves precision for multi-tier fractional rates", () => {
    // Maybank SaveUp: 3000*0.1875% + 47000*0.25% + 25000*0.3125% = 201.25
    const r = new ResultInterest(201.25, 75000);
    expect(r.toYearly()).toBe(201.25);
  });

  it("toYearlyPercent returns full-precision EIR", () => {
    // 4500 * 0.1875% = 8.4375, EIR = 8.4375/4500 * 100 = 0.1875
    const r = new ResultInterest(8.4375, 4500);
    expect(r.toYearlyPercent()).toBeCloseTo(0.1875, 4);
  });

  it("toYearlyRounded rounds to 2 decimal places for display", () => {
    const r = new ResultInterest(1.875, 1000);
    expect(r.toYearlyRounded(2)).toBe(1.88);
  });

  it("toYearlyRounded accepts custom precision", () => {
    const r = new ResultInterest(1.875, 1000);
    expect(r.toYearlyRounded(3)).toBe(1.875);
    expect(r.toYearlyRounded(1)).toBe(1.9);
  });

  it("toMonthly and toDaily use full precision", () => {
    const r = new ResultInterest(12.3, 1000);
    expect(r.toMonthly()).toBe(12.3 / 12);
    expect(r.toDaily()).toBe(12.3 / 365);
  });

  it("zero savings returns zero EIR", () => {
    const r = new ResultInterest(0, 0);
    expect(r.toYearlyPercent()).toBe(0);
  });
});
