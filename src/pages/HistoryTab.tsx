import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import { isValidSlug } from "../logic/slugs";
import type Profile from "../types/profile";
import { BankToggleChips } from "../Components/BankToggleChips";
import { ComparisonChart } from "../Components/ComparisonChart";
import { BankHistorySection } from "../Components/BankHistorySection";
import { textColor } from "../consts/colors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

interface Props {
  profile: Profile;
}

/**
 * Rate History tab.
 *
 * - Bank filter chips (primary state lives in sessionStorage)
 * - Comparison overlay chart when 1+ banks selected
 * - Per-bank detail sections always visible
 *
 * Bank selection persists across tab switches via sessionStorage.
 * URL param (?banks=) is only consumed on initial load for shareability
 * and then cleared — all subsequent updates go to sessionStorage only.
 *
 * Bank identifiers are slugs (e.g. "uob-one-account").
 */

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

export const HistoryTab = ({ profile }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBanks = readSessionBanks();

  useDocumentTitle("Rate Change History — Track Singapore HYSA Interest Rates Over Time");

  // On first mount: if URL has ?banks=, hydrate sessionStorage and clean URL
  const urlBanks = useMemo(
    () => (searchParams.get(BANKS_PARAM) ? parseBanksRaw(searchParams.get(BANKS_PARAM)!) : null),
    // Only run once — parseBanksRaw is stable, and we only care about initial URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (urlBanks && urlBanks.length > 0) {
      sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(urlBanks));
      // Remove ?banks= from URL so subsequent navigations use sessionStorage
      const next = new URLSearchParams(searchParams);
      next.delete(BANKS_PARAM);
      setSearchParams(next, { replace: true });
    }
    // Run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBankChange = (banks: string[]) => {
    sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(banks));
    // Force re-read via state change — use searchParams trick
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      // Keep a minimal signal; actual value is in sessionStorage
      if (banks.length > 0) {
        next.set(BANKS_PARAM, banks.join(","));
      } else {
        next.delete(BANKS_PARAM);
      }
      return next;
    }, { replace: true });
  };

  return (
    <Box component="section" aria-label="Interest rate change history" sx={{ mt: 3 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ color: textColor, mb: 2, fontWeight: 600 }}
      >
        Rate Change History
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: textColor, mb: 2, opacity: 0.7 }}
      >
        Interest calculated for your current profile (
        {profile.Savings
          ? `$${profile.Savings.toLocaleString()} savings`
          : "enter savings to see rates"}
        )
      </Typography>

      <BankToggleChips
        selected={selectedBanks}
        onChange={handleBankChange}
        profile={profile}
      />

      {/* Comparison chart */}
      {selectedBanks.length >= 1 && (
        <ComparisonChart
          selectedBanks={selectedBanks}
          profile={profile}
        />
      )}

      {/* Prompt when no banks selected */}
      {selectedBanks.length === 0 && (
        <Paper
          sx={{
            p: 4,
            borderRadius: "10px",
            textAlign: "center",
            mb: 3,
          }}
        >
          <Typography variant="body1" color={textColor} sx={{ opacity: 0.7 }}>
            Select one or more banks above to view their rate history.
          </Typography>
        </Paper>
      )}

      {/* Per-bank detail sections */}
      {selectedBanks.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: textColor, fontWeight: 600, mb: 2 }}
          >
            Details
          </Typography>
          {selectedBanks.map((slug) => (
            <BankHistorySection
              key={slug}
              bankSlug={slug}
              profile={profile}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};