import { describe, it, expect } from "vitest";
import {
  collectBankPoints,
  collectAllDates,
  buildComparisonDataset,
} from "./buildDataset";
import type Profile from "../../types/profile";

const emptyProfile: Profile = {
  Savings: 0,
  Age: 25,
  Salary: 0,
  Spending: 0,
  Investment: 0,
  Insurance: 0,
  GiroTransactions: 0,
  MonthlyAccIncrease: 0,
  LoanInstallment: 0,
  OneTimeLoan: 0,
  IsNTUCMember: false,
  ReferredCustomer: false,
  PayNowReceived: 0,
  FXSpend: 0,
};

describe("collectBankPoints", () => {
  it("returns empty record for empty bank list", () => {
    const result = collectBankPoints([], emptyProfile);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("skips unknown banks silently", () => {
    const result = collectBankPoints(["fake-bank"], emptyProfile);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("collects points for known banks", () => {
    const result = collectBankPoints(["gxs-savings-account"], emptyProfile);
    expect(result["gxs-savings-account"]).toBeDefined();
    expect(result["gxs-savings-account"].length).toBeGreaterThan(0);
  });

  it("sorts points chronologically", () => {
    const result = collectBankPoints(["gxs-savings-account"], emptyProfile);
    const dates = result["gxs-savings-account"].map((p) => p.date);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] >= dates[i - 1]).toBe(true);
    }
  });

  it("collects multiple banks", () => {
    const result = collectBankPoints(
      ["gxs-savings-account", "mari-savings-account"],
      emptyProfile,
    );
    expect(Object.keys(result)).toHaveLength(2);
    expect(result["gxs-savings-account"]).toBeDefined();
    expect(result["mari-savings-account"]).toBeDefined();
  });

  it("each point has yearlyInterest and eir as numbers", () => {
    const result = collectBankPoints(["gxs-savings-account"], emptyProfile);
    for (const pt of result["gxs-savings-account"]) {
      expect(typeof pt.yearlyInterest).toBe("number");
      expect(typeof pt.eir).toBe("number");
    }
  });
});

describe("collectAllDates", () => {
  it("returns empty array for empty bankPoints", () => {
    expect(collectAllDates({})).toEqual([]);
  });

  it("collects and deduplicates dates across banks", () => {
    const bankPoints = {
      A: [
        { date: "2025-01-01", yearlyInterest: 100, eir: 2.0 },
        { date: "2025-03-01", yearlyInterest: 200, eir: 2.5 },
      ],
      B: [
        { date: "2025-01-01", yearlyInterest: 150, eir: 1.5 }, // duplicate
        { date: "2025-06-01", yearlyInterest: 250, eir: 3.0 },
      ],
    };
    const dates = collectAllDates(bankPoints);
    // Should be 3 unique dates sorted
    expect(dates).toEqual(["2025-01-01", "2025-03-01", "2025-06-01"]);
  });
});

describe("buildComparisonDataset", () => {
  it("returns empty array for empty allDates", () => {
    expect(buildComparisonDataset(["A"], {}, [])).toEqual([]);
  });

  it("builds forward-fill dataset correctly", () => {
    const bankPoints = {
      A: [
        { date: "2025-01-01", yearlyInterest: 100, eir: 2.0 },
        { date: "2025-03-01", yearlyInterest: 200, eir: 2.5 },
      ],
      B: [
        { date: "2025-02-01", yearlyInterest: 150, eir: 1.5 },
      ],
    };
    const allDates = ["2025-01-01", "2025-02-01", "2025-03-01"];
    const dataset = buildComparisonDataset(["A", "B"], bankPoints, allDates);

    expect(dataset).toHaveLength(3);

    // 2025-01-01: A has 100/2.0, B back-fills to earliest (150/1.5)
    expect(dataset[0]["A_yearlyInterest"]).toBe(100);
    expect(dataset[0]["A_eir"]).toBe(2.0);
    expect(dataset[0]["B_yearlyInterest"]).toBe(150);
    expect(dataset[0]["B_eir"]).toBe(1.5);

    // 2025-02-01: A forward-fills 100/2.0, B has 150/1.5
    expect(dataset[1]["A_yearlyInterest"]).toBe(100);
    expect(dataset[1]["B_yearlyInterest"]).toBe(150);

    // 2025-03-01: A has 200/2.5, B forward-fills 150/1.5
    expect(dataset[2]["A_yearlyInterest"]).toBe(200);
    expect(dataset[2]["B_yearlyInterest"]).toBe(150);
  });

  it("date column is a Date object", () => {
    const bankPoints = {
      A: [{ date: "2025-06-01", yearlyInterest: 100, eir: 2.0 }],
    };
    const dataset = buildComparisonDataset(["A"], bankPoints, ["2025-06-01"]);
    expect(dataset[0].date).toBeInstanceOf(Date);
  });

  it("skips banks with no points", () => {
    const bankPoints = {
      A: [{ date: "2025-06-01", yearlyInterest: 100, eir: 2.0 }],
    };
    const dataset = buildComparisonDataset(
      ["A", "B"],
      bankPoints,
      ["2025-06-01"],
    );
    // B is selected but has no points — should not throw
    expect(dataset[0]["A_yearlyInterest"]).toBe(100);
    expect(dataset[0]["B_yearlyInterest"]).toBeUndefined();
  });

  it("back-fills before first data point", () => {
    const bankPoints = {
      A: [
        { date: "2025-03-01", yearlyInterest: 200, eir: 2.5 },
      ],
    };
    const allDates = ["2025-01-01", "2025-03-01"];
    const dataset = buildComparisonDataset(["A"], bankPoints, allDates);
    // Before A's first date, back-fill to earliest
    expect(dataset[0]["A_yearlyInterest"]).toBe(200);
    expect(dataset[0]["A_eir"]).toBe(2.5);
  });

  // ── Date validation tests ──

  it("throws on malformed date in bankPoints (via collectAllDates sort)", () => {
    const bankPoints = {
      A: [{ date: "not-a-date", yearlyInterest: 100, eir: 2.0 }],
      B: [{ date: "2025-01-01", yearlyInterest: 200, eir: 3.0 }],
    };
    expect(() => collectAllDates(bankPoints)).toThrow("Invalid date string");
  });

  it("throws on malformed date in allDates", () => {
    const bankPoints = {
      A: [{ date: "2025-01-01", yearlyInterest: 100, eir: 2.0 }],
    };
    expect(() =>
      buildComparisonDataset(["A"], bankPoints, ["bad-date"]),
    ).toThrow("Invalid date string");
  });
});