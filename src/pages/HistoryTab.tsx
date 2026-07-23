import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
import type {Profile} from "../types/profile";
import { textColor, bgColor, primaryColor, TOGGLE_SX } from "../consts/theme";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useMobile } from "../hooks/useMobile";
import { MAX_COMPARISON_BANKS } from "../consts/keys";
import { useHistoryState, type BankHistoryGroup } from "../hooks/useHistoryState";
import { prefetchRoute } from "../data/prefetch";

interface Props {
  profile: Profile;
}

type ChartMode = "yearly" | "eir";

/**
 * Rate History tab — early split for clarity.
 */
export const HistoryTab = ({ profile }: Props) => {
  const { isMobile } = useMobile();
  const [chartMode, setChartMode] = useState<ChartMode>("yearly");

  useDocumentTitle("Rate Change History — Track Singapore HYSA Interest Rates Over Time");

  return (
    <>
      <Helmet>
        <title>Rate Change History — Track Singapore HYSA Interest Rates Over Time — SG HYSA Calculator</title>
        <meta name="description" content="View historical interest rate changes for all Singapore high yield savings accounts. Track how UOB One, OCBC 360, DBS Multiplier, Maribank, Trust Bank, GXS rates have evolved over time." />
        <meta property="og:title" content="Rate Change History — Track Singapore HYSA Interest Rates Over Time — SG HYSA Calculator" />
        <meta property="og:description" content="View historical interest rate changes for all Singapore high yield savings accounts. Track how UOB One, OCBC 360, DBS Multiplier, Maribank, Trust Bank, GXS rates have evolved over time." />
        <meta property="og:url" content="https://hysa.jh123x.com/history" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hysa.jh123x.com/history" />
      </Helmet>
      <Typography component="h2" variant="h4" sx={{ color: textColor, fontWeight: 700, mb: 2.5, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
        Rate Change History
      </Typography>
      {isMobile ? (
        <HistoryTabMobile profile={profile} chartMode={chartMode} setChartMode={setChartMode} />
      ) : (
        <HistoryTabDesktop profile={profile} chartMode={chartMode} setChartMode={setChartMode} />
      )}
    </>
  );
};

// ══════════════════════════════════════════════════════════════════
// ── Desktop ──
// ══════════════════════════════════════════════════════════════════

const HistoryTabDesktop = ({
  profile,
  chartMode,
  setChartMode,
}: Props & { chartMode: ChartMode; setChartMode: (m: ChartMode) => void }) => {
  const {
    navigate,
    selectedBanks,
    collapsedBanks,
    handleBankChange,
    toggleCollapse,
    bankEirs,
    sortedOptions,
    displayNames,
    isMaxed,
    bankHistories,
  } = useHistoryState(profile);

  const renderGroupedTable = () => {
    const highlightCol = chartMode === "yearly" ? "yearlyInterest" : "eir";
    return (
      <Paper sx={{ backgroundColor: bgColor }}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 30 }} />
                <TableCell sx={{ width: 130 }}>Date</TableCell>
                <TableCell>What Changed</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  Yearly Interest ($)
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  EIR (%)
                </TableCell>
                <TableCell sx={{ width: 80, textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankHistories.flatMap((bank) => {
                const isCollapsed = collapsedBanks.has(bank.slug);
                return [
                  <TableRow key={`hdr-${bank.slug}`} hover onClick={() => toggleCollapse(bank.slug)} sx={{ cursor: "pointer", backgroundColor: `${primaryColor}10`, "&:hover": { backgroundColor: `${primaryColor}1d` } }}>
                    <TableCell sx={{ p: 0.5 }}>
                      <IconButton size="small" sx={{ color: textColor }}>
                        {isCollapsed ? <KeyboardArrowRight fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                      </IconButton>
                    </TableCell>
                    <TableCell colSpan={5} sx={{ py: 1.5 }}>
                      <Typography component="span" sx={{ fontWeight: 600, color: textColor }}>{bank.name}</Typography>
                      <Typography component="span" variant="body2" sx={{ color: textColor, opacity: 0.6, ml: 1 }}>
                        ({bank.rows.length} change{bank.rows.length !== 1 ? "s" : ""})
                      </Typography>
                    </TableCell>
                  </TableRow>,
                  ...(!isCollapsed ? bank.rows.map((row, idx) => (
                    <TableRow key={`${bank.slug}-${idx}`} sx={{ "&:hover": { backgroundColor: `${primaryColor}08` } }}>
                      <TableCell sx={{ p: 0 }} />
                      <TableCell sx={{ pl: 2 }}>{row.date}</TableCell>
                      <TableCell sx={{ whiteSpace: "pre-line" }}>{row.changeSummary}</TableCell>
                      <TableCell sx={{ textAlign: "right", backgroundColor: highlightCol === "yearlyInterest" ? `${primaryColor}08` : "transparent" }}>
                        {row.yearlyInterest}
                      </TableCell>
                      <TableCell sx={{ textAlign: "right", backgroundColor: highlightCol === "eir" ? `${primaryColor}08` : "transparent" }}>
                        {row.eir}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", p: 0.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                          <Tooltip title="View details" placement="left">
                            <IconButton size="small"
                              onMouseEnter={() => prefetchRoute(`/bank/${bank.slug}`)}
                              onClick={() => navigate(`/bank/${bank.slug}`)} sx={{ color: primaryColor }}>
                              <OpenInNew fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {row.sourceUrl && (
                            <Tooltip title="Visit official website" placement="right">
                              <IconButton size="small" href={row.sourceUrl} target="_blank" rel="noopener noreferrer" sx={{ color: primaryColor }}>
                                <Language fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
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
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, mb: 2 }}>
      <ToggleButtonGroup value={chartMode} exclusive onChange={(_e, v) => v && setChartMode(v)} size="small">
        <ToggleButton value="yearly" sx={TOGGLE_SX}>Yearly $</ToggleButton>
        <ToggleButton value="eir" sx={TOGGLE_SX}>EIR (%)</ToggleButton>
      </ToggleButtonGroup>
      <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
        <Select multiple value={selectedBanks} onChange={(e) => { const val = (e as { target: { value: string[] } }).target.value; if (val.length <= MAX_COMPARISON_BANKS) handleBankChange(val); }} input={<OutlinedInput />} renderValue={(selected) => (<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{selected.map((slug) => <Chip key={slug} label={displayNames[slug] ?? slug} size="small" />)}</Box>)} displayEmpty sx={{ color: textColor, backgroundColor: bgColor, "& .MuiOutlinedInput-notchedOutline": { borderColor: `${textColor}40` }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor }, "& .MuiSvgIcon-root": { color: textColor } }}>
          <MenuItem disabled value=""><Typography variant="body2" sx={{ color: textColor, opacity: 0.6 }}>{selectedBanks.length === 0 ? "Select a bank to begin" : `Select banks (${selectedBanks.length}/${MAX_COMPARISON_BANKS})`}</Typography></MenuItem>
          {sortedOptions.map((slug) => (<MenuItem key={slug} value={slug} disabled={!selectedBanks.includes(slug) && isMaxed} sx={{ color: textColor, "&.Mui-selected": { backgroundColor: `${primaryColor}30` }, "&:hover": { backgroundColor: `${primaryColor}20` }, "&.Mui-disabled": { opacity: 0.35 } }}><Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}><Typography component="span" sx={{ color: textColor }}>{displayNames[slug] ?? slug}</Typography><Typography component="span" sx={{ opacity: 0.65, fontSize: "0.85em" }}>{profile.Savings > 0 ? `${bankEirs[slug]}%` : ""}</Typography></Box></MenuItem>))}
        </Select>
      </FormControl>
    </Box>
  );

  const renderRightPanel = () => {
    if (selectedBanks.length === 0) {
      return (
        <Paper sx={{ p: 4, backgroundColor: bgColor, textAlign: "center" }}>
          <Typography variant="body1" color={textColor} sx={{ opacity: 0.7 }}>
            Select one or more banks above to view their rate history.
          </Typography>
        </Paper>
      );
    }
    if (bankHistories.length === 0) {
      return (
        <Paper sx={{ p: 4, backgroundColor: bgColor, textAlign: "center" }}>
          <Typography variant="body1" color={textColor} sx={{ opacity: 0.7 }}>
            No rate data available for the selected banks.
          </Typography>
        </Paper>
      );
    }
    return renderGroupedTable();
  };

  return (
    <Box component="section" aria-label="Interest rate change history" sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <ThreePanelLayout
        bottomLeft={
          <>
            {renderControls()}
            {selectedBanks.length > 0 && (
              <Box sx={{ height: "48vh" }}>
                <ComparisonChart selectedBanks={selectedBanks} profile={profile} chartMode={chartMode} />
              </Box>
            )}
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
  const {
    navigate,
    selectedBanks,
    collapsedBanks,
    handleBankChange,
    toggleCollapse,
    bankEirs,
    sortedOptions,
    displayNames,
    isMaxed,
    bankHistories,
  } = useHistoryState(profile);

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
              const val = (e as { target: { value: string[] } }).target.value;
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
                  <Typography component="span" sx={{ color: textColor }}>{displayNames[slug] ?? slug}</Typography>
                  <Typography component="span" sx={{ opacity: 0.65, fontSize: "0.85em" }}>{profile.Savings > 0 ? `${bankEirs[slug]}%` : ""}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedBanks.length === 0 && (
        <Paper sx={{ p: 4, backgroundColor: bgColor, textAlign: "center" }}>
          <Typography variant="body1" color={textColor} sx={{ opacity: 0.7 }}>
            Select one or more banks above to view their rate history.
          </Typography>
        </Paper>
      )}

      {selectedBanks.length > 0 && bankHistories.length > 0 && (
        <>
          <Box sx={{ height: "60vh", minHeight: 300 }}>
            <ComparisonChart selectedBanks={selectedBanks} profile={profile} chartMode={chartMode} />
          </Box>
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
    <Paper sx={{ backgroundColor: bgColor, overflow: "hidden" }}>
      <TableContainer sx={{ overflow: "hidden" }}>
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: textColor, fontWeight: 600, width: 24, p: 0.5, backgroundColor: bgColor }} />
              <TableCell sx={{ color: textColor, fontWeight: 600, fontSize: "0.75rem", px: 0.5, backgroundColor: bgColor, width: 80, whiteSpace: "nowrap" }}>Date</TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, textAlign: "right", fontSize: "0.75rem", px: 0.5, backgroundColor: highlightCol === "yearlyInterest" ? `${primaryColor}1a` : bgColor, width: 48 }}>
                Yr$
              </TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, textAlign: "right", fontSize: "0.75rem", px: 0.5, backgroundColor: highlightCol === "eir" ? `${primaryColor}1a` : bgColor, width: 48 }}>
                EIR (%)</TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, fontSize: "0.75rem", textAlign: "center", width: 60, px: 0.5, backgroundColor: bgColor, whiteSpace: "nowrap" }}>Actions</TableCell>
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
                  <TableCell colSpan={4} sx={{ color: textColor, py: 1, pl: 0 }}>
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
                    <TableCell sx={{ color: textColor, textAlign: "right", fontSize: "0.7rem", px: 0.5, backgroundColor: highlightCol === "yearlyInterest" ? `${primaryColor}08` : "transparent", whiteSpace: "nowrap" }}>
                      {row.yearlyInterest}
                    </TableCell>
                    <TableCell sx={{ color: textColor, textAlign: "right", fontSize: "0.7rem", px: 0.5, backgroundColor: highlightCol === "eir" ? `${primaryColor}08` : "transparent", whiteSpace: "nowrap" }}>
                      {row.eir}
                    </TableCell>
                    <TableCell sx={{ color: textColor, textAlign: "center", p: 0.25, whiteSpace: "nowrap" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 0 }}>
                        <Tooltip title="Details"><IconButton size="small"
                          onMouseEnter={() => prefetchRoute(`/bank/${bank.slug}`)}
                          onClick={() => navigate(`/bank/${bank.slug}`)} sx={{ color: primaryColor, p: 0.25 }}><OpenInNew sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                        {row.sourceUrl && (
                          <Tooltip title="Source"><IconButton size="small" href={row.sourceUrl} target="_blank" rel="noopener noreferrer" sx={{ color: primaryColor, p: 0.25 }}><Language sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                        )}
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

export default HistoryTab;
