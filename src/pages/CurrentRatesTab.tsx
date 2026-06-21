import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableSortLabel,
  alpha,
  useMediaQuery,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Tooltip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { ResultProp } from "../types/props";
import { primaryColor, bgColor, textColor } from "../consts/colors";
import type Profile from "../types/profile";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { InterestGraph } from "../Components/InterestGraph";

type SortableColumns = "name" | "yearlyInterest" | "effectiveInterest";

const cellSx = {
  color: textColor,
  backgroundColor: bgColor,
  padding: { xs: "6px 8px", sm: "8px 14px" },
};

const SORT_ICON_SX = {
  "& .MuiTableSortLabel-icon": { color: `${textColor} !important` },
};

interface Props {
  profile: Profile;
}

/**
 * Current Rates tab — side-by-side graph + table on desktop, stacked on mobile.
 *
 * Desktop: InterestGraph (left, ~45%) | Sortable table (right, ~55%)
 * Mobile: Graph on top, card-based bank list below.
 */
export const CurrentRatesTab = ({ profile }: Props) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [orderBy, setOrderBy] = useState<SortableColumns | undefined>(undefined);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // Compute results for all banks
  const results: Record<string, ResultProp> = {};
  for (const [slug, info] of Object.entries(bankInfo)) {
    const { interestFn, lastUpdated } = deriveCurrentFromHistory(info.history);
    results[slug] = {
      interest: interestFn(profile),
      url: info.url,
      remarks: info.remarks,
      lastUpdated,
    };
  }

  const handleSort = (column: SortableColumns) => {
    if (orderBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
  };

  const sortedResults = Object.entries(results).sort((a, b) => {
    switch (orderBy) {
      case "name":
        return order === "asc"
          ? (bankInfo[a[0]]?.name ?? a[0]).localeCompare(bankInfo[b[0]]?.name ?? b[0])
          : (bankInfo[b[0]]?.name ?? b[0]).localeCompare(bankInfo[a[0]]?.name ?? a[0]);
      case "yearlyInterest":
        return order === "asc"
          ? a[1].interest.toYearly() - b[1].interest.toYearly()
          : b[1].interest.toYearly() - a[1].interest.toYearly();
      case "effectiveInterest":
        return order === "asc"
          ? a[1].interest.toYearlyPercent() - b[1].interest.toYearlyPercent()
          : b[1].interest.toYearlyPercent() - a[1].interest.toYearlyPercent();
      default:
        return 0;
    }
  });

  // ── Sortable table (shared by desktop side-by-side and mobile stacked) ──

  const renderDesktopTable = () => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "10px",
        overflow: "auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        flex: 1,
        minWidth: 0,
      }}
    >
      <Table
        aria-label="High yield savings account interest rate comparison table"
        size="small"
      >
        <TableHead>
          <TableRow
            sx={{
              color: textColor,
              backgroundColor: bgColor,
              "&:hover": { backgroundColor: bgColor },
            }}
          >
            <TableCell
              sx={{
                ...cellSx,
                cursor: "pointer",
                fontWeight: 600,
                "&:hover": { backgroundColor: alpha(primaryColor, 0.15) },
                transition: "background-color 0.3s ease",
              }}
            >
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleSort("name")}
                sx={SORT_ICON_SX}
              >
                Accounts
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                ...cellSx,
                cursor: "pointer",
                fontWeight: 600,
                "&:hover": { backgroundColor: alpha(primaryColor, 0.15) },
                transition: "background-color 0.3s ease",
              }}
            >
              <TableSortLabel
                active={orderBy === "yearlyInterest"}
                direction={orderBy === "yearlyInterest" ? order : "asc"}
                onClick={() => handleSort("yearlyInterest")}
                sx={SORT_ICON_SX}
              >
                Yearly Interest ($)
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                ...cellSx,
                cursor: "pointer",
                fontWeight: 600,
                "&:hover": { backgroundColor: alpha(primaryColor, 0.15) },
                transition: "background-color 0.3s ease",
              }}
            >
              <TableSortLabel
                active={orderBy === "effectiveInterest"}
                direction={orderBy === "effectiveInterest" ? order : "asc"}
                onClick={() => handleSort("effectiveInterest")}
                sx={SORT_ICON_SX}
              >
                EIR (%)
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...cellSx, fontWeight: 600, width: 60 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResults.map(([slug, interest]) => (
            <TableRow
              key={slug}
              hover
              sx={{
                color: textColor,
                backgroundColor: bgColor,
                "&:hover": { backgroundColor: alpha(primaryColor, 0.1) },
                transition: "background-color 0.3s ease",
              }}
            >
              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                {bankInfo[slug]?.name ?? slug}
              </TableCell>
              <TableCell sx={cellSx}>
                ${(interest.interest.toYearly() ?? 0).toFixed(2)}
              </TableCell>
              <TableCell sx={cellSx}>
                {(interest.interest.toYearlyPercent() ?? 0).toFixed(2)}%
              </TableCell>
              <TableCell sx={cellSx}>
                <Tooltip title="View details">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/bank/${slug}`)}
                    sx={{ color: primaryColor }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // ── Mobile card layout ──

  const renderMobileCards = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {sortedResults.map(([slug, interest]) => (
        <Card
          key={slug}
          sx={{
            backgroundColor: bgColor,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
          }}
        >
          <CardActionArea onClick={() => navigate(`/bank/${slug}`)}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography
                variant="subtitle1"
                sx={{ color: textColor, fontWeight: 600, mb: 1 }}
              >
                {bankInfo[slug]?.name ?? slug}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: textColor, opacity: 0.6 }}>
                    Yearly Interest
                  </Typography>
                  <Typography variant="body1" sx={{ color: textColor, fontWeight: 500 }}>
                    ${(interest.interest.toYearly() ?? 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" sx={{ color: textColor, opacity: 0.6 }}>
                    EIR
                  </Typography>
                  <Typography variant="body1" sx={{ color: textColor, fontWeight: 500 }}>
                    {(interest.interest.toYearlyPercent() ?? 0).toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box component="section" aria-label="Current interest rates comparison" sx={{ mt: 1 }}>
      {/* ── Side-by-side layout (desktop) ── */}
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "stretch",
          }}
        >
          {/* Graph column — left, 45% */}
          <Box sx={{ flex: "0 0 45%", minWidth: 0 }}>
            <InterestGraph profile={profile} height={380} />
          </Box>

          {/* Table column — right, 55% */}
          <Box
            sx={{
              flex: "1 1 55%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderDesktopTable()}
          </Box>
        </Box>
      )}

      {/* ── Stacked layout (mobile) ── */}
      {isMobile && (
        <>
          <InterestGraph profile={profile} height={350} />
          {renderMobileCards()}
        </>
      )}

      {/* Footer — centered asterisks */}
      <Typography
        variant="caption"
        sx={{
          color: textColor,
          mt: 2,
          display: "block",
          textAlign: "center",
          opacity: 0.7,
        }}
      >
        * Interest rates on their respective websites are subject to change
        without notice
        <br />
        ** Please do your own research before making any decisions, the numbers
        here serve as a guide.
        <br />
        *** Please ask around in your friend group for referrals to get
        additional bonuses, you can use the my referral code if your friends do
        not have any.
      </Typography>
    </Box>
  );
};
