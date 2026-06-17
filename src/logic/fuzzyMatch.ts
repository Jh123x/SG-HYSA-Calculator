/**
 * Fuzzy-matching for unknown bank slugs.
 *
 * When a user navigates to /bank/<unknown-slug>, we compute the
 * Levenshtein (edit) distance against every known bank slug and
 * return the closest match — if it’s close enough.
 */

import { banks, type BankData, BANK_SLUGS } from "../data/banks";

/**
 * Levenshtein edit distance between two strings.
 *
 * O(m·n) time, O(n) space (single-row optimisation).
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  // Small-string fast-path: one string is empty
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    const ai = a[i - 1];
    for (let j = 1; j <= n; j++) {
      const cost = ai === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1, // insertion
        prev[j] + 1, // deletion
        prev[j - 1] + cost, // substitution
      );
    }
    prev = curr;
  }
  return prev[n];
}

/**
 * Search criteria for {@link findClosestBank}.
 */
export interface FuzzyResult {
  bank: BankData;
  slug: string;
  /** Edit distance between the query slug and the matched slug. */
  distance: number;
}

/**
 * Find the closest known bank slug to `query` by edit distance.
 *
 * Returns `null` when:
 * - `query` is empty
 * - the closest distance exceeds the threshold (50 % of query length,
 *   minimum 3)
 */
export function findClosestBank(query: string): FuzzyResult | null {
  if (!query || query.length === 0) return null;

  let best: FuzzyResult | null = null;

  for (const candidate of BANK_SLUGS) {
    const dist = levenshtein(query, candidate);
    if (best === null || dist < best.distance) {
      best = { bank: banks[candidate], slug: candidate, distance: dist };
    }
  }

  if (!best) return null;

  // Threshold: ≤ max(3, ceil(50 % of query length))
  const threshold = Math.max(3, Math.ceil(query.length * 0.5));
  return best.distance <= threshold ? best : null;
}
