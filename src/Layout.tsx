import { Outlet } from "react-router-dom";
import { Container, GlobalStyles, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { ErrorBoundary } from "./Components/ErrorBoundary";
import { bgColor, theme } from "./consts/theme";
import { useMobile } from "./hooks/useMobile";
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
  const { isMobile } = useMobile();

  // Desktop: strict viewport lock — no scrollbars at body or Box level.
  // Tabbed pages fill exactly 100dvh (internal scrollbars in BottomPanels);
  // document pages (FAQ) scroll through `main overflow: auto` alone.
  const bodyOverflow = isMobile ? "auto" : "hidden";
  const rootHeight = isMobile ? "auto" : "100%";
  const rootOverflow = isMobile ? "visible" : "hidden";

  const boxHeight = isMobile ? "auto" : "100dvh";
  const boxOverflow = isMobile ? "visible" : "hidden";

  const mainOverflow = isMobile ? "visible" : "auto";
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
              px: { xs: 1.5, sm: 4, md: 5 },
              py: { xs: 0, sm: 1 },
              height: "100%",
              maxWidth: "100% !important",
              ...(isMobile ? { overflowX: "hidden" } : {}),
            }}
          >
            <ErrorBoundary>
              <div style={{ width: "100%", height: "100%" }}>
                <Outlet
                  context={{
                    currProfile,
                    setCurrProfile,
                    pendingUrlProfile,
                    onAcceptShared,
                    onRejectShared,
                  }}
                />
              </div>
            </ErrorBoundary>
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};
