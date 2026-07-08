import { IconButton, Tooltip } from "@mui/material";
import { useThemeMode } from "../hooks/useThemeMode";
import { mutedColor, primaryColor } from "../consts/theme";

/**
 * Light/dark mode toggle button for the header.
 * Shows ☀️ in dark mode (to switch TO light) and 🌙 in light mode (to switch TO dark).
 */
export const ModeToggle = () => {
  const { mode, toggle } = useThemeMode();

  return (
    <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggle}
        size="small"
        sx={{
          color: mutedColor,
          fontSize: "1.1rem",
          "&:hover": { color: primaryColor },
        }}
        aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {mode === "dark" ? "☀️" : "🌙"}
      </IconButton>
    </Tooltip>
  );
};
