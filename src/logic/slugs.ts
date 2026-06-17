/**
 * Bank slug ↔ display name conversion.
 *
 * Slugs are derived by lowercasing the bank key and replacing spaces/special
 * chars with hyphens.  E.g.:
 *   "UOB One Account"   →  "uob-one-account"
 *   "Trust Bank (Zen)"   →  "trust-bank--zen-"
 *
 * These are used in URL paths (e.g. /bank/uob-bank) so we avoid encoding
 * issues and keep URLs human-readable.
 */

import { bankInfo } from "./constants";

/**
 * Sentinel slug returned by slugToBankName when the input slug
 * does not match any known bank.  Contains underscores so it
 * can never collide with a real slug (which only has hyphens).
 */
export const ERROR_SLUG = "__error__";

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
 * Returns the {@link ERROR_SLUG} sentinel when no bank matches.
 */
export function slugToBankName(slug: string): string {
  for (const name of Object.keys(bankInfo)) {
    if (bankNameToSlug(name) === slug) return name;
  }
  return ERROR_SLUG;
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
