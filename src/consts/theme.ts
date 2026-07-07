import { createTheme, Theme, type Components, type SxProps } from "@mui/material";

// ── Geckoboard-inspired color primitives ─────────────────────────

export const bgColor = "#0d1117";
export const surfaceColor = "#161b22";
export const textColor = "#e6edf3";
export const mutedColor = "#8b949e";
export const primaryColor = "#58a6ff";
export const accentGreen = "#3fb950";
export const accentAmber = "#d29922";
export const dangerColor = "#f85149";
export const borderColor = "rgba(255,255,255,0.06)";

export const lineColors: string[] = [
  "#58a6ff", // blue
  "#3fb950", // green
  "#d29922", // amber
  "#f0883e", // orange
  "#bc8cff", // purple
  "#f85149", // red
  "#79c0ff", // light blue
  "#56d364", // light green
  "#e3b341", // light amber
  "#ffa657", // light orange
  "#d2a8ff", // light purple
  "#ff7b72", // light red
  "#a5d6ff", // pale blue
  "#7ee787", // pale green
  "#f0c976", // pale amber
  "#fdaa6b", // pale orange
  "#dbb4ff", // pale purple
  "#ffa198", // pale red
  "#e6edf3", // white-ish
  "#484f58", // dark gray
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
      root: {
        borderRadius: 12,
        backgroundColor: surfaceColor,
        border: `1px solid ${borderColor}`,
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        backgroundColor: surfaceColor,
        borderBottom: `1px solid ${borderColor}`,
      },
      head: {
        fontWeight: 600,
        color: mutedColor,
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        color: mutedColor,
        borderColor: borderColor,
        textTransform: "none",
        fontSize: "0.8rem",
        borderRadius: 8,
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
      outlined: { borderColor: borderColor, color: mutedColor },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        backgroundColor: surfaceColor,
        border: `1px solid ${borderColor}`,
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        color: textColor,
        backgroundColor: surfaceColor,
        borderRadius: 8,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: borderColor,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: primaryColor,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: primaryColor,
        },
        "& .MuiSvgIcon-root": {
          color: mutedColor,
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          color: textColor,
          backgroundColor: surfaceColor,
          borderRadius: 8,
          "& fieldset": { borderColor: borderColor },
          "&:hover fieldset": { borderColor: primaryColor },
          "&.Mui-focused fieldset": { borderColor: primaryColor },
        },
        "& .MuiInputLabel-root": { color: mutedColor },
      },
    },
  },
};

// ── Theme ────────────────────────────────────────────────────────

export const theme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: primaryColor },
    background: { default: bgColor, paper: surfaceColor },
    text: { primary: textColor, secondary: mutedColor },
    error: { main: dangerColor },
    warning: { main: accentAmber },
    success: { main: accentGreen },
  },
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif`,
  },
  components,
});
