import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";
import { calculate_ir } from "./common.ts";

const baseInterest = 0.05

export const stand_chart_interest = (profile: Profile): ResultInterest => {
    const { Savings, Salary, Spending, Insurance, Investment } = profile
    var interest = baseInterest

    if (Salary >= 3000) interest += 1
    if (Spending >= 1000) interest += 1
    if (Insurance >= 12000) interest += 2
    if (Investment >= 30000) interest += 2

    return calculate_ir(
        Savings,
        {
            cutoffs: [{ Cutoff: 100_000, InterestRatePercent: interest }],
            baseRatePercent: baseInterest
        },
    )
}