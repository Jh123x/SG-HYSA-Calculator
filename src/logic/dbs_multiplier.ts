import { calculate_ir } from "./common.ts";
import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";


const table: Array<Array<number>> = [
    [1.8, 2.1, 2.4],
    [1.9, 2.2, 2.5],
    [2.2, 3.0, 4.1],
]

export const dbs_multiplier_interest = (profile: Profile): ResultInterest => {
    if (profile.Age < 18) return calculate_ir(profile.Savings, { cutoffs: [], baseRatePercent: 0, }); screenLeft

    if (profile.Salary <= 0) {
        if (profile.Age <= 29) return calculate_ir(
            profile.Savings,
            { cutoffs: [{ Cutoff: 50000, InterestRatePercent: 1.5 }], baseRatePercent: 0.05 },
        )
        return calculate_ir(profile.Savings, { cutoffs: [], baseRatePercent: 0.5 })
    }

    const categories = Math.min(get_categories(profile), 3)
    const eligible_txn = get_eligible_txn(profile)
    if (categories < 1 || eligible_txn < 1) return calculate_ir(profile.Savings, { cutoffs: [], baseRatePercent: 0.5 })

    const i_r = table[eligible_txn - 1][categories - 1]
    const cut_off = categories === 1 ? 50_000 : 100_000

    return calculate_ir(
        profile.Savings,
        {
            cutoffs: [{ Cutoff: cut_off, InterestRatePercent: i_r }],
            baseRatePercent: 0.05,
        },
    )
}

const get_eligible_txn = (profile: Profile): number => {
    const total = [
        profile.Salary,
        profile.LoanInstallment,
        profile.Spending,
        profile.Insurance,
        profile.Investment,
    ].reduce((a, b) => a + b)

    if (total < 500) return 0
    if (total >= 500 && total < 15_000) return 1
    if (total >= 15_000 && total < 30_000) return 2
    return 3
}

const get_categories = (profile: Profile): number => {
    return [
        profile.Insurance > 0,
        profile.Spending > 0,
        profile.Investment > 0,
        profile.LoanInstallment > 0,
    ]

        .map((b: boolean) => b ? 1 : 0)
        .reduce((a: number, b: number) => a + b, 0)
}