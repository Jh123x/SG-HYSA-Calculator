import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, WithInputs } from "./Layout";
import { CurrentRatesTab } from "./pages/CurrentRatesTab";
import { HistoryTab } from "./pages/HistoryTab";
import { BankDetailPage } from "./pages/BankDetailPage";
import { FaqPage } from "./pages/FaqPage";
import Profile, { NewProfile } from "./types/profile";
import { STORE_KEY } from "./consts/keys";
import { searchToProfile, profileToSearch } from "./logic/profileUrl";

export const App = () => {
  // 1. Determine initial profile: URL params > localStorage > defaults
  const [currProfile, setCurrProfile] = useState<Profile>(() => {
    const urlSearch = window.location.search;
    if (urlSearch) {
      const fromUrl = searchToProfile(urlSearch);
      // Persist URL-derived profile so subsequent visits without URL still work
      localStorage.setItem(STORE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const localData = localStorage.getItem(STORE_KEY) ?? "";
    return localData ? JSON.parse(localData) : NewProfile({});
  });

  // 2. Sync profile changes to localStorage + URL
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
            <Layout currProfile={currProfile} setCurrProfile={setCurrProfile} />
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
