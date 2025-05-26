import { calculate_ir } from "./common.ts";
import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";

export const mariInterestRate_pre_06_2025 = 2.28;

export const maribank_interest_pre_06_2025 = (profile: Profile): ResultInterest => {
    return calculate_ir(
        Math.min(profile.Savings, 100_000),
        { cutoffs: [], baseRatePercent: mariInterestRate_pre_06_2025 },
    );
}


export const mariInterestRate = 1.88;

export const maribank_interest = (profile: Profile): ResultInterest => {
    return calculate_ir(
        Math.min(profile.Savings, 100_000),
        { cutoffs: [], baseRatePercent: mariInterestRate },
    );
}