import { Outlet } from "react-router-dom";
import { Container, GlobalStyles, Box, useMediaQuery } from "@mui/material";
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
 * Layout:
 *   Desktop: Header + scrollable content + Footer, filling viewport (sticky header/footer)
 *   Mobile:  Normal document flow — Header and Footer scroll with content
 */
export const Layout = ({
  currProfile,
  setCurrProfile,
  pendingUrlProfile,
  onAcceptShared,
  onRejectShared,
}: LayoutProps) => {
  const isMobile = useMediaQuery("(max-width:900px)");

  // Mobile: normal document flow — no fixed viewport, no overflow clamping
  const bodyOverflow = isMobile ? "auto" : "hidden";
  const rootHeight = isMobile ? "auto" : "100%";
  const rootOverflow = isMobile ? "visible" : undefined;

  const boxHeight = isMobile ? "auto" : "100dvh";
  const boxOverflow = isMobile ? "visible" : "hidden";

  const mainOverflow = isMobile ? "visible" : "hidden";
  const mainFlex = isMobile ? undefined : 1;
  const mainMinHeight = isMobile ? undefined : 0;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: bgColor,
            margin: "0px",
            padding: "0px",
            height: rootHeight,
            width: "100%",
            overflow: bodyOverflow,
          },
          "#root": {
            height: rootHeight,
            ...(rootOverflow ? { overflow: rootOverflow } : {}),
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: boxHeight,
          overflow: boxOverflow,
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flex: mainFlex,
            minHeight: mainMinHeight,
            overflow: mainOverflow,
          }}
        >
          <Container
            sx={{
              maxWidth: "100% !important",
              px: { xs: 1, sm: 2 },
              height: "100%",
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
};
