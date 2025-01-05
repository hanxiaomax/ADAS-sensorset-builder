import React from "react";
import SensorSetBuilderMain from "./main";
// import { SnackbarProvider } from "./components/SnackbarContext";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { GlobalStateProvider } from "./contexts/GlobalState";
import { UiConfigProvider } from "./contexts/UiConfigContext";
import { SensorProvider } from "./contexts/SensorContext";

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={4} autoHideDuration={5000}>
      <GlobalStateProvider>
        <UiConfigProvider>
          <SensorProvider>
            <SensorSetBuilderMain />
          </SensorProvider>
        </UiConfigProvider>
      </GlobalStateProvider>
    </SnackbarProvider>
  );
};

export default App;
