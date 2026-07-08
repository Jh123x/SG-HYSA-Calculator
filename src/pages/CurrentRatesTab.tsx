import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { ResultProp } from "../types/props";
import { bgColor, textColor, accentGreen, TOGGLE_SX } from "../consts/theme";
import { useMobile } from "../hooks/useMobile";
import type Profile from "../types/profile";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { InterestGraph } from "../Components/InterestGraph";
import { ThreePanelLayout } from "../Components/ThreePanelLayout";
import { BankWidgetCard } from "../Components/BankWidgetCard";

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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Sort controls — inside cards panel */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
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
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: accentGreen },
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
            {/* Cards grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 2,
                alignContent: "start",
              }}
            >
              {sortedResults.map(([slug, interest]) => (
                <div key={slug}>
                  <BankWidgetCard
                    slug={slug}
                    name={bankInfo[slug]?.name ?? slug}
                    eir={interest.interest.toYearlyPercent() ?? 0}
                    yearlyInterest={interest.interest.toYearly() ?? 0}
                    remarks={bankInfo[slug]?.remarks}
                    url={interest.url}
                    onClick={() => navigate(`/bank/${slug}`)}
                  />
                </div>
              ))}
            </Box>
          </Box>
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
    <Box component="section" aria-label="Current interest rates comparison">
      <Typography
        component="h2"
        variant="h5"
        sx={{ color: textColor, fontWeight: 600, mb: 2, fontSize: { xs: "1rem", sm: "1.1rem" } }}
      >
        Rate Comparison
      </Typography>
      {/* Graph + asterisks together */}
      <InterestGraph
        profile={profile}
        height={340}
      />

      {/* Sort bar: dropdown + asc/desc toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
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
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: accentGreen },
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
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {mobileSorted.map(([slug, interest]) => (
          <div key={slug}>
            <BankWidgetCard
              slug={slug}
              name={bankInfo[slug]?.name ?? slug}
              eir={interest.interest.toYearlyPercent() ?? 0}
              yearlyInterest={interest.interest.toYearly() ?? 0}
              remarks={bankInfo[slug]?.remarks}
              url={interest.url}
              onClick={() => navigate(`/bank/${slug}`)}
            />
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default CurrentRatesTab;

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
