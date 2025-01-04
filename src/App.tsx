import React from "react";
import SensorSetBuilderMain from "./main";
import { SnackbarProvider } from "./components/SnackbarContext";

const App: React.FC = () => {
  return (
    <SnackbarProvider>
      <SensorSetBuilderMain />
    </SnackbarProvider>
  );
};

export default App;
