import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { ocbc_interest } from "./ocbc360";

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
            caseName: "200k and all criteria",

            savings: 200_000,
            salary: 1800,
            balanceIncrease: 500,
            spending: 500,
            insurance: true,
            investment: true,

            expectedResult: 857.76 * 12,
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
            const result = ocbc_interest(NewProfile({
                Savings: tc.savings,
                Salary: tc.salary,
                Spending: tc.spending,
                Investment: tc.investment ? 100 : 0,
                Insurance: tc.insurance ? 100 : 0,
                MonthlyAccIncrease: tc.balanceIncrease,
            }))

            expect(result).toEqual(new ResultInterest(tc.expectedResult))
        })
    }
})