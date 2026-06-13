import { useParams, useNavigate } from "react-router-dom";
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
import HomeIcon from "@mui/icons-material/Home";
import { textColor, bgColor, primaryColor, lineColors } from "../consts/colors";
import { bankInfo } from "../logic/constants";
import { slugToBankName, ERROR_SLUG } from "../logic/slugs";
import { resolveHistoryForChart } from "../logic/history";
import { formatDate } from "../logic/dates";
import { InterestVsSavingsChart, type ChartLine } from "../Components/InterestVsSavingsChart";
import type Profile from "../types/profile";

interface BankDetailPageProps {
  profile: Profile;
}

/**
 * Bank detail page at /bank/:slug.
 *
 * Shows:
 * - Summary card (bank name, current rate, last update)
 * - Time-series chart of yearly interest ($) vs savings across historical snapshots
 * - Full rate change log table
 * - Back navigation that restores previous query params
 */
export const BankDetailPage = ({ profile }: BankDetailPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const bankName = slug ? slugToBankName(slug) : ERROR_SLUG;

  // Unknown bank — show error page with reset option
  if (bankName === ERROR_SLUG || !bankInfo[bankName]) {
    return (
      <Paper
        sx={{
          p: 4,
          borderRadius: "10px",
          backgroundColor: bgColor,
          textAlign: "center",
          mt: 3,
        }}
      >
        <Typography variant="h5" color={textColor} sx={{ mb: 2 }}>
          Bank Not Found
        </Typography>
        <Typography variant="body1" color={textColor} sx={{ mb: 3, opacity: 0.7 }}>
          The bank you're looking for doesn't exist or may have been removed.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ color: textColor, borderColor: `${textColor}40` }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{ backgroundColor: primaryColor, color: "#fff" }}
          >
            Go to Calculator
          </Button>
        </Box>
      </Paper>
    );
  }

  const info = bankInfo[bankName];
  const resolved = resolveHistoryForChart(info.history, profile);

  // Latest snapshot (first chronologically, usable interestFn)
  const sortedHistory = [...info.history].sort(
    (a, b) =>
      new Date(a.effectiveDate).getTime() -
      new Date(b.effectiveDate).getTime(),
  );

  // Build chart lines: one per historical snapshot
  const chartLines: ChartLine[] = sortedHistory.map((snapshot, idx) => ({
    dataKey: snapshot.effectiveDate,
    label: snapshot.effectiveDate,
    interestFn: snapshot.interestFn,
    color: lineColors[idx % lineColors.length],
  }));

  const handleBack = () => {
    navigate(-1);
  };

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

      {/* Time-series chart: yearly interest ($) vs savings, all historical snapshots overlaid */}
      {info.history.length > 0 && (
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
            Interest vs Savings Over Time
          </Typography>
          <InterestVsSavingsChart
            lines={chartLines}
            profile={profile}
            height={400}
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
            * Each line represents a different rate snapshot. The legend label is
            the date the snapshot became effective.
            <br />
            ** The "updated at" date reflects when this calculator was updated,
            which may differ from the date the bank published the change.
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
