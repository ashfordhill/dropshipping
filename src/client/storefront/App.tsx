import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { HEALTH_PATH, type HealthResponse } from "../../shared/health";
import { theme } from "./theme";

type ApiStatus = "checking" | "ok" | "unavailable";

const statusText: Record<ApiStatus, string> = {
  checking: "Checking the storefront API.",
  ok: "The storefront API is responding.",
  unavailable: "The storefront API is unavailable.",
};

export function App() {
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();
    fetch(HEALTH_PATH, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Health check failed");
        const body = (await response.json()) as HealthResponse;
        if (!body.ok) throw new Error("Health check failed");
        setStatus("ok");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("unavailable");
      });
    return () => controller.abort();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" sx={{ maxWidth: 720, px: 2, py: 3 }}>
        <Typography component="h1" variant="h1" sx={{ fontSize: "2rem", fontWeight: 650, mb: 1 }}>
          Storefront
        </Typography>
        <Typography role="status">{statusText[status]}</Typography>
      </Box>
    </ThemeProvider>
  );
}
