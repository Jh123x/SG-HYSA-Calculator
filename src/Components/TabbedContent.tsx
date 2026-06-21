import { Outlet, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ErrorBoundary } from "./ErrorBoundary";
import { FormInputs } from "./Inputs";
import { primaryColor, textColor } from "../consts/colors";
import { useMobile } from "../hooks/useMobile";
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
 * Tabbed content — early split: Mobile and Desktop are completely separate
 * component trees for clarity and maintainability.
 */
export const TabbedContent = () => {
  const ctx = useOutletContext<LayoutContext>();
  const { isMobile } = useMobile();

  if (isMobile) {
    return <TabbedContentMobile ctx={ctx} />;
  }
  return <TabbedContentDesktop ctx={ctx} />;
};

// ── Desktop: inputs (natural height) → content fills viewport ──

const TabbedContentDesktop = ({ ctx }: { ctx: LayoutContext }) => {
  const { currProfile, setCurrProfile, pendingUrlProfile, onAcceptShared, onRejectShared } = ctx;
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname === "/history" ? "history" : "current";

  const toggleGroup = (
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
  );

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
      {/* Inputs — natural height, no internal scroll */}
      <Box
        sx={{
          flexShrink: 0,
          pt: 2,
          pb: 1,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <ErrorBoundary>
          <FormInputs
            currProfile={currProfile}
            setCurrProfile={setCurrProfile}
            pendingUrlProfile={pendingUrlProfile}
            onAcceptShared={onAcceptShared}
            onRejectShared={onRejectShared}
            leftChildren={toggleGroup}
          />
        </ErrorBoundary>
      </Box>

      {/* Content — fills remaining viewport, scrolls as a whole page */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

// ── Mobile: single continuous flow, no compartments ──────────────

const TabbedContentMobile = ({ ctx }: { ctx: LayoutContext }) => {
  const { currProfile, setCurrProfile, pendingUrlProfile, onAcceptShared, onRejectShared } = ctx;
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname === "/history" ? "history" : "current";

  return (
    <Box component="section" aria-label="Savings calculator" sx={{ pt: 1 }}>
      {/* Inputs — natural flow */}
      <ErrorBoundary>
        <FormInputs
          currProfile={currProfile}
          setCurrProfile={setCurrProfile}
          pendingUrlProfile={pendingUrlProfile}
          onAcceptShared={onAcceptShared}
          onRejectShared={onRejectShared}
        />
      </ErrorBoundary>

      {/* Toggle buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, mb: 1.5 }}>
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
            History
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content — natural flow, no internal scroll */}
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </Box>
  );
};
