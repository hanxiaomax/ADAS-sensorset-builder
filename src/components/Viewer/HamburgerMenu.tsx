import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Settings, ImportExport, Help, GitHub } from "@mui/icons-material";
import { useSceneStore } from "../../stores/sceneStore";
import { useSensorStore } from "../../stores/sensorStore";
import { SensorStocks } from "../../types/Common";
import notifier from "../Helper/Notification";
import { useSnackbar } from "notistack";

const HamburgerMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { scale, stagePos, rotation, sensors, selectedSensor } =
    useSceneStore();
  const { sensorStocks, setSensorStocks } = useSensorStore();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    notifier.init(enqueueSnackbar);
  }, [enqueueSnackbar]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 验证SensorStocks的结构
  const isValidSensorStock = (data: any): data is SensorStocks => {
    return (
      typeof data === "object" && data !== null && Object.keys(data).length > 0
    );
  };

  const handleImportSensorDatabase = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (isValidSensorStock(data)) {
            setSensorStocks(data);
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
    };

    input.click();
    handleMenuClose();
  };

  const handleExportSensorDatabase = () => {
    const stockDataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sensorStocks, null, 2));
    const stockDownloadNode = document.createElement("a");
    stockDownloadNode.setAttribute("href", stockDataStr);
    stockDownloadNode.setAttribute("download", "sensor_database.json");
    document.body.appendChild(stockDownloadNode);
    stockDownloadNode.click();
    stockDownloadNode.remove();
    notifier.success("Sensor Database exported successfully!");
    handleMenuClose();
  };

  const handleImportScene = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const sceneData = JSON.parse(event.target?.result as string);
          useSceneStore.setState(sceneData);
          notifier.success("Scene imported successfully!");
        } catch (error) {
          console.error("Error loading scene:", error);
          notifier.error("Failed to load scene configuration file");
        }
      };
      reader.readAsText(file);
    };

    input.click();
    handleMenuClose();
  };

  const handleExportScene = () => {
    const sceneData = {
      scale,
      stagePos,
      rotation,
      sensors,
      selectedSensor,
    };

    const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scene_config.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notifier.success("Scene exported successfully!");
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1100,
      }}
    >
      <IconButton
        onClick={handleMenuClick}
        size="large"
        sx={{
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
          boxShadow: 2,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleImportSensorDatabase}>
          <ListItemIcon>
            <ImportExport fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import Sensor Database</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportSensorDatabase}>
          <ListItemIcon>
            <ImportExport fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Sensor Database</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleImportScene}>
          <ListItemIcon>
            <ImportExport fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import Scene</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportScene}>
          <ListItemIcon>
            <ImportExport fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Scene</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Help fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <GitHub fontSize="small" />
          </ListItemIcon>
          <ListItemText>GitHub</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HamburgerMenu;
