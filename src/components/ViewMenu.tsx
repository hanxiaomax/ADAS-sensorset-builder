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

interface ViewMenuProps {
  uiConfig: any;
  setUiConfig: React.Dispatch<React.SetStateAction<any>>;
}

const ViewMenu: React.FC<ViewMenuProps> = ({ uiConfig, setUiConfig }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUssZonesToggle = () => {
    setUiConfig((prev: any) => ({
      ...prev,
      showUssZones: !prev.showUssZones,
    }));
  };

  const handleZoneChange =
    (zone: "frontZones" | "sideZones" | "rearZones") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUiConfig((prev: any) => ({
        ...prev,
        [zone]: Number(event.target.value),
      }));
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
                checked={uiConfig.showCarImage}
                onChange={() =>
                  setUiConfig((prev: any) => ({
                    ...prev,
                    showCarImage: !prev.showCarImage,
                  }))
                }
              />
            }
            label="Car Image"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={uiConfig.showUssZones}
                onChange={handleUssZonesToggle}
              />
            }
            label="USS Zones"
          />
        </MenuItem>

        {uiConfig.showUssZones && (
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
              value={uiConfig.frontZones}
              onChange={handleZoneChange("frontZones")}
              size="small"
              sx={{ marginBottom: 1, width: "100%" }} // 设置宽度为100%
              inputProps={{ min: 0, style: { textAlign: "center" } }} // 使数字居中
            />
            <TextField
              label="Side"
              type="number"
              variant="standard"
              value={uiConfig.sideZones}
              onChange={handleZoneChange("sideZones")}
              size="small"
              sx={{ marginBottom: 1, width: "100%" }} // 设置宽度为100%
              inputProps={{ min: 0, style: { textAlign: "center" } }} // 使数字居中
            />
            <TextField
              label="Rear"
              type="number"
              variant="standard"
              value={uiConfig.rearZones}
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
                checked={uiConfig.showUssSensors}
                onChange={() =>
                  setUiConfig((prev: any) => ({
                    ...prev,
                    showUssSensors: !prev.showUssSensors,
                  }))
                }
              />
            }
            label="USS Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={uiConfig.showLidarSensors}
                onChange={() =>
                  setUiConfig((prev: any) => ({
                    ...prev,
                    showLidarSensors: !prev.showLidarSensors,
                  }))
                }
              />
            }
            label="Lidar Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={uiConfig.showRadarSensors}
                onChange={() =>
                  setUiConfig((prev: any) => ({
                    ...prev,
                    showRadarSensors: !prev.showRadarSensors,
                  }))
                }
              />
            }
            label="Radar Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={uiConfig.showCameraSensors}
                onChange={() =>
                  setUiConfig((prev: any) => ({
                    ...prev,
                    showCameraSensors: !prev.showCameraSensors,
                  }))
                }
              />
            }
            label="Camera Sensors"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={uiConfig.showVehicleRefPoint}
                onChange={() =>
                  setUiConfig((prev: any) => ({
                    ...prev,
                    showVehicleRefPoint: !prev.showVehicleRefPoint,
                  }))
                }
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
