import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { ocbc_interest_pre_08_2025 } from "./ocbc360";

interface testCase {
    caseName: string

    savings: number
    salary: number
    balanceIncrease: number
    spending: number
    insurance: boolean
    investment: boolean

    expectedResult: number
}

describe("OCBC Interest rates", () => {
    const testCases: Array<testCase> = [
        {
            caseName: "250k and all criteria",
            savings: 250_000,
            salary: 1800,
            balanceIncrease: 500,
            spending: 500,
            insurance: true,
            investment: true,

            expectedResult: 8575,
        },
        {
            caseName: "100k and all criteria",

            savings: 100_000,
            salary: 1800,
            balanceIncrease: 500,
            spending: 500,
            insurance: true,
            investment: true,

            expectedResult: 6300,
        },
        {
            caseName: "100k + salary + save",

            savings: 100_000,
            salary: 1800,
            balanceIncrease: 500,
            spending: 500,
            insurance: false,
            investment: false,

            expectedResult: 3300,
        },
        {
            caseName: "0 should return 0",
            savings: 0,
            salary: 1800,
            balanceIncrease: 500,
            spending: 500,
            insurance: true,
            investment: true,

            expectedResult: 0,
        }
    ]
    for (const tc of testCases) {
        it(tc.caseName, () => {
            const result = ocbc_interest_pre_08_2025(NewProfile({
                Savings: tc.savings,
                Salary: tc.salary,
                Spending: tc.spending,
                Investment: tc.investment ? 100 : 0,
                Insurance: tc.insurance ? 100 : 0,
                MonthlyAccIncrease: tc.balanceIncrease,
            }))

            expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.savings))
        })
    }
})