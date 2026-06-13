/**
 * Bank slug ↔ display name conversion.
 *
 * Slugs are derived by lowercasing the bank key and replacing spaces/special
 * chars with hyphens.  E.g.:
 *   "UOB Bank"           →  "uob-bank"
 *   "Trust Bank (Zen)"   →  "trust-bank--zen-"
 *
 * These are used in URL paths (e.g. /bank/uob-bank) so we avoid encoding
 * issues and keep URLs human-readable.
 */

import { bankInfo } from "./constants";

/**
 * Convert a bank display name (the key in `bankInfo`) to a URL-safe slug.
 */
export function bankNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")  // sequences of non-alnum → single hyphen
    .replace(/^-+|-+$/g, "");     // trim leading/trailing hyphens
}

/**
 * Convert a URL slug back to the bank display name.
 * Returns `undefined` when the slug is unknown.
 */
export function slugToBankName(slug: string): string | undefined {
  for (const name of Object.keys(bankInfo)) {
    if (bankNameToSlug(name) === slug) return name;
  }
  return undefined;
}

/**
 * Pre-computed slug → bank name map for fast lookup.
 */
export const SLUG_MAP: Record<string, string> = Object.keys(bankInfo).reduce(
  (acc, name) => {
    acc[bankNameToSlug(name)] = name;
    return acc;
  },
  {} as Record<string, string>,
);
