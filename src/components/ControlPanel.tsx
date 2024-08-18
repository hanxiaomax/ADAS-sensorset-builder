import React from "react";

import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UiConfig } from "../types/Common";

interface ControlPanelProps {
  uiConfig: UiConfig;
  setUiConfig: React.Dispatch<React.SetStateAction<UiConfig>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  uiConfig,
  setUiConfig,
}) => {
  const layers = [
    {
      name: "Vehicle",
      visible: uiConfig.showCarImage,
      toggleVisibility: () =>
        setUiConfig((prev) => ({ ...prev, showCarImage: !prev.showCarImage })),
      controls: null,
    },
    {
      name: "USS Zone",
      visible: uiConfig.showUssZones,
      toggleVisibility: () =>
        setUiConfig((prev) => ({ ...prev, showUssZones: !prev.showUssZones })),
      controls: (
        <Box>
          <TextField
            label="Front Zones Numbers"
            type="number"
            variant="outlined"
            value={uiConfig.frontZones}
            onChange={(e) =>
              setUiConfig((prev) => ({
                ...prev,
                frontZones: parseInt(e.target.value),
              }))
            }
            margin="normal"
            fullWidth
          />
          <TextField
            label="Side Zone Numbers"
            type="number"
            variant="outlined"
            value={uiConfig.sideZones}
            onChange={(e) =>
              setUiConfig((prev) => ({
                ...prev,
                sideZones: parseInt(e.target.value),
              }))
            }
            margin="normal"
            fullWidth
          />
          <TextField
            label="Rear Zones Numbers"
            type="number"
            variant="outlined"
            value={uiConfig.rearZones}
            onChange={(e) =>
              setUiConfig((prev) => ({
                ...prev,
                rearZones: parseInt(e.target.value),
              }))
            }
            margin="normal"
            fullWidth
          />
        </Box>
      ),
    },

    {
      name: "USS",
      visible: uiConfig.showUssSensors,
      toggleVisibility: () =>
        setUiConfig((prev) => ({
          ...prev,
          showUssSensors: !prev.showUssSensors,
        })),
      controls: null,
    },
    {
      name: "Lidar",
      visible: uiConfig.showLidarSensors,
      toggleVisibility: () =>
        setUiConfig((prev) => ({
          ...prev,
          showLidarSensors: !prev.showLidarSensors,
        })),
      controls: null,
    },
    {
      name: "Radar",
      visible: uiConfig.showRadarSensors,
      toggleVisibility: () =>
        setUiConfig((prev) => ({
          ...prev,
          showRadarSensors: !prev.showRadarSensors,
        })),
      controls: null,
    },
    {
      name: "Camera",
      visible: uiConfig.showCameraSensors,
      toggleVisibility: () =>
        setUiConfig((prev) => ({
          ...prev,
          showCameraSensors: !prev.showCameraSensors,
        })),
      controls: null,
    },
    {
      name: "Vehicle Ref Point",
      visible: uiConfig.showVehicleRefPoint,
      toggleVisibility: () =>
        setUiConfig((prev) => ({
          ...prev,
          showVehicleRefPoint: !prev.showVehicleRefPoint,
        })),
      controls: null,
    },
  ];
  return (
    <Box
      width="250px"
      bgcolor="white"
      padding={2}
      borderRadius={4}
      boxShadow={3}
      position="absolute"
      top={16}
      right={16}
    >
      {/* 右上角关闭按钮 */}
      <IconButton
        onClick={() =>
          setUiConfig((prev) => ({ ...prev, panelVisible: false }))
        }
        style={{ position: "absolute", top: 8, right: 8 }}
        size="small"
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6">图层控制</Typography>
      {layers.map((layer, index) => (
        <div key={index}>
          <FormControlLabel
            control={
              <Switch
                checked={layer.visible}
                onChange={layer.toggleVisibility}
                color="primary"
              />
            }
            label={`显示 ${layer.name}`}
          />
          {layer.visible && layer.controls}
        </div>
      ))}
    </Box>
  );
};

export default ControlPanel;
