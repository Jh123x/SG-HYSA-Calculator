import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { choco_finance } from "./choco_finance";

interface TestCase {
    name: string
    savings: number
    expected_ir: number
}

describe("Choco Finance", () => {
    const tests: Array<TestCase> = [
        {
            name: "should return the correct i/r for < 20k",
            savings: 1000,
            expected_ir: 36,
        },
        {
            name: "should return the correct i/r for 20k",
            savings: 20000,
            expected_ir: 720,
        },
        {
            name: "should return the correct i/r for > 20k and < 50k",
            savings: 30000,
            expected_ir: 1040,
        },
        {
            name: "should return the correct i/r for 50k",
            savings: 50000,
            expected_ir: 1680,
        },
        {
            name: "should return the i/r for 50k for > 50k",
            savings: 100000,
            expected_ir: 1680,
        }
    ]

    for (const test of tests) {
        it(test.name, () => {
            const result = choco_finance(NewProfile({ Savings: test.savings }))
            expect(result).toEqual(new ResultInterest(test.expected_ir, test.savings))
        })
    }
})