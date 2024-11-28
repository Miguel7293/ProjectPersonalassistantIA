import React from "react";
import { ThemeProvider } from "@mui/material";
import SignUp from "./SignUp";  // Asegúrate de que esta ruta sea correcta
import theme from "./theme";  // Asegúrate de que la ruta y el contenido del tema sean correctos

export default function Page() {
  return (
    <ThemeProvider theme={theme}>
      <SignUp />  {/* Renderizando el componente SignUp */}
    </ThemeProvider>
  );
}
