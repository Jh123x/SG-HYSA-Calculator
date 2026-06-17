/**
 * Fuzzy-matching for unknown bank slugs.
 *
 * When a user navigates to /bank/<unknown-slug>, we compute the
 * Jaro-Winkler similarity against every known bank slug and return
 * the closest match — if it's close enough.
 *
 * Jaro-Winkler is chosen over Levenshtein because it heavily weights
 * common prefixes, making short acronyms like "UOB" match
 * "uob-one-account" strongly rather than falling back to a shorter
 * but unrelated target like the homepage.
 */

import { banks, type BankData, BANK_SLUGS } from "../data/banks";

// ── Jaro-Winkler similarity ──────────────────────────────────────────

/**
 * Jaro similarity between two strings.
 *
 * Returns 0–1 where 1 = identical.
 *
 * Measures matching characters within a sliding window and penalises
 * transpositions (out-of-order matches).
 */
export function jaro(a: string, b: string): number {
  // Case-insensitive comparison for slug matching
  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a === b) return 1;
  const m = a.length;
  const n = b.length;
  if (m === 0 || n === 0) return 0;

  // Matching window: how far apart characters can be to still count
  const window = Math.max(0, Math.floor(Math.max(m, n) / 2) - 1);

  const aMatches = new Array<boolean>(m).fill(false);
  const bMatches = new Array<boolean>(n).fill(false);

  let matches = 0;

  for (let i = 0; i < m; i++) {
    const lo = Math.max(0, i - window);
    const hi = Math.min(n - 1, i + window);
    for (let j = lo; j <= hi; j++) {
      if (!bMatches[j] && a[i] === b[j]) {
        aMatches[i] = true;
        bMatches[j] = true;
        matches++;
        break;
      }
    }
  }

  if (matches === 0) return 0;

  // Count transpositions (matched chars in different order)
  let transpositions = 0;
  let bIdx = 0;
  for (let i = 0; i < m; i++) {
    if (!aMatches[i]) continue;
    while (bIdx < n && !bMatches[bIdx]) bIdx++;
    if (bIdx < n && a[i] !== b[bIdx]) {
      transpositions++;
    }
    bIdx++;
  }

  const t = transpositions / 2;

  return (matches / m + matches / n + (matches - t) / matches) / 3;
}

/**
 * Jaro-Winkler similarity.
 *
 * Returns 0–1 where 1 = identical.
 *
 * Extends Jaro by boosting strings that share a common prefix (up to 4
 * characters). This is what makes "UOB" → "uob-one-account" score high.
 *
 * @param a        First string
 * @param b        Second string
 * @param scale    Prefix scaling factor (default 0.1, standard value)
 * @param maxPref  Maximum prefix length to consider (default 4)
 */
export function jaroWinkler(
  a: string,
  b: string,
  scale = 0.1,
  maxPref = 4,
): number {
  const j = jaro(a, b);
  if (j < 0.7) return j; // no boost for already-low scores

  // Normalise case for prefix comparison (jaro() already lowercases
  // internally, but prefix matching uses the raw a/b references)
  a = a.toLowerCase();
  b = b.toLowerCase();

  // Common prefix length
  let prefixLen = 0;
  const limit = Math.min(maxPref, a.length, b.length);
  for (let i = 0; i < limit; i++) {
    if (a[i] === b[i]) {
      prefixLen++;
    } else {
      break;
    }
  }

  return j + prefixLen * scale * (1 - j);
}

// ── Fuzzy bank lookup ────────────────────────────────────────────────

/** Minimum Jaro-Winkler score to consider a match valid. */
const MIN_SIMILARITY = 0.7;

export interface FuzzyResult {
  bank: BankData;
  slug: string;
  /** Jaro-Winkler similarity score (0–1). */
  similarity: number;
}

/**
 * Find the closest known bank slug to `query` by Jaro-Winkler similarity.
 *
 * Returns `null` when:
 * - `query` is empty
 * - the best similarity is below {@link MIN_SIMILARITY} (0.7)
 */
export function findClosestBank(query: string): FuzzyResult | null {
  if (!query || query.length === 0) return null;

  let best: FuzzyResult | null = null;

  for (const candidate of BANK_SLUGS) {
    const sim = jaroWinkler(query, candidate);
    if (best === null || sim > best.similarity) {
      best = { bank: banks[candidate], slug: candidate, similarity: sim };
    }
  }

  if (!best) return null;
  return best.similarity >= MIN_SIMILARITY ? best : null;
}
