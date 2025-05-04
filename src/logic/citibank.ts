import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile";
import { calculate_ir } from "./common.ts";

const baseInterest = 0.01

export const citi_wealth_first = (profile: Profile): ResultInterest => {

    // Minimum 250k savings and 18 year old
    if (profile.Savings < 250_000 || profile.Age < 18) return new ResultInterest(0, profile.Savings)

    var ir = baseInterest
    if (profile.Spending >= 250) ir += 1.5
    if (profile.Investment >= 50_000) ir += 1.5
    if (profile.Insurance >= 50_000) ir += 1.5
    if (profile.OneTimeLoan >= 500_000) ir += 1.5

    const additionalIr = profile.MonthlyAccIncrease * 0.015

    const result = calculate_ir(profile.Savings, {
        cutoffs: [
            { Cutoff: 250_000, InterestRatePercent: ir },
        ],
        baseRatePercent: 0.01,
    })

    result.addInterest(additionalIr)
    return result
}

