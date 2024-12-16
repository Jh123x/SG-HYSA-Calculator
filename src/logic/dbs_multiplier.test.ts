import { ResultInterest } from "../types/interest_result"
import { NewProfile } from "../types/profile"
import { dbs_multiplier_interest } from "./dbs_multiplier"


interface TestCase {
    name: string
    savings: number
    spending: number
    loanInstallment: number
    insurance: number
    investment: number
    salary: number

    expectedInterest: number
}

describe("DBS Multiplier Account", () => {
    const tests: Array<TestCase> = [
        {
            name: "$0",
            savings: 0,
            spending: 100_000,
            loanInstallment: 100_000,
            insurance: 100_000,
            investment: 100_000,
            salary: 1000,

            expectedInterest: 0,
        },
        {
            name: "$1000 for everything",
            savings: 1000,
            spending: 1000,
            loanInstallment: 1000,
            insurance: 1000,
            investment: 1000,
            salary: 1000,

            expectedInterest: 21.9,
        },
        {
            name: "1st working adult",
            savings: 10000,
            spending: 200,
            loanInstallment: 0,
            insurance: 0,
            investment: 100,
            salary: 3500,
            expectedInterest: 210,
        },
    ]

    for (const test of tests) {
        it(test.name, () => {
            const result = dbs_multiplier_interest(NewProfile({
                Savings: test.savings,
                Spending: test.spending,
                LoanInstallment: test.loanInstallment,
                Insurance: test.insurance,
                Investment: test.investment,
                Salary: test.salary,
            }))
            expect(result).toEqual(new ResultInterest(test.expectedInterest, test.savings))
        })
    }
})