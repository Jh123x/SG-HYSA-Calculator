import { createTheme, type Theme, type SxProps } from "@mui/material";
import type { Components } from "@mui/material/styles/components";

// ── Color palettes ───────────────────────────────────────────────

const darkPalette = {
  bgColor: "#0a0a0c",
  surfaceColor: "#131316",
  textColor: "#fafafa",
  mutedColor: "#86868b",
  borderColor: "rgba(255,255,255,0.04)",
  tooltipBg: "#1c1c1e",
} as const;

const lightPalette = {
  bgColor: "#ffffff",
  surfaceColor: "#f5f5f7",
  textColor: "#1d1d1f",
  mutedColor: "#6e6e73",
  borderColor: "rgba(0,0,0,0.08)",
  tooltipBg: "#f5f5f7",
} as const;

// ── Static colors (same in both modes) ───────────────────────────

export const primaryColor = "#5b5bd6";
export const accentGreen = "#34d058";
export const accentAmber = "#f5a623";
export const dangerColor = "#f44b42";

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

// ── Dynamic colors (module-level mutable vars) ───────────────────
// These are exported as `let` variables so their values can be updated
// at runtime via setThemeMode(). Components import them directly and
// re-read on each render — no hooks needed for most consumers.

export let bgColor: string = darkPalette.bgColor;
export let surfaceColor: string = darkPalette.surfaceColor;
export let textColor: string = darkPalette.textColor;
export let mutedColor: string = darkPalette.mutedColor;
export let borderColor: string = darkPalette.borderColor;
export let tooltipBg: string = darkPalette.tooltipBg;

export function setThemeMode(mode: "light" | "dark") {
  const p = mode === "light" ? lightPalette : darkPalette;
  bgColor = p.bgColor;
  surfaceColor = p.surfaceColor;
  textColor = p.textColor;
  mutedColor = p.mutedColor;
  borderColor = p.borderColor;
  tooltipBg = p.tooltipBg;
}

// ── Reusable style fragments ─────────────────────────────────────

/** ToggleButton overrides that vary per use case (added on top of theme defaults). */
export const TOGGLE_SX: SxProps<Theme> = {
  fontSize: "0.8rem",
};

// ── Component overrides factories ────────────────────────────────
// These are called during theme construction so they capture the
// correct palette values at build time.

function buildComponents(mode: "light" | "dark"): Components {
  const p = mode === "light" ? lightPalette : darkPalette;
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: p.surfaceColor,
          border: `1px solid ${p.borderColor}`,
          backgroundImage: "none", // strip default MUI gradient
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: p.surfaceColor,
          borderBottom: `1px solid ${p.borderColor}`,
        },
        head: {
          fontWeight: 600,
          color: p.mutedColor,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: p.mutedColor,
          borderColor: p.borderColor,
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
        outlined: { borderColor: p.borderColor, color: p.mutedColor },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: p.surfaceColor,
          border: `1px solid ${p.borderColor}`,
          backdropFilter: "blur(20px)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: p.textColor,
          backgroundColor: p.surfaceColor,
          borderRadius: 8,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: p.borderColor,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${primaryColor}50`,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: primaryColor,
          },
          "& .MuiSvgIcon-root": {
            color: p.mutedColor,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            color: p.textColor,
            backgroundColor: p.surfaceColor,
            borderRadius: 8,
            "& fieldset": { borderColor: p.borderColor },
            "&:hover fieldset": { borderColor: `${primaryColor}50` },
            "&.Mui-focused fieldset": { borderColor: primaryColor },
          },
          "& .MuiInputLabel-root": { color: p.mutedColor },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: p.tooltipBg,
          color: p.textColor,
          borderRadius: 6,
          fontSize: "0.75rem",
          padding: "6px 10px",
          border: `1px solid ${p.borderColor}`,
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
}

// ── MUI Themes ───────────────────────────────────────────────────

function buildTheme(mode: "light" | "dark"): Theme {
  const p = mode === "light" ? lightPalette : darkPalette;
  return createTheme({
    palette: {
      mode,
      primary: { main: primaryColor },
      background: { default: p.bgColor, paper: p.surfaceColor },
      text: { primary: p.textColor, secondary: p.mutedColor },
      error: { main: dangerColor },
      warning: { main: accentAmber },
      success: { main: accentGreen },
    },
    typography: {
      fontFamily: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Inter, sans-serif`,
    },
    components: buildComponents(mode),
  });
}

export const darkTheme = buildTheme("dark");
export const lightTheme = buildTheme("light");
