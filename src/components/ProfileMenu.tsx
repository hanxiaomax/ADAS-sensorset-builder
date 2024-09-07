import React, { useState } from "react";
import { Menu, MenuItem, Button, Snackbar, Alert } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { SensorConfig, SensorStock } from "../types/Common";

interface ProfileMenuProps {
  onImportSensorSetConfigImport: (data: any) => void;
  onImportSensorStock: (data: any) => void;
  onExport: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  onImportSensorSetConfigImport,
  onImportSensorStock,
  onExport,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "sensorConfig" | "sensorStocks"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (type === "sensorStocks") {
            const data = JSON.parse(e.target?.result as string) as SensorStock;
            onImportSensorStock(data);
            setSnackbarMessage("Sensor Stocks imported successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
          } else if (type === "sensorConfig") {
            const data = JSON.parse(
              e.target?.result as string
            ) as SensorConfig[];
            onImportSensorSetConfigImport(data);
            setSnackbarMessage("Sensor Set imported successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
          }
        } catch (error) {
          setSnackbarMessage("Error importing data");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportClick = () => {
    onExport();
    setSnackbarMessage("Data exported successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  return (
    <>
      <Button
        aria-label="profile menu"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Import/Export
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component="label">
          <FileUploadIcon sx={{ mr: 1 }} />
          Import Sensor Set
          <input
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e, "sensorConfig")}
          />
        </MenuItem>
        <MenuItem component="label">
          <FileUploadIcon sx={{ mr: 1 }} />
          Import Sensor Stocks
          <input
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e, "sensorStocks")}
          />
        </MenuItem>
        <MenuItem onClick={handleExportClick}>
          <FileDownloadIcon sx={{ mr: 1 }} />
          Export Data
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileMenu;
