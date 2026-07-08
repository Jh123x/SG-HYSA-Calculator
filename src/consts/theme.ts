import { createTheme, Theme, type Components, type SxProps } from "@mui/material";

// ── Stripe / Apple-inspired color primitives ──────────────────────

export const bgColor = "#0a0a0c";
export const surfaceColor = "#131316";
export const textColor = "#fafafa";
export const mutedColor = "#86868b";
export const primaryColor = "#5b5bd6";
export const accentGreen = "#34d058";
export const accentAmber = "#f5a623";
export const dangerColor = "#f44b42";
export const borderColor = "rgba(255,255,255,0.04)";

export const lineColors: string[] = [
  "#5b5bd6", // blue-purple
  "#34d058", // green
  "#f5a623", // amber
  "#ff6b4a", // coral
  "#a78bfa", // violet
  "#f44b42", // red
  "#67b8f7", // sky
  "#56d470", // light green
  "#f7c948", // gold
  "#ff9175", // light coral
  "#c4b5fd", // light violet
  "#fb7b70", // light red
  "#93cbfa", // pale sky
  "#8ae39b", // pale green
  "#fad87a", // pale gold
  "#ffb399", // pale coral
  "#e0d4fd", // pale violet
  "#fca9a2", // pale red
  "#f5f5f7", // off-white
  "#484850", // dark gray
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
        backgroundImage: "none", // strip default MUI gradient
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
          backgroundColor: `${primaryColor}14`,
          borderColor: `${primaryColor}40`,
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
        backdropFilter: "blur(20px)",
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
          borderColor: `${primaryColor}50`,
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
          "&:hover fieldset": { borderColor: `${primaryColor}50` },
          "&.Mui-focused fieldset": { borderColor: primaryColor },
        },
        "& .MuiInputLabel-root": { color: mutedColor },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: "#1c1c1e",
        color: textColor,
        borderRadius: 6,
        fontSize: "0.75rem",
        padding: "6px 10px",
        border: `1px solid ${borderColor}`,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 8,
        fontWeight: 500,
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
    fontFamily: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Inter, sans-serif`,
  },
  components,
});
