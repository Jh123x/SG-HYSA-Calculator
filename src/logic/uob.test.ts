import { ResultInterest } from "../types/interest_result";
import { uob_interest_2025_09 } from "./uob";
import { NewProfile } from "../types/profile";


interface testCase {
    caseName: string

    savings: number
    salaryCredit: number
    giroTxns: number
    spending: number

    expectedResult: number
}

describe("UOB Interest Rates", () => {
    const testCases: Array<testCase> = [
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
            expectedResult: 2675,
        },
        {
            caseName: "150k + salary + spend",
            savings: 150_000,
            salaryCredit: 1600,
            giroTxns: 0,
            spending: 500,
            expectedResult: 4950,
        },
        {
            caseName: "100k + giro + spend",
            savings: 100_000,
            salaryCredit: 0,
            giroTxns: 3,
            spending: 500,
            expectedResult: 1750,
        },
        {
            caseName: "150k + giro + spend",
            savings: 150_000,
            salaryCredit: 0,
            giroTxns: 3,
            spending: 500,
            expectedResult: 2387.5,
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
    ]

    for (const tc of testCases) {
        it(tc.caseName, () => {
            const result = uob_interest_2025_09(NewProfile({
                Savings: tc.savings,
                Salary: tc.salaryCredit,
                Spending: tc.spending,
                GiroTransactions: tc.giroTxns
            }))

            expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.savings))
        })
    }
})