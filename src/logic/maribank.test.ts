import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { maribank_interest_09_2025, mariInterestRate_09_2025 } from "./maribank";

describe("Maribank interest rates", () => {
    for (var i = 0; i < 200_000; i += 10000) {
        it(`balance ${i} should be correct`, () => {
            const result = maribank_interest_09_2025(NewProfile({ Savings: i, }))
            expect(result.toYearlyPercent()).toBeCloseTo(mariInterestRate_09_2025)
            if (i > 100_000) {
                expect(result).toEqual(new ResultInterest(100_000 * mariInterestRate_09_2025 / 100, 100_000))
                return
            }

            expect(result).toEqual(new ResultInterest(i * mariInterestRate_09_2025 / 100, i))
        })
    }
})
