import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { maribank_new_interest, mariNewInterestRate } from "./maribank";

describe("Maribank interest rates", () => {
    for (var i = 0; i < 200_000; i += 10000) {
        it(`balance ${i} should be correct`, () => {
            const result = maribank_new_interest(NewProfile({ Savings: i, }))
            expect(result.toYearlyPercent()).toBeCloseTo(mariNewInterestRate)
            if (i > 100_000) {
                expect(result).toEqual(new ResultInterest(100_000 * mariNewInterestRate / 100, 100_000))
            } else {
                expect(result).toEqual(new ResultInterest(i * mariNewInterestRate / 100, i))
            }
        })
    }
})
