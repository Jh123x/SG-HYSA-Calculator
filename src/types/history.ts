import type { InterestFn } from "./interest";

/**
 * A single snapshot in a bank's interest rate history.
 * `effectiveDate` should be an ISO date string (YYYY-MM-DD).
 * `changeSummary` is a human-readable description of what changed from the previous snapshot.
 * `sourceUrl` is an optional link to the official rate announcement or changelog.
 */
export interface RateSnapshot {
  effectiveDate: string;
  interestFn: InterestFn;
  changeSummary: string;
  sourceUrl?: string;
}
