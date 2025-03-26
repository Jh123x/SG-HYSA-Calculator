import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { dbs_multiplier_interest } from "./dbs_multiplier";

interface testCase {
    caseName: string

    savings: number
    salary: number
    age: number
    spending?: number
    loanInstallment?: number
    insurance?: number
    investment?: number

    expectedResult: number
}

describe("DBS Interest rates", () => {
    const testCases: Array<testCase> = [
        {
            caseName: "less than 18 year old not eligible",
            savings: 200_000,
            salary: 1800,
            spending: 500,
            age: 17,

            expectedResult: 0,
        },
        {
            caseName: "First Jobber",
            savings: 100_000,
            salary: 3500,
            spending: 200,
            investment: 100,
            age: 21,

            expectedResult: 2100
        },
        {
            caseName: "Married couple family (Rachel)",
            savings: 100_000,
            salary: 11_000,
            spending: 5000,
            loanInstallment: 3000,
            age: 25,

            expectedResult: 2200
        },
        {
            caseName: "Married couple family (Bryan)",
            savings: 100_000,
            salary: 11_000,
            spending: 3000,
            loanInstallment: 3000,
            insurance: 1000,
            age: 25,

            expectedResult: 2500
        },
        {
            caseName: "Full time NSF",
            savings: 50_000,
            salary: 755,
            spending: 100,
            age: 18,
            expectedResult: 900,
        },
        {
            caseName: "University Student",
            salary:0,
            spending: 100,
            savings: 50_000,
            age: 21,

            expectedResult: 750,
        },
        {
            caseName: "Retiree",
            savings: 100_000,
            salary: 700,
            spending: 200,
            age: 65,

            expectedResult: 900 + 25
        },
    ]
    for (const tc of testCases) {
        it(tc.caseName, () => {
            const result = dbs_multiplier_interest(NewProfile({
                Savings: tc.savings,
                Salary: tc.salary,
                Spending: tc.spending,
                Investment: tc.investment,
                Insurance: tc.insurance,
                Age: tc.age,
                LoanInstallment: tc.loanInstallment,
            }))

            expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.savings))
        })
    }
})