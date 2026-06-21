import { createContext, useContext, type ReactNode } from "react";
import { useMediaQuery } from "@mui/material";

/**
 * Centralized mobile detection.
 *
 * isMobile  — viewport ≤900px (architectural: stacked layouts, cards instead of tables)
 * isCompact — viewport ≤600px (cosmetic: icon vs text, reduced margins, dot indicators)
 */
export interface MobileCtx {
  isMobile: boolean;
  isCompact: boolean;
}

const MobileContext = createContext<MobileCtx>({ isMobile: false, isCompact: false });

/**
 * Provide centralized mobile detection to the component tree.
 * Place this as high as possible (e.g. wrapping <App />) so every
 * descendant can call useMobile() instead of useMediaQuery directly.
 */
export function MobileProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const isCompact = useMediaQuery("(max-width:600px)");

  return (
    <MobileContext.Provider value={{ isMobile, isCompact }}>
      {children}
    </MobileContext.Provider>
  );
}

/** Read mobile flags from context. Fails fast if used outside MobileProvider. */
export function useMobile(): MobileCtx {
  const ctx = useContext(MobileContext);
  if (!ctx) {
    throw new Error("useMobile must be used within a <MobileProvider>");
  }
  return ctx;
}
