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

/**
 * Map of slug → display name for all known banks.
 */
export const SLUG_MAP: Record<string, string> = Object.entries(banks).reduce(
  (acc, [slug, data]) => {
    acc[slug] = data.name;
    return acc;
  },
  {} as Record<string, string>,
);

/**
 * Convert a bank display name to a URL-safe slug.
 *
 * This is a lossy, one-way transformation used only when migrating
 * legacy display-name identifiers to slugs.  For new code, prefer
 * passing slugs directly.
 */
export function bankNameToSlug(name: string): string {
  // First try reverse lookup in the registry (exact match)
  for (const [slug, data] of Object.entries(banks)) {
    if (data.name === name) return slug;
  }

  // Fallback: compute slug from the display name using the same
  // algorithm that generated the original slugs.
  return name
    .toLowerCase()
    .replace(/\$/g, "s")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** All known bank slugs. */
export const ALL_SLUGS = Object.keys(banks);
