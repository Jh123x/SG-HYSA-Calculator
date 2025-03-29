import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile";
import { calculate_ir } from "./common.ts";

export const bank_of_china = (profile: Profile) => {
    const { Savings, Insurance, Spending, Salary, GiroTransactions } = profile;
    if (Savings < 1_500) return new ResultInterest(0, Savings);

    const baseInterest = getBaseInterest(Savings);
    var hasExtraSavingsInterest = false;
    var interest = baseInterest;

    if (Insurance > 120_000) interest += 2.4;
    if (Spending >= 500) interest += 0.5;

    if (Spending > 1500) {
        interest += 0.3;
        hasExtraSavingsInterest = true;
    }

    if (Salary >= 2000) {
        interest += 2.5
        hasExtraSavingsInterest = true;
    };

    if (Spending >= 90 && GiroTransactions >= 3) {
        interest += 0.9;
        hasExtraSavingsInterest = true;
    };

    return calculate_ir(
        Savings > 1_000_000 ? 1_000_000 : Savings,
        {
            cutoffs: [
                { Cutoff: 100_000, InterestRatePercent: interest }
            ],
            baseRatePercent: hasExtraSavingsInterest ? baseInterest + 0.6 : baseInterest,
        }
    )
}


const getBaseInterest = (savings: number): number => {
    if (savings < 5000) return 0.15;
    if (savings < 20_000) return 0.2;
    if (savings < 100_000) return 0.3;
    return 0.4;
}