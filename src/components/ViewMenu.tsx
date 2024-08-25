import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
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

  return (
    <>
      <Button
        aria-controls="view-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        View
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
                onChange={() =>
                  setUiConfig((prev: any) => ({
                    ...prev,
                    showUssZones: !prev.showUssZones,
                  }))
                }
              />
            }
            label="USS Zones"
          />
        </MenuItem>
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
      </Menu>
    </>
  );
};

export default ViewMenu;
