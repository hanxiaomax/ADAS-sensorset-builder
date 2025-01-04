import React, { createContext, useContext } from "react";
import useSnackbar from "./SnackbarComponent";

const SnackbarContext = createContext<any>(null);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const snackbar = useSnackbar();
  return (
    <SnackbarContext.Provider value={snackbar}>
      {children}
      {snackbar.SnackbarElement}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => useContext(SnackbarContext);
