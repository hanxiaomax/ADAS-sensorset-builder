import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { SensorStocks } from "../../types/Common";
import notifier from "../Helper/Notification";
import { useSnackbar } from "notistack";

interface ProfileMenuProps {
  onImportSensorStock: (data: any) => void;
  onExport: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  onImportSensorStock,
  onExport,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    notifier.init(enqueueSnackbar);
  }, [enqueueSnackbar]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 验证SensorStocks的结构
  const isValidSensorStock = (data: any): data is SensorStocks => {
    return (
      typeof data === "object" && data !== null && Object.keys(data).length > 0
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (isValidSensorStock(data)) {
            onImportSensorStock(data);
            notifier.success("Sensor Database imported successfully!");
          } else {
            throw new Error("Invalid Sensor Database format.");
          }
        } catch (error) {
          const errorMessage = (error as Error).message.replace("Error: ", "");
          notifier.error(errorMessage);
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    }
  };

  const handleExportClick = () => {
    onExport();
    notifier.success("Data exported successfully!");
    handleClose();
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
          Import Database
          <input
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </MenuItem>
        <MenuItem onClick={handleExportClick}>
          <FileDownloadIcon sx={{ mr: 1 }} />
          Export Database
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
