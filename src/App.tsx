import React from "react";
import SensorSetBuilderMain from "./main";
// import { SnackbarProvider } from "./components/SnackbarContext";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { GlobalStateProvider } from "./contexts/GlobalState";
import { UiConfigProvider } from "./contexts/UiConfigContext";

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={4} autoHideDuration={5000}>
      <GlobalStateProvider>
        <UiConfigProvider>
          <SensorSetBuilderMain />
        </UiConfigProvider>
      </GlobalStateProvider>
    </SnackbarProvider>
  );
};

export default App;
