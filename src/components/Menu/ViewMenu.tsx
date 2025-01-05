import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  TextField,
} from "@mui/material";
import useUiConfigStore from "../../stores/uiConfigStore";

const ViewMenu: React.FC = () => {
  const {
    layerVisibility,
    toggleLayerVisibility,
    ussZoneConfig,
    setUssZoneConfig,
  } = useUiConfigStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleZoneChange =
    (zone: "frontZones" | "sideZones" | "rearZones") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setUssZoneConfig(zone, value);
    };

  return (
    <>
      <Button
        aria-controls="view-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        View Control
      </Button>
      <Menu
        id="view-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={layerVisibility.showCarImage}
                onChange={() => toggleLayerVisibility("showCarImage")}
              />
            }
            label="Car Image"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={layerVisibility.showUssZones}
                onChange={() => toggleLayerVisibility("showUssZones")}
              />
            }
            label="USS Zones"
          />
        </MenuItem>

        {layerVisibility.showUssZones && (
          <Box
            sx={{
              padding: "0 16px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              label="Front"
              type="number"
              variant="standard"
              value={ussZoneConfig.frontZones}
              onChange={handleZoneChange("frontZones")}
              size="small"
              sx={{ marginBottom: 1, width: "100%" }} // 设置宽度为100%
              inputProps={{ min: 0, style: { textAlign: "center" } }} // 使数字居中
            />
            <TextField
              label="Side"
              type="number"
              variant="standard"
              value={ussZoneConfig.sideZones}
              onChange={handleZoneChange("sideZones")}
              size="small"
              sx={{ marginBottom: 1, width: "100%" }} // 设置宽度为100%
              inputProps={{ min: 0, style: { textAlign: "center" } }} // 使数字居中
            />
            <TextField
              label="Rear"
              type="number"
              variant="standard"
              value={ussZoneConfig.rearZones}
              onChange={handleZoneChange("rearZones")}
              size="small"
              sx={{ marginBottom: 1, width: "100%" }} // 设置宽度为100%
              inputProps={{ min: 0, style: { textAlign: "center" } }} // 使数字居中
            />
          </Box>
        )}

        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={layerVisibility.showUssSensors}
                onChange={() => toggleLayerVisibility("showUssSensors")}
              />
            }
            label="USS Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={layerVisibility.showLidarSensors}
                onChange={() => toggleLayerVisibility("showLidarSensors")}
              />
            }
            label="Lidar Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={layerVisibility.showRadarSensors}
                onChange={() => toggleLayerVisibility("showRadarSensors")}
              />
            }
            label="Radar Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={layerVisibility.showCameraSensors}
                onChange={() => toggleLayerVisibility("showCameraSensors")}
              />
            }
            label="Camera Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={layerVisibility.showVehicleRefPoint}
                onChange={() => toggleLayerVisibility("showVehicleRefPoint")}
              />
            }
            label="Vehicle Key Point"
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ViewMenu;
