import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, WithInputs } from "./Layout";
import { CurrentRatesTab } from "./pages/CurrentRatesTab";
import { HistoryTab } from "./pages/HistoryTab";
import { BankDetailPage } from "./pages/BankDetailPage";
import { FaqPage } from "./pages/FaqPage";
import Profile, { NewProfile } from "./types/profile";
import { STORE_KEY } from "./consts/keys";

export const App = () => {
  const localData = localStorage.getItem(STORE_KEY) ?? "";
  const localValue = localData ? JSON.parse(localData) : NewProfile({});
  const [currProfile, setCurrProfile] = useState<Profile>(localValue);

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
