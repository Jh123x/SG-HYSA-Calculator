import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";
import { calculate_ir } from "./common.ts";

export const stand_chart_interest = (profile: Profile): ResultInterest => {
    const { Savings, Salary, Spending, GiroTransactions, Insurance, Investment } = profile
    var interest = 0.05;

    if (Salary >= 3000) {
        interest += 2
    }

    if (Spending >= 500 && Spending <= 1999) {
        interest += 0.65
    } else if (Spending >= 2000) {
        interest += 1.4
    }

    if (GiroTransactions >= 3) {
        interest += 0.23
    }

    if (Insurance >= 12000) {
        interest += 2
    }

    if (Investment >= 30000) {
        interest += 2
    }

    return calculate_ir(Savings, {
        cutoffs: [{ Cutoff: 100000, InterestRatePercent: interest },],
        baseRatePercent: 0.05
    })
}