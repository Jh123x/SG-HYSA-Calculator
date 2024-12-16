import { calculate_ir } from "./common.ts";
import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile.ts";


const table: Array<Array<number>> = [
    [0.5, 0.5, 0.5, 0.5],
    [0.5, 1.8, 1.9, 2.2],
    [0.5, 2.1, 2.2, 3.0],
    [0.5, 2.4, 2.5, 4.1],
]

export const dbs_multiplier_interest = (profile: Profile): ResultInterest => {
    if (profile.Age > 18) return calculate_ir(profile.Savings, { cutoffs: [], baseRatePercent: 0 });

    if (profile.Salary <= 0) return calculate_ir(
        profile.Savings,
        { cutoffs: [{ Cutoff: 50000, InterestRatePercent: 1.5 }], baseRatePercent: 0.05 },
    )

    const categories = Math.min(get_categories(profile), 3)
    const eligible_txn = get_eligible_txn(profile)
    const i_r = table[categories][eligible_txn]
    const cut_off = categories === 1 ? 50_000 : 100_000

    return calculate_ir(
        profile.Savings,
        { cutoffs: [{ Cutoff: cut_off, InterestRatePercent: i_r }], baseRatePercent: 0.05 },
    )
}

const get_eligible_txn = (profile: Profile): number => {
    const total = [
        profile.LoanInstallment,
        profile.Savings,
        profile.Spending,
        profile.Insurance,
        profile.Investment,
    ].reduce((a, b) => a + b)

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