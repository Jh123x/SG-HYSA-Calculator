import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { textColor, bgColor, primaryColor } from "../consts/colors";
import { bankInfo } from "../logic/constants";
import type Profile from "../types/profile";
import { todayISO } from "../logic/dates";
import {
  collectBankPoints,
  collectAllDates,
  buildComparisonDataset,
} from "./comparison/buildDataset";
import { buildComparisonSeries } from "./comparison/buildSeries";
import { dateFormatter } from "../consts/formatter";

interface ComparisonChartProps {
  selectedBanks: string[];
  profile: Profile;
}

type ChartMode = "yearly" | "eir";

const BUTTON_SX = {
  color: textColor,
  borderColor: `${textColor}40`,
  textTransform: "none",
  fontSize: "0.8rem",
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: primaryColor,
  },
  "&.Mui-selected:hover": {
    backgroundColor: primaryColor,
    opacity: 0.9,
  },
};

/**
 * Time-series step chart comparing yearly interest ($) or EIR (%) across
 * selected banks over time. Users toggle between the two metrics via
 * button group.
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
      const names = unknown.map((s) => bankInfo[s]?.name ?? s);
      return { valid: false, error: "unknownBanks", banks: names } as const;
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
    <ComparisonChartContent selectedBanks={selectedBanks} profile={profile} />
  );
};

// ── Chart content (only mounted when validation passes) ───────────────

/** Shared x-axis config reused by both chart modes. */
const X_AXIS = [
  {
    dataKey: "date" as const,
    label: "Date",
    scaleType: "time" as const,
    tickLabelStyle: {
      angle: 45,
      textAnchor: "start" as const,
      fontSize: 11,
    },
    valueFormatter: dateFormatter,
  },
];

/** Shared axis label colour. */
const AXIS_SX = {
  ".MuiChartsAxis-label": { fill: textColor },
  ".MuiChartsAxis-tick": { fill: textColor },
  ".MuiChartsLegend-label": { fill: textColor },
};

const ComparisonChartContent = ({
  selectedBanks,
  profile,
}: ComparisonChartProps) => {
  const [chartMode, setChartMode] = useState<ChartMode>("yearly");

  const { dataset, yearlySeries, eirSeries } = useMemo(() => {
    const bankPoints = collectBankPoints(selectedBanks, profile);

    const allDates = collectAllDates(bankPoints);
    const today = todayISO();
    if (allDates.length > 0 && allDates[allDates.length - 1] !== today) {
      allDates.push(today);
    }

    if (allDates.length === 0)
      return { dataset: [], yearlySeries: [], eirSeries: [] };

    const datasetArr = buildComparisonDataset(
      selectedBanks,
      bankPoints,
      allDates,
    );

    const yearlySeriesArr = buildComparisonSeries(
      selectedBanks,
      "yearlyInterest",
    );
    const eirSeriesArr = buildComparisonSeries(selectedBanks, "eir");

    return {
      dataset: datasetArr,
      yearlySeries: yearlySeriesArr,
      eirSeries: eirSeriesArr,
    };
  }, [selectedBanks, profile]);

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

  const isYearly = chartMode === "yearly";
  const activeSeries = isYearly ? yearlySeries : eirSeries;
  const yLabel = isYearly ? "Yearly Interest ($)" : "EIR (%)";
  const yFormatter = isYearly
    ? (v: number) => `$${v / 1000}k`
    : (v: number) => `${v.toFixed(1)}%`;

  return (
    <>
      {/* ── Metric toggle ─────────────────────────────────────────── */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <ToggleButtonGroup
          value={chartMode}
          exclusive
          onChange={(_e, v) => v && setChartMode(v)}
          size="small"
        >
          <ToggleButton value="yearly" sx={BUTTON_SX}>
            Yearly Interest ($)
          </ToggleButton>
          <ToggleButton value="eir" sx={BUTTON_SX}>
            EIR (%)
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ── Chart ─────────────────────────────────────────────────── */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "10px",
          backgroundColor: bgColor,
          mb: 3,
        }}
      >
        <LineChart
          dataset={dataset}
          xAxis={X_AXIS}
          series={activeSeries}
          yAxis={[
            {
              label: yLabel,
              scaleType: "linear",
              min: 0,
              valueFormatter: yFormatter,
            },
          ]}
          height={400}
          grid={{ vertical: true, horizontal: true }}
          slotProps={{
            legend: {
              direction: "horizontal",
              position: { vertical: "bottom", horizontal: "center" },
            },
          }}
          sx={AXIS_SX}
        />
      </Paper>

      <Typography
        variant="caption"
        sx={{
          color: textColor,
          display: "block",
          textAlign: "left",
          mt: -2,
          mb: 3,
          opacity: 0.6,
        }}
      >
        * The &ldquo;updated at&rdquo; date reflects when this calculator was
        updated, which may differ from the date the bank published the change.
      </Typography>
    </>
  );
};
