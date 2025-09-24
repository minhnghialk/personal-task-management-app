import React from "react";
import "./styles/tailwind.css";
import { AppProviders } from "./AppProviders";
import { AppInitializer } from "./AppInitializer";
import { AppRoutes } from "./routes/AppRoutes";

const App = () => {
  return (
    <AppProviders>
      <AppInitializer>
        <AppRoutes />
      </AppInitializer>
    </AppProviders>
  );
};

export default App;
