import { Outlet, useLocation } from "react-router-dom";
import { Container, GlobalStyles, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
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
  const location = useLocation();

  // Desktop: fixed viewport with auto overflow — pages that fully consume their
  // allocated space (e.g. ThreePanelLayout) don't scroll at the page level,
  // while pages with natural document flow (e.g. FAQ) get a page-level scrollbar.
  const bodyOverflow = isMobile ? "auto" : "auto";
  const rootHeight = isMobile ? "auto" : "100%";
  const rootOverflow = isMobile ? "visible" : undefined;

  const boxHeight = isMobile ? "auto" : "100dvh";
  const boxOverflow = isMobile ? "visible" : "auto";

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
              maxWidth: "100% !important",
              px: { xs: 1, sm: 2 },
              height: "100%",
            }}
          >
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Outlet
                    context={{
                      currProfile,
                      setCurrProfile,
                      pendingUrlProfile,
                      onAcceptShared,
                      onRejectShared,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};
