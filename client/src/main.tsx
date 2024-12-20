import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import { ErrorBoundary } from "./components/ErrorBoundry.tsx";
import Fallback from "./components/Fallback.tsx";

import { Routes } from "./router/index.tsx";
import { BrowserRouter } from "react-router-dom";

import AuthProvider from "@/provider/auth.contex.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<Fallback />}>
        <BrowserRouter>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
