import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";
import type { ResultInterest } from "../types/interest_result";

/** A resolved snapshot ready for charting / display */
export interface ResolvedHistoryItem {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** EIR as a percentage number (e.g. 2.50 for 2.5%) */
  eir: number;
  /** Human-readable description of the change */
  changeSummary: string;
}

/**
 * Derive the "current" interest function and last-updated date from the
 * last entry in a bank's rate history array.
 */
export function deriveCurrentFromHistory(
  history: RateSnapshot[],
): {
  interestFn: (profile: Profile) => ResultInterest;
  lastUpdated: string;
} {
  const latest = history[history.length - 1];
  return {
    interestFn: latest.interestFn,
    lastUpdated: latest.effectiveDate,
  };
}

/**
 * Resolve a bank's rate history into display-ready snapshots.
 *
 * Each RateSnapshot is computed against the profile to produce
 * EIR percentages for charts and changelogs.
 */
export function resolveHistoryForChart(
  history: RateSnapshot[],
  profile: Profile,
): ResolvedHistoryItem[] {
  return history.map((snapshot) => ({
    date: snapshot.effectiveDate,
    eir: Number(
      snapshot.interestFn(profile).toYearlyPercent().toFixed(2),
    ),
    changeSummary: snapshot.changeSummary,
  }));
}
