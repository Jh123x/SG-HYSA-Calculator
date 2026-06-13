import { bankInfo } from "../../logic/constants";
import { deriveCurrentFromHistory } from "../../logic/history";
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
 * One line per bank. The label includes the bank name and its last-updated date.
 * Colors cycle through the lineColors palette.
 */
export function buildComparisonSeries(
  selectedBanks: string[],
  metric: YAxisMetric,
): ChartSeriesItem[] {
  return selectedBanks.map((bankName, idx) => {
    const info = bankInfo[bankName];
    const { lastUpdated } = info
      ? deriveCurrentFromHistory(info.history)
      : { lastUpdated: "" };
    const dataKey = `${bankName}_${metric}`;

    return {
      dataKey,
      label: `${bankName} (last: ${lastUpdated})`,
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
