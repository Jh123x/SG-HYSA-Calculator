import { ResultInterest } from "../types/interest_result"
import { stand_chart_interest_before_06_25, stand_chart_interest } from "./stand_chart"
import Profile, { NewProfile } from "../types/profile"

describe("Standard Chartered I/R", () => {
    const tests: {
        name: string
        profile: Profile
        expectedInterest: ResultInterest
    }[] = [
            {
                name: "should be correct for 100k balance with all interest rates",
                profile: NewProfile({
                    Savings: 100000,
                    Salary: 3000,
                    Spending: 1000,
                    Investment: 20000,
                    Insurance: 12000,
                }),
                expectedInterest: new ResultInterest(8050, 100000)
            },
            {
                name: "should be correct for 200k balance with all interest rates",
                profile: NewProfile({
                    Savings: 200000,
                    Salary: 3000,
                    Spending: 2000,
                    Investment: 30000,
                    Insurance: 12000,
                }),
                expectedInterest: new ResultInterest(8100, 200000)
            },
            {
                name: "should be correct for 200k no condition",
                profile: NewProfile({ Savings: 200000 }),
                expectedInterest: new ResultInterest(100, 200000),
            },
            {
                name: "should be correct for 100k balance with 2 req",
                profile: NewProfile({
                    Savings: 100000,
                    Salary: 3000,
                    Spending: 1000,
                }),
                expectedInterest: new ResultInterest(3050, 100000)
            },
            {
                name: "should be correct for 100k balance with no condition",
                profile: NewProfile({ Savings: 100_000, }),
                expectedInterest: new ResultInterest(50, 100_000)
            },
            {
                name: "should be correct for 100k balance with salary only",
                profile: NewProfile({
                    Savings: 100000,
                    Salary: 3000,
                }),
                expectedInterest: new ResultInterest(1550, 100000)
            },
            {
                name: "should be correct for 50k balance with salary only",
                profile: NewProfile({
                    Savings: 50000,
                    Salary: 3000,
                }),
                expectedInterest: new ResultInterest(775, 50000),
            },
            {
                name: "no money should have no interest",
                profile: NewProfile({}),
                expectedInterest: new ResultInterest(0, 0)
            }
        ]

    for (const testCase of tests) {
        it(testCase.name, () => {
            const result = stand_chart_interest(testCase.profile)
            expect(result).toEqual(testCase.expectedInterest)
        })
    }
})

describe("Standard Chartered Pre 06 25 Interest Rates", () => {
    const tests: {
        name: string
        profile: Profile
        expectedInterest: ResultInterest
    }[] = [
            {
                name: "should be correct for 100k balance with all interest rates",
                profile: NewProfile({
                    Savings: 100000,
                    Salary: 3000,
                    Spending: 2000,
                    Investment: 30000,
                    Insurance: 12000,
                    GiroTransactions: 3,
                }),
                expectedInterest: new ResultInterest(6050, 100000)
            },
            {
                name: "should be correct for 200k balance with all interest rates",
                profile: NewProfile({
                    Savings: 200000,
                    Salary: 3000,
                    Spending: 2000,
                    Investment: 30000,
                    Insurance: 12000,
                }),
                expectedInterest: new ResultInterest(6100, 200000)
            },
            {
                name: "should be correct for 200k no condition",
                profile: NewProfile({ Savings: 200000 }),
                expectedInterest: new ResultInterest(100, 200000),
            },
            {
                name: "should be correct for 100k balance with 2 req",
                profile: NewProfile({
                    Savings: 100000,
                    Salary: 3000,
                    Spending: 2000,
                }),
                expectedInterest: new ResultInterest(2050, 100000)
            },
            {
                name: "should be correct for 100k balance with no condition",
                profile: NewProfile({ Savings: 100_000, }),
                expectedInterest: new ResultInterest(50, 100_000)
            },
            {
                name: "should be correct for 100k balance with salary only",
                profile: NewProfile({
                    Savings: 100000,
                    Salary: 3000,
                }),
                expectedInterest: new ResultInterest(1050, 100000)
            },
            {
                name: "should be correct for 50k balance with salary only",
                profile: NewProfile({
                    Savings: 50000,
                    Salary: 3000,
                }),
                expectedInterest: new ResultInterest(525, 50000),
            },
            {
                name: "no money should have no interest",
                profile: NewProfile({}),
                expectedInterest: new ResultInterest(0, 0)
            }
        ]

    for (const testCase of tests) {
        it(testCase.name, () => {
            const result = stand_chart_interest_before_06_25(testCase.profile)
            expect(result).toEqual(testCase.expectedInterest)
        })
    }
})