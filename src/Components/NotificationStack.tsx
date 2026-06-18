import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface NotificationStackProps {
  children: ReactNode;
}

/**
 * Fixed-position container that stacks notifications vertically
 * at the bottom-right of the viewport.
 * Add more notifications and they automatically stack.
 */
export const NotificationStack = ({ children }: NotificationStackProps) => (
  <Box
    sx={{
      position: "fixed",
      bottom: "16px",
      right: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      zIndex: 9999,
      pointerEvents: "none",
      "& > *": {
        pointerEvents: "auto",
      },
    }}
  >
    {children}
  </Box>
);
