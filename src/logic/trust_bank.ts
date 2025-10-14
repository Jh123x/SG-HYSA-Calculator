import { ResultInterest } from "../types/interest_result";
import Profile from "../types/profile";
import { calculate_ir } from "./common.ts";


const baseInterest = 0.75

export const trust_bank_05_2025 = (profile: Profile): ResultInterest => {
    const { Savings, Salary, Spending, IsNTUCMember } = profile

    var currentInterest = baseInterest

    if (Spending >= 150) currentInterest += 0.4
    if (Spending >= 150 && IsNTUCMember) currentInterest += 0.35
    if (Savings >= 100_000) currentInterest += 0.5
    if (Salary >= 1500) currentInterest += 0.75


    return calculate_ir(
        Savings,
        {
            cutoffs: [{ Cutoff: 800_000, InterestRatePercent: currentInterest, }],
            baseRatePercent: baseInterest,
        }
    )
}

const newbaseInterest = 0.5

export const trust_bank_06_2025 = (profile: Profile): ResultInterest => {
    const { Savings, Salary, Spending, IsNTUCMember } = profile

    var currentInterest = newbaseInterest

    if (Spending >= 150) currentInterest += 0.3
    if (Spending >= 150 && IsNTUCMember) currentInterest += 0.2
    if (Savings >= 100_000) currentInterest += 0.75
    if (Salary >= 1500) currentInterest += 0.5


    return calculate_ir(
        Savings,
        {
            cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: currentInterest, }],
            baseRatePercent: 0.05,
        }
    )
}

export const trust_bank_08_2025 = (profile: Profile): ResultInterest => {
    const { Savings, Salary, Spending, IsNTUCMember } = profile

    var currentInterest = newbaseInterest

    if (Spending >= 150) currentInterest += 0.3
    if (Spending >= 150 && IsNTUCMember) currentInterest += 0.2
    if (Savings >= 100_000) currentInterest += 0.5
    if (Salary >= 1500) currentInterest += 0.5

    return calculate_ir(
        Savings,
        {
            cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: currentInterest, }],
            baseRatePercent: 0.05,
        }
    )
}

export const trust_bank_signature_10_2025 = (profile: Profile): ResultInterest => {
    const { Savings, Salary, Spending, IsNTUCMember } = profile

    var currentInterest = 0.1

    if (Spending >= 150) currentInterest += 0.2
    if (Spending >= 150 && IsNTUCMember) currentInterest += 0.1
    if (Savings >= 100_000) currentInterest += 0.4
    if (Salary >= 1500) currentInterest += 0.5

    return calculate_ir(
        Savings,
        {
            cutoffs: [{ Cutoff: 1_200_000, InterestRatePercent: currentInterest, }],
            baseRatePercent: 0.05,
        }
    )
}