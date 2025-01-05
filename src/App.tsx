import React from "react";
import SensorSetBuilderMain from "./main";
// import { SnackbarProvider } from "./components/SnackbarContext";
import { SnackbarProvider } from "notistack";

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={4} autoHideDuration={5000}>
      <SensorSetBuilderMain />
    </SnackbarProvider>
  );
};

export default App;
