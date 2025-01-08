import React, { useState } from 'react';
import { Container, GlobalStyles } from '@mui/material';
import { Header } from './Components/Header.tsx';
import { FormInputs } from './Components/Inputs.tsx';
import Profile from './types/profile.ts';
import { bankInfo } from './logic/constants.tsx';
import { Result } from './Components/Interests.tsx';
import { ThemeProvider } from '@mui/material/styles';
import { ResultProp } from './types/props.ts';
import { bgColor, theme } from './consts/colors.ts';
import { Footer } from './Components/Footer.tsx';



export const App = () => {
  const [interests, setInterests] = useState<Record<string, ResultProp>>({})
  const updateResult = (profile: Profile) => {
    const results: Record<string, ResultProp> = {}
    for (let [name, info] of Object.entries(bankInfo)) {
      results[name] = {
        interest: info.interestFn(profile),
        url: info.url,
        remarks: info.remarks,
        lastUpdated: info.lastUpdated,
      }
    }
    setInterests(results)
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: bgColor,
            margin: '0px',
            padding: '0px',
          },
        }}
      />
      <Header />
      <Container>
        <FormInputs updateResult={updateResult} />
        <Result results={interests} />
      </Container>
      <Footer />
    </ThemeProvider>
  );
}
