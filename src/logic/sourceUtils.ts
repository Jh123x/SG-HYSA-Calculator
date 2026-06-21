/**
 * Strips "Source: URL" suffix from change summary strings.
 * Some bank data entries embed source URLs as text at the end
 * of the changeSummary field (e.g. "...changed. Source: https://...")
 * This extracts them so they can be shown as action icons instead.
 */
export function stripSourceFromSummary(summary: string): {
  text: string;
  sourceUrl: string | null;
} {
  const match = summary.match(/\s*Source:\s*(https?:\/\/\S+)\s*$/);
  if (match) {
    return {
      text: summary.slice(0, match.index).trimEnd(),
      sourceUrl: match[1],
    };
  }
  return { text: summary, sourceUrl: null };
}
