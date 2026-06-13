import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { textColor, bgColor } from "../consts/colors";
import { bankInfo } from "../logic/constants";
import type Profile from "../types/profile";
import { todayISO } from "../logic/dates";
import {
  collectBankPoints,
  collectAllDates,
  buildComparisonDataset,
} from "./comparison/buildDataset";
import { buildComparisonSeries } from "./comparison/buildSeries";

type YAxisMetric = "yearlyInterest" | "eir";

interface ComparisonChartProps {
  selectedBanks: string[];
  profile: Profile;
}

/**
 * Time-series step chart comparing yearly interest ($) or EIR (%) across
 * selected banks over time.
 *
 * Validation runs first — when it fails an error Paper is returned immediately.
 * The chart content (with its expensive data computation) is only mounted when
 * validation passes.
 */
export const ComparisonChart = ({
  selectedBanks,
  profile,
}: ComparisonChartProps) => {
  // ── Validation ──────────────────────────────────────────────────────
  const validation = useMemo(() => {
    if (selectedBanks.length === 0) {
      return { valid: false, error: "noBanks" } as const;
    }
    const unknown = selectedBanks.filter((b) => !bankInfo[b]);
    if (unknown.length > 0) {
      return { valid: false, error: "unknownBanks", banks: unknown } as const;
    }
    const noHistory = selectedBanks.filter(
      (b) => bankInfo[b] && bankInfo[b].history.length === 0,
    );
    if (noHistory.length === selectedBanks.length) {
      return { valid: false, error: "noHistory" } as const;
    }
    return { valid: true } as const;
  }, [selectedBanks]);

  // ── Error state — return early before mounting chart content ────────
  if (!validation.valid) {
    const msg =
      validation.error === "noBanks"
        ? "Select banks above to compare their rate history."
        : validation.error === "unknownBanks"
          ? `Unable to load data for: ${validation.banks?.join(", ")}.`
          : "Selected banks have no rate history data yet.";
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
          {msg}
        </Typography>
      </Paper>
    );
  }

  return (
    <ComparisonChartContent
      selectedBanks={selectedBanks}
      profile={profile}
    />
  );
};

// ── Chart content (only mounted when validation passes) ───────────────

const ComparisonChartContent = ({
  selectedBanks,
  profile,
}: ComparisonChartProps) => {
  const [metric, setMetric] = useState<YAxisMetric>("yearlyInterest");

  const { dataset, series } = useMemo(() => {
    const bankPoints = collectBankPoints(selectedBanks, profile);

    const allDates = collectAllDates(bankPoints);
    const today = todayISO();
    if (allDates.length > 0 && allDates[allDates.length - 1] !== today) {
      allDates.push(today);
    }

    if (allDates.length === 0) return { dataset: [], series: [] };

    const datasetArr = buildComparisonDataset(
      selectedBanks,
      bankPoints,
      allDates,
    );

    const seriesArr = buildComparisonSeries(selectedBanks, metric);

    return { dataset: datasetArr, series: seriesArr };
  }, [selectedBanks, profile, metric]);

  if (dataset.length === 0) {
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
          No rate data available for the selected banks.
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
