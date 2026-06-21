import { Outlet, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ErrorBoundary } from "./ErrorBoundary";
import { FormInputs } from "./Inputs";
import { primaryColor, textColor } from "../consts/colors";
import type Profile from "../types/profile";

/** Toggle button styling with hover response */
const TOGGLE_SX = {
  color: textColor,
  borderColor: `${textColor}40`,
  textTransform: "none" as const,
  fontWeight: 500,
  fontSize: { xs: "0.8rem", sm: "0.9rem" },
  px: { xs: 1.5, sm: 2 },
  transition: "all 0.2s ease",
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: primaryColor,
    fontWeight: 600,
  },
  "&.Mui-selected:hover": {
    backgroundColor: primaryColor,
    opacity: 0.85,
  },
  "&:hover": {
    backgroundColor: `${primaryColor}18`,
    borderColor: primaryColor,
  },
};

interface LayoutContext {
  currProfile: Profile;
  setCurrProfile: (p: Profile) => void;
  pendingUrlProfile: Profile | null;
  onAcceptShared: () => void;
  onRejectShared: () => void;
}

/**
 * Tabbed content area — redesigned with:
 * - ToggleButtonGroup above inputs for tab navigation (left-aligned)
 * - All data / Clear / Share at bottom-right of top section
 * - Single scrollable page: inputs section (scrollable) + content area (scrollable)
 */
export const TabbedContent = () => {
  const { currProfile, setCurrProfile, pendingUrlProfile, onAcceptShared, onRejectShared } =
    useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname === "/history" ? "history" : "current";

  return (
    <Box
      component="section"
      aria-label="Savings calculator"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Top section: Toggles + Inputs + Action buttons (scrollable) ── */}
      <Box
        sx={{
          flexShrink: 0,
          overflowY: "auto",
          maxHeight: { xs: "45vh", sm: "50vh" },
          pt: { xs: 1, sm: 2 },
          pb: 1,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Input fields */}
        <ErrorBoundary>
          <FormInputs
            currProfile={currProfile}
            setCurrProfile={setCurrProfile}
            pendingUrlProfile={pendingUrlProfile}
            onAcceptShared={onAcceptShared}
            onRejectShared={onRejectShared}
          />
        </ErrorBoundary>

        {/* Toggle button group — left-aligned on desktop, below inputs on mobile */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={(_, v) => {
              if (v) navigate(v === "history" ? "/history" : "/");
            }}
            size="small"
          >
            <ToggleButton value="current" sx={TOGGLE_SX}>
              Current Rates
            </ToggleButton>
            <ToggleButton value="history" sx={TOGGLE_SX}>
              Rate Change History
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* ── Content area (scrollable) ── */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          py: { xs: 1, sm: 2 },
        }}
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
    </Box>
  );
};
