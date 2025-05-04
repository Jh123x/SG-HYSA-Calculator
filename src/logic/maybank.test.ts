import { ResultInterest } from "../types/interest_result"
import Profile, { NewProfile } from "../types/profile"
import { maybank_save_up } from "./maybank"


interface testCase {
    caseName: string
    profile: Profile

    expectedResult: number
}

describe("Maybank Save Up Interest rates", () => {
    const testCases: Array<testCase> = [
        {
            caseName: "No $$ is empty",
            profile: NewProfile({}),
            expectedResult: 0,
        },
        {
            caseName: "1k + Save only",
            profile: NewProfile({
                Savings: 1000,
                Salary: 2000,
            }),
            expectedResult: 3.5,
        },
        {
            caseName: "5k + Spending",
            profile: NewProfile({
                Savings: 5000,
                Spending: 500,
            }),
            expectedResult: 21.5,
        },
        {
            caseName: "10k + Invest",
            profile: NewProfile({
                Savings: 10_000,
                Investment: 25_000,
            }),
            expectedResult: 49,
        },
        {
            caseName: "20k + Insure",
            profile: NewProfile({
                Savings: 20_000,
                Insurance: 5000,
            }),
            expectedResult: 104
        },
        {
            caseName: "30k + Loan",
            profile: NewProfile({
                Savings: 30_000,
                LoanInstallment: 10_000,
            }),
            expectedResult: 159
        },
        {
            caseName: "50k 2 product",
            profile: NewProfile({
                Savings: 50_000,
                LoanInstallment: 10_000,
                Insurance: 5000,
            }),
            expectedResult: 619,
        },
        {
            caseName: "50k 3 product",
            profile: NewProfile({
                Savings: 50_000,
                LoanInstallment: 10_000,
                Insurance: 5000,
                Salary: 2000,
            }),
            expectedResult: 1494,
        },
        {
            caseName:"75k > 3 products",
            profile: NewProfile({
                Savings: 75_000,
                LoanInstallment: 10_000,
                Spending: 500,
                Insurance: 5000,
                Salary: 2000,
            }),
            expectedResult: 2494,
        }
    ]

    for (const tc of testCases) {
        it(tc.caseName, () => {
            const result = maybank_save_up(tc.profile)
            expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.profile.Savings))
        })
    }
})