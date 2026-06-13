import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { textColor, primaryColor, bgColor } from "../consts/colors";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import type Profile from "../types/profile";
import { MAX_COMPARISON_BANKS } from "../consts/keys";

interface BankToggleChipsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  profile: Profile;
}

/**
 * A responsive grid of toggleable chips for selecting banks.
 *
 * Features:
 * - Max {MAX_COMPARISON_BANKS} banks can be selected at once
 * - Text filter to narrow down visible chips
 * - Select All / Clear quick actions
 * - Each chip shows the bank name + current EIR
 * - Already-selected chips stay visible even when filter doesn't match
 */
export const BankToggleChips = ({
  selected,
  onChange,
  profile,
}: BankToggleChipsProps) => {
  const [filter, setFilter] = useState("");

  // Pre-compute current EIR for display on chips
  const bankEirs = useMemo(() => {
    const eirs: Record<string, string> = {};
    for (const [name, info] of Object.entries(bankInfo)) {
      const { interestFn } = deriveCurrentFromHistory(info.history);
      eirs[name] = interestFn(profile).toYearlyPercent().toFixed(2);
    }
    return eirs;
  }, [profile]);

  const allBankNames = Object.keys(bankInfo);

  const handleToggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else if (selected.length < MAX_COMPARISON_BANKS) {
      onChange([...selected, name]);
    }
    // If at max, ignore
  };

  const handleSelectAll = () => {
    onChange(allBankNames.slice(0, MAX_COMPARISON_BANKS));
  };

  const handleClear = () => {
    onChange([]);
  };

  // Determine which chips to show based on filter
  const lowerFilter = filter.toLowerCase();
  const visibleBanks = filter
    ? allBankNames.filter(
        (name) =>
          name.toLowerCase().includes(lowerFilter) || selected.includes(name),
      )
    : allBankNames;

  const isMaxed = selected.length >= MAX_COMPARISON_BANKS;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Controls row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1.5,
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          placeholder="Filter banks..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: textColor, opacity: 0.6 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: "1 1 200px",
            maxWidth: "300px",
            "& .MuiOutlinedInput-root": {
              color: textColor,
              "& fieldset": { borderColor: `${textColor}40` },
              "&:hover fieldset": { borderColor: primaryColor },
            },
          }}
        />
        <Button
          size="small"
          variant="outlined"
          onClick={handleSelectAll}
          disabled={isMaxed}
          sx={{
            color: textColor,
            borderColor: `${textColor}40`,
            textTransform: "none",
          }}
        >
          Select All
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleClear}
          disabled={selected.length === 0}
          sx={{
            color: textColor,
            borderColor: `${textColor}40`,
            textTransform: "none",
          }}
        >
          Clear
        </Button>
        <Typography variant="caption" sx={{ color: textColor, opacity: 0.7 }}>
          {selected.length}/{MAX_COMPARISON_BANKS} selected
        </Typography>
      </Box>

      {/* Chip grid */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {visibleBanks.map((name) => {
          const isSelected = selected.includes(name);
          const eir = bankEirs[name];

          return (
            <Chip
              key={name}
              label={
                <Box component="span" sx={{ display: "flex", gap: 0.5 }}>
                  <span>{name}</span>
                  <span
                    style={{
                      opacity: 0.7,
                      fontSize: "0.8em",
                    }}
                  >
                    {profile.Savings > 0 ? `${eir}%` : ""}
                  </span>
                </Box>
              }
              onClick={() => handleToggle(name)}
              variant={isSelected ? "filled" : "outlined"}
              sx={{
                backgroundColor: isSelected ? primaryColor : "transparent",
                color: isSelected ? "#fff" : textColor,
                borderColor: isSelected ? primaryColor : `${textColor}30`,
                opacity: !isSelected && isMaxed ? 0.5 : 1,
                cursor: !isSelected && isMaxed ? "not-allowed" : "pointer",
                fontWeight: isSelected ? 600 : 400,
                "&:hover": {
                  backgroundColor: isSelected
                    ? primaryColor
                    : `${primaryColor}20`,
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};
