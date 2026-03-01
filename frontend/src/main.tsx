import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient.ts";
import { Toaster } from "sonner";
import UploadedFilesProvider from "./contexts/UploadedFilesContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UploadedFilesProvider>
            <App />
            <Toaster richColors />
          </UploadedFilesProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
