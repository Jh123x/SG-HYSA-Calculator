/**
 * ResultInterest — the result of an interest calculation.
 *
 * ## Precision policy
 *
 * Values are stored at **meaningful decimal precision** (10 decimal places).
 * This eliminates IEEE 754 floating-point representation noise (~1e-15)
 * while preserving all meaningful digits — the smallest practical value is
 * $1 × 0.1875% = $0.001875 (6 decimal places).
 *
 * Early rounding to 2 decimal places is **not** applied — that must happen
 * at the display layer. All UI consumers already call `.toFixed(2)` at
 * render time. If you need a rounded value programmatically, use
 * `toYearlyRounded()`.
 *
 * ## Mutability
 *
 * This class is mutable. `addInterest()` modifies the instance in place.
 * Do NOT reuse ResultInterest instances across independent computations
 * (Citibank is the only current consumer of addInterest).
 */
export class ResultInterest {
  private yearly_interest: number;
  private savings: number;

  /**
   * @param yearly  Yearly interest in SGD. Stored at 10dp to eliminate
   *                IEEE 754 noise while preserving sub-cent precision.
   * @param savings The savings principal used for this calculation.
   */
  constructor(yearly: number, savings: number) {
    // Round to 10 decimal places to eliminate IEEE 754 floating-point
    // representation noise (~1e-15) while preserving all meaningful
    // precision. Interest rates produce at most ~6dp at $1 savings.
    this.yearly_interest = Number(yearly.toFixed(10));
    this.savings = savings;
  }

  /** Add interest to the yearly total (mutates this instance). */
  addInterest(no: number) {
    this.yearly_interest += no;
  }

  /** Effective interest rate as a percentage (e.g. 2.5 for 2.5% p.a.). */
  toYearlyPercent(): number {
    if (this.savings === 0) return 0;
    return (this.yearly_interest / this.savings) * 100;
  }

  /** Yearly interest in SGD (full precision). */
  toYearly(): number {
    return this.yearly_interest;
  }

  /** Yearly interest rounded to `decimals` decimal places. */
  toYearlyRounded(decimals: number = 2): number {
    return Number(this.yearly_interest.toFixed(decimals));
  }

  /** Monthly interest in SGD (yearly / 12, full precision). */
  toMonthly(): number {
    return this.yearly_interest / 12;
  }

  /** Daily interest in SGD (yearly / 365, full precision). */
  toDaily(): number {
    return this.yearly_interest / 365;
  }
}
