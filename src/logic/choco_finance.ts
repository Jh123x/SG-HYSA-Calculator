import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";
import { calculate_ir } from "./common.ts";

export const choco_finance = (profile: Profile): ResultInterest => {
    return calculate_ir(profile.Savings, {
        cutoffs: [
            { Cutoff: 20000, InterestRatePercent: 3.3 },
            { Cutoff: 30000, InterestRatePercent: 3 },
        ],
        baseRatePercent: 0,
    })
}