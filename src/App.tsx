import * as React from "react";
import { Container, GlobalStyles } from "@mui/material";
import { Header } from "./Components/Header";
import { FormInputs } from "./Components/Inputs";
import Profile, { NewProfile } from "./types/profile";
import { STORE_KEY } from "./consts/keys";
import { Result } from "./Components/Interests";
import { ThemeProvider } from "@mui/material/styles";
import { bgColor, theme } from "./consts/colors";
import { Footer } from "./Components/Footer";

export const App = () => {
  const localData = localStorage.getItem(STORE_KEY) ?? "";
  const localValue = localData ? JSON.parse(localData) : NewProfile({});
  const [currProfile, setCurrProfile] = React.useState<Profile>(localValue);

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
        <Result profile={currProfile} />
      </Container>
      <Footer />
    </ThemeProvider>
  );
};
