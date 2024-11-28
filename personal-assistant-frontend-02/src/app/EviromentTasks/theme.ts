'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Activamos el modo oscuro
    primary: {
      main: '#2979FF', // Azul para el sidebar y bordes.
    },
    secondary: {
      main: '#00C49A', // verde  para elementos seleccionados.
    },
    background: {
      default: '#121212', // Fondo general.
      paper: '#1E1E1E', // Fondo de secciones o componentes secundarios.
    },
    text: {
      primary: '#E0E0E0', // Texto principal.
      secondary: '#A0A0A0', // Texto secundario.
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#FF4081', // Fondo rosa medio para el seleccionado.
            color: '#FFFFFF', // Texto blanco para el seleccionado.
            '&:hover': {
              backgroundColor: '#FF5773', // Hover para seleccionado.
            },
          },
          '&:hover': {
            backgroundColor: '#333333', // Hover general.
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#E0E0E0', // Texto predeterminado en blanco/gris claro.
        },
      },
    },
  },
});

export default theme;
