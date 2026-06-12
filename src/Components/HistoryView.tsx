import { useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LineChart } from "@mui/x-charts/LineChart";
import { bankInfo } from "../logic/constants";
import { lineColors, textColor, bgColor } from "../consts/colors";
import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";

interface Props {
  profile: Profile;
}

/**
 * HistoryView shows interest rate history across all banks:
 * - A time-series chart of EIR% over time for the user's profile
 * - An expandable changelog per bank
 */
export const HistoryView = ({ profile }: Props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:640px)");

  // Build chart data: each bank with history contributes a line
  const { chartSeries, dataset } = useMemo(() => {
    const dateSet = new Set<string>();
    const banksWithHistory: {
      name: string;
      snapshots: { date: string; eir: number }[];
    }[] = [];

    Object.entries(bankInfo).forEach(([name, info]) => {
      if (!info.history || info.history.length === 0) return;

      const snapshots = info.history
        .map((s: RateSnapshot) => {
          const yearly = s.interestFn(profile).toYearlyPercent();
          dateSet.add(s.effectiveDate);
          return { date: s.effectiveDate, eir: Number(yearly.toFixed(2)) };
        })
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      banksWithHistory.push({ name, snapshots });
    });

    const allDatesSorted = Array.from(dateSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    // Build dataset: one row per date, columns = bank EIR values
    const dataset = allDatesSorted.map((date) => {
      const row: Record<string, string | number> = { date };
      banksWithHistory.forEach(({ name, snapshots }) => {
        const snap = snapshots.find((s) => s.date === date);
        row[name] = snap ? snap.eir : null;
      });
      return row;
    });

    const series = banksWithHistory.map(({ name }, idx) => ({
      dataKey: name,
      label: name,
      showMark: true,
      color: lineColors[idx % lineColors.length],
      valueFormatter: (v: number | null) =>
        v !== null ? `${v.toFixed(2)}%` : "",
    }));

    return { chartSeries: series, allDates: allDatesSorted, dataset };
  }, [profile]);

  if (isSmallScreen) {
    return (
      <Paper
        sx={{
          padding: "20px",
          borderRadius: "10px",
          boxShadow: theme.shadows[3],
          textAlign: "center",
          mt: 3,
        }}
      >
        <Typography variant="body1" color={textColor}>
          Please view on a larger screen to see the rate history charts.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Time-series chart */}
      {chartSeries.length > 0 && (
        <Paper
          sx={{
            padding: "30px",
            borderRadius: "10px",
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper,
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: textColor, mb: 2, fontWeight: 600 }}
          >
            Historical Effective Interest Rate (%)
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: textColor, mb: 2, opacity: 0.7 }}
          >
            EIR% calculated for your current profile ({profile.Savings
              ? `$${profile.Savings.toLocaleString()} savings`
              : "enter savings to see rates"}
            )
          </Typography>
          <LineChart
            dataset={dataset}
            xAxis={[
              {
                dataKey: "date",
                label: "Effective Date",
                scaleType: "band",
              },
            ]}
            series={chartSeries}
            yAxis={[
              {
                label: "EIR %",
                scaleType: "linear",
                valueFormatter: (v) => `${v}%`,
              },
            ]}
            height={450}
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
        </Paper>
      )}

      {/* Changelog per bank */}
      <Typography
        variant="h6"
        sx={{ color: textColor, mb: 2, fontWeight: 600 }}
      >
        Rate Change History
      </Typography>
      {Object.entries(bankInfo)
        .filter(([, info]) => info.history && info.history.length > 0)
        .map(([name, info]) => (
          <Accordion
            key={name}
            sx={{
              backgroundColor: bgColor,
              color: textColor,
              mb: 1,
              borderRadius: "8px !important",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
              <Chip
                label={`${info.history.length} changes`}
                size="small"
                sx={{ ml: 2, backgroundColor: lineColors[0], color: "#fff" }}
              />
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: textColor, fontWeight: 600 }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ color: textColor, fontWeight: 600 }}>
                        What Changed
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {info.history
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.effectiveDate).getTime() -
                          new Date(a.effectiveDate).getTime(),
                      )
                      .map((snapshot: RateSnapshot, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ color: textColor }}>
                            {snapshot.effectiveDate}
                          </TableCell>
                          <TableCell sx={{ color: textColor }}>
                            {snapshot.changeSummary}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
    </Box>
  );
};
