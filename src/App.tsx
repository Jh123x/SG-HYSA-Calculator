import React from 'react';
import { Container } from '@mui/material';
import { Header } from './Components/Header.tsx';
import { FormInputs } from './Components/Inputs.tsx';

export const App = () => {
  return (
    <Container>
      <Header />
      <FormInputs />
    </Container>
  );
}
