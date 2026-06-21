import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { isValidSlug } from "../logic/slugs";
import type Profile from "../types/profile";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory, resolveHistoryForChart } from "../logic/history";
import { formatDate } from "../logic/dates";
import { textColor, bgColor, primaryColor } from "../consts/colors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { MAX_COMPARISON_BANKS } from "../consts/keys";
import { ALL_SLUGS } from "../logic/slugs";

interface Props {
  profile: Profile;
}

/** Toggle button styling */
const TOGGLE_SX = {
  color: textColor,
  borderColor: `${textColor}40`,
  textTransform: "none" as const,
  fontSize: "0.8rem",
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: primaryColor,
  },
  "&.Mui-selected:hover": {
    backgroundColor: primaryColor,
    opacity: 0.9,
  },
  "&:hover": {
    backgroundColor: `${primaryColor}18`,
    borderColor: primaryColor,
  },
};

const BANKS_PARAM = "banks";
const BANKS_SESSION_KEY = "history_selected_banks";

function parseBanksRaw(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && isValidSlug(s));
}

function readSessionBanks(): string[] {
  try {
    const stored = sessionStorage.getItem(BANKS_SESSION_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s): s is string => typeof s === "string" && isValidSlug(s),
    );
  } catch {
    return [];
  }
}

type ChartMode = "yearly" | "eir";

/**
 * Rate History tab:
 * - Bank selection dropdown beside Yearly/EIR toggle (left-aligned)
 * - Grouped bank history tables with collapsible sections
 */
export const HistoryTab = ({ profile }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBanks = readSessionBanks();
  const [chartMode, setChartMode] = useState<ChartMode>("yearly");
  const [collapsedBanks, setCollapsedBanks] = useState<Set<string>>(new Set());

  useDocumentTitle("Rate Change History — Track Singapore HYSA Interest Rates Over Time");

  // On first mount: hydrate sessionStorage from URL
  const urlBanks = useMemo(
    () => (searchParams.get(BANKS_PARAM) ? parseBanksRaw(searchParams.get(BANKS_PARAM)!) : null),
    [],
  );

  useEffect(() => {
    if (urlBanks && urlBanks.length > 0) {
      sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(urlBanks));
      const next = new URLSearchParams(searchParams);
      next.delete(BANKS_PARAM);
      setSearchParams(next, { replace: true });
    }
  }, []);

  const handleBankChange = (banks: string[]) => {
    sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(banks));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (banks.length > 0) {
        next.set(BANKS_PARAM, banks.join(","));
      } else {
        next.delete(BANKS_PARAM);
      }
      return next;
    }, { replace: true });
  };

  const toggleCollapse = (slug: string) => {
    setCollapsedBanks((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  // Pre-compute bank EIRs for dropdown display
  const bankEirs = useMemo(() => {
    const eirs: Record<string, string> = {};
    for (const [slug, info] of Object.entries(bankInfo)) {
      const { interestFn } = deriveCurrentFromHistory(info.history);
      eirs[slug] = interestFn(profile).toYearlyPercent().toFixed(2);
    }
    return eirs;
  }, [profile]);

  // Dropdown options sorted by EIR descending
  const sortedOptions = useMemo(
    () =>
      [...ALL_SLUGS].sort((a, b) => {
        const eirA = parseFloat(bankEirs[a] ?? "0");
        const eirB = parseFloat(bankEirs[b] ?? "0");
        return eirB - eirA;
      }),
    [bankEirs],
  );

  const displayNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [slug, info] of Object.entries(bankInfo)) {
      map[slug] = info.name;
    }
    return map;
  }, []);

  const isMaxed = selectedBanks.length >= MAX_COMPARISON_BANKS;

  // Build grouped history data
  const bankHistories = useMemo(() => {
    const result: Array<{
      slug: string;
      name: string;
      rows: Array<{
        date: string;
        changeSummary: string;
        yearlyInterest: string;
        eir: string;
      }>;
    }> = [];

    for (const slug of selectedBanks) {
      const info = bankInfo[slug];
      if (!info) continue;
      const resolved = resolveHistoryForChart(info.history, profile);
      result.push({
        slug,
        name: info.name,
        rows: [...resolved]
          .reverse()
          .map((snapshot) => {
            const isTbd = snapshot.date.getTime() === 0;
            return {
              date: isTbd ? "TBD" : formatDate(snapshot.date),
              changeSummary: snapshot.changeSummary,
              yearlyInterest: isTbd ? "—" : `$${snapshot.yearlyInterest.toFixed(2)}`,
              eir: isTbd ? "—" : `${snapshot.eir.toFixed(2)}%`,
            };
          }),
      });
    }
    return result;
  }, [selectedBanks, profile]);

  return (
    <Box component="section" aria-label="Interest rate change history" sx={{ mt: 1 }}>
      {/* ── Bank selection + Metric toggle row ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Bank multi-select dropdown */}
        <FormControl size="small" sx={{ minWidth: 280, flexShrink: 0 }}>
          <Select
            multiple
            value={selectedBanks}
            onChange={(e) => {
              const val = e.target.value as string[];
              if (val.length <= MAX_COMPARISON_BANKS) {
                handleBankChange(val);
              }
            }}
            input={<OutlinedInput />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((slug) => (
                  <Chip
                    key={slug}
                    label={displayNames[slug] ?? slug}
                    size="small"
                  />
                ))}
              </Box>
            )}
            displayEmpty
            sx={{
              color: textColor,
              backgroundColor: bgColor,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${textColor}40`,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: primaryColor,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: primaryColor,
              },
              "& .MuiSvgIcon-root": { color: textColor },
            }}
          >
            <MenuItem disabled value="">
              <Typography variant="body2" sx={{ color: textColor, opacity: 0.6 }}>
                Select banks ({selectedBanks.length}/{MAX_COMPARISON_BANKS})
              </Typography>
            </MenuItem>
            {sortedOptions.map((slug) => (
              <MenuItem
                key={slug}
                value={slug}
                disabled={!selectedBanks.includes(slug) && isMaxed}
                sx={{
                  color: textColor,
                  "&.Mui-selected": { backgroundColor: `${primaryColor}30` },
                  "&:hover": { backgroundColor: `${primaryColor}20` },
                  "&.Mui-disabled": { opacity: 0.35 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span>{displayNames[slug] ?? slug}</span>
                  <span style={{ opacity: 0.65, fontSize: "0.85em" }}>
                    {profile.Savings > 0 ? `${bankEirs[slug]}%` : ""}
                  </span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Metric toggle — left-aligned */}
        <ToggleButtonGroup
          value={chartMode}
          exclusive
          onChange={(_e, v) => v && setChartMode(v)}
          size="small"
        >
          <ToggleButton value="yearly" sx={TOGGLE_SX}>
            Yearly Interest ($)
          </ToggleButton>
          <ToggleButton value="eir" sx={TOGGLE_SX}>
            EIR (%)
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Prompt when no banks selected */}
      {selectedBanks.length === 0 && (
        <Paper
          sx={{
            p: 4,
            borderRadius: "10px",
            backgroundColor: bgColor,
            textAlign: "center",
          }}
        >
          <Typography variant="body1" color={textColor} sx={{ opacity: 0.7 }}>
            Select one or more banks above to view their rate history.
          </Typography>
        </Paper>
      )}

      {/* Grouped bank history — collapsible sections */}
      {bankHistories.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {bankHistories.map((bank) => {
            const isCollapsed = collapsedBanks.has(bank.slug);
            const highlightCol = chartMode === "yearly" ? "yearlyInterest" : "eir";

            return (
              <Paper
                key={bank.slug}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: bgColor,
                  overflow: "hidden",
                }}
              >
                {/* Bank group header */}
                <Box
                  onClick={() => toggleCollapse(bank.slug)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    backgroundColor: `${primaryColor}15`,
                    "&:hover": { backgroundColor: `${primaryColor}20` },
                    userSelect: "none",
                  }}
                >
                  <IconButton size="small" sx={{ color: textColor }}>
                    {isCollapsed ? (
                      <KeyboardArrowRight fontSize="small" />
                    ) : (
                      <KeyboardArrowDown fontSize="small" />
                    )}
                  </IconButton>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: textColor, fontWeight: 600 }}
                  >
                    {bank.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: textColor, opacity: 0.6, ml: 1 }}
                  >
                    ({bank.rows.length} change{bank.rows.length !== 1 ? "s" : ""})
                  </Typography>
                </Box>

                {/* Bank history table */}
                <Collapse in={!isCollapsed}>
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
                            sx={{
                              color: textColor,
                              fontWeight: 600,
                              textAlign: "right",
                              backgroundColor:
                                highlightCol === "yearlyInterest"
                                  ? `${primaryColor}12`
                                  : "transparent",
                            }}
                          >
                            Yearly Interest ($)
                          </TableCell>
                          <TableCell
                            sx={{
                              color: textColor,
                              fontWeight: 600,
                              textAlign: "right",
                              backgroundColor:
                                highlightCol === "eir"
                                  ? `${primaryColor}12`
                                  : "transparent",
                            }}
                          >
                            EIR (%)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bank.rows.map((row, idx) => (
                          <TableRow
                            key={idx}
                            sx={{
                              "&:hover": {
                                backgroundColor: `${primaryColor}08`,
                              },
                            }}
                          >
                            <TableCell sx={{ color: textColor }}>
                              {row.date}
                            </TableCell>
                            <TableCell sx={{ color: textColor }}>
                              {row.changeSummary}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: textColor,
                                textAlign: "right",
                                backgroundColor:
                                  highlightCol === "yearlyInterest"
                                    ? `${primaryColor}08`
                                    : "transparent",
                              }}
                            >
                              {row.yearlyInterest}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: textColor,
                                textAlign: "right",
                                backgroundColor:
                                  highlightCol === "eir"
                                    ? `${primaryColor}08`
                                    : "transparent",
                              }}
                            >
                              {row.eir}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Collapse>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
