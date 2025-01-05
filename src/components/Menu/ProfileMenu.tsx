import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { SensorStocks } from "../../types/Common";
import Sensor from "../../types/Sensor";
import { v4 as uuidv4 } from "uuid"; // 引入uuid库
import notifier from "../Helper/Notification";
import { useSnackbar } from "notistack";

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
            onChange={(e) => handleFileUpload(e, "sensorSet")}
          />
        </MenuItem>
        <MenuItem component="label">
          <FileUploadIcon sx={{ mr: 1 }} />
          Import Sensor Database
          <input
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e, "sensorDatabase")}
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

export default ProfileMenu;
