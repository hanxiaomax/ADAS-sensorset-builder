import React, { useState } from "react";
import { Menu, MenuItem, Button, IconButton } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { SensorStocks } from "../../types/Common";
import Sensor from "../../types/Sensor";
import { v4 as uuidv4 } from "uuid"; // 引入uuid库
import notifier from "../Helper/Notification";
import { useSnackbar } from "notistack";
import DehazeRoundedIcon from "@mui/icons-material/DehazeRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
interface MainMenuProps {
  onImportSensorSetConfigImport: (sensors: Sensor[]) => void;
  onImportSensorStock: (data: any) => void;
  onExport: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onImportSensorSetConfigImport,
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

  const isValidUUID = (id: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // 验证SensorSet的结构
  const isValidSensorSet = (data: any): data is Sensor[] => {
    return Array.isArray(data) && data.every(isValidSensor);
  };

  // 验证SensorStocks的结构
  const isValidSensorStock = (data: any): data is SensorStocks => {
    return (
      typeof data === "object" && data !== null && Object.keys(data).length > 0
    );
  };

  // 验证单个Sensor的结构
  const isValidSensor = (sensor: any): sensor is Sensor => {
    return (
      typeof sensor.id === "string" &&
      typeof sensor.sensorInfo === "object" &&
      typeof sensor.sensorInfo.name === "string" &&
      typeof sensor.mountPosition === "object" &&
      typeof sensor.mountPosition.name === "string"
    );
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "sensorSet" | "sensorDatabase"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);

          if (type === "sensorDatabase") {
            if (isValidSensorStock(data)) {
              // 验证传入数据是否符合SensorStocks类型
              onImportSensorStock(data);
              notifier.success("Sensor Stocks imported successfully!");
            } else {
              throw new Error("Invalid Sensor Database format.");
            }
          } else if (type === "sensorSet") {
            if (isValidSensorSet(data)) {
              // 验证传入数据是否符合Sensor类型
              const sensorInstances = data.map((sensor: any) => {
                const sensorId = isValidUUID(sensor.id) ? sensor.id : uuidv4();
                return new Sensor(
                  sensorId,
                  sensor.sensorInfo,
                  sensor.mountPosition
                );
              });
              onImportSensorSetConfigImport(sensorInstances);
              notifier.success(
                "Sensor Set imported and instantiated successfully!"
              );
            } else {
              notifier.error("Invalid Sensor Set format.");
            }
          }
        } catch (error) {
          const errorMessage = (error as Error).message.replace("Error: ", "");
          notifier.error(errorMessage);
        }
      };
      reader.readAsText(file);

      // 重置 input 的值，确保相同文件的二次导入也能触发
      event.target.value = "";
    }
  };

  const handleExportClick = () => {
    onExport();
    notifier.success("Data exported successfully!");
  };

  return (
    <>
      <Button
        aria-label="main menu"
        aria-controls="main-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          left: "3vh",
          top: "3vh",
          backgroundColor: "#f5f5f5",
          zIndex: 1000,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
        }}
      >
        <DehazeRoundedIcon />
      </Button>
      <Menu
        id="main-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "main-menu-button",
          sx: { minWidth: 200 },
        }}
      >
        <MenuItem component="label" sx={{ py: 1.5 }}>
          <FileUploadIcon sx={{ mr: 1.5 }} />
          Import Sensor Set
          <input
            id="sensor-set-upload"
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e, "sensorSet")}
            aria-labelledby="sensor-set-label"
          />
        </MenuItem>
        <MenuItem component="label" sx={{ py: 1.5 }}>
          <FileUploadIcon sx={{ mr: 1.5 }} />
          Import Sensor Database
          <input
            id="sensor-database-upload"
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e, "sensorDatabase")}
            aria-labelledby="sensor-database-label"
          />
        </MenuItem>
        <MenuItem onClick={handleExportClick}>
          <FileDownloadIcon sx={{ mr: 1 }} />
          Export Data
        </MenuItem>
      </Menu>
    </>
  );
};

export default MainMenu;
