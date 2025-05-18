import { ResultInterest } from "../types/interest_result.ts";
import Profile from "../types/profile";
import { calculate_ir } from "./common.ts";

export const gxs_interest = (profile: Profile): ResultInterest => {
    const { Savings } = profile
    if (Savings < 200) {
        return new ResultInterest(0, 0)
    }

    return calculate_ir(
        Savings > 95_000 ? 95_000 : Savings,
        {
            cutoffs: [
                { Cutoff: 60_000, InterestRatePercent: 2.58 }, // Boost Pocket
                { Cutoff: 35_000, InterestRatePercent: 1.68 }, // Base Interest rates
            ],
            baseRatePercent: 0,
        },
    )
}
