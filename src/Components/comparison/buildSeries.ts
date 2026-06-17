import { bankInfo } from "../../logic/constants";
import { lineColors } from "../../consts/colors";

type YAxisMetric = "yearlyInterest" | "eir";

export interface ChartSeriesItem {
  dataKey: string;
  label: string;
  showMark: boolean;
  color: string;
  curve: "stepAfter";
  valueFormatter: (v: number | null) => string;
}

/**
 * Build the MUI LineChart series array for the comparison chart.
 *
 * One line per bank. Colors cycle through the lineColors palette.
 * Labels use bank display names.
 */
export function buildComparisonSeries(
  selectedBanks: string[],
  metric: YAxisMetric,
): ChartSeriesItem[] {
  return selectedBanks.map((slug, idx) => {
    const dataKey = `${slug}_${metric}`;

    return {
      dataKey,
      label: bankInfo[slug]?.name ?? slug,
      showMark: true,
      color: lineColors[idx % lineColors.length],
      curve: "stepAfter" as const,
      valueFormatter:
        metric === "yearlyInterest"
          ? (v: number | null) => (v !== null ? `$${v.toFixed(2)}` : "")
          : (v: number | null) => (v !== null ? `${v.toFixed(2)}%` : ""),
    };
  });
}
