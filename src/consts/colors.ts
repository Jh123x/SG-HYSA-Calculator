import { createTheme, Theme } from "@mui/material";

export const primaryColor: string = "#9550ff";
export const bgColor: string = "#282828";
export const textColor: string = "#FFFFFF";
export const dangerColor: string = "#d32f2f";

/** Shared dark-theme ToggleButton styling used across all page-level toggle groups. */
export const TOGGLE_SX = {
  color: textColor,
  borderColor: `${textColor}40`,
  textTransform: "none" as const,
  fontSize: "0.8rem",
  "&.Mui-selected": { color: "#fff", backgroundColor: primaryColor },
  "&.Mui-selected:hover": { backgroundColor: primaryColor, opacity: 0.9 },
  "&:hover": { backgroundColor: `${primaryColor}18`, borderColor: primaryColor },
};
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

export const theme: Theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: bgColor,
    },
  },
});
