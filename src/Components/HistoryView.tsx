import {
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ChartsReferenceLine } from "@mui/x-charts";
import { bankInfo } from "../logic/constants";
import { lineColors, textColor, bgColor } from "../consts/colors";
import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";
import { resolveHistoryForChart } from "../logic/history";
import { formatDate, TBD_DATE } from "../logic/dates";
import {
  InterestVsSavingsChart,
  type ChartLine,
} from "./InterestVsSavingsChart";

interface Props {
  profile: Profile;
}

/**
 * HistoryView shows per-bank interest rate history.
 * Each bank gets its own expandable accordion with:
 * - A time-series chart of yearly interest ($) at each historical date
 * - A table showing Date, Change Summary, Yearly Interest, and EIR
 */
export const HistoryView = ({ profile }: Props) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="h6"
        sx={{ color: textColor, mb: 2, fontWeight: 600 }}
      >
        Rate Change History
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: textColor, mb: 2, opacity: 0.7 }}
      >
        Interest calculated for your current profile (
        {profile.Savings
          ? `$${profile.Savings.toLocaleString()} savings`
          : "enter savings to see rates"}
        )
      </Typography>

      {Object.entries(bankInfo).map(([slug, info]) => (
        <BankAccordion
          key={slug}
          slug={slug}
          info={info}
          profile={profile}
        />
      ))}
    </Box>
  );
};

/** Single bank accordion: chart + table inside. */
const BankAccordion = ({
  slug,
  info,
  profile,
}: {
  slug: string;
  info: (typeof bankInfo)[string];
  profile: Profile;
}) => {
  const resolved = resolveHistoryForChart(info.history, profile);
  const hasData = info.history.length > 0;

  return (
    <Accordion
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        mb: 1,
        borderRadius: "8px !important",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600 }}>{info.name}</Typography>
        <Chip
          label={`${resolved.length} snapshot${resolved.length !== 1 ? "s" : ""}`}
          size="small"
          sx={{ ml: 2, backgroundColor: lineColors[0], color: "#fff" }}
        />
      </AccordionSummary>
      <AccordionDetails>
        {/* Per-bank chart: yearly interest ($) vs savings, one line per historical snapshot */}
        {hasData && info.history.length > 0 && (
          <BankHistoryChart history={info.history} profile={profile} />
        )}

        {/* Table: Date | What Changed | Yearly Interest | EIR */}
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
              {/* resolved is already chronologically sorted (oldest first);
                  reverse for display (latest first) */}
              {[...resolved]
                .reverse()
                .map((snapshot, idx) => {
                  const isTbd =
                    snapshot.date.getTime() === TBD_DATE.getTime();
                  return (
                  <TableRow key={idx}>
                    <TableCell sx={{ color: textColor }}>
                      {isTbd ? "TBD" : formatDate(snapshot.date)}
                    </TableCell>
                    <TableCell sx={{ color: textColor }}>
                      {snapshot.changeSummary}
                    </TableCell>
                    <TableCell
                      sx={{ color: textColor, textAlign: "right" }}
                    >
                      {isTbd
                        ? "—"
                        : `$${snapshot.yearlyInterest.toFixed(2)}`}
                    </TableCell>
                    <TableCell
                      sx={{ color: textColor, textAlign: "right" }}
                    >
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
      </AccordionDetails>
    </Accordion>
  );
};

/** Mini chart: yearly interest ($) vs savings, one line per historical snapshot. */
const BankHistoryChart = ({
  history,
  profile,
}: {
  history: RateSnapshot[];
  profile: Profile;
}) => {
  if (history.length === 0) return null;

  // history is already chronologically sorted (oldest first)
  const lines: ChartLine[] = history.map((snapshot, idx) => ({
    dataKey: snapshot.effectiveDate,
    label: snapshot.effectiveDate,
    interestFn: snapshot.interestFn,
    color: lineColors[idx % lineColors.length],
  }));

  return (
    <Box sx={{ mb: 3 }}>
      <InterestVsSavingsChart lines={lines} profile={profile} height={250}>
        <ChartsReferenceLine
          x={profile.Savings}
          label="Your savings"
          lineStyle={{
            stroke: lineColors[0],
            strokeWidth: 2,
            strokeDasharray: "6 3",
          }}
        />
      </InterestVsSavingsChart>
    </Box>
  );
};