import { LineChart } from "@mui/x-charts/LineChart";
import { Box, type SxProps, type Theme } from "@mui/material";
import { lineColors, textColor, mutedColor, borderColor } from "../consts/theme";
import { useMobile } from "../hooks/useMobile";
import type Profile from "../types/profile";
import type { ResultInterest } from "../types/interest_result";

export interface ChartLine {
  dataKey: string;
  label: string;
  interestFn: (profile: Profile) => ResultInterest;
  color?: string;
}

/** Minimal type for MUI x-charts legend slot props (subset of ChartsLegendProps). */
interface LegendSlotProps {
  direction: "horizontal" | "vertical";
  position: { vertical: "top" | "bottom" | "middle"; horizontal: "start" | "end" | "center" };
  toggleVisibilityOnClick?: boolean;
}

interface Props {
  lines: ChartLine[];
  profile: Profile;
  /** Pixel height; when undefined the chart fills its container via flex */
  height?: number;
  /** Enable click-to-toggle behaviour on legend items (default true). */
  enableLegendToggle?: boolean;
  /** Optional children (e.g. ChartsReferenceLine) */
  children?: React.ReactNode;
  /** Optional sx to apply to the wrapper Box (used for flex fill) */
  containerSx?: SxProps<Theme>;
}

/**
 * Reusable savings-vs-yearly-interest chart.
 *
 * - X-axis: Savings ($0 — $200k)
 * - Y-axis: Yearly Interest ($), starts at 0
 * - One line per entry in `lines`
 * - When `enableLegendToggle` is true, clicking a legend label toggles
 *   that line on/off using MUI X Charts' built-in `toggleVisibilityOnClick`.
 */
export const InterestVsSavingsChart = ({
  lines,
  profile,
  height = 300,
  enableLegendToggle = true,
  children,
  containerSx,
}: Props) => {
  const { isCompact } = useMobile();

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
    showMark: false,
    hidden: idx >= 5,
    color: line.color ?? lineColors[idx % lineColors.length],
    valueFormatter: (v: number | null) =>
      v !== null ? `$${v.toFixed(2)}` : "",
  }));

  const legendSlotProps: LegendSlotProps = {
    direction: "vertical",
    position: { vertical: "middle", horizontal: "end" },
    ...(enableLegendToggle ? { toggleVisibilityOnClick: true } : {}),
  };

  return (
    <Box sx={containerSx}>
      <LineChart
        dataset={data}
        margin={{ right: isCompact ? 20 : 40 }}
        xAxis={[
          {
            dataKey: "savings",
            label: "Savings ($)",
            scaleType: "linear",
            valueFormatter: (v) => `$${v / 1000}k`,
            tickLabelStyle: { fill: mutedColor, fontSize: 12, fontWeight: 400 },
          },
        ]}
        series={series}
        yAxis={[
          {
            label: "Yearly Interest ($)",
            scaleType: "linear",
            min: 0,
            valueFormatter: (v) => `$${v / 1000}k`,
            tickLabelStyle: { fill: mutedColor, fontSize: 12, fontWeight: 400 },
          },
        ]}
        height={height}
        grid={{ vertical: true, horizontal: true }}
        slotProps={{
          legend: legendSlotProps,
        }}
        sx={{
          ".MuiChartsAxis-line": { stroke: borderColor },
          ".MuiChartsAxis-tick": { fill: mutedColor },
          ".MuiChartsAxis-label": { fill: mutedColor, fontSize: 12, fontWeight: 400 },
          ".MuiChartsLegend-label": { fill: mutedColor },
          "& .MuiChartsSurface-root": { background: "transparent" },
          ...(height === undefined ? { height: "100%", width: "100%" } : {}),
        }}
      >
        {children}
      </LineChart>
    </Box>
  );
};
