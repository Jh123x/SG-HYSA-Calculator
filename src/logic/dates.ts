/**
 * Safe date parsing and formatting utilities.
 *
 * All ISO date strings (YYYY-MM-DD) in the app are validated through
 * parseISODate before use, catching malformed inputs early.
 */

/**
 * Sentinel date used as a placeholder when a bank has no rate history.
 * Displayed as "TBD" / "Coming soon". Epoch (1970-01-01) is
 * intentionally zero so `getTime() === 0` acts as a fast isTbd check.
 */
export const TBD_DATE = new Date(0);

/**
 * Parse an ISO date string (YYYY-MM-DD) into a Date object.
 * Throws if the string does not strictly match the format or is
 * not a valid calendar date.
 */
export function parseISODate(dateStr: string): Date {
  // Strict format: YYYY-MM-DD (exactly 10 chars)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(`Invalid date string: "${dateStr}"`);
  }

  const [year, month, day] = dateStr.split("-").map(Number);

  // new Date(year, month-1, day) uses local time — reliable for validation
  const date = new Date(year, month - 1, day);

  // Verify the parsed date components match (catches Feb 30 → Mar 2 rollover)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid date string: "${dateStr}"`);
  }

  return date;
}

/**
 * Format a Date object back to an ISO date string (YYYY-MM-DD).
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Returns today's date as an ISO string (YYYY-MM-DD).
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}
