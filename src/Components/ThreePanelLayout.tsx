import { Box } from "@mui/material";
import { useMobile } from "../hooks/useMobile";

interface ThreePanelLayoutProps {
  /** Top panel — spans full width on desktop. */
  top?: React.ReactNode;
  /** Bottom-left panel — equal width to bottom-right on desktop. */
  bottomLeft?: React.ReactNode;
  /** Bottom-right panel — equal width to bottom-left on desktop. */
  bottomRight?: React.ReactNode;
}

/**
 * Universal 3-slot layout with independent scrollbars per panel on desktop.
 *
 * Desktop ( >900px ):
 *   ┌──────────────────────────────┐
 *   │            top               │  ← flexShrink: 0 (natural height)
 *   ├──────────────┬───────────────┤
 *   │  bottomLeft  │  bottomRight  │  ← flex: 1, overflow: auto (independent scroll)
 *   │  (scrolls)   │  (scrolls)    │
 *   └──────────────┴───────────────┘
 *   Both columns equal width. Each scrolls independently.
 *
 * Mobile ( ≤900px ):
 *   Stacked vertically — top, then bottomLeft, then bottomRight.
 *   Natural document flow, no independent scrollbars needed.
 */
export const ThreePanelLayout = ({
  top,
  bottomLeft,
  bottomRight,
}: ThreePanelLayoutProps) => {
  const { isMobile } = useMobile();

  if (isMobile) {
    return (
      <ThreePanelLayoutMobile
        top={top}
        bottomLeft={bottomLeft}
        bottomRight={bottomRight}
      />
    );
  }

  return (
    <ThreePanelLayoutDesktop
      top={top}
      bottomLeft={bottomLeft}
      bottomRight={bottomRight}
    />
  );
};

// ── Desktop: fixed viewport, independent panel scrollbars ─────────

const ThreePanelLayoutDesktop = ({
  top,
  bottomLeft,
  bottomRight,
}: ThreePanelLayoutProps) => (
  <Box
    component="section"
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%", // fill parent's constrained viewport height
      pt: 1.5,
      pb: 2,
    }}
  >
    {/* Top — natural height, doesn't shrink */}
    {top && (
      <Box sx={{ flexShrink: 0, pb: 1.5 }}>{top}</Box>
    )}

    {/* Bottom row — fills remaining height, panels scroll independently */}
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flex: 1,
        minHeight: 0, // allow shrinking below content height
      }}
    >
      <BottomPanel>{bottomLeft}</BottomPanel>
      <BottomPanel>{bottomRight}</BottomPanel>
    </Box>
  </Box>
);

// ── Mobile: stacked vertical, natural document flow ───────────────

const ThreePanelLayoutMobile = ({
  top,
  bottomLeft,
  bottomRight,
}: ThreePanelLayoutProps) => (
  <Box
    component="section"
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      pt: 1,
    }}
  >
    {top && <Box>{top}</Box>}
    {bottomLeft && <Box>{bottomLeft}</Box>}
    {bottomRight && <Box>{bottomRight}</Box>}
  </Box>
);

// ── Shared: a single scrollable panel in the bottom row ───────────

const BottomPanel = ({ children }: { children?: React.ReactNode }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 0,
      overflow: "auto",
    }}
  >
    {children}
  </Box>
);
