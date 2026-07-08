import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme, setThemeMode } from "../consts/theme";

type Mode = "light" | "dark";

const MODE_KEY = "theme_mode";

interface ThemeModeContextValue {
  mode: Mode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: "dark",
  toggle: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>(() => {
    try {
      return (localStorage.getItem(MODE_KEY) as Mode) || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    setThemeMode(mode);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(MODE_KEY, next);
      } catch {
        // localStorage may be unavailable
      }
      return next;
    });
  }, []);

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
