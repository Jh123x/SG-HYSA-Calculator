import { Interest } from "../types/interest.ts";
import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";

export const calculate_ir = (savings: number, interest: Interest): ResultInterest => {
    var total_interest = 0;
    const total_savings = savings
    for (const { Cutoff, InterestRatePercent } of interest.cutoffs) {
        const irDecimal = InterestRatePercent / 100
        if (savings <= Cutoff) {
            return new ResultInterest(total_interest + savings * irDecimal, total_savings)
        }

        savings -= Cutoff
        total_interest += Cutoff * irDecimal
    }

    return new ResultInterest(total_interest + savings * interest.baseRatePercent / 100, total_savings)
}

export const placeholder_ir = (profile: Profile): ResultInterest => {
    return new ResultInterest(0, 0)
}