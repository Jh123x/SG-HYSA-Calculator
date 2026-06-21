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
 * Layout matching the wireframe:
 *   Header (sticky) → Content (scrollable, flex-1) → Footer (always visible)
 *
 * No nested scrollbars: the entire page is a flex column filling the viewport.
 * TabbedContent uses flex:1 and handles its own internal scrolling.
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
          width: "100%",
          overflow: "hidden",
        },
        "#root": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    />
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
        }}
      >
        <Container
          sx={{
            maxWidth: "100% !important",
            px: { xs: 1, sm: 2 },
            pb: { xs: 2, sm: 3 },
          }}
        >
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
    </Box>
  </ThemeProvider>
);
