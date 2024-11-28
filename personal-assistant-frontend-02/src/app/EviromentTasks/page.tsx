import React from "react";
import { ThemeProvider } from "@mui/material";
import EnviromentTask from "./EnviromentTask";
import theme from "./theme";

export default function Page() {
  return (
    <ThemeProvider theme={theme}>
      <EnviromentTask />
    </ThemeProvider>
  );
}
