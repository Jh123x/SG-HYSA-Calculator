import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, useMediaQuery, Paper } from "@mui/material";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import type Profile from "../types/profile";
import { BankToggleChips } from "../Components/BankToggleChips";
import { ComparisonChart } from "../Components/ComparisonChart";
import { BankHistorySection } from "../Components/BankHistorySection";
import { textColor } from "../consts/colors";
import { FAVORITES_KEY, MAX_COMPARISON_BANKS } from "../consts/keys";

interface Props {
  profile: Profile;
}

/**
 * Rate History tab.
 *
 * - Bank filter chips (synced to ?banks= URL param)
 * - Default selection: favorites from localStorage, or top 3 by EIR
 * - Comparison overlay chart when 2+ banks selected (max 3)
 * - Per-bank detail sections below
 */

const BANKS_PARAM = "banks";

function readBanksFromParams(params: URLSearchParams): string[] {
  const raw = params.get(BANKS_PARAM);
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && bankInfo[s] !== undefined);
}

function writeBanksToParams(
  banks: string[],
  existingParams: URLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(existingParams);
  if (banks.length === 0) {
    next.delete(BANKS_PARAM);
  } else {
    next.set(BANKS_PARAM, banks.join(","));
  }
  return next;
}

/** Get default banks: favorites → top N by EIR. */
function getDefaultBanks(profile: Profile): string[] {
  // 1. Try favorites from localStorage
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) {
      const favs: string[] = JSON.parse(raw);
      const valid = favs.filter((f) => bankInfo[f] !== undefined);
      if (valid.length > 0) return valid.slice(0, MAX_COMPARISON_BANKS);
    }
  } catch {
    // Ignore parse errors
  }

  // 2. Fall back to top N by EIR
  if (profile.Savings === 0) return [];
  const ranked = Object.entries(bankInfo)
    .map(([name, info]) => {
      const { interestFn } = deriveCurrentFromHistory(info.history);
      return {
        name,
        eir: interestFn(profile).toYearlyPercent(),
      };
    })
    .sort((a, b) => b.eir - a.eir);
  return ranked.slice(0, MAX_COMPARISON_BANKS).map((r) => r.name);
}

export const HistoryTab = ({ profile }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBanks = readBanksFromParams(searchParams);
  const isSmallScreen = useMediaQuery("(max-width:640px)");

  // Initialize default selection on first load (only when URL has no banks param)
  const hasExplicitParam = searchParams.has(BANKS_PARAM);
  useEffect(() => {
    if (!hasExplicitParam) {
      const defaults = getDefaultBanks(profile);
      if (defaults.length > 0) {
        setSearchParams(
          writeBanksToParams(defaults, searchParams),
          { replace: true },
        );
      }
    }
    // Only run on mount / when profile changes and there's no param
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasExplicitParam, profile.Savings]);

  const handleBankChange = (banks: string[]) => {
    setSearchParams(writeBanksToParams(banks, searchParams), {
      replace: true,
    });
  };

  if (isSmallScreen) {
    return (
      <Paper
        sx={{
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          mt: 3,
        }}
      >
        <Typography variant="body1" color={textColor}>
          Please view on a larger screen to see the rate history charts.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="h6"
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

      {/* Comparison chart — only when 2+ banks selected */}
      {selectedBanks.length >= 2 && (
        <ComparisonChart
          selectedBanks={selectedBanks}
          profile={profile}
        />
      )}

      {/* Per-bank detail sections */}
      {selectedBanks.length > 0 && (
        <Box sx={{ mt: selectedBanks.length >= 2 ? 0 : 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: textColor, fontWeight: 600, mb: 2 }}
          >
            Details
          </Typography>
          {selectedBanks.map((bankName) => (
            <BankHistorySection
              key={bankName}
              bankName={bankName}
              profile={profile}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
