import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";

/** A resolved snapshot ready for charting / display */
export interface ResolvedHistoryItem {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Yearly interest in SGD (e.g. 1234.56) */
  yearlyInterest: number;
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
 * Derive the "current" interest function and last-updated date from a
 * bank's rate history array.
 *
 * Walks backwards through the (chronologically sorted) history to find
 * the latest entry whose effectiveDate is not in the future. This
 * prevents showing rates that haven't taken effect yet.
 *
 * When history is empty or all entries are future-dated, returns a
 * zero-interest fallback.
 */
export function deriveCurrentFromHistory(
  history: RateSnapshot[],
): DerivedCurrent {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Walk backwards to find the latest entry that is not in the future
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].effectiveDate <= today) {
      return {
        interestFn: history[i].interestFn,
        lastUpdated: history[i].effectiveDate,
      };
    }
  }

  // Empty history or all entries are future-dated
  return {
    interestFn: ZERO_INTEREST,
    lastUpdated: history.length > 0 ? `Effective ${history[0].effectiveDate}` : "Coming soon",
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
        yearlyInterest: 0,
        eir: 0,
        changeSummary: "Coming soon",
      },
    ];
  }
  return history.map((snapshot) => {
    const result = snapshot.interestFn(profile);
    return {
      date: snapshot.effectiveDate,
      yearlyInterest: result.toYearly(),
      eir: Number(result.toYearlyPercent().toFixed(2)),
      changeSummary: snapshot.changeSummary,
    };
  });
}