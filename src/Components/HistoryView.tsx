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
  type Theme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { bankInfo } from "../logic/constants";
import { lineColors, textColor, bgColor } from "../consts/colors";
import type Profile from "../types/profile";
import type { RateSnapshot } from "../types/history";
import { resolveHistoryForChart } from "../logic/history";
import type { ResolvedHistoryItem } from "../logic/history";
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:640px)");

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

  return <HistoryViewContent profile={profile} theme={theme} />;
};

const HistoryViewContent = ({
  profile,
  theme,
}: {
  profile: Profile;
  theme: Theme;
}) => {
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

      {Object.entries(bankInfo).map(([name, info]) => (
        <BankAccordion
          key={name}
          name={name}
          info={info}
          profile={profile}
        />
      ))}
    </Box>
  );
};

/** Single bank accordion: chart + table inside. */
const BankAccordion = ({
  name,
  info,
  profile,
}: {
  name: string;
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
        <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
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
              {resolved
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .map((snapshot, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ color: textColor }}>
                      {snapshot.date}
                    </TableCell>
                    <TableCell sx={{ color: textColor }}>
                      {snapshot.changeSummary}
                    </TableCell>
                    <TableCell
                      sx={{ color: textColor, textAlign: "right" }}
                    >
                      {snapshot.date === "TBD"
                        ? "—"
                        : `$${snapshot.yearlyInterest.toFixed(2)}`}
                    </TableCell>
                    <TableCell
                      sx={{ color: textColor, textAlign: "right" }}
                    >
                      {snapshot.date === "TBD"
                        ? "—"
                        : `${snapshot.eir.toFixed(2)}%`}
                    </TableCell>
                  </TableRow>
                ))}
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

  const sorted = [...history].sort(
    (a, b) =>
      new Date(a.effectiveDate).getTime() -
      new Date(b.effectiveDate).getTime(),
  );

  const lines: ChartLine[] = sorted.map((snapshot, idx) => ({
    dataKey: snapshot.effectiveDate,
    label: snapshot.effectiveDate,
    interestFn: snapshot.interestFn,
    color: lineColors[idx % lineColors.length],
  }));

  return (
    <Box sx={{ mb: 3 }}>
      <InterestVsSavingsChart lines={lines} profile={profile} height={250} />
    </Box>
  );
};
