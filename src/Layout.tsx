import { Outlet } from "react-router-dom";
import { Container, GlobalStyles, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Header } from "./Components/Header";
import { FormInputs } from "./Components/Inputs";
import { Footer } from "./Components/Footer";
import { ErrorBoundary } from "./Components/ErrorBoundary";
import { bgColor, theme } from "./consts/colors";
import type Profile from "./types/profile";

interface LayoutProps {
  currProfile: Profile;
  setCurrProfile: (p: Profile) => void;
}

/**
 * Shared layout: Header (always), Profile inputs (error-bounded), then
 * page content via <Outlet> (error-bounded).
 *
 * Each section has its own ErrorBoundary so a crash in one doesn't take
 * down the other.
 */
export const Layout = ({ currProfile, setCurrProfile }: LayoutProps) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: bgColor,
          margin: "0px",
          padding: "0px",
          height: "100vh",
          width: "100%",
        },
      }}
    />
    <Header />
    <Box component="main" sx={{ marginTop: "20px", paddingBottom: "20px" }}>
      <Container>
        <ErrorBoundary>
          <FormInputs currProfile={currProfile} setCurrProfile={setCurrProfile} />
        </ErrorBoundary>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Container>
    </Box>
    <Footer />
  </ThemeProvider>
);