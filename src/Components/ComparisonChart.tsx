import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { textColor, lineColors, bgColor } from "../consts/colors";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import type Profile from "../types/profile";

type YAxisMetric = "yearlyInterest" | "eir";

interface ComparisonChartProps {
  selectedBanks: string[];
  profile: Profile;
}

/**
 * Time-series step chart comparing yearly interest ($) or EIR (%) across
 * selected banks over time.
 *
 * - X-axis: time (proportional gaps between dates via time scale)
 * - Y-axis: yearly interest ($) or EIR (%)
 * - Lines: stepAfter curve — flat until the next rate change, then a vertical step
 * - Forward-fill: each bank's current rate is shown at every other bank's
 *   change dates so users can compare rates at any point in time.
 * - Toggle between yearly interest ($) and EIR (%)
 */
export const ComparisonChart = ({
  selectedBanks,
  profile,
}: ComparisonChartProps) => {
  const [metric, setMetric] = useState<YAxisMetric>("yearlyInterest");

  const { dataset, series } = useMemo(() => {
    if (selectedBanks.length === 0) return { dataset: [], series: [] };

    // ── 1. Collect all (date, bankName, yearlyInterest, eir) tuples ──
    // Group by bank, sorted by date ascending
    const bankPoints: Record<
      string,
      Array<{ date: string; yearlyInterest: number; eir: number }>
    > = {};

    for (const bankName of selectedBanks) {
      const info = bankInfo[bankName];
      if (!info) continue;

      bankPoints[bankName] = info.history
        .map((snapshot) => {
          const result = snapshot.interestFn(profile);
          return {
            date: snapshot.effectiveDate,
            yearlyInterest: result.toYearly(),
            eir: parseFloat(result.toYearlyPercent().toFixed(2)),
          };
        })
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
    }

    // ── 2. All unique dates across selected banks, sorted ──
    const allDates = [
      ...new Set(
        Object.values(bankPoints).flatMap((pts) => pts.map((p) => p.date)),
      ),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (allDates.length === 0) return { dataset: [], series: [] };

    // ── 3. Build dataset: forward- and back-fill each bank's value to every date ──
    // For dates before a bank's first data point, use the earliest known rate.
    // For dates after a bank's last data point, use the latest known rate.
    const datasetArr = allDates.map((date) => {
      const row: Record<string, number | Date | null> = {
        date: new Date(date),
      };

      for (const bankName of selectedBanks) {
        const pts = bankPoints[bankName];
        if (!pts || pts.length === 0) continue;

        // Find the latest point with date ≤ current date (forward-fill)
        let valueYearly: number | null = null;
        let valueEir: number | null = null;
        for (let i = pts.length - 1; i >= 0; i--) {
          if (pts[i].date <= date) {
            valueYearly = pts[i].yearlyInterest;
            valueEir = pts[i].eir;
            break;
          }
        }

        // Back-fill: if no point ≤ date, use the earliest known rate
        if (valueYearly === null) {
          valueYearly = pts[0].yearlyInterest;
          valueEir = pts[0].eir;
        }

        row[`${bankName}_yearlyInterest`] = valueYearly;
        row[`${bankName}_eir`] = valueEir;
      }

      return row;
    });

    // ── 4. Build series: one stepAfter line per bank ──
    const seriesArr = selectedBanks.map((bankName, idx) => {
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
            ? (v: number | null) =>
                v !== null ? `$${v.toFixed(2)}` : ""
            : (v: number | null) =>
                v !== null ? `${v.toFixed(2)}%` : "",
      };
    });

    return { dataset: datasetArr, series: seriesArr };
  }, [selectedBanks, profile, metric]);

  if (selectedBanks.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          borderRadius: "10px",
          backgroundColor: bgColor,
          textAlign: "center",
          mb: 3,
        }}
      >
        <Typography variant="body1" color={textColor} sx={{ opacity: 0.7 }}>
          Select banks above to compare their rate history.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "10px",
        backgroundColor: bgColor,
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: textColor, fontWeight: 600 }}>
          Rate History Comparison
        </Typography>
        <ToggleButtonGroup
          value={metric}
          exclusive
          size="small"
          onChange={(_, v) => v && setMetric(v)}
        >
          <ToggleButton
            value="yearlyInterest"
            sx={{
              color: textColor,
              fontSize: "0.75rem",
              "&.Mui-selected": { color: "#fff" },
            }}
          >
            Yearly Interest ($)
          </ToggleButton>
          <ToggleButton
            value="eir"
            sx={{
              color: textColor,
              fontSize: "0.75rem",
              "&.Mui-selected": { color: "#fff" },
            }}
          >
            EIR (%)
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <LineChart
        dataset={dataset}
        xAxis={[
          {
            dataKey: "date",
            label: "Date",
            scaleType: "time",
            tickLabelStyle: {
              angle: 45,
              textAnchor: "start",
              fontSize: 11,
            },
          },
        ]}
        series={series}
        yAxis={[
          {
            label:
              metric === "yearlyInterest" ? "Yearly Interest ($)" : "EIR (%)",
            scaleType: "linear",
            min: 0,
            valueFormatter:
              metric === "yearlyInterest"
                ? (v) => `$${v / 1000}k`
                : (v) => `${v.toFixed(1)}%`,
          },
        ]}
        height={350}
        grid={{ vertical: true, horizontal: true }}
        slotProps={{
          legend: {
            direction: "horizontal",
            position: { vertical: "bottom", horizontal: "center" },
          },
        }}
        sx={{
          ".MuiChartsAxis-label": { fill: textColor },
          ".MuiChartsAxis-tick": { fill: textColor },
          ".MuiChartsLegend-label": { fill: textColor },
        }}
      />

      <Typography
        variant="caption"
        sx={{
          color: textColor,
          display: "block",
          textAlign: "left",
          mt: 1,
          opacity: 0.6,
        }}
      >
        * The &ldquo;updated at&rdquo; date reflects when this calculator was
        updated, which may differ from the date the bank published the change.
      </Typography>
    </Paper>
  );
};
