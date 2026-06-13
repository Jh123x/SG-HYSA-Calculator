import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { MainPage } from "./MainPage";
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
          {/* / is the default — shows current rates */}
          <Route
            path="/"
            element={<MainPage tab="current" profile={currProfile} />}
          />
          <Route
            path="/history"
            element={<MainPage tab="history" profile={currProfile} />}
          />
          <Route
            path="/bank/:slug"
            element={<BankDetailPage profile={currProfile} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
