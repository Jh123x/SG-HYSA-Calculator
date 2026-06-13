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
 * history array.  When history is present the latest entry wins; otherwise
 * an explicit fallback is used.
 *
 * Usage in constants.tsx:
 *   "Bank Name": {
 *     ...deriveCurrentFromHistory(bankHistory, fallbackFn, "2025-01-01"),
 *     url: "...",
 *     remarks: "...",
 *     history: bankHistory,
 *   }
 *
 * This means adding a new RateSnapshot to the history array automatically
 * updates both the chart *and* the top-level current-rate display — no
 * manual syncing of interestFn or lastUpdated required.
 */
export function deriveCurrentFromHistory(
  history: RateSnapshot[],
  fallbackFn: (profile: Profile) => ResultInterest,
  fallbackDate: string,
): {
  interestFn: (profile: Profile) => ResultInterest;
  lastUpdated: string;
} {
  if (history.length > 0) {
    const latest = history[history.length - 1];
    return {
      interestFn: latest.interestFn,
      lastUpdated: latest.effectiveDate,
    };
  }
  return { interestFn: fallbackFn, lastUpdated: fallbackDate };
}

/**
 * Resolve a bank's rate history into display-ready snapshots.
 *
 * - Banks with recorded history: each RateSnapshot is computed against the profile.
 * - Banks with no history: a single entry is synthesized from the current
 *   interest function so they still appear in charts and changelogs.
 *
 * This keeps the resolution logic at the data layer — the UI just renders
 * whatever comes back.
 */
export function resolveHistoryForChart(
  history: RateSnapshot[],
  currentInterestFn: (profile: Profile) => { toYearlyPercent: () => number },
  lastUpdated: string,
  profile: Profile,
): ResolvedHistoryItem[] {
  if (history.length > 0) {
    return history.map((snapshot) => ({
      date: snapshot.effectiveDate,
      eir: Number(
        snapshot.interestFn(profile).toYearlyPercent().toFixed(2),
      ),
      changeSummary: snapshot.changeSummary,
    }));
  }

  // No recorded history — synthesize a single entry from the current rate.
  const currentEir = Number(
    currentInterestFn(profile).toYearlyPercent().toFixed(2),
  );

  return [
    {
      date: lastUpdated,
      eir: currentEir,
      changeSummary: "Current rate",
    },
  ];
}
