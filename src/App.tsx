import { lazy, useState, useEffect, useCallback, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { Layout } from "./Layout";
import { TabbedContent } from "./Components/TabbedContent";
import Profile, { NewProfile } from "./types/profile";
import { STORE_KEY } from "./consts/keys";
import { searchToProfile, profileToSearch } from "./logic/profileUrl";
import { primaryColor } from "./consts/colors";

const CurrentRatesTab = lazy(() => import("./pages/CurrentRatesTab"));
const HistoryTab = lazy(() => import("./pages/HistoryTab"));
const BankDetailPage = lazy(() => import("./pages/BankDetailPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const BlogIndexPage = lazy(() => import("./pages/BlogIndexPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));

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
          {/* Pages with inputs + tab navigation */}
          <Route element={<TabbedContent />}>
            <Route path="/" element={
              <Suspense fallback={
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                  <CircularProgress sx={{ color: primaryColor }} />
                </Box>
              }>
                <CurrentRatesTab profile={currProfile} />
              </Suspense>
            } />
            <Route path="/history" element={
              <Suspense fallback={
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                  <CircularProgress sx={{ color: primaryColor }} />
                </Box>
              }>
                <HistoryTab profile={currProfile} />
              </Suspense>
            } />
            <Route
              path="/bank/:slug"
              element={
                <Suspense fallback={
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                    <CircularProgress sx={{ color: primaryColor }} />
                  </Box>
                }>
                  <BankDetailPage profile={currProfile} />
                </Suspense>
              }
            />
          </Route>

          {/* Pages that don't need inputs */}
          <Route path="/faq" element={
            <Suspense fallback={
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress sx={{ color: primaryColor }} />
              </Box>
            }>
              <FaqPage />
            </Suspense>
          } />
          <Route path="/blog" element={
            <Suspense fallback={
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress sx={{ color: primaryColor }} />
              </Box>
            }>
              <BlogIndexPage />
            </Suspense>
          } />
          <Route path="/blog/:slug" element={
            <Suspense fallback={
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress sx={{ color: primaryColor }} />
              </Box>
            }>
              <BlogPostPage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
