import { Outlet, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { Box, Tabs, Tab, useMediaQuery, Container } from "@mui/material";
import { ErrorBoundary } from "./ErrorBoundary";
import { FormInputs } from "./Inputs";
import { primaryColor, textColor, bgColor } from "../consts/colors";
import type Profile from "../types/profile";

/** Tab configuration matching the Excalidraw design */
const TABS = {
  current: { path: "/", label: "Current Rates" },
  history: { path: "/history", label: "Rate Change History" },
} as const;

type TabKey = keyof typeof TABS;

const tabSx = {
  color: `${textColor}99`,
  textTransform: "none" as const,
  fontWeight: 500,
  fontSize: { xs: "0.8rem", sm: "0.9rem" },
  minWidth: "auto",
  px: { xs: 1.5, sm: 2 },
  "&.Mui-selected": {
    color: primaryColor,
    fontWeight: 600,
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
 * Tabbed content area — matches the Excalidraw wireframe design:
 *
 * ┌──────────────────────────────────┐
 * │ [Savings] [Age] [Salary] ...     │  ← Input fields
 * │ [Current Rates] [Rate History]  │  ← Tab navigation
 * │ [Clear] [Copy Profile URL]      │  ← Action buttons
 * │ 🔒 All data stays on device     │  ← Privacy chip
 * ├──────────────────────────────────┤
 * │  Yearly Int │ EIR(%) │ Account  │  ← Content (table/Outlet)
 * └──────────────────────────────────┘
 *
 * Desktop: tabs centered below inputs
 * Mobile: full-width stacked layout
 */
export const TabbedContent = () => {
  const { currProfile, setCurrProfile, pendingUrlProfile, onAcceptShared, onRejectShared } =
    useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");

  const activeTab =
    (Object.keys(TABS) as TabKey[]).find(
      (key) => location.pathname === TABS[key].path,
    ) ?? "current";

  return (
    <Box
      component="section"
      aria-label="Savings calculator"
      sx={{
        mt: { xs: 1, sm: 2 },
        mb: 2,
      }}
    >
      <Container
        sx={{
          maxWidth: "100% !important",
          px: { xs: 1, sm: 2 },
        }}
      >
        {/* Input fields + action buttons + privacy chip */}
        <ErrorBoundary>
          <FormInputs
            currProfile={currProfile}
            setCurrProfile={setCurrProfile}
            pendingUrlProfile={pendingUrlProfile}
            onAcceptShared={onAcceptShared}
            onRejectShared={onRejectShared}
          />
        </ErrorBoundary>

        {/* Tab navigation — below inputs, matching wireframe */}
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "flex-start" : "center",
            mt: 2,
            mb: 1,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => {
              navigate(TABS[v as TabKey].path);
            }}
            sx={{
              minHeight: "auto",
              "& .MuiTabs-indicator": {
                backgroundColor: primaryColor,
              },
            }}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={false}
          >
            {(Object.keys(TABS) as TabKey[]).map((key) => (
              <Tab
                key={key}
                label={TABS[key].label}
                value={key}
                sx={tabSx}
              />
            ))}
          </Tabs>
        </Box>

        {/* Content area — rendered by child routes */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Container>
    </Box>
  );
};
