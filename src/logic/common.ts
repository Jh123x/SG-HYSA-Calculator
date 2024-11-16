import { Interest } from "../types/interest.ts";
import { ResultInterest } from "../types/interest_result.ts";

export const calculate_ir = (savings, interest: Interest): ResultInterest => {
    var total_interest = 0;
    for( const {Cutoff, InterestRatePercent} of interest.cutoffs){
        if (savings <= Cutoff) {
            total_interest += savings * InterestRatePercent/100
            break
        }
        savings -= Cutoff
        total_interest += Cutoff * InterestRatePercent / 100
    }

    return new ResultInterest(total_interest + savings * interest.baseRatePercent / 100)
}