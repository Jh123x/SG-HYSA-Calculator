import React, { useState } from 'react';
import { Container, GlobalStyles } from '@mui/material';
import { Header } from './Components/Header.tsx';
import { FormInputs } from './Components/Inputs.tsx';
import Profile from './types/profile.ts';
import { bankInfo } from './logic/constants.ts';
import { Result } from './Components/Interests.tsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ResultProp } from './types/props.ts';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'grey'
    }
  },
});


export const App = () => {
  const [interests, setInterests] = useState<Record<string, ResultProp>>({})
  const updateResult = (profile: Profile) => {
    const results: Record<string, ResultProp> = {}
    for (let [name, info] of Object.entries(bankInfo)) {
      results[name] = {
        interest: info.interestFn(profile),
        url: info.url,
        remarks: info.remarks
      }
    }
    setInterests(results)
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: '#bbb',
            margin: '0px',
            padding: '0px',
            height: '100vh',
            width: '100vw',
          },
        }}
      />
      <Header />
      <Container
        maxWidth={false}
        sx={{
          backgroundColor: '#fff',
          height: '100%',
          width: '100%',
        }}
      >
        <FormInputs updateResult={updateResult} />
        <Result results={interests} />
      </Container>
    </ThemeProvider>
  );
}
