import React from "react";
import SensorSetBuilderMain from "./main";
// import { SnackbarProvider } from "./components/SnackbarContext";
import { SnackbarProvider } from "notistack";
import { SensorProvider } from "./contexts/SensorContext";

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={4} autoHideDuration={5000}>
      <SensorProvider>
        <SensorSetBuilderMain />
      </SensorProvider>
    </SnackbarProvider>
  );
};

export default App;
