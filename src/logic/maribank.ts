import { calculate_ir } from "./common.ts";
import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";

export const mariInterestRate = 2.5;

export const maribank_interest = (profile: Profile): ResultInterest => {
    return calculate_ir(
        Math.min(profile.Savings, 100_000),
        { cutoffs: [], baseRatePercent: mariInterestRate },
    );
}