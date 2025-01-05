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
    showCarImage,
    showUssZones,
    showUssSensors,
    showLidarSensors,
    showRadarSensors,
    showCameraSensors,
    showVehicleRefPoint,
    showGrid,
    frontZones,
    sideZones,
    rearZones,
    toggleCarImage,
    toggleUssZones,
    toggleUssSensors,
    toggleLidarSensors,
    toggleRadarSensors,
    toggleCameraSensors,
    toggleVehicleRefPoint,
    setFrontZones,
    setSideZones,
    setRearZones,
  } = useUiConfigStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUssZonesToggle = toggleUssZones;

  const handleZoneChange =
    (zone: "frontZones" | "sideZones" | "rearZones") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (zone === "frontZones") setFrontZones(value);
      else if (zone === "sideZones") setSideZones(value);
      else if (zone === "rearZones") setRearZones(value);
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
              <Switch checked={showCarImage} onChange={toggleCarImage} />
            }
            label="Car Image"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch checked={showUssZones} onChange={toggleUssZones} />
            }
            label="USS Zones"
          />
        </MenuItem>

        {showUssZones && (
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
              value={frontZones}
              onChange={handleZoneChange("frontZones")}
              size="small"
              sx={{ marginBottom: 1, width: "100%" }} // 设置宽度为100%
              inputProps={{ min: 0, style: { textAlign: "center" } }} // 使数字居中
            />
            <TextField
              label="Side"
              type="number"
              variant="standard"
              value={sideZones}
              onChange={handleZoneChange("sideZones")}
              size="small"
              sx={{ marginBottom: 1, width: "100%" }} // 设置宽度为100%
              inputProps={{ min: 0, style: { textAlign: "center" } }} // 使数字居中
            />
            <TextField
              label="Rear"
              type="number"
              variant="standard"
              value={rearZones}
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
              <Switch checked={showUssSensors} onChange={toggleUssSensors} />
            }
            label="USS Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={showLidarSensors}
                onChange={toggleLidarSensors}
              />
            }
            label="Lidar Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={showRadarSensors}
                onChange={toggleRadarSensors}
              />
            }
            label="Radar Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={showCameraSensors}
                onChange={toggleCameraSensors}
              />
            }
            label="Camera Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={showVehicleRefPoint}
                onChange={toggleVehicleRefPoint}
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
