import React from "react";
import { ThemeProvider } from "@mui/material";
import Dashboard from "./Dashboard";
import theme from "./theme";

export default function Page() {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  );
}
