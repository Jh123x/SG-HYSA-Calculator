import { useSearchParams } from "react-router-dom";
import { Box, Typography, useMediaQuery, Paper } from "@mui/material";
import { bankInfo } from "../logic/constants";
import type Profile from "../types/profile";
import { BankToggleChips } from "../Components/BankToggleChips";
import { ComparisonChart } from "../Components/ComparisonChart";
import { BankHistorySection } from "../Components/BankHistorySection";
import { textColor } from "../consts/colors";

interface Props {
  profile: Profile;
}

/**
 * Rate History tab.
 *
 * - Bank filter chips (synced to ?banks= URL param)
 * - Comparison overlay chart when 1+ banks selected (desktop only)
 * - Per-bank detail sections always visible (with drop-down on mobile)
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

export const HistoryTab = ({ profile }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBanks = readBanksFromParams(searchParams);
  const isSmallScreen = useMediaQuery("(max-width:640px)");

  const handleBankChange = (banks: string[]) => {
    setSearchParams(writeBanksToParams(banks, searchParams), {
      replace: true,
    });
  };

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

      {/* Comparison chart — desktop only */}
      {!isSmallScreen && selectedBanks.length >= 1 && (
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

      {/* Per-bank detail sections — always visible */}
      {selectedBanks.length > 0 && (
        <Box sx={{ mt: 1 }}>
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
