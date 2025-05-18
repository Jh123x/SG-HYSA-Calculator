import { ResultInterest } from "../types/interest_result"
import { NewProfile } from "../types/profile"
import { gxs_interest } from "./gxs"


interface testCase {
    caseName: string
    savings: number

    expectedResult: number
}


describe("GXS Interest rates", () => {
    const testCases: Array<testCase> = [
        {
            caseName: "No $$ is empty",
            savings: 0,
            expectedResult: 0,
        },
        {
            caseName: "Max boost pocket",
            savings: 60000,
            expectedResult: 1548,
        },
        {
            caseName: "Max amount deposited",
            savings: 95000,
            expectedResult: 2136,
        },
    ]

    for (const tc of testCases) {
        it(tc.caseName, () => {
            const result = gxs_interest(NewProfile({
                Savings: tc.savings,
            }))

            expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.savings))
        })
    }
})