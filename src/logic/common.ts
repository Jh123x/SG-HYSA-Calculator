import { Interest } from "../types/interest";
import { ResultInterest } from "../types/interest_result";

/**
 * Calculate interest for cumulative (additive) tiered rates.
 *
 * Each cutoff consumes savings sequentially. The `baseRatePercent` applies
 * to any remaining balance after all cutoffs are exhausted.
 *
 * For **flat (non-additive) tiered** products (where the entire balance
 * earns a single rate based on its tier), pass the rate as `baseRatePercent`
 * with an empty `cutoffs` array.
 *
 * ## Precision
 *
 * Results are returned at full floating-point precision. No rounding is
 * applied — display-layer consumers handle `.toFixed(2)` independently.
 *
 * @param savings  Total savings principal.
 * @param interest The tiered rate structure.
 * @returns        A ResultInterest with full-precision yearly interest.
 */
export const calculate_ir = (
  savings: number,
  interest: Interest,
): ResultInterest => {
  let total_interest = 0;
  const total_savings = savings;
  let remaining = savings;

  for (const { Cutoff, InterestRatePercent } of interest.cutoffs) {
    const irDecimal = InterestRatePercent / 100;
    if (remaining <= Cutoff) {
      return new ResultInterest(
        total_interest + remaining * irDecimal,
        total_savings,
      );
    }

    remaining -= Cutoff;
    total_interest += Cutoff * irDecimal;
  }

  return new ResultInterest(
    total_interest + (remaining * interest.baseRatePercent) / 100,
    total_savings,
  );
};
