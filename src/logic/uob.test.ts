import { ResultInterest } from "../types/interest_result";
import { uob_interest_2025_09, uob_interest_2025_12 } from "./uob";
import { NewProfile } from "../types/profile";

interface testCase {
  caseName: string;

  savings: number;
  salaryCredit: number;
  giroTxns: number;
  spending: number;

  expectedResult: number;
}

const baseCases: Array<testCase> = [
  {
    caseName: "100k no conditions",
    savings: 100_000,
    salaryCredit: 0,
    giroTxns: 0,
    spending: 0,
    expectedResult: 50,
  },
  {
    caseName: "150k no conditions",
    savings: 150_000,
    salaryCredit: 0,
    giroTxns: 0,
    spending: 0,
    expectedResult: 75,
  },
  {
    caseName: "100k + salary + spend",
    savings: 100_000,
    salaryCredit: 1600,
    giroTxns: 0,
    spending: 500,
    expectedResult: 1875,
  },
  {
    caseName: "150k + salary + spend",
    savings: 150_000,
    salaryCredit: 1600,
    giroTxns: 0,
    spending: 500,
    expectedResult: 3750,
  },
  {
    caseName: "100k + giro + spend",
    savings: 100_000,
    salaryCredit: 0,
    giroTxns: 3,
    spending: 500,
    expectedResult: 1250,
  },
  {
    caseName: "150k + giro + spend",
    savings: 150_000,
    salaryCredit: 0,
    giroTxns: 3,
    spending: 500,
    expectedResult: 1762.5,
  },
  {
    caseName: "100k + salary",
    savings: 100_000,
    salaryCredit: 1600,
    giroTxns: 0,
    spending: 0,
    expectedResult: 50,
  },
  {
    caseName: "150k + salary",
    savings: 150_000,
    salaryCredit: 1600,
    giroTxns: 0,
    spending: 0,
    expectedResult: 75,
  },
  {
    caseName: "100k + spend only",
    savings: 100_000,
    salaryCredit: 0,
    giroTxns: 0,
    spending: 500,
    expectedResult: 500,
  },
  {
    caseName: "150k + spend only",
    savings: 150_000,
    salaryCredit: 0,
    giroTxns: 0,
    spending: 500,
    expectedResult: 525,
  },
  {
    caseName: "0 + spend only",
    savings: 0,
    salaryCredit: 0,
    giroTxns: 0,
    spending: 500,
    expectedResult: 0,
  },
  {
    caseName: "0 + salary + spend",
    savings: 0,
    salaryCredit: 1600,
    giroTxns: 0,
    spending: 500,
    expectedResult: 0,
  },
];

describe("UOB Interest Rates (Sep 2025)", () => {
  for (const tc of baseCases) {
    it(tc.caseName, () => {
      const result = uob_interest_2025_09(
        NewProfile({
          Savings: tc.savings,
          Salary: tc.salaryCredit,
          Spending: tc.spending,
          GiroTransactions: tc.giroTxns,
        }),
      );

      expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.savings));
    });
  }
});

describe("UOB Interest Rates (Dec 2025)", () => {
  const currentCases: Array<testCase> = baseCases.map((tc) => ({ ...tc }));

  // Dec 2025 structure differs from Sep 2025 for the salary tier:
  //   Salary: 1st $75K +1.0% (was +1.5%), next $50K +2.5% (was +3%),
  //           next $25K +3.4% (was +4.5%)
  //   GIRO: 1st $75K +1.0%, next $50K +2.0% (unchanged from Sep)
  for (const tc of currentCases) {
    if (tc.caseName === "100k + salary + spend") tc.expectedResult = 1375;
    if (tc.caseName === "150k + salary + spend") tc.expectedResult = 2850;
  }

  for (const tc of currentCases) {
    it(tc.caseName, () => {
      const result = uob_interest_2025_12(
        NewProfile({
          Savings: tc.savings,
          Salary: tc.salaryCredit,
          Spending: tc.spending,
          GiroTransactions: tc.giroTxns,
        }),
      );

      expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.savings));
    });
  }
});
