import React from "react";
import { FormControlLabel, Switch, Box, TextField } from "@mui/material";
import useGlobalConfigStore from "../../stores/globalConfigStore";

const ViewPanel: React.FC = () => {
  const {
    layerVisibility,
    toggleLayerVisibility,
    ussZoneConfig,
    setUssZoneConfig,
  } = useGlobalConfigStore();

  const handleZoneChange =
    (zone: "frontZones" | "sideZones" | "rearZones") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setUssZoneConfig(zone, value);
    };

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={layerVisibility.showCarImage}
            onChange={() => toggleLayerVisibility("showCarImage")}
          />
        }
        label="Car Image"
      />
      <FormControlLabel
        control={
          <Switch
            checked={layerVisibility.showUssZones}
            onChange={() => toggleLayerVisibility("showUssZones")}
          />
        }
        label="USS Zones"
      />

      {layerVisibility.showUssZones && (
        <Box
          sx={{
            padding: "0 16px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 1,
          }}
        >
          <TextField
            label="Front"
            type="number"
            variant="standard"
            value={ussZoneConfig.frontZones}
            onChange={handleZoneChange("frontZones")}
            size="small"
            sx={{ marginBottom: 1, width: "100%" }}
            inputProps={{ min: 0, style: { textAlign: "center" } }}
          />
          <TextField
            label="Side"
            type="number"
            variant="standard"
            value={ussZoneConfig.sideZones}
            onChange={handleZoneChange("sideZones")}
            size="small"
            sx={{ marginBottom: 1, width: "100%" }}
            inputProps={{ min: 0, style: { textAlign: "center" } }}
          />
          <TextField
            label="Rear"
            type="number"
            variant="standard"
            value={ussZoneConfig.rearZones}
            onChange={handleZoneChange("rearZones")}
            size="small"
            sx={{ marginBottom: 1, width: "100%" }}
            inputProps={{ min: 0, style: { textAlign: "center" } }}
          />
        </Box>
      )}

      <FormControlLabel
        control={
          <Switch
            checked={layerVisibility.showUssSensors}
            onChange={() => toggleLayerVisibility("showUssSensors")}
          />
        }
        label="USS Sensors"
      />
      <FormControlLabel
        control={
          <Switch
            checked={layerVisibility.showLidarSensors}
            onChange={() => toggleLayerVisibility("showLidarSensors")}
          />
        }
        label="Lidar Sensors"
      />
      <FormControlLabel
        control={
          <Switch
            checked={layerVisibility.showRadarSensors}
            onChange={() => toggleLayerVisibility("showRadarSensors")}
          />
        }
        label="Radar Sensors"
      />
      <FormControlLabel
        control={
          <Switch
            checked={layerVisibility.showCameraSensors}
            onChange={() => toggleLayerVisibility("showCameraSensors")}
          />
        }
        label="Camera Sensors"
      />
      <FormControlLabel
        control={
          <Switch
            checked={layerVisibility.showVehicleRefPoint}
            onChange={() => toggleLayerVisibility("showVehicleRefPoint")}
          />
        }
        label="Vehicle Key Point"
      />
      <FormControlLabel
        control={
          <Switch
            checked={layerVisibility.showMountingPoints}
            onChange={() => toggleLayerVisibility("showMountingPoints")}
          />
        }
        label="Mounting Points"
      />
    </Box>
  );
};

export default ViewPanel;
