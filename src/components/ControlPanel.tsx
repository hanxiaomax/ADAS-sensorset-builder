import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UiConfig, SensorConfig, MountPosition } from "../types/Common";
import { MountingPoints } from "../types/Vehicle";

interface ControlPanelProps {
  uiConfig: UiConfig;
  setUiConfig: React.Dispatch<React.SetStateAction<UiConfig>>;
  sensorConfiguration: SensorConfig[]; // 主插件的 sensor_configuration 数组
  setSensorConfiguration: React.Dispatch<React.SetStateAction<SensorConfig[]>>;
  mountingPoints: MountingPoints; // 车辆的安装点集合
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  uiConfig,
  setUiConfig,
  sensorConfiguration,
  setSensorConfiguration,
  mountingPoints,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSensor, setNewSensor] = useState<SensorConfig>({
    name: "",
    type: "",
    mountPosition: { position: { x: 0, y: 0 }, orientation: 0 },
    fov: 0,
    range: 0,
  });

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const handleAddSensor = () => {
    setSensorConfiguration([...sensorConfiguration, newSensor]);
    handleDialogClose();
  };

  const handleSensorChange = (field: keyof SensorConfig, value: any) => {
    console.log(value);
    setNewSensor((prev) => ({ ...prev, [field]: value }));
  };

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
      bgcolor="#efefef"
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

      {/* 添加传感器按钮 */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleDialogOpen}
        fullWidth
      >
        添加传感器
      </Button>

      {/* 添加传感器对话框 */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>添加新的传感器</DialogTitle>
        <DialogContent>
          <TextField
            label="名称"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newSensor.name}
            onChange={(e) => handleSensorChange("name", e.target.value)}
          />
          <TextField
            label="类型"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newSensor.type}
            onChange={(e) => handleSensorChange("type", e.target.value)}
          />
          <TextField
            label="视场角 (FOV)"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            value={newSensor.fov}
            onChange={(e) =>
              handleSensorChange("fov", parseInt(e.target.value))
            }
          />
          <TextField
            label="范围 (Range)"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            value={newSensor.range}
            onChange={(e) =>
              handleSensorChange("range", parseInt(e.target.value))
            }
          />
          <Select
            label="安装位置"
            variant="outlined"
            fullWidth
            value={
              Object.keys(mountingPoints).find(
                (key) =>
                  mountingPoints[key as keyof MountingPoints] ===
                  newSensor.mountPosition
              ) || ""
            }
            onChange={(e) =>
              handleSensorChange(
                "mountPosition",
                mountingPoints[e.target.value as keyof MountingPoints]
              )
            }
          >
            {Object.keys(mountingPoints).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            取消
          </Button>
          <Button onClick={handleAddSensor} color="primary">
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ControlPanel;
