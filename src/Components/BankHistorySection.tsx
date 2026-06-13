import { useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { textColor, bgColor, dangerColor } from "../consts/colors";
import { bankInfo } from "../logic/constants";
import type Profile from "../types/profile";
import { resolveHistoryForChart } from "../logic/history";
import { formatDate } from "../logic/dates";
import { bankNameToSlug } from "../logic/slugs";

interface BankHistorySectionProps {
  bankName: string;
  profile: Profile;
}

/**
 * Detail section for a single bank shown in the History tab.
 * Displays the rate change log table + a link to the full detail page.
 *
 * When `bankInfo` has no entry for the bank, an error placeholder is shown
 * instead of silently rendering nothing.
 */
export const BankHistorySection = ({
  bankName,
  profile,
}: BankHistorySectionProps) => {
  const navigate = useNavigate();
  const info = bankInfo[bankName];

  // ── Error fallback: bank not found in bankInfo ──
  if (!info) {
    return (
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: "10px",
          backgroundColor: bgColor,
          mb: 2,
          border: `1px solid ${dangerColor}40`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            component="span"
            sx={{ color: dangerColor, fontWeight: 700, fontSize: 18 }}
          >
            !
          </Typography>
          <Typography variant="body2" sx={{ color: textColor, opacity: 0.8 }}>
            Unable to load history for "{bankName}". The bank may have been
            removed or renamed.
          </Typography>
        </Box>
      </Paper>
    );
  }

  const resolved = resolveHistoryForChart(info.history, profile);

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: "10px",
        backgroundColor: bgColor,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: textColor, fontWeight: 600 }}>
          {bankName}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          endIcon={<OpenInNewIcon />}
          onClick={() => navigate(`/bank/${bankNameToSlug(bankName)}`)}
          sx={{
            color: textColor,
            borderColor: `${textColor}40`,
            textTransform: "none",
            fontSize: "0.75rem",
          }}
        >
          View Full Page
        </Button>
      </Box>

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
  );
};
