import { Outlet } from "react-router-dom";
import { Container, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Header } from "./Components/Header";
import { FormInputs } from "./Components/Inputs";
import { Footer } from "./Components/Footer";
import { bgColor, theme } from "./consts/colors";
import type Profile from "./types/profile";

interface LayoutProps {
  currProfile: Profile;
  setCurrProfile: (p: Profile) => void;
}

/**
 * Shared layout: Header (always), Profile inputs (always), then page content via <Outlet>.
 * Footer is also shared.
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
    <Container sx={{ marginTop: "20px", paddingBottom: "20px" }}>
      <FormInputs currProfile={currProfile} setCurrProfile={setCurrProfile} />
      <Outlet />
    </Container>
    <Footer />
  </ThemeProvider>
);
