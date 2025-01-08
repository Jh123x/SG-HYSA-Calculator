import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { maribank_interest, mariInterestRate } from "./maribank";

describe("Maribank interest rates", () => {
    for (var i = 0; i < 200_000; i += 10000) {
        it(`balance ${i} should be correct`, () => {
            const result = maribank_interest(NewProfile({ Savings: i, }))
            expect(result.toYearlyPercent()).toEqual(mariInterestRate)
            if (i > 100_000) {
                expect(result).toEqual(new ResultInterest(100_000 * mariInterestRate / 100, 100_000))
            } else {
                expect(result).toEqual(new ResultInterest(i * mariInterestRate / 100, i))
            }
        })
    }
})
