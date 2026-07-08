import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Typography,
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
  Chip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { ResultProp } from "../types/props";
import { primaryColor, mutedColor, bgColor, textColor, TOGGLE_SX, FACTOR_CHIP_SX } from "../consts/theme";
import { useMobile } from "../hooks/useMobile";
import type Profile from "../types/profile";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { InterestGraph } from "../Components/InterestGraph";
import { ThreePanelLayout } from "../Components/ThreePanelLayout";

type SortableColumns = "name" | "yearlyInterest" | "effectiveInterest";

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
  const { isMobile } = useMobile();

  return (
    <>
      <Helmet>
        <title>[SG] High Yield Savings Account Calculator — Compare &amp; Maximise Your Interest</title>
        <meta name="description" content="Compare Singapore's best high yield savings accounts (HYSA) side by side. Calculate interest for UOB One, OCBC 360, DBS Multiplier, Maribank, Trust Bank, GXS, and more. Updated regularly with latest rates." />
        <meta property="og:title" content="[SG] High Yield Savings Account Calculator — Compare &amp; Maximise Your Interest" />
        <meta property="og:description" content="Compare Singapore's best high yield savings accounts (HYSA) side by side. Calculate interest for UOB One, OCBC 360, DBS Multiplier, Maribank, Trust Bank, GXS, and more." />
        <meta property="og:url" content="https://hysa.jh123x.com/" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hysa.jh123x.com/" />
      </Helmet>
      {isMobile ? (
        <CurrentRatesTabMobile profile={profile} />
      ) : (
        <CurrentRatesTabDesktop profile={profile} />
      )}
    </>
  );
};

// ── Desktop ───────────────────────────────────────────────────────

const CurrentRatesTabDesktop = ({ profile }: Props) => {
  const navigate = useNavigate();
  const [orderBy, setOrderBy] = useState<SortableColumns>("effectiveInterest");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const results = useResults(profile);

  const sortedResults = useMemo(() => {
    return sortEntries(results, orderBy, order);
  }, [results, orderBy, order]);

  return (
    <>
      <Typography
        component="h2"
        variant="h5"
        sx={{ color: textColor, fontWeight: 600, mb: 1, fontSize: { xs: "1rem", sm: "1.1rem" } }}
      >
        Rate Comparison
      </Typography>
      <ThreePanelLayout
      aria-label="Current interest rates comparison"
        bottomLeft={
          <Box sx={{ height: "40vh", minHeight: 0 }}>
            <InterestGraph
            profile={profile}
            height="fill"
          />
        </Box>
      }
      bottomRight={
        <>
          {/* Sort bar: dropdown + asc/desc toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <SortIcon sx={{ color: textColor, fontSize: 20 }} />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={orderBy}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "name" || val === "yearlyInterest" || val === "effectiveInterest") {
                    setOrderBy(val);
                  }
                }}
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
              value={order}
              exclusive
              size="small"
              onChange={(_, v) => v && setOrder(v)}
            >
              <ToggleButton value="asc" aria-label="Sort ascending" sx={{ ...TOGGLE_SX, px: 1, "&.Mui-selected:hover": { opacity: 0.85 } }}>
                <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />Asc
              </ToggleButton>
              <ToggleButton value="desc" aria-label="Sort descending" sx={{ ...TOGGLE_SX, px: 1, "&.Mui-selected:hover": { opacity: 0.85 } }}>
                <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />Desc
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Card grid */}
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 2,
            pb: 1,
          }}>
            {sortedResults.map(([slug, interest]) => (
              <Card key={slug} sx={{
                backgroundColor: bgColor,
                border: `1px solid ${textColor}10`,
                borderRadius: 2,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": { transform: "scale(1.01)", boxShadow: `0 4px 20px ${primaryColor}20` },
              }}>
                <CardActionArea onClick={() => navigate(`/bank/${slug}`)} sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "flex-start", height: "100%" }}>
                  {/* Bank name */}
                  <Typography sx={{ color: textColor, fontWeight: 600, fontSize: "0.95rem", mb: 0.5 }}>
                    {bankInfo[slug]?.name ?? slug}
                  </Typography>

                  {/* Factor chips — single row with dynamic overflow */}
                  {bankInfo[slug]?.factors && bankInfo[slug].factors.length > 0 && (
                    <ChipRow factors={bankInfo[slug].factors} />
                  )}

                  {/* EIR large */}
                  <Box sx={{ mt: "auto", textAlign: "center", width: "100%" }}>
                    <Typography sx={{ color: primaryColor, fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}>
                      {(interest.interest.toYearlyPercent() ?? 0).toFixed(2)}%
                    </Typography>
                    <Typography sx={{ color: mutedColor, fontSize: "0.75rem" }}>
                      EIR
                    </Typography>
                  </Box>

                  {/* Yearly interest */}
                  <Typography sx={{ color: textColor, fontSize: "1rem", fontWeight: 600, mt: 0.5, textAlign: "center", width: "100%" }}>
                    ${(interest.interest.toYearly() ?? 0).toFixed(2)}/yr
                  </Typography>

                  {/* Remarks — truncated */}
                  {bankInfo[slug]?.remarks && (
                    <Tooltip title={bankInfo[slug].remarks} placement="top">
                      <Typography sx={{ color: mutedColor, fontSize: "0.65rem", mt: 0.5, textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {bankInfo[slug].remarks}
                      </Typography>
                    </Tooltip>
                  )}
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </>
      }
    />
    </>
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
    <Box component="section" aria-label="Current interest rates comparison" sx={{ overflow: "hidden", maxWidth: "100%", pt: 1 }}>
      <Typography
        component="h2"
        variant="h5"
        sx={{ color: textColor, fontWeight: 600, mb: 2, fontSize: { xs: "1rem", sm: "1.1rem" } }}
      >
        Rate Comparison
      </Typography>
      {/* Graph + asterisks together */}
      <Box sx={{ mb: 2.5 }}>
        <InterestGraph
          profile={profile}
          height={340}
        />
      </Box>

      {/* Sort bar: dropdown + asc/desc toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, flexWrap: "wrap" }}>
        <SortIcon sx={{ color: textColor, fontSize: 20 }} />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={mobileSort}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "name" || val === "yearlyInterest" || val === "effectiveInterest") {
                setMobileSort(val);
              }
            }}
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
          <ToggleButton value="asc" aria-label="Sort ascending" sx={{ ...TOGGLE_SX, px: 1, "&.Mui-selected:hover": { opacity: 0.85 } }}>
            <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />Asc
          </ToggleButton>
          <ToggleButton value="desc" aria-label="Sort descending" sx={{ ...TOGGLE_SX, px: 1, "&.Mui-selected:hover": { opacity: 0.85 } }}>
            <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />Desc
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Cards — stacked */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%", overflow: "hidden" }}>
        {mobileSorted.map(([slug, interest]) => (
          <Card
            key={slug}
            sx={{
              backgroundColor: bgColor,
              border: "1px solid rgba(255,255,255,0.08)",

            }}
          >
            <CardActionArea
              onClick={() => navigate(`/bank/${slug}`)}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", minWidth: 0 }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 }, flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ color: textColor, fontWeight: 600, mb: 0.25, fontSize: "0.9rem" }}>
                  {bankInfo[slug]?.name ?? slug}
                </Typography>
                {bankInfo[slug]?.factors && bankInfo[slug].factors.length > 0 && (
                  <ChipRow factors={bankInfo[slug].factors} />
                )}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: textColor, opacity: 0.6, fontSize: "0.7rem" }}>
                      Yearly Interest
                    </Typography>
                    <Typography variant="body2" sx={{ color: textColor, fontWeight: 600, fontSize: "1rem" }}>
                      ${(interest.interest.toYearly() ?? 0).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: textColor, opacity: 0.6, fontSize: "0.7rem" }}>
                      EIR
                    </Typography>
                    <Typography variant="body2" sx={{ color: textColor, fontWeight: 600, fontSize: "1.1rem" }}>
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
                  <IconButton component="span" size="small" onClick={(e) => { e.stopPropagation(); navigate(`/bank/${slug}`); }} sx={{ color: primaryColor }}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {interest.url && (
                  <Tooltip title="Visit official website" placement="right">
                    <IconButton component="span" size="small" onClick={(e) => { e.stopPropagation(); window.open(interest.url, '_blank', 'noopener,noreferrer'); }} sx={{ color: primaryColor }}>
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

export default CurrentRatesTab;

// ── ChipRow component ──────────────────────────────────────────────

/** Single-row chip display with dynamic overflow detection.
 *  Renders all chips, measures available width via useLayoutEffect,
 *  and shows a "+N" badge with Tooltip for any overflow. */
function ChipRow({ factors }: { factors: string[] }) {
  const [visibleCount, setVisibleCount] = useState(factors.length);
  const chipRowRef = useRef<HTMLDivElement>(null);
  const measuredRef = useRef(false);

  useLayoutEffect(() => {
    const container = chipRowRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const containerWidth = container.getBoundingClientRect().width;
    const gap = 8; // 0.5rem gap = 8px at default 16px base
    const overflowBadgeWidth = 40;

    // First pass: measure total width of all chips
    let totalChipsWidth = 0;
    const chipWidths: number[] = [];
    for (let i = 0; i < children.length; i++) {
      chipWidths.push(children[i].getBoundingClientRect().width);
      if (i > 0) totalChipsWidth += gap;
      totalChipsWidth += chipWidths[i];
    }

    // If all chips fit, show all
    if (totalChipsWidth <= containerWidth) {
      if (visibleCount !== factors.length) {
        setVisibleCount(factors.length);
      }
      measuredRef.current = true;
      return;
    }

    // Otherwise, find how many full chips fit, reserving space for +N badge
    let usedWidth = 0;
    let count = 0;
    for (let i = 0; i < children.length; i++) {
      const needed = usedWidth === 0 ? chipWidths[i] : chipWidths[i] + gap;
      // Check if this chip plus the overflow badge fits
      if (usedWidth + needed + overflowBadgeWidth > containerWidth) break;
      usedWidth += needed;
      count++;
    }

    // Ensure at least 1 chip is shown
    const newCount = Math.max(1, Math.min(count, factors.length));
    if (newCount !== visibleCount) {
      setVisibleCount(newCount);
    }
    measuredRef.current = true;
  }, [factors.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Guard: if we haven't measured yet, render all chips (measurement pass)
  const showCount = measuredRef.current ? visibleCount : factors.length;
  const visible = factors.slice(0, showCount);
  const overflow = factors.slice(showCount);

  return (
    <Box
      ref={chipRowRef}
      sx={{ display: "flex", flexWrap: "nowrap", overflow: "hidden", gap: 0.5, mb: 1 }}
    >
      {visible.map((f) => (
        <Chip
          key={f}
          label={f}
          size="small"
          variant="outlined"
          sx={{ ...FACTOR_CHIP_SX, flexShrink: 0 }}
        />
      ))}
      {overflow.length > 0 && (
        <Tooltip title={overflow.join(", ")} placement="top">
          <Chip
            label={`+${overflow.length}`}
            size="small"
            variant="outlined"
            sx={{
              color: primaryColor,
              borderColor: `${primaryColor}60`,
              fontSize: "0.6rem",
              height: 20,
              fontWeight: 600,
              flexShrink: 0,
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────

function useResults(profile: Profile): Record<string, ResultProp> {
  return useMemo(() => {
    const map: Record<string, ResultProp> = {};
    for (const [slug, info] of Object.entries(bankInfo)) {
      const { interestFn, lastUpdated } = deriveCurrentFromHistory(info.history);
      map[slug] = {
        interest: interestFn(profile),
        url: info.url,
        remarks: info.remarks,
        lastUpdated,
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
