import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Header } from './Components/Header.tsx';
import { FormInputs } from './Components/Inputs.tsx';
import Profile from './types/profile.ts';
import { calc_fn } from './logic/constants.ts';
import { ResultInterest } from './types/interest_result.ts';
import { Result } from './Components/Interests.tsx';

export const App = () => {
  const [interests, setInterests] = useState<Array<ResultInterest>>([])
  const updateResult = (profile: Profile) => {
    const results: Array<ResultInterest> = []
    for (const fn of calc_fn) {
      results.push(fn(profile))
    }
    setInterests(results)
  }

  return (
    <Container>
      <Header />
      <FormInputs updateResult={updateResult} />
      <Result results={interests} />
    </Container>
  );
}
