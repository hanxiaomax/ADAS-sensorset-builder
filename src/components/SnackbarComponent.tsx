import React, { useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity?: "success" | "error" | "warning" | "info";
    open: boolean;
    autoHideDuration?: number;
  }>({ message: "", severity: "info", open: false });

  const showSnackbar = useCallback(
    (
      message: string,
      severity: "success" | "error" | "warning" | "info" = "info",
      autoHideDuration?: number
    ) => {
      setSnackbar({
        message,
        severity,
        open: true,
        autoHideDuration:
          autoHideDuration === undefined ? 6000 : autoHideDuration,
      });
    },
    []
  );

  const handleClose = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackbar((prev) => ({ ...prev, open: false }));
    },
    []
  );

  const SnackbarElement = (
    <Snackbar
      open={snackbar.open}
      onClose={handleClose}
      autoHideDuration={snackbar.autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  return { showSnackbar, SnackbarElement };
};

export default useSnackbar;
