import { useState, useCallback } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box } from "@mui/material";
import { lineColors, textColor } from "../consts/colors";
import type Profile from "../types/profile";
import type { ResultInterest } from "../types/interest_result";

export interface ChartLine {
  dataKey: string;
  label: string;
  interestFn: (profile: Profile) => ResultInterest;
  color?: string;
}

interface Props {
  lines: ChartLine[];
  profile: Profile;
  height?: number;
  /** Enable click-to-toggle behaviour on legend items (default true). */
  enableLegendToggle?: boolean;
  /** Optional children (e.g. ChartsReferenceLine) */
  children?: React.ReactNode;
}

/**
 * Reusable savings-vs-yearly-interest chart.
 *
 * - X-axis: Savings ($0 — $200k)
 * - Y-axis: Yearly Interest ($), starts at 0
 * - One line per entry in `lines`
 * - When `enableLegendToggle` is true, clicking a legend label toggles
 *   that line on/off.
 */
export const InterestVsSavingsChart = ({
  lines,
  profile,
  height = 300,
  enableLegendToggle = true,
  children,
}: Props) => {
  // Track which series are hidden (by dataKey).  Clicking a legend
  // item toggles its visibility.
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  const handleLegendClick = useCallback(
    (_event: React.MouseEvent, legendItem: { id?: string }) => {
      // In @mui/x-charts, the legend onClick callback receives { id } where
      // id matches the `id` we set on each series.
      const key = legendItem.id;
      if (!key) return;
      setHiddenKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    [],
  );

  // Build data points from $0 to $200,000 in $10,000 steps
  const data: Record<string, number>[] = Array.from({ length: 21 }, (_, i) => {
    const savings = i * 10_000;
    const tmpProfile = { ...profile, Savings: savings };
    const point: Record<string, number> = { savings };
    lines.forEach((line) => {
      point[line.dataKey] = line.interestFn(tmpProfile).toYearly();
    });
    return point;
  });

  // Insert user's actual savings as a data point
  const userPoint: Record<string, number> = { savings: profile.Savings };
  lines.forEach((line) => {
    userPoint[line.dataKey] = line.interestFn(profile).toYearly();
  });
  const insertIndex = data.findIndex((p) => p.savings > profile.Savings);
  if (insertIndex >= 0) {
    data.splice(insertIndex, 0, userPoint);
  } else {
    data.push(userPoint);
  }

  const series = lines.map((line, idx) => ({
    id: line.dataKey,
    dataKey: line.dataKey,
    label: line.label,
    showMark: true,
    hidden: enableLegendToggle ? hiddenKeys.has(line.dataKey) : false,
    color: line.color ?? lineColors[idx % lineColors.length],
    valueFormatter: (v: number | null) =>
      v !== null ? `$${v.toFixed(2)}` : "",
  }));

  const legendSlotProps = enableLegendToggle
    ? ({
        direction: "horizontal" as const,
        position: { vertical: "bottom" as const, horizontal: "center" as const },
        onClick: handleLegendClick,
      } as any)
    : {
        direction: "horizontal" as const,
        position: { vertical: "bottom" as const, horizontal: "center" as const },
      };

  return (
    <Box>
      <LineChart
        dataset={data}
        xAxis={[
          {
            dataKey: "savings",
            label: "Savings ($)",
            scaleType: "linear",
            valueFormatter: (v) => `$${v / 1000}k`,
          },
        ]}
        series={series}
        yAxis={[
          {
            label: "Yearly Interest ($)",
            scaleType: "linear",
            min: 0,
            valueFormatter: (v) => `$${v / 1000}k`,
          },
        ]}
        height={height}
        grid={{ vertical: true, horizontal: true }}
        slotProps={{ legend: legendSlotProps } as any}
        sx={{
          ".MuiChartsAxis-label": { fill: textColor },
          ".MuiChartsAxis-tick": { fill: textColor },
          ".MuiChartsLegend-label": { fill: textColor },
        }}
      >
        {children}
      </LineChart>
    </Box>
  );
};