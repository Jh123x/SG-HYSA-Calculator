/**
 * Bank registry — React-aware wrapper around {@link ../data/banks!banks}.
 *
 * Imports the pure data layer and adds JSX formatting to remarks via
 * {@link ./bankFormatter!formatRemarks}.
 *
 * Keys are URL-safe slugs (e.g. "uob-one-account").
 * For the display name use `bankInfo[slug].name`.
 */

import type { ReactElement } from "react";
import type { RateSnapshot } from "../types/history";
import { banks } from "../data/banks";
import { formatRemarks } from "./bankFormatter";

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
  bankInfo[slug] = {
    name: data.name,
    url: data.url,
    remarks: formatRemarks(data.remarks),
    history: data.history,
  };
}