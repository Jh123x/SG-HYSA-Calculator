import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LineChart } from "@mui/x-charts/LineChart";
import { textColor, bgColor, primaryColor, lineColors } from "../consts/colors";
import { bankInfo } from "../logic/constants";
import { slugToBankName, ERROR_SLUG } from "../logic/slugs";
import { resolveHistoryForChart } from "../logic/history";
import { formatDate } from "../logic/dates";
import type Profile from "../types/profile";

interface BankDetailPageProps {
  profile: Profile;
}

/**
 * Bank detail page at /bank/:slug.
 *
 * Shows:
 * - Summary card (bank name, current rate, last update)
 * - Time-series chart of EIR (%) over time
 * - Full rate change log table
 * - Back navigation that restores previous query params
 */
export const BankDetailPage = ({ profile }: BankDetailPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const bankName = slug ? slugToBankName(slug) : ERROR_SLUG;

  /**
   * Navigate back one step in history. When the user arrived directly
   * (e.g. typed the URL, opened a bookmark, or followed a link from
   * another site), there is no prior history entry — redirect to the
   * homepage instead of leaving the user stranded.
   *
   * React Router assigns key="default" to the initial page load entry;
   * all in-app navigations get a unique generated key.
   */
  const handleBack = () => {
    if (location.key === "default") {
      navigate("/", { replace: true });
    } else {
      navigate(-1);
    }
  };

  // Unknown bank — redirect to homepage
  useEffect(() => {
    if (bankName === ERROR_SLUG || !bankInfo[bankName]) {
      navigate("/", { replace: true });
    }
  }, [bankName, navigate]);

  if (bankName === ERROR_SLUG || !bankInfo[bankName]) {
    return null;
  }

  const info = bankInfo[bankName];
  const resolved = resolveHistoryForChart(info.history, profile);

  // Build time-series dataset for EIR chart (sorted chronologically,
  // excluding TBD entries where date is epoch zero)
  const eirChartData = resolved
    .filter((r) => r.date.getTime() !== 0)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((r) => ({
      date: r.date,
      eir: r.eir,
    }));

  return (
    <Box sx={{ mt: 3 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{
          color: textColor,
          mb: 2,
          textTransform: "none",
          "&:hover": { color: primaryColor },
        }}
      >
        Back
      </Button>

      {/* Summary card */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "10px",
          backgroundColor: bgColor,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: textColor, fontWeight: 700, mb: 1 }}>
          {bankName}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {resolved.length > 0 && resolved[resolved.length - 1].date.getTime() !== 0 && (
            <Chip
              label={`Current EIR: ${resolved[resolved.length - 1].eir.toFixed(2)}%`}
              size="small"
              sx={{ backgroundColor: primaryColor, color: "#fff", fontWeight: 600 }}
            />
          )}
          <Chip
            label={`${info.history.length} rate snapshot${info.history.length !== 1 ? "s" : ""}`}
            size="small"
            variant="outlined"
            sx={{ color: textColor, borderColor: `${textColor}30` }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: textColor, opacity: 0.7 }}>
          {info.remarks}
        </Typography>
      </Paper>

      {/* Time-series chart: EIR (%) over time */}
      {eirChartData.length > 0 && (
        <Paper
          sx={{
            p: 3,
            borderRadius: "10px",
            backgroundColor: bgColor,
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: textColor, fontWeight: 600, mb: 2 }}
          >
            Interest Rate Over Time
          </Typography>
          <LineChart
            dataset={eirChartData}
            xAxis={[
              {
                dataKey: "date",
                label: "Date",
                scaleType: "time",
                tickLabelStyle: {
                  angle: 45,
                  textAnchor: "start" as const,
                  fontSize: 11,
                },
              },
            ]}
            series={[
              {
                dataKey: "eir",
                label: bankName,
                color: lineColors[0],
                showMark: true,
                curve: "stepAfter",
                valueFormatter: (v: number | null) =>
                  v !== null ? `${v.toFixed(2)}%` : "",
              },
            ]}
            yAxis={[
              {
                label: "EIR (%)",
                scaleType: "linear",
                min: 0,
                valueFormatter: (v: number) => `${v.toFixed(1)}%`,
              },
            ]}
            height={400}
            grid={{ vertical: true, horizontal: true }}
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
            * Interest rate changes over time. EIR is calculated based on your
            current savings amount (${profile.Savings.toLocaleString()}).
            <br />
            ** The &ldquo;updated at&rdquo; date reflects when this calculator
            was updated, which may differ from the date the bank published the
            change.
          </Typography>
        </Paper>
      )}

      {/* Full rate change log */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "10px",
          backgroundColor: bgColor,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: textColor, fontWeight: 600, mb: 2 }}
        >
          Rate Change History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: textColor, fontWeight: 600 }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: textColor, fontWeight: 600 }}>
                  What Changed
                </TableCell>
                <TableCell
                  sx={{ color: textColor, fontWeight: 600, textAlign: "right" }}
                >
                  Yearly Interest
                </TableCell>
                <TableCell
                  sx={{ color: textColor, fontWeight: 600, textAlign: "right" }}
                >
                  EIR
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resolved
                .sort(
                  (a, b) => b.date.getTime() - a.date.getTime(),
                )
                .map((snapshot, idx) => {
                  const isTbd = snapshot.date.getTime() === 0;
                  return (
                  <TableRow key={idx}>
                    <TableCell sx={{ color: textColor }}>
                      {isTbd ? "TBD" : formatDate(snapshot.date)}
                    </TableCell>
                    <TableCell sx={{ color: textColor }}>
                      {snapshot.changeSummary}
                    </TableCell>
                    <TableCell sx={{ color: textColor, textAlign: "right" }}>
                      {isTbd
                        ? "—"
                        : `$${snapshot.yearlyInterest.toFixed(2)}`}
                    </TableCell>
                    <TableCell sx={{ color: textColor, textAlign: "right" }}>
                      {isTbd
                        ? "—"
                        : `${snapshot.eir.toFixed(2)}%`}
                    </TableCell>
                  </TableRow>
                );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};