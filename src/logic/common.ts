import { Interest } from "../types/interest.ts";
import { ResultInterest } from "../types/interest_result.ts";

export const calculate_ir = (savings: number, interest: Interest): ResultInterest => {
    var total_interest = 0;
    for (const { Cutoff, InterestRatePercent } of interest.cutoffs) {
        const irDecimal = InterestRatePercent / 100
        if (savings <= Cutoff) {
            return new ResultInterest(total_interest + savings * irDecimal)
        }

        savings -= Cutoff
        total_interest += Cutoff * irDecimal
    }

    return new ResultInterest(total_interest + savings * interest.baseRatePercent / 100)
}