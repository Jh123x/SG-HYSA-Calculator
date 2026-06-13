import { useSearchParams } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { textColor, theme } from "./consts/colors";
import { CurrentRatesTab } from "./pages/CurrentRatesTab";
import { HistoryTab } from "./pages/HistoryTab";
import type Profile from "./types/profile";

type TabValue = "current" | "history";

interface MainPageProps {
  profile: Profile;
}

const toggleSx = {
  color: textColor,
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
};

/**
 * Main page with two tabs: Current Rates and Rate History.
 * Tab selection is synced to the `?tab=` URL search param.
 */
export const MainPage = ({ profile }: MainPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get("tab") as TabValue) || "current";

  const handleTabChange = (_: unknown, v: TabValue | null) => {
    if (!v) return;
    const next = new URLSearchParams(searchParams);
    next.set("tab", v);
    // Preserve banks param when switching to history
    if (v !== "history") next.delete("banks");
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <ToggleButtonGroup
        value={tab}
        exclusive
        onChange={handleTabChange}
        sx={{ mt: 2, mb: 2 }}
      >
        <ToggleButton value="current" sx={toggleSx}>
          Current Rates
        </ToggleButton>
        <ToggleButton value="history" sx={toggleSx}>
          Rate History
        </ToggleButton>
      </ToggleButtonGroup>

      {tab === "current" ? (
        <CurrentRatesTab profile={profile} />
      ) : (
        <HistoryTab profile={profile} />
      )}
    </>
  );
};
