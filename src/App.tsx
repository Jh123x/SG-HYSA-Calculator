import { useState } from "react";
import { Container, GlobalStyles, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Header } from "./Components/Header";
import { FormInputs } from "./Components/Inputs";
import Profile, { NewProfile } from "./types/profile";
import { STORE_KEY } from "./consts/keys";
import { Result } from "./Components/Interests";
import { ThemeProvider } from "@mui/material/styles";
import { bgColor, theme, textColor } from "./consts/colors";
import { Footer } from "./Components/Footer";
import { HistoryView } from "./Components/HistoryView";

export const App = () => {
  const localData = localStorage.getItem(STORE_KEY) ?? "";
  const localValue = localData ? JSON.parse(localData) : NewProfile({});
  const [currProfile, setCurrProfile] = useState<Profile>(localValue);
  const [view, setView] = useState<"current" | "history">("current");

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: bgColor,
            margin: "0px",
            padding: "0px",
            height: "100vh",
            width: "100%",
          },
        }}
      />
      <Header />
      <Container
        sx={{
          marginTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <FormInputs currProfile={currProfile} setCurrProfile={setCurrProfile} />
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          sx={{ mt: 2, mb: 2 }}
        >
          <ToggleButton
            value="current"
            sx={{
              color: textColor,
              "&.Mui-selected": { backgroundColor: theme.palette.primary.main, color: "#fff" },
            }}
          >
            Current Rates
          </ToggleButton>
          <ToggleButton
            value="history"
            sx={{
              color: textColor,
              "&.Mui-selected": { backgroundColor: theme.palette.primary.main, color: "#fff" },
            }}
          >
            Rate History
          </ToggleButton>
        </ToggleButtonGroup>
        {view === "current" ? (
          <Result profile={currProfile} />
        ) : (
          <HistoryView profile={currProfile} />
        )}
      </Container>
      <Footer />
    </ThemeProvider>
  );
};
