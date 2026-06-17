/**
 * Bank registry — React-aware wrapper around {@link ../data/banks!banks}.
 *
 * Imports the pure data layer and adds JSX formatting to remarks via
 * {@link ./bankFormatter!formatRemarks}.  The Mari current rate is computed
 * once at module load time and substituted into the remarks.
 *
 * Keys are URL-safe slugs (e.g. "uob-one-account").
 * For the display name use `bankInfo[slug].name`.
 */

import type { ReactElement } from "react";
import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";
import { banks } from "../data/banks";
import { formatRemarks } from "./bankFormatter";
import { deriveCurrentFromHistory } from "./history";
import { maribankHistory } from "./maribank";

// Pre-compute Mari current rate for the remarks placeholder
const mariCurrentRate = (() => {
  const { interestFn } = deriveCurrentFromHistory(maribankHistory);
  return interestFn({ Savings: 10000 } as Profile).toYearlyPercent().toFixed(2);
})();

// ── Types ────────────────────────────────────────────────────────────

export interface BankDef {
  /** Human-readable display name (e.g. "UOB One Account") */
  name: string;
  /** Official product page URL */
  url: string;
  /** Formatted remarks (plain string or JSX) */
  remarks: string | ReactElement;
  /** Chronologically sorted rate snapshots (oldest first) */
  history: RateSnapshot[];
}

// ── Registry (slug-keyed, with JSX remarks) ─────────────────────────

export const bankInfo: Record<string, BankDef> = {};

for (const [slug, data] of Object.entries(banks)) {
  const isMari = slug === "mari-savings-account";

  bankInfo[slug] = {
    name: data.name,
    url: data.url,
    remarks: isMari
      ? formatRemarks(data.remarks, mariCurrentRate)
      : formatRemarks(data.remarks),
    history: data.history,
  };
}
