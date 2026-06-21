import { Outlet } from "react-router-dom";
import { Container, GlobalStyles, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { ErrorBoundary } from "./Components/ErrorBoundary";
import { bgColor, theme } from "./consts/colors";
import type Profile from "./types/profile";

export interface LayoutContext {
  currProfile: Profile;
  setCurrProfile: (p: Profile) => void;
  pendingUrlProfile: Profile | null;
  onAcceptShared: () => void;
  onRejectShared: () => void;
}

interface LayoutProps extends LayoutContext {}

/**
 * Shared layout matching the Excalidraw wireframe:
 *   Header (title + FAQ) → Content (inputs + tabs + page) → Footer
 *
 * The old WithInputs wrapper is replaced by TabbedContent which
 * integrates inputs, tab navigation, and page content together.
 */
export const Layout = ({
  currProfile,
  setCurrProfile,
  pendingUrlProfile,
  onAcceptShared,
  onRejectShared,
}: LayoutProps) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: bgColor,
          margin: "0px",
          padding: "0px",
          height: "100%",
          minHeight: "100dvh",
          width: "100%",
        },
      }}
    />
    <Header />
    <Box component="main" sx={{ paddingBottom: "20px" }}>
      <Container sx={{ maxWidth: "100% !important" }}>
        <ErrorBoundary>
          <Outlet
            context={{
              currProfile,
              setCurrProfile,
              pendingUrlProfile,
              onAcceptShared,
              onRejectShared,
            }}
          />
        </ErrorBoundary>
      </Container>
    </Box>
    <Footer />
  </ThemeProvider>
);
