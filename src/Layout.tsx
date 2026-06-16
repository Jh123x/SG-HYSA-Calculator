import { Outlet, useOutletContext } from "react-router-dom";
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
 * Shared layout: Header, then page content via <Outlet>, then Footer.
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
          <Outlet context={{ currProfile, setCurrProfile }} />
        </ErrorBoundary>
      </Container>
    </Box>
    <Footer />
  </ThemeProvider>
);

/**
 * Layout wrapper that adds profile input fields above the page content.
 * Use this for pages that need savings / account configuration inputs.
 */
export const WithInputs = () => (
  <>
    <FormInputsWrapper />
    <Outlet />
  </>
);

/** Internal: reads profile state from Outlet context and renders FormInputs */
const FormInputsWrapper = () => {
  const { currProfile, setCurrProfile } = useOutletContext<LayoutProps>();
  return (
    <ErrorBoundary>
      <FormInputs currProfile={currProfile} setCurrProfile={setCurrProfile} />
    </ErrorBoundary>
  );
};