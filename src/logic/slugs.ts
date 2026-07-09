/**
 * Bank slug utilities.
 *
 * Banks are now keyed by slug (e.g. "uob-one-account") in the data
 * layer, so slug ↔ display name conversion is a simple lookup in the
 * bank registry.
 */

import { banks } from "../data/banks";

/**
 * Sentinel slug returned by slugToBankName when the input slug
 * does not match any known bank.  Contains underscores so it
 * can never collide with a real slug (which only has hyphens).
 */
export const ERROR_SLUG = "__error__";

/**
 * Convert a bank slug to its display name.
 * Returns the {@link ERROR_SLUG} sentinel when no bank matches.
 */
export function slugToBankName(slug: string): string {
  const bank = banks[slug];
  return bank ? bank.name : ERROR_SLUG;
}

/**
 * Validate that a slug corresponds to a known bank.
 */
export function isValidSlug(slug: string): boolean {
  return slug in banks;
}

/** All known bank slugs. */
export const ALL_SLUGS = Object.keys(banks);
