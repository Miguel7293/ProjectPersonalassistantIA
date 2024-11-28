'use client';

import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
