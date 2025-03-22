import { ResultInterest } from "../types/interest_result";
import Profile, { NewProfile } from "../types/profile";
import { trust_bank } from "./trust_bank";

interface testCases {
    name: string
    profile: Profile
    expectedInterest: ResultInterest
}

describe("trust_bank", () => {
    const tests: testCases[] = [
        {
            name: "no interest should return empty",
            profile: NewProfile({}),
            expectedInterest: new ResultInterest(0, 0),
        },
        {
            name: "max interest rate",
            profile: NewProfile({
                Savings: 800_000,
                Spending: 150,
                Salary: 1500,
                IsNTUCMember: true,
            }),
            expectedInterest: new ResultInterest(22_000, 800_000)
        },
        {
            name: "not ntuc member + 100k",
            profile: NewProfile({
                Savings: 100_000,
                Spending: 150,
                Salary: 1500,
                IsNTUCMember: false,
            }),
            expectedInterest: new ResultInterest(200 * 12, 100_000)
        },
        {
            name: "only spending + 100k",
            profile: NewProfile({ Savings: 100_000, Spending: 150 }),
            expectedInterest: new ResultInterest(137.5 * 12, 100_000)
        },
        {
            name: "only 100k",
            profile: NewProfile({ Savings: 100_000 }),
            expectedInterest: new ResultInterest(1250, 100_000)
        },
        {
            name: "only 50k",
            profile: NewProfile({ Savings: 50_000 }),
            expectedInterest: new ResultInterest(375, 50_000)
        }
    ]

    for (const testCase of tests) {
        it(testCase.name, () => {
            const result = trust_bank(testCase.profile)
            expect(result).toEqual(testCase.expectedInterest)
        })
    }
})
