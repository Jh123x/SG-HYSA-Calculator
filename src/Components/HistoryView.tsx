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
import { LineChart } from "@mui/x-charts/LineChart";
import { bankInfo } from "../logic/constants";
import { lineColors, textColor, bgColor } from "../consts/colors";
import type Profile from "../types/profile";
import { resolveHistoryForChart } from "../logic/history";
import type { ResolvedHistoryItem } from "../logic/history";

interface Props {
  profile: Profile;
}

/**
 * HistoryView shows per-bank interest rate history:
 * each bank gets its own expandable accordion with a time-series chart
 * and a changelog table.
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
        EIR% calculated for your current profile (
        {profile.Savings
          ? `$${profile.Savings.toLocaleString()} savings`
          : "enter savings to see rates"}
        )
      </Typography>

      {Object.entries(bankInfo).map(([name, info]) => {
        const resolved = resolveHistoryForChart(info.history, profile);
        const hasData = info.history.length > 0;

        return (
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
                label={`${resolved.length} change${resolved.length !== 1 ? "s" : ""}`}
                size="small"
                sx={{ ml: 2, backgroundColor: lineColors[0], color: "#fff" }}
              />
            </AccordionSummary>
            <AccordionDetails>
              {hasData && <BankHistoryChart resolved={resolved} />}

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
                    {resolved
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .map((snapshot, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ color: textColor }}>
                            {snapshot.date}
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
        );
      })}
    </Box>
  );
};

/** Mini chart showing a single bank's EIR history over time. */
const BankHistoryChart = ({
  resolved,
}: {
  resolved: ResolvedHistoryItem[];
}) => {
  const chartData = resolved
    .map((s) => ({
      date: s.date,
      eir: s.eir,
      label: s.changeSummary,
    }))
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  if (chartData.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <LineChart
        dataset={chartData}
        xAxis={[
          {
            dataKey: "date",
            scaleType: "band",
          },
        ]}
        series={[
          {
            dataKey: "eir",
            showMark: true,
            color: lineColors[0],
            valueFormatter: (v: number | null) =>
              v !== null ? `${v.toFixed(2)}%` : "",
          },
        ]}
        yAxis={[
          {
            scaleType: "linear",
            valueFormatter: (v) => `${v}%`,
          },
        ]}
        height={200}
        grid={{ vertical: true, horizontal: true }}
        sx={{
          ".MuiChartsAxis-label": { fill: textColor },
          ".MuiChartsAxis-tick": { fill: textColor },
          ".MuiChartsLegend-label": { fill: textColor },
        }}
      />
    </Box>
  );
};
