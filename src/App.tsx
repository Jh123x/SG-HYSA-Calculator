import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { CurrentRatesTab } from "./pages/CurrentRatesTab";
import { HistoryTab } from "./pages/HistoryTab";
import { BankDetailPage } from "./pages/BankDetailPage";
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
          <Route path="/" element={<CurrentRatesTab profile={currProfile} />} />
          <Route path="/history" element={<HistoryTab profile={currProfile} />} />
          <Route
            path="/bank/:slug"
            element={<BankDetailPage profile={currProfile} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
