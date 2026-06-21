import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  OpenInNew,
  Language,
} from "@mui/icons-material";
import { ComparisonChart } from "../Components/ComparisonChart";
import { ThreePanelLayout } from "../Components/ThreePanelLayout";
import { isValidSlug } from "../logic/slugs";
import type Profile from "../types/profile";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory, resolveHistoryForChart } from "../logic/history";
import { formatDate } from "../logic/dates";
import { textColor, bgColor, primaryColor } from "../consts/colors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useMobile } from "../hooks/useMobile";
import { MAX_COMPARISON_BANKS } from "../consts/keys";
import { ALL_SLUGS } from "../logic/slugs";

interface Props {
  profile: Profile;
}

const TOGGLE_SX = {
  color: textColor,
  borderColor: `${textColor}40`,
  textTransform: "none" as const,
  fontSize: "0.8rem",
  "&.Mui-selected": { color: "#fff", backgroundColor: primaryColor },
  "&.Mui-selected:hover": { backgroundColor: primaryColor, opacity: 0.9 },
  "&:hover": { backgroundColor: `${primaryColor}18`, borderColor: primaryColor },
};

const BANKS_PARAM = "banks";
const BANKS_SESSION_KEY = "history_selected_banks";

type ChartMode = "yearly" | "eir";

interface BankHistoryRow {
  date: string;
  changeSummary: string;
  yearlyInterest: string;
  eir: string;
  sourceUrl?: string;
}

interface BankHistoryGroup {
  slug: string;
  name: string;
  rows: BankHistoryRow[];
}

function parseBanksRaw(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter((s) => s.length > 0 && isValidSlug(s));
}

function readSessionBanks(): string[] {
  try {
    const stored = sessionStorage.getItem(BANKS_SESSION_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string" && isValidSlug(s));
  } catch {
    return [];
  }
}

/**
 * Rate History tab — early split for clarity.
 */
export const HistoryTab = ({ profile }: Props) => {
  const { isMobile } = useMobile();
  const [chartMode, setChartMode] = useState<ChartMode>("yearly");

  useDocumentTitle("Rate Change History — Track Singapore HYSA Interest Rates Over Time");

  if (isMobile) {
    return <HistoryTabMobile profile={profile} chartMode={chartMode} setChartMode={setChartMode} />;
  }
  return <HistoryTabDesktop profile={profile} chartMode={chartMode} setChartMode={setChartMode} />;
};

// ══════════════════════════════════════════════════════════════════
// ── Desktop ──
// ══════════════════════════════════════════════════════════════════

const HistoryTabDesktop = ({
  profile,
  chartMode,
  setChartMode,
}: Props & { chartMode: ChartMode; setChartMode: (m: ChartMode) => void }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBanks, setSelectedBanks] = useState<string[]>(readSessionBanks);
  const [collapsedBanks, setCollapsedBanks] = useState<Set<string>>(new Set());

  const urlBanks = useMemo(
    () => (searchParams.get(BANKS_PARAM) ? parseBanksRaw(searchParams.get(BANKS_PARAM)!) : null),
    [],
  );

  useEffect(() => {
    if (urlBanks && urlBanks.length > 0) {
      setSelectedBanks(urlBanks);
      sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(urlBanks));
      const next = new URLSearchParams(searchParams);
      next.delete(BANKS_PARAM);
      setSearchParams(next, { replace: true });
    }
  }, []);

  const handleBankChange = (banks: string[]) => {
    setSelectedBanks(banks);
    sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(banks));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (banks.length > 0) next.set(BANKS_PARAM, banks.join(","));
      else next.delete(BANKS_PARAM);
      return next;
    }, { replace: true });
  };

  const toggleCollapse = useCallback((slug: string) => {
    setCollapsedBanks((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }, []);

  const { bankEirs, sortedOptions, displayNames, isMaxed, bankHistories } = useHistoryData(profile, selectedBanks);

  const renderGroupedTable = () => {
    const highlightCol = chartMode === "yearly" ? "yearlyInterest" : "eir";
    return (
      <Paper sx={{ borderRadius: "10px", backgroundColor: bgColor }}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: textColor, fontWeight: 600, width: 30, backgroundColor: bgColor }} />
                <TableCell sx={{ color: textColor, fontWeight: 600, width: 130, backgroundColor: bgColor }}>Date</TableCell>
                <TableCell sx={{ color: textColor, fontWeight: 600, backgroundColor: bgColor }}>What Changed</TableCell>
                <TableCell sx={{ color: textColor, fontWeight: 600, textAlign: "right", backgroundColor: bgColor }}>
                  Yearly Interest ($)
                </TableCell>
                <TableCell sx={{ color: textColor, fontWeight: 600, textAlign: "right", backgroundColor: bgColor }}>
                  EIR
                </TableCell>
                <TableCell sx={{ color: textColor, fontWeight: 600, width: 80, textAlign: "center", backgroundColor: bgColor }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankHistories.flatMap((bank) => {
                const isCollapsed = collapsedBanks.has(bank.slug);
                return [
                  <TableRow key={`hdr-${bank.slug}`} hover onClick={() => toggleCollapse(bank.slug)} sx={{ cursor: "pointer", backgroundColor: `${primaryColor}10`, "&:hover": { backgroundColor: `${primaryColor}1d` } }}>
                    <TableCell sx={{ color: textColor, p: 0.5 }}>
                      <IconButton size="small" sx={{ color: textColor }}>
                        {isCollapsed ? <KeyboardArrowRight fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                      </IconButton>
                    </TableCell>
                    <TableCell colSpan={5} sx={{ color: textColor, py: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 600, color: textColor }}>{bank.name}</Typography>
                      <Typography component="span" variant="body2" sx={{ color: textColor, opacity: 0.6, ml: 1 }}>
                        ({bank.rows.length} change{bank.rows.length !== 1 ? "s" : ""})
                      </Typography>
                    </TableCell>
                  </TableRow>,
                  ...(!isCollapsed ? bank.rows.map((row, idx) => (
                    <TableRow key={`${bank.slug}-${idx}`} sx={{ "&:hover": { backgroundColor: `${primaryColor}08` } }}>
                      <TableCell sx={{ p: 0 }} />
                      <TableCell sx={{ color: textColor, pl: 2 }}>{row.date}</TableCell>
                      <TableCell sx={{ color: textColor }}>{row.changeSummary}</TableCell>
                      <TableCell sx={{ color: textColor, textAlign: "right", backgroundColor: highlightCol === "yearlyInterest" ? `${primaryColor}08` : "transparent" }}>
                        {row.yearlyInterest}
                      </TableCell>
                      <TableCell sx={{ color: textColor, textAlign: "right", backgroundColor: highlightCol === "eir" ? `${primaryColor}08` : "transparent" }}>
                        {row.eir}
                      </TableCell>
                      <TableCell sx={{ color: textColor, textAlign: "center", p: 0.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                          {row.sourceUrl && (
                            <Tooltip title="Visit source" placement="left">
                              <IconButton size="small" href={row.sourceUrl} target="_blank" rel="noopener noreferrer" sx={{ color: primaryColor }}>
                                <Language fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="View details" placement="right">
                            <IconButton size="small" onClick={() => navigate(`/bank/${bank.slug}`)} sx={{ color: primaryColor }}>
                              <OpenInNew fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )) : []),
                ];
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  const renderControls = () => (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 1.5, mb: 1.5 }}>
      <ToggleButtonGroup value={chartMode} exclusive onChange={(_e, v) => v && setChartMode(v)} size="small">
        <ToggleButton value="yearly" sx={TOGGLE_SX}>Yearly Interest ($)</ToggleButton>
        <ToggleButton value="eir" sx={TOGGLE_SX}>EIR (%)</ToggleButton>
      </ToggleButtonGroup>
      <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
        <Select multiple value={selectedBanks} onChange={(e) => { const val = e.target.value as string[]; if (val.length <= MAX_COMPARISON_BANKS) handleBankChange(val); }} input={<OutlinedInput />} renderValue={(selected) => (<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{selected.map((slug) => <Chip key={slug} label={displayNames[slug] ?? slug} size="small" />)}</Box>)} displayEmpty sx={{ color: textColor, backgroundColor: bgColor, "& .MuiOutlinedInput-notchedOutline": { borderColor: `${textColor}40` }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor }, "& .MuiSvgIcon-root": { color: textColor } }}>
          <MenuItem disabled value=""><Typography variant="body2" sx={{ color: textColor, opacity: 0.6 }}>Select banks ({selectedBanks.length}/{MAX_COMPARISON_BANKS})</Typography></MenuItem>
          {sortedOptions.map((slug) => (<MenuItem key={slug} value={slug} disabled={!selectedBanks.includes(slug) && isMaxed} sx={{ color: textColor, "&.Mui-selected": { backgroundColor: `${primaryColor}30` }, "&:hover": { backgroundColor: `${primaryColor}20` }, "&.Mui-disabled": { opacity: 0.35 } }}><Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}><span>{displayNames[slug] ?? slug}</span><span style={{ opacity: 0.65, fontSize: "0.85em" }}>{profile.Savings > 0 ? `${bankEirs[slug]}%` : ""}</span></Box></MenuItem>))}
        </Select>
      </FormControl>
    </Box>
  );

  const renderRightPanel = () => {
    if (selectedBanks.length === 0) {
      return (
        <Paper sx={{ p: 4, borderRadius: "10px", backgroundColor: bgColor, textAlign: "center" }}>
          <Typography variant="body1" color={textColor} sx={{ opacity: 0.7 }}>
            Select one or more banks above to view their rate history.
          </Typography>
        </Paper>
      );
    }
    if (bankHistories.length === 0) {
      return (
        <Paper sx={{ p: 4, borderRadius: "10px", backgroundColor: bgColor, textAlign: "center" }}>
          <Typography variant="body1" color={textColor} sx={{ opacity: 0.7 }}>
            No rate data available for the selected banks.
          </Typography>
        </Paper>
      );
    }
    return renderGroupedTable();
  };

  return (
    <Box component="section" aria-label="Interest rate change history">
      <ThreePanelLayout
        bottomLeft={
          <>
            {renderControls()}
            <Box sx={{ height: "50vh" }}>
              <ComparisonChart selectedBanks={selectedBanks} profile={profile} chartMode={chartMode} />
            </Box>
          </>
        }
        bottomRight={renderRightPanel()}
      />
    </Box>
  );
};

// ══════════════════════════════════════════════════════════════════
// ── Mobile ──
// ══════════════════════════════════════════════════════════════════

const HistoryTabMobile = ({
  profile,
  chartMode,
  setChartMode,
}: Props & { chartMode: ChartMode; setChartMode: (m: ChartMode) => void }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBanks, setSelectedBanks] = useState<string[]>(readSessionBanks);
  const [collapsedBanks, setCollapsedBanks] = useState<Set<string>>(new Set());

  const urlBanks = useMemo(
    () => (searchParams.get(BANKS_PARAM) ? parseBanksRaw(searchParams.get(BANKS_PARAM)!) : null),
    [],
  );

  useEffect(() => {
    if (urlBanks && urlBanks.length > 0) {
      setSelectedBanks(urlBanks);
      sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(urlBanks));
      const next = new URLSearchParams(searchParams);
      next.delete(BANKS_PARAM);
      setSearchParams(next, { replace: true });
    }
  }, []);

  const handleBankChange = (banks: string[]) => {
    setSelectedBanks(banks);
    sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(banks));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (banks.length > 0) next.set(BANKS_PARAM, banks.join(","));
      else next.delete(BANKS_PARAM);
      return next;
    }, { replace: true });
  };

  const toggleCollapse = useCallback((slug: string) => {
    setCollapsedBanks((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }, []);

  const { bankEirs, sortedOptions, displayNames, isMaxed, bankHistories } = useHistoryData(profile, selectedBanks);

  return (
    <Box component="section" aria-label="Interest rate change history" sx={{ mt: 1 }}>
      {/* Toggle + dropdown stacked */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
        <ToggleButtonGroup value={chartMode} exclusive onChange={(_e, v) => v && setChartMode(v)} size="small">
          <ToggleButton value="yearly" sx={TOGGLE_SX}>Yearly $</ToggleButton>
          <ToggleButton value="eir" sx={TOGGLE_SX}>EIR (%)</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 0, width: "100%" }}>
          <Select
            multiple
            value={selectedBanks}
            onChange={(e) => {
              const val = e.target.value as string[];
              if (val.length <= MAX_COMPARISON_BANKS) handleBankChange(val);
            }}
            input={<OutlinedInput />}
            renderValue={(selected) =>
              selected.length > 2 ? (
                <Typography variant="body2" sx={{ color: textColor }}>{selected.length} banks selected</Typography>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((slug) => <Chip key={slug} label={displayNames[slug] ?? slug} size="small" />)}
                </Box>
              )
            }
            displayEmpty
            sx={{
              color: textColor, backgroundColor: bgColor,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: `${textColor}40` },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
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
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span>{displayNames[slug] ?? slug}</span>
                  <span style={{ opacity: 0.65, fontSize: "0.85em" }}>{profile.Savings > 0 ? `${bankEirs[slug]}%` : ""}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedBanks.length === 0 && (
        <Paper sx={{ p: 4, borderRadius: "10px", backgroundColor: bgColor, textAlign: "center" }}>
          <Typography variant="body1" color={textColor} sx={{ opacity: 0.7 }}>
            Select one or more banks above to view their rate history.
          </Typography>
        </Paper>
      )}

      {selectedBanks.length > 0 && bankHistories.length > 0 && (
        <>
          <ComparisonChart selectedBanks={selectedBanks} profile={profile} chartMode={chartMode} />
          <Box sx={{ mt: 2 }}>
            <MobileRowGroupedList
              bankHistories={bankHistories}
              collapsedBanks={collapsedBanks}
              toggleCollapse={toggleCollapse}
              chartMode={chartMode}
              navigate={navigate}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

// ── Mobile row-grouped list ──────────────────────────────────────

const MobileRowGroupedList = ({
  bankHistories,
  collapsedBanks,
  toggleCollapse,
  chartMode,
  navigate,
}: {
  bankHistories: BankHistoryGroup[];
  collapsedBanks: Set<string>;
  toggleCollapse: (slug: string) => void;
  chartMode: ChartMode;
  navigate: (path: string) => void;
}) => {
  const highlightCol = chartMode === "yearly" ? "yearlyInterest" : "eir";

  return (
    <Paper sx={{ borderRadius: "10px", backgroundColor: bgColor, overflow: "hidden" }}>
      <TableContainer sx={{ overflow: "hidden" }}>
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: textColor, fontWeight: 600, width: 24, p: 0.5, backgroundColor: bgColor }} />
              <TableCell sx={{ color: textColor, fontWeight: 600, fontSize: "0.75rem", px: 0.5, backgroundColor: bgColor, width: 80, whiteSpace: "nowrap" }}>Date</TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, fontSize: "0.75rem", px: 0.5, backgroundColor: bgColor }}>Change</TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, textAlign: "right", fontSize: "0.75rem", px: 0.5, backgroundColor: highlightCol === "yearlyInterest" ? `${primaryColor}1a` : bgColor, width: 48 }}>
                Yr$
              </TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, textAlign: "right", fontSize: "0.75rem", px: 0.5, backgroundColor: highlightCol === "eir" ? `${primaryColor}1a` : bgColor, width: 48 }}>
                EIR
              </TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, fontSize: "0.75rem", textAlign: "center", width: 60, px: 0.5, backgroundColor: bgColor, whiteSpace: "nowrap" }}>Act</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bankHistories.flatMap((bank) => {
              const isCollapsed = collapsedBanks.has(bank.slug);
              return [
                <TableRow key={`hdr-${bank.slug}`} hover onClick={() => toggleCollapse(bank.slug)} sx={{ cursor: "pointer", backgroundColor: `${primaryColor}10`, "&:hover": { backgroundColor: `${primaryColor}1d` } }}>
                  <TableCell sx={{ color: textColor, p: 0.5 }}>
                    <IconButton size="small" sx={{ color: textColor, p: 0 }}>
                      {isCollapsed ? <KeyboardArrowRight fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                    </IconButton>
                  </TableCell>
                  <TableCell colSpan={5} sx={{ color: textColor, py: 1, pl: 0 }}>
                    <Typography component="span" sx={{ fontWeight: 600, color: textColor, fontSize: "0.85rem" }}>{bank.name}</Typography>
                    <Typography component="span" variant="body2" sx={{ color: textColor, opacity: 0.5, ml: 0.5, fontSize: "0.7rem" }}>
                      ({bank.rows.length})
                    </Typography>
                  </TableCell>
                </TableRow>,
                ...(!isCollapsed ? bank.rows.map((row, idx) => (
                  <TableRow key={`${bank.slug}-${idx}`} sx={{ "&:hover": { backgroundColor: `${primaryColor}08` } }}>
                    <TableCell sx={{ p: 0 }} />
                    <TableCell sx={{ color: textColor, fontSize: "0.7rem", px: 0.5, whiteSpace: "nowrap" }}>{row.date}</TableCell>
                    <TableCell sx={{ color: textColor, fontSize: "0.7rem", px: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.changeSummary}</TableCell>
                    <TableCell sx={{ color: textColor, textAlign: "right", fontSize: "0.7rem", px: 0.5, backgroundColor: highlightCol === "yearlyInterest" ? `${primaryColor}08` : "transparent", whiteSpace: "nowrap" }}>
                      {row.yearlyInterest}
                    </TableCell>
                    <TableCell sx={{ color: textColor, textAlign: "right", fontSize: "0.7rem", px: 0.5, backgroundColor: highlightCol === "eir" ? `${primaryColor}08` : "transparent", whiteSpace: "nowrap" }}>
                      {row.eir}
                    </TableCell>
                    <TableCell sx={{ color: textColor, textAlign: "center", p: 0.25, whiteSpace: "nowrap" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 0 }}>
                        {row.sourceUrl && (
                          <Tooltip title="Source"><IconButton size="small" href={row.sourceUrl} target="_blank" rel="noopener noreferrer" sx={{ color: primaryColor, p: 0.25 }}><Language sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                        )}
                        <Tooltip title="Details"><IconButton size="small" onClick={() => navigate(`/bank/${bank.slug}`)} sx={{ color: primaryColor, p: 0.25 }}><OpenInNew sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )) : []),
              ];
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// ══════════════════════════════════════════════════════════════════
// ── Shared data hook ──
// ══════════════════════════════════════════════════════════════════

function useHistoryData(profile: Profile, selectedBanks: string[]) {
  const bankEirs = useMemo(() => {
    const eirs: Record<string, string> = {};
    for (const [slug, info] of Object.entries(bankInfo)) {
      const { interestFn } = deriveCurrentFromHistory(info.history);
      eirs[slug] = interestFn(profile).toYearlyPercent().toFixed(2);
    }
    return eirs;
  }, [profile]);

  const sortedOptions = useMemo(
    () => [...ALL_SLUGS].sort((a, b) => parseFloat(bankEirs[b] ?? "0") - parseFloat(bankEirs[a] ?? "0")),
    [bankEirs],
  );

  const displayNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [slug, info] of Object.entries(bankInfo)) map[slug] = info.name;
    return map;
  }, []);

  const isMaxed = selectedBanks.length >= MAX_COMPARISON_BANKS;

  const bankHistories: BankHistoryGroup[] = useMemo(() => {
    const result: BankHistoryGroup[] = [];
    for (const slug of selectedBanks) {
      const info = bankInfo[slug];
      if (!info) continue;
      const resolved = resolveHistoryForChart(info.history, profile);
      result.push({
        slug,
        name: info.name,
        rows: [...resolved].reverse().map((snapshot) => {
          const isTbd = snapshot.date.getTime() === 0;
          return {
            date: isTbd ? "TBD" : formatDate(snapshot.date),
            changeSummary: snapshot.changeSummary,
            yearlyInterest: isTbd ? "—" : `$${snapshot.yearlyInterest.toFixed(2)}`,
            eir: isTbd ? "—" : `${snapshot.eir.toFixed(2)}%`,
            sourceUrl: snapshot.sourceUrl,
          };
        }),
      });
    }
    return result;
  }, [selectedBanks, profile]);

  return { bankEirs, sortedOptions, displayNames, isMaxed, bankHistories };
}
