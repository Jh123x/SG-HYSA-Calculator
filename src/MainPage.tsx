import { CurrentRatesTab } from "./pages/CurrentRatesTab";
import { HistoryTab } from "./pages/HistoryTab";
import type Profile from "./types/profile";

interface MainPageProps {
  tab: "current" | "history";
  profile: Profile;
}

/**
 * Main page router hub.
 *
 * Renders the appropriate tab page based on the `tab` prop,
 * set by the router in App.tsx (from /current or /history path).
 *
 * Tab navigation has been moved to the Header component.
 */
export const MainPage = ({ tab, profile }: MainPageProps) => {
  if (tab === "history") {
    return <HistoryTab profile={profile} />;
  }
  return <CurrentRatesTab profile={profile} />;
};
