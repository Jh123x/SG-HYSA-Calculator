import type Profile from "./profile";
import type { ResultInterest } from "./interest_result";

/**
 * A single snapshot in a bank's interest rate history.
 * `effectiveDate` should be an ISO date string (YYYY-MM-DD).
 * `changeSummary` is a human-readable description of what changed from the previous snapshot.
 */
export interface RateSnapshot {
  effectiveDate: string;
  interestFn: (profile: Profile) => ResultInterest;
  changeSummary: string;
}
