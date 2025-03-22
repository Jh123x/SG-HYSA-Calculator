import React, { useState } from 'react';
import { Container, GlobalStyles } from '@mui/material';
import { Header } from './Components/Header.tsx';
import { FormInputs } from './Components/Inputs.tsx';
import Profile, { NewProfile } from './types/profile.ts';
import { STORE_KEY } from './logic/constants.tsx';
import { Result } from './Components/Interests.tsx';
import { ThemeProvider } from '@mui/material/styles';
import { bgColor, theme } from './consts/colors.ts';
import { Footer } from './Components/Footer.tsx';

export const App = () => {
  const localData = localStorage.getItem(STORE_KEY) ?? ""
  const localValue = localData ? JSON.parse(localData) : NewProfile({})
  const [currProfile, setCurrProfile] = useState<Profile>(localValue)

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: bgColor,
            margin: '0px',
            padding: '0px',
            height: '100vh',
            width: '100%',
          },
        }}
      />
      <Header />
      <Container>
        <FormInputs currProfile={currProfile} setCurrProfile={setCurrProfile} />
        <Result profile={currProfile} />
      </Container>
      <Footer />
    </ThemeProvider>
  );
}
