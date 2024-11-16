import { calculate_ir } from "./common.ts";
import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";

export const maribank_interest = (profile: Profile): ResultInterest => {
    return calculate_ir(profile.Savings, {
        cutoffs: [],
        baseRatePercent: 2.7,
    })
}