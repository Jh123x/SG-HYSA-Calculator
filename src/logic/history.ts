import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";

/** A resolved snapshot ready for charting / display */
export interface ResolvedHistoryItem {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** EIR as a percentage number (e.g. 2.50 for 2.5%) */
  eir: number;
  /** Human-readable description of the change */
  changeSummary: string;
}

/** Zero-interest fallback function for banks with no history entries yet. */
const ZERO_INTEREST = (_profile: Profile): ResultInterest =>
  new ResultInterest(0, 0);

/** The resolved "current" state for a bank: its interest function + when it was last updated. */
export interface DerivedCurrent {
  interestFn: (profile: Profile) => ResultInterest;
  lastUpdated: string;
}

/**
 * Derive the "current" interest function and last-updated date from the
 * last entry in a bank's rate history array.
 *
 * When history is empty (bank not yet active / coming soon), returns a
 * zero-interest fallback so the bank still renders without crashing.
 */
export function deriveCurrentFromHistory(
  history: RateSnapshot[],
): DerivedCurrent {
  if (history.length === 0) {
    return {
      interestFn: ZERO_INTEREST,
      lastUpdated: "Coming soon",
    };
  }
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
 *
 * When history is empty, returns a single "Coming soon" placeholder.
 */
export function resolveHistoryForChart(
  history: RateSnapshot[],
  profile: Profile,
): ResolvedHistoryItem[] {
  if (history.length === 0) {
    return [
      {
        date: "TBD",
        eir: 0,
        changeSummary: "Coming soon",
      },
    ];
  }
  return history.map((snapshot) => ({
    date: snapshot.effectiveDate,
    eir: Number(
      snapshot.interestFn(profile).toYearlyPercent().toFixed(2),
    ),
    changeSummary: snapshot.changeSummary,
  }));
}