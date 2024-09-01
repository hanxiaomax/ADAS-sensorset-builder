import React from "react";
import { Menu, MenuItem, Button } from "@mui/material";
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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          if (type == "sensorStocks") {
            const data = JSON.parse(e.target?.result as string) as SensorStock;
            onImportSensorStock(data);
          } else if (type == "sensorConfig") {
            const data = JSON.parse(
              e.target?.result as string
            ) as SensorConfig[];
            console.log(data);
            onImportSensorSetConfigImport(data);
            console.log("success");
          } else {
          }
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
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
        <MenuItem onClick={onExport}>
          <FileDownloadIcon sx={{ mr: 1 }} />
          Export Data
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
