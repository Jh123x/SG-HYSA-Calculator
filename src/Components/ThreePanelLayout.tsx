import { Box, useMediaQuery } from "@mui/material";

interface ThreePanelLayoutProps {
  /** Top panel — spans full width on desktop. */
  top?: React.ReactNode;
  /** Bottom-left panel — equal width to bottom-right on desktop. */
  bottomLeft?: React.ReactNode;
  /** Bottom-right panel — equal width to bottom-left on desktop. */
  bottomRight?: React.ReactNode;
}

/**
 * Universal 3-slot layout.
 *
 * Desktop ( >900px ):
 *   ┌──────────────────────────────┐
 *   │            top               │
 *   ├──────────────┬───────────────┤
 *   │  bottomLeft  │  bottomRight  │
 *   │              │               │
 *   └──────────────┴───────────────┘
 *   Each slot has its own overflow scroll.
 *
 * Mobile ( ≤900px ):
 *   Stacked vertically — top, then bottomLeft, then bottomRight —
 *   each in normal document flow.
 */
export const ThreePanelLayout = ({
  top,
  bottomLeft,
  bottomRight,
}: ThreePanelLayoutProps) => {
  const isMobile = useMediaQuery("(max-width:900px)");

  if (isMobile) {
    return (
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
  }

  return (
    <Box
      component="section"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pt: 1.5,
      }}
    >
      {top && (
        <Box sx={{ flexShrink: 0, pb: 1.5 }}>{top}</Box>
      )}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          gap: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "auto",
          }}
        >
          {bottomLeft}
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "auto",
          }}
        >
          {bottomRight}
        </Box>
      </Box>
    </Box>
  );
};
