import { calculate_ir } from "./common.ts";
import { Interest } from "../types/interest.ts";
import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";

const ir_cutoff: Array<Interest> = [
    // Spend 500 + Salary Credit
    {
        cutoffs: [
            { Cutoff: 75000, InterestRatePercent: 3 },
            { Cutoff: 50000, InterestRatePercent: 4.5 },
            { Cutoff: 25000, InterestRatePercent: 6 },
        ],
        baseRatePercent: 0.05
    },
    // Spend 500 + 3 Giro Transactions
    {
        cutoffs: [
            { Cutoff: 75000, InterestRatePercent: 2 },
            { Cutoff: 50000, InterestRatePercent: 3 },
        ],
        baseRatePercent: 0.05,
    },
    // Only Spend 500
    {
        cutoffs: [
            { Cutoff: 75000, InterestRatePercent: 0.65 },
        ],
        baseRatePercent: 0.05,
    },
    // Does not fulfill any criteria
    {
        cutoffs: [],
        baseRatePercent: 0.05,
    }
]

export const uob_interest = (profile: Profile): ResultInterest => {
    const { Savings, Spending, GiroTransactions, Salary } = profile

    if (Spending >= 500 && Salary >= 1600) {
        return calculate_ir(Savings, ir_cutoff[0])
    }

    if (Spending >= 500 && GiroTransactions >= 3) {
        return calculate_ir(Savings, ir_cutoff[1])
    }

    if (Spending >= 500) {
        return calculate_ir(Savings, ir_cutoff[2])
    }

    return calculate_ir(Savings, ir_cutoff[3])
}
