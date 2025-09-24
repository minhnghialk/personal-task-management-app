// src/App.jsx
import React from "react";
import "./styles/tailwind.css";
import { AppProviders } from "./AppProviders";
import { AppInitializer } from "./AppInitializer";
import { AppRoutes } from "./routes/AppRoutes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ReactQueryProvider } from "./components/ReactQueryProvider";

const App = () => (
  <ErrorBoundary>
    <ReactQueryProvider>
      <AppProviders>
        <AppInitializer>
          <AppRoutes />
        </AppInitializer>
      </AppProviders>
    </ReactQueryProvider>
  </ErrorBoundary>
);

export default App;
