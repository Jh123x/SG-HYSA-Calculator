import { createTheme, Theme, type Components, type SxProps } from "@mui/material";

// ── Color primitives ─────────────────────────────────────────────

export const primaryColor = "#9550ff";
export const bgColor = "#282828";
export const textColor = "#FFFFFF";
export const dangerColor = "#d32f2f";

export const lineColors: string[] = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#42d4f4",
  "#f032e6",
  "#bfef45",
  "#fabed4",
  "#469990",
  "#9a6324", // Brown
  "#fffac8", // Beige
  "#800000", // Maroon
  "#aaffc3", // Mint
  "#808000", // Olive
  "#ffd8b1", // Apricot
  "#000075", // Navy
  "#a9a9a9", // Grey
  "#ffffff", // White
  "#000000", // Black
  "#e6beff", // Lavender
  "#dcbeff", // Mauve
];

// ── Reusable style fragments ─────────────────────────────────────

/** ToggleButton overrides that vary per use case (added on top of theme defaults). */
export const TOGGLE_SX: SxProps<Theme> = {
  fontSize: "0.8rem",
};

// ── Component overrides ──────────────────────────────────────────

const components: Components = {
  MuiPaper: {
    styleOverrides: {
      root: { borderRadius: 10 },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: { backgroundColor: bgColor },
      head: { fontWeight: 600 },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        color: textColor,
        borderColor: `${textColor}40`,
        textTransform: "none",
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
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      outlined: { borderColor: `${textColor}30` },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: { backgroundColor: bgColor },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
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
        "& .MuiSvgIcon-root": {
          color: textColor,
        },
      },
    },
  },
};

// ── Theme ────────────────────────────────────────────────────────

export const theme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: primaryColor },
    background: { default: bgColor },
    text: { primary: textColor },
    error: { main: dangerColor },
  },
  components,
});
