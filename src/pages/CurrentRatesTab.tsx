import { useState, useMemo } from "react";
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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import SortIcon from "@mui/icons-material/Sort";
import type { ResultProp } from "../types/props";
import { primaryColor, bgColor, textColor } from "../consts/colors";
import type Profile from "../types/profile";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { InterestGraph } from "../Components/InterestGraph";
import { Carousel } from "../Components/Carousel";

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

/** Sort dropdown options for mobile */
const SORT_OPTIONS: { value: SortableColumns | "default"; label: string }[] = [
  { value: "default", label: "Default order" },
  { value: "effectiveInterest", label: "EIR (highest first)" },
  { value: "yearlyInterest", label: "Yearly Interest (highest first)" },
  { value: "name", label: "Account name (A-Z)" },
];

/**
 * Current Rates tab:
 * - Desktop: side-by-side graph (45%) + sortable table (55%)
 * - Mobile: carousel (graph ↔ cards), sortable cards with action icons
 */
export const CurrentRatesTab = ({ profile }: Props) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [orderBy, setOrderBy] = useState<SortableColumns | undefined>(undefined);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [mobileSort, setMobileSort] = useState<SortableColumns | "default">("default");

  // Compute results for all banks
  const results = useMemo(() => {
    const map: Record<string, ResultProp> = {};
    for (const [slug, info] of Object.entries(bankInfo)) {
      const { interestFn } = deriveCurrentFromHistory(info.history);
      map[slug] = {
        interest: interestFn(profile),
        url: info.url,
        remarks: info.remarks,
        lastUpdated: undefined as unknown as string,
      };
    }
    return map;
  }, [profile]);

  const handleSort = (column: SortableColumns) => {
    if (orderBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
  };

  const sortedResults = useMemo(() => {
    return Object.entries(results).sort((a, b) => {
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
  }, [results, orderBy, order]);

  // Mobile-sorted results (from dropdown)
  const mobileSorted = useMemo(() => {
    const entries = Object.entries(results);
    switch (mobileSort) {
      case "effectiveInterest":
        return [...entries].sort(
          (a, b) => b[1].interest.toYearlyPercent() - a[1].interest.toYearlyPercent(),
        );
      case "yearlyInterest":
        return [...entries].sort(
          (a, b) => b[1].interest.toYearly() - a[1].interest.toYearly(),
        );
      case "name":
        return [...entries].sort((a, b) =>
          (bankInfo[a[0]]?.name ?? a[0]).localeCompare(bankInfo[b[0]]?.name ?? b[0]),
        );
      default:
        return entries;
    }
  }, [results, mobileSort]);

  // ── Desktop table ──
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
      <Table aria-label="High yield savings account interest rate comparison table" size="small">
        <TableHead>
          <TableRow sx={{ color: textColor, backgroundColor: bgColor }}>
            <TableCell
              onClick={() => handleSort("name")}
              sx={{
                ...cellSx,
                cursor: "pointer",
                fontWeight: 600,
                "&:hover": { backgroundColor: alpha(primaryColor, 0.15) },
              }}
            >
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                hideSortIcon={false}
                sx={SORT_ICON_SX}
              >
                Accounts
              </TableSortLabel>
            </TableCell>
            <TableCell
              onClick={() => handleSort("yearlyInterest")}
              sx={{
                ...cellSx,
                cursor: "pointer",
                fontWeight: 600,
                "&:hover": { backgroundColor: alpha(primaryColor, 0.15) },
              }}
            >
              <TableSortLabel
                active={orderBy === "yearlyInterest"}
                direction={orderBy === "yearlyInterest" ? order : "asc"}
                hideSortIcon={false}
                sx={SORT_ICON_SX}
              >
                Yearly Interest ($)
              </TableSortLabel>
            </TableCell>
            <TableCell
              onClick={() => handleSort("effectiveInterest")}
              sx={{
                ...cellSx,
                cursor: "pointer",
                fontWeight: 600,
                "&:hover": { backgroundColor: alpha(primaryColor, 0.15) },
              }}
            >
              <TableSortLabel
                active={orderBy === "effectiveInterest"}
                direction={orderBy === "effectiveInterest" ? order : "asc"}
                hideSortIcon={false}
                sx={SORT_ICON_SX}
              >
                EIR (%)
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ ...cellSx, fontWeight: 600, minWidth: 180 }}>
              Remarks
            </TableCell>
            <TableCell sx={{ ...cellSx, fontWeight: 600, width: 80, textAlign: "center" }}>
              Actions
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
              <TableCell sx={{ ...cellSx, opacity: 0.75 }}>
                {bankInfo[slug]?.remarks ?? "—"}
              </TableCell>
              <TableCell sx={{ ...cellSx, textAlign: "center", whiteSpace: "nowrap" }}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                  <Tooltip title="View details" placement="left">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/bank/${slug}`)}
                      sx={{ color: primaryColor }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {interest.url && (
                    <Tooltip title="Visit official website" placement="right">
                      <IconButton
                        size="small"
                        href={interest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: primaryColor }}
                      >
                        <LanguageIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // ── Mobile sort dropdown ──
  const renderMobileSortDropdown = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
      <SortIcon sx={{ color: textColor, fontSize: 20 }} />
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          value={mobileSort}
          onChange={(e) => setMobileSort(e.target.value as SortableColumns | "default")}
          sx={{
            color: textColor,
            backgroundColor: bgColor,
            fontSize: "0.85rem",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: `${textColor}40`,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: primaryColor,
            },
            "& .MuiSvgIcon-root": { color: textColor },
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ color: textColor }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  // ── Mobile cards ──
  const renderMobileCards = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {mobileSorted.map(([slug, interest]) => (
        <Card
          key={slug}
          sx={{
            backgroundColor: bgColor,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
          }}
        >
          <CardActionArea
            onClick={() => navigate(`/bank/${slug}`)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "stretch",
            }}
          >
            <CardContent
              sx={{
                p: 1.5,
                "&:last-child": { pb: 1.5 },
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: textColor, fontWeight: 600, mb: 0.5, fontSize: "0.9rem" }}
              >
                {bankInfo[slug]?.name ?? slug}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: textColor, opacity: 0.6, fontSize: "0.7rem" }}>
                    Yearly Interest
                  </Typography>
                  <Typography variant="body2" sx={{ color: textColor, fontWeight: 500 }}>
                    ${(interest.interest.toYearly() ?? 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: textColor, opacity: 0.6, fontSize: "0.7rem" }}>
                    EIR
                  </Typography>
                  <Typography variant="body2" sx={{ color: textColor, fontWeight: 500 }}>
                    {(interest.interest.toYearlyPercent() ?? 0).toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            {/* Action icons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pr: 0.5,
                gap: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip title="View details" placement="left">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/bank/${slug}`);
                  }}
                  sx={{ color: primaryColor }}
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {interest.url && (
                <Tooltip title="Visit official website" placement="right">
                  <IconButton
                    size="small"
                    href={interest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ color: primaryColor }}
                  >
                    <LanguageIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box component="section" aria-label="Current interest rates comparison" sx={{ mt: 1 }}>
      {/* ── Desktop side-by-side ── */}
      {!isMobile && (
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          {/* Left: Graph + asterisks (fixed, no scroll) */}
          <Box sx={{ flex: "0 0 45%", minWidth: 0 }}>
            <InterestGraph profile={profile} height={380} />
            {/* Asterisks under graph */}
            <Typography
              variant="caption"
              sx={{
                color: textColor,
                display: "block",
                textAlign: "left",
                opacity: 0.7,
                mt: 1,
              }}
            >
              * Interest rates on their respective websites are subject to change
              without notice.
              <br />
              ** Please do your own research before making any decisions.
              <br />
              *** Ask for referrals to get additional bonuses.
            </Typography>
          </Box>
          {/* Right: Scrollable table (own scrollbar) */}
          <Box
            sx={{
              flex: "1 1 55%",
              minWidth: 0,
              maxHeight: "calc(100vh - 320px)",
              overflowY: "auto",
            }}
          >
            {renderDesktopTable()}
          </Box>
        </Box>
      )}

      {/* ── Mobile carousel ── */}
      {isMobile && (
        <>
          <Carousel>
            <InterestGraph profile={profile} height={340} />
            <Box>
              {renderMobileSortDropdown()}
              {renderMobileCards()}
            </Box>
          </Carousel>
          {/* Mobile asterisks */}
          <Typography
            variant="caption"
            sx={{
              color: textColor,
              display: "block",
              textAlign: "center",
              opacity: 0.7,
              mt: 1,
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
        </>
      )}
    </Box>
  );
};
