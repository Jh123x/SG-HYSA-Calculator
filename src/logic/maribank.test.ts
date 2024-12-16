import { ResultInterest } from "../types/interest_result";
import { NewProfile } from "../types/profile";
import { maribank_interest } from "./maribank";

describe("Maribank interest rates", () => {
    for (var i = 0; i < 200_000; i += 10000) {
        it(`balance ${i} should be correct`, () => {
            const result = maribank_interest(NewProfile({ Savings: i, }))
            expect(result.toYearlyPercent()).toEqual(2.7)
            if (i > 100_000) {
                expect(result).toEqual(new ResultInterest(100_000 * 0.027, 100_000))
            } else {
                expect(result).toEqual(new ResultInterest(i * 0.027, i))
            }
        })
    }
})
