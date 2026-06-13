import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";
import { ResultInterest } from "../types/interest_result";
import { parseISODate, todayISO, TBD_DATE } from "./dates";

/** A resolved snapshot ready for charting / display */
export interface ResolvedHistoryItem {
  /** Parsed date */
  date: Date;
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
 *
 * All effectiveDate strings are validated via parseISODate — a malformed
 * date will throw rather than silently produce wrong results.
 */
export function deriveCurrentFromHistory(
  history: RateSnapshot[],
): DerivedCurrent {
  const today = todayISO();

  // Walk backwards to find the latest entry that is not in the future.
  // effectiveDate is validated before comparison so invalid dates surface early.
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];

    // Validate the date before using it — throws on malformed strings
    parseISODate(entry.effectiveDate);

    if (entry.effectiveDate <= today) {
      return {
        interestFn: entry.interestFn,
        lastUpdated: entry.effectiveDate,
      };
    }
  }

  // Empty history or all entries are future-dated
  return {
    interestFn: ZERO_INTEREST,
    lastUpdated:
      history.length > 0
        ? `Effective ${history[0].effectiveDate}`
        : "Coming soon",
  };
}

/**
 * Resolve a bank's rate history into display-ready snapshots.
 *
 * Each RateSnapshot is computed against the profile to produce
 * EIR percentages for charts and changelogs.
 *
 * effectiveDate strings are validated via parseISODate — invalid
 * dates will throw an error.
 *
 * When history is empty, returns a single "Coming soon" placeholder
 * with a zero-date (epoch).
 */
export function resolveHistoryForChart(
  history: RateSnapshot[],
  profile: Profile,
): ResolvedHistoryItem[] {
  if (history.length === 0) {
    return [
      {
        date: TBD_DATE,
        yearlyInterest: 0,
        eir: 0,
        changeSummary: "Coming soon",
      },
    ];
  }
  return history.map((snapshot) => {
    // Validate date — throws on malformed strings
    const date = parseISODate(snapshot.effectiveDate);

    const result = snapshot.interestFn(profile);
    return {
      date,
      yearlyInterest: result.toYearly(),
      eir: Number(result.toYearlyPercent().toFixed(2)),
      changeSummary: snapshot.changeSummary,
    };
  });
}
