import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, WithInputs } from "./Layout";
import { CurrentRatesTab } from "./pages/CurrentRatesTab";
import { HistoryTab } from "./pages/HistoryTab";
import { BankDetailPage } from "./pages/BankDetailPage";
import { FaqPage } from "./pages/FaqPage";
import Profile, { NewProfile } from "./types/profile";
import { STORE_KEY } from "./consts/keys";
import { searchToProfile, profileToSearch } from "./logic/profileUrl";

const defaults = NewProfile({});

export const App = () => {
  const urlSearch = window.location.search;
  const localStr = localStorage.getItem(STORE_KEY);
  const localProfile: Profile = localStr ? JSON.parse(localStr) : defaults;
  const urlProfile: Profile | null = urlSearch ? searchToProfile(urlSearch) : null;

  // Conflict: URL profile exists, local has real data, and they differ
  const hasConflict =
    urlProfile !== null &&
    localStr !== null &&
    JSON.stringify(localProfile) !== JSON.stringify(defaults) &&
    JSON.stringify(urlProfile) !== JSON.stringify(localProfile);

  // Start with local profile; if no conflict, transparently load from URL
  const [currProfile, setCurrProfile] = useState<Profile>(() => {
    if (urlProfile && !hasConflict) {
      localStorage.setItem(STORE_KEY, JSON.stringify(urlProfile));
      return urlProfile;
    }
    return localProfile;
  });

  // Pending URL profile waiting for user confirmation
  const [pendingUrlProfile, setPendingUrlProfile] = useState<Profile | null>(
    hasConflict ? urlProfile : null,
  );

  const onAcceptShared = useCallback(() => {
    if (pendingUrlProfile) {
      setCurrProfile(pendingUrlProfile);
      localStorage.setItem(STORE_KEY, JSON.stringify(pendingUrlProfile));
      setPendingUrlProfile(null);
    }
  }, [pendingUrlProfile]);

  const onRejectShared = useCallback(() => {
    setPendingUrlProfile(null);
    // Clean URL params so the shared link doesn't re-trigger on refresh
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  // Sync profile changes to localStorage + URL
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(currProfile));
    const search = profileToSearch(currProfile);
    const newUrl = search
      ? `${window.location.pathname}${search}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [currProfile]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              currProfile={currProfile}
              setCurrProfile={setCurrProfile}
              pendingUrlProfile={pendingUrlProfile}
              onAcceptShared={onAcceptShared}
              onRejectShared={onRejectShared}
            />
          }
        >
          {/* Pages that need the savings inputs */}
          <Route element={<WithInputs />}>
            <Route path="/" element={<CurrentRatesTab profile={currProfile} />} />
            <Route path="/history" element={<HistoryTab profile={currProfile} />} />
            <Route
              path="/bank/:slug"
              element={<BankDetailPage profile={currProfile} />}
            />
          </Route>

          {/* Pages that don't need inputs */}
          <Route path="/faq" element={<FaqPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
