import React from "react";
import SensorSetBuilderMain from "./main";
// import { SnackbarProvider } from "./components/SnackbarContext";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { Button } from "@mui/material";

const App: React.FC = () => {
  return (
    <SnackbarProvider
      maxSnack={4}
      autoHideDuration={5000}
      // action={(snackbarId) => (
      //   <Button
      //     variant="text"
      //     sx={{ color: "#000", fontSize: "12px", fontStyle: "italic" }}
      //     onClick={() => closeSnackbar(snackbarId)}
      //   >
      //     Dismiss
      //   </Button>
      // )}
    >
      <SensorSetBuilderMain />
    </SnackbarProvider>
  );
};

export default App;
