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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
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

/** Sort dropdown options */
const SORT_OPTIONS: { value: SortableColumns; label: string }[] = [
  { value: "effectiveInterest", label: "EIR" },
  { value: "yearlyInterest", label: "Yearly Interest" },
  { value: "name", label: "Account Name" },
];

/**
 * Current Rates tab:
 * - Desktop: side-by-side graph + sortable table
 * - Mobile: stacked graph → sort bar with asc/desc → cards
 */
export const CurrentRatesTab = ({ profile }: Props) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [orderBy, setOrderBy] = useState<SortableColumns | undefined>(undefined);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  if (isMobile) {
    return <CurrentRatesTabMobile profile={profile} />;
  }
  return <CurrentRatesTabDesktop profile={profile} />;
};

// ── Desktop ───────────────────────────────────────────────────────

const CurrentRatesTabDesktop = ({ profile }: Props) => {
  const navigate = useNavigate();
  const [orderBy, setOrderBy] = useState<SortableColumns | undefined>(undefined);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const results = useResults(profile);

  const sortedResults = useMemo(() => {
    return sortEntries(results, orderBy, order);
  }, [results, orderBy, order]);

  const handleSort = (column: SortableColumns) => {
    if (orderBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
  };

  return (
    <Box component="section" aria-label="Current interest rates comparison" sx={{ height: "100%", display: "flex", gap: 2, alignItems: "flex-start", pt: 1.5 }}>
      {/* Left: Graph + asterisks — content-height, scales on zoom */}
      <Box sx={{ flex: "0 0 45%", minWidth: 0, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "auto" }}>
        <Box sx={{ height: "45vh", minHeight: 0 }}>
          <InterestGraph profile={profile} height="fill" />
        </Box>
        <Typography
          variant="caption"
          sx={{ color: textColor, display: "block", textAlign: "left", opacity: 0.7, mt: 1, flexShrink: 0 }}
        >
          * Interest rates on their respective websites are subject to change without notice.
          <br />
          ** Please do your own research before making any decisions.
          <br />
          *** Ask for referrals to get additional bonuses.
        </Typography>
      </Box>
      {/* Right: Table — single internal scrollbar */}
      <Box sx={{ flex: "1 1 55%", minWidth: 0, alignSelf: "stretch" }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
            <Table aria-label="High yield savings account interest rate comparison table" size="small">
              <TableHead>
                <TableRow sx={{ color: textColor, backgroundColor: bgColor }}>
                  <TableCell
                    onClick={() => handleSort("name")}
                    sx={{ ...cellSx, cursor: "pointer", fontWeight: 600, "&:hover": { backgroundColor: alpha(primaryColor, 0.15) } }}
                  >
                    <TableSortLabel active={orderBy === "name"} direction={orderBy === "name" ? order : "asc"} hideSortIcon={false} sx={SORT_ICON_SX}>
                      Accounts
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("yearlyInterest")}
                    sx={{ ...cellSx, cursor: "pointer", fontWeight: 600, "&:hover": { backgroundColor: alpha(primaryColor, 0.15) } }}
                  >
                    <TableSortLabel active={orderBy === "yearlyInterest"} direction={orderBy === "yearlyInterest" ? order : "asc"} hideSortIcon={false} sx={SORT_ICON_SX}>
                      Yearly Interest ($)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("effectiveInterest")}
                    sx={{ ...cellSx, cursor: "pointer", fontWeight: 600, "&:hover": { backgroundColor: alpha(primaryColor, 0.15) } }}
                  >
                    <TableSortLabel active={orderBy === "effectiveInterest"} direction={orderBy === "effectiveInterest" ? order : "asc"} hideSortIcon={false} sx={SORT_ICON_SX}>
                      EIR (%)
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600, minWidth: 180 }}>Remarks</TableCell>
                  <TableCell sx={{ ...cellSx, fontWeight: 600, width: 80, textAlign: "center" }}>Actions</TableCell>
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
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>{bankInfo[slug]?.name ?? slug}</TableCell>
                    <TableCell sx={cellSx}>${(interest.interest.toYearly() ?? 0).toFixed(2)}</TableCell>
                    <TableCell sx={cellSx}>{(interest.interest.toYearlyPercent() ?? 0).toFixed(2)}%</TableCell>
                    <TableCell sx={{ ...cellSx, opacity: 0.75 }}>{bankInfo[slug]?.remarks ?? "—"}</TableCell>
                    <TableCell sx={{ ...cellSx, textAlign: "center", whiteSpace: "nowrap" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                        <Tooltip title="View details" placement="left">
                          <IconButton size="small" onClick={() => navigate(`/bank/${slug}`)} sx={{ color: primaryColor }}>
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {interest.url && (
                          <Tooltip title="Visit official website" placement="right">
                            <IconButton size="small" href={interest.url} target="_blank" rel="noopener noreferrer" sx={{ color: primaryColor }}>
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
      </Box>
    </Box>
  );
};

// ── Mobile ────────────────────────────────────────────────────────

const CurrentRatesTabMobile = ({ profile }: Props) => {
  const navigate = useNavigate();
  const [mobileSort, setMobileSort] = useState<SortableColumns>("effectiveInterest");
  const [mobileOrder, setMobileOrder] = useState<"asc" | "desc">("desc");

  const results = useResults(profile);

  const mobileSorted = useMemo(() => {
    return sortEntries(results, mobileSort, mobileOrder);
  }, [results, mobileSort, mobileOrder]);

  return (
    <Box component="section" aria-label="Current interest rates comparison">
      {/* Graph + asterisks together */}
      <InterestGraph profile={profile} height={340} />
      <Typography
        variant="caption"
        sx={{ color: textColor, display: "block", textAlign: "left", opacity: 0.7, mt: 0.5, mb: 1.5 }}
      >
        * Interest rates on their respective websites are subject to change without notice.
        <br />
        ** Please do your own research before making any decisions.
        <br />
        *** Ask for referrals to get additional bonuses.
      </Typography>

      {/* Sort bar: dropdown + asc/desc toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <SortIcon sx={{ color: textColor, fontSize: 20 }} />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={mobileSort}
            onChange={(e) => setMobileSort(e.target.value as SortableColumns)}
            sx={{
              color: textColor,
              backgroundColor: bgColor,
              fontSize: "0.85rem",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: `${textColor}40` },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
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
        <ToggleButtonGroup
          value={mobileOrder}
          exclusive
          size="small"
          onChange={(_, v) => v && setMobileOrder(v)}
        >
          <ToggleButton value="asc" aria-label="Sort ascending" sx={{
            color: textColor, borderColor: `${textColor}40`, textTransform: "none",
            fontSize: "0.8rem", px: 1,
            "&.Mui-selected": { color: "#fff", backgroundColor: primaryColor },
            "&.Mui-selected:hover": { backgroundColor: primaryColor, opacity: 0.85 },
            "&:hover": { backgroundColor: `${primaryColor}18`, borderColor: primaryColor },
          }}>
            <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />Asc
          </ToggleButton>
          <ToggleButton value="desc" aria-label="Sort descending" sx={{
            color: textColor, borderColor: `${textColor}40`, textTransform: "none",
            fontSize: "0.8rem", px: 1,
            "&.Mui-selected": { color: "#fff", backgroundColor: primaryColor },
            "&.Mui-selected:hover": { backgroundColor: primaryColor, opacity: 0.85 },
            "&:hover": { backgroundColor: `${primaryColor}18`, borderColor: primaryColor },
          }}>
            <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />Desc
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Cards — stacked */}
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
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "stretch" }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 }, flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ color: textColor, fontWeight: 600, mb: 0.5, fontSize: "0.9rem" }}>
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
              <Box
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pr: 0.5, gap: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Tooltip title="View details" placement="left">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/bank/${slug}`); }} sx={{ color: primaryColor }}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {interest.url && (
                  <Tooltip title="Visit official website" placement="right">
                    <IconButton size="small" href={interest.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} sx={{ color: primaryColor }}>
                      <LanguageIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

// ── Shared helpers ─────────────────────────────────────────────────

function useResults(profile: Profile): Record<string, ResultProp> {
  return useMemo(() => {
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
}

function sortEntries(
  results: Record<string, ResultProp>,
  sortBy: SortableColumns | undefined,
  sortOrder: "asc" | "desc",
): [string, ResultProp][] {
  const entries = Object.entries(results);
  if (!sortBy) return entries;
  return [...entries].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case "name":
        cmp = (bankInfo[a[0]]?.name ?? a[0]).localeCompare(bankInfo[b[0]]?.name ?? b[0]);
        break;
      case "yearlyInterest":
        cmp = a[1].interest.toYearly() - b[1].interest.toYearly();
        break;
      case "effectiveInterest":
        cmp = a[1].interest.toYearlyPercent() - b[1].interest.toYearlyPercent();
        break;
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });
}
