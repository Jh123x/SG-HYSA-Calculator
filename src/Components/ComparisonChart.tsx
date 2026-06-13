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
 * Time-series overlay chart comparing yearly interest ($) or EIR (%) across
 * selected banks over time.
 *
 * - X-axis: date (chronological)
 * - Y-axis: yearly interest ($) or EIR (%)
 * - One line per selected bank, max 3
 * - Legend includes bank name + last updated date
 * - Toggle between yearly interest ($) and EIR (%)
 */
export const ComparisonChart = ({
  selectedBanks,
  profile,
}: ComparisonChartProps) => {
  const [metric, setMetric] = useState<YAxisMetric>("yearlyInterest");

  // Gather all unique dates across selected banks' histories
  const { dataset, series } = useMemo(() => {
    if (selectedBanks.length === 0) return { dataset: [], series: [] };

    // Collect (date, bankName, value) tuples from history
    const points: Array<{
      date: string;
      bankName: string;
      yearlyInterest: number;
      eir: number;
    }> = [];

    for (const bankName of selectedBanks) {
      const info = bankInfo[bankName];
      if (!info) continue;

      for (const snapshot of info.history) {
        const result = snapshot.interestFn(profile);
        points.push({
          date: snapshot.effectiveDate,
          bankName,
          yearlyInterest: result.toYearly(),
          eir: parseFloat(result.toYearlyPercent().toFixed(2)),
        });
      }
    }

    // Sort by date
    points.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Create dataset with one row per unique date
    const dateMap = new Map<
      string,
      Record<string, number> & { date: string }
    >();
    for (const p of points) {
      if (!dateMap.has(p.date)) {
        dateMap.set(p.date, { date: p.date } as Record<string, number> & {
          date: string;
        });
      }
      const row = dateMap.get(p.date)!;
      row[`${p.bankName}_yearlyInterest`] = p.yearlyInterest;
      row[`${p.bankName}_eir`] = p.eir;
    }

    const datasetArr = Array.from(dateMap.values());

    // Build series: one line per bank
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
        connectNulls: true,
        valueFormatter:
          metric === "yearlyInterest"
            ? (v: number | null) => (v !== null ? `$${v.toFixed(2)}` : "")
            : (v: number | null) => (v !== null ? `${v.toFixed(2)}%` : ""),
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
            scaleType: "band",
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
        * The "updated at" date reflects when this calculator was updated, which
        may differ from the date the bank published the change.
      </Typography>
    </Paper>
  );
};
