import { useMemo } from "react";
import {
  Box,
  Autocomplete,
  TextField,
  Typography,
  Button,
} from "@mui/material";
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
 * A searchable multi-select for banks, optimized for mobile and desktop.
 *
 * - Autocomplete dropdown replaces the chip grid, saving screen real estate
 * - Each option shows bank name + current EIR
 * - Selected banks appear as chips in the input (limitTags=1 on mobile)
 * - Max {MAX_COMPARISON_BANKS} selectable
 * - "Select All" convenience button
 */
export const BankToggleChips = ({
  selected,
  onChange,
  profile,
}: BankToggleChipsProps) => {
  // Pre-compute current EIR for display in dropdown options
  const bankEirs = useMemo(() => {
    const eirs: Record<string, string> = {};
    for (const [name, info] of Object.entries(bankInfo)) {
      const { interestFn } = deriveCurrentFromHistory(info.history);
      eirs[name] = interestFn(profile).toYearlyPercent().toFixed(2);
    }
    return eirs;
  }, [profile]);

  const allBankNames = Object.keys(bankInfo);
  const isMaxed = selected.length >= MAX_COMPARISON_BANKS;

  const handleSelectAll = () => {
    onChange(allBankNames.slice(0, MAX_COMPARISON_BANKS));
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top row: Select All + counter */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={handleSelectAll}
          disabled={isMaxed}
          sx={{
            color: textColor,
            borderColor: `${textColor}40`,
            textTransform: "none",
            fontSize: "0.8rem",
            px: 1.5,
          }}
        >
          Select All
        </Button>
        <Typography variant="caption" sx={{ color: textColor, opacity: 0.7 }}>
          {selected.length}/{MAX_COMPARISON_BANKS} selected
        </Typography>
      </Box>

      {/* Searchable multi-select */}
      <Autocomplete
        multiple
        options={allBankNames}
        value={selected}
        onChange={(_event, newValue) => {
          // Enforce max (shouldn't exceed due to getOptionDisabled, but guard anyway)
          if (newValue.length <= MAX_COMPARISON_BANKS) {
            onChange(newValue);
          }
        }}
        getOptionDisabled={(option) =>
          !selected.includes(option) && isMaxed
        }
        // Show EIR next to each bank in the dropdown
        getOptionLabel={(option) => option}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Typography variant="body2">{option}</Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.65, fontSize: "0.85em", ml: 1 }}
              >
                {profile.Savings > 0 ? `${bankEirs[option]}%` : ""}
              </Typography>
            </Box>
          </li>
        )}
        // Show "+N more" on narrow screens instead of wrapping chips
        limitTags={1}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={
              selected.length === 0
                ? "Search banks..."
                : "Add more banks..."
            }
            size="small"
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                sx: {
                  color: textColor,
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: textColor,
                backgroundColor: bgColor,
                "& fieldset": { borderColor: `${textColor}40` },
                "&:hover fieldset": { borderColor: primaryColor },
                "&.Mui-focused fieldset": { borderColor: primaryColor },
              },
              "& .MuiInputBase-input::placeholder": {
                color: textColor,
                opacity: 0.5,
              },
            }}
          />
        )}
        // Style the dropdown
        slotProps={{
          paper: {
            sx: {
              backgroundColor: bgColor,
              border: `1px solid ${textColor}20`,
              "& .MuiAutocomplete-listbox": {
                "& .MuiAutocomplete-option": {
                  color: textColor,
                  "&.Mui-focused": {
                    backgroundColor: `${primaryColor}20`,
                  },
                  '&[aria-selected="true"]': {
                    backgroundColor: `${primaryColor}30`,
                  },
                  "&.Mui-disabled": {
                    opacity: 0.35,
                  },
                },
              },
            },
          },
          popper: {
            sx: {
              "& .MuiAutocomplete-listbox": {
                maxHeight: { xs: "60vh", sm: "40vh" },
              },
            },
          },
        }}
        disableCloseOnSelect
        noOptionsText="No banks match your search"
        fullWidth
      />
    </Box>
  );
};
