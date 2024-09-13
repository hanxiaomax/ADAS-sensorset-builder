import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  AlertTitle,
  Typography,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { SensorStocks, Sensor } from "../types/Common";
import { v4 as uuidv4 } from "uuid"; // 引入uuid库

interface ProfileMenuProps {
  onImportSensorSetConfigImport: (sensors: Sensor[]) => void;
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

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setOpenSnackbar(false); // 强制关闭Snackbar

    // 确保Snackbar关闭后再显示新消息，使用短暂延迟
    setTimeout(() => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setOpenSnackbar(true); // 重新打开Snackbar
    }, 200);
  };

  const isValidUUID = (id: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
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
            const data = JSON.parse(e.target?.result as string) as SensorStocks;
            onImportSensorStock(data);
            showSnackbar("Sensor Stocks imported successfully!", "success");
          } else if (type === "sensorConfig") {
            const data = JSON.parse(e.target?.result as string) as Sensor[];

            // 检查和生成UUID，并实例化Sensor对象
            const sensorInstances = data.map((sensor) => {
              const sensorId = isValidUUID(sensor.id) ? sensor.id : uuidv4();

              // 实例化Sensor对象
              return new Sensor(
                sensorId,
                sensor.sensorInfo,
                sensor.mountPosition
              );
            });

            onImportSensorSetConfigImport(sensorInstances);
            showSnackbar(
              "Sensor Set imported and instantiated successfully!",
              "success"
            );
          }
        } catch (error) {
          const errorMessage = (error as Error).message.replace("Error: ", "");
          showSnackbar(`Import failed due to:\n${errorMessage}`, "error");
        }
      };
      reader.readAsText(file);

      // 重置 input 的值，确保相同文件的二次导入也能触发
      event.target.value = "";
    }
  };

  const handleExportClick = () => {
    onExport();
    showSnackbar("Data exported successfully!", "success");
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
          sx={{
            width: "100%",
            backgroundColor:
              snackbarSeverity === "error" ? "#ff9800" : undefined,
            color: snackbarSeverity === "error" ? "#fff" : undefined,
          }}
        >
          {snackbarSeverity === "error" ? <AlertTitle>Error</AlertTitle> : null}
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {snackbarMessage}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileMenu;
