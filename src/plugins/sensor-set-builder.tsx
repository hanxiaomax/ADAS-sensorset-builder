import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Stage, Layer, Rect } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import { Sensor } from "../components/Sensors";
import ControlPanel from "../components/ControlPanel";
import useImage from "use-image";
import { Position, SensorConfig } from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import _sensor_configuration from "../sensorConfiguration.json";
import { transformJsonArray } from "../parser";
import BottomDrawer from "../components/BottomDrawer"; // 引入新的BottomDrawer组件

interface MarkerProps {
  position: Position;
  fill?: string;
}

const Marker: React.FC<MarkerProps> = ({ position, fill = "black" }) => {
  const offset = 5;
  return (
    <Rect
      x={position.x - offset}
      y={position.y - offset}
      width={10}
      height={10}
      fill={fill}
    />
  );
};

const SensorSetBuilderMain: React.FC = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [uiConfig, setUiConfig] = useState({
    showCarImage: true,
    showUssZones: false,
    showUssSensors: true,
    showLidarSensors: true,
    showRadarSensors: true,
    showCameraSensors: true,
    showVehicleRefPoint: false,
    frontZones: 6,
    rearZones: 4,
    sideZones: 6,
    panelVisible: false,
    background: "white",
  });

  const stageCenter = { x: stageSize.width / 2, y: stageSize.height / 2 };
  const [image] = useImage("/vehicle.png");
  const vehicle = new Vehicle(stageSize, image);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let vehicleKeyPoint = vehicle.refPoints;
  const [sensorConfiguration, setSensorConfiguration] = useState<
    SensorConfig[]
  >([]);

  const sensor_configuration = transformJsonArray(
    _sensor_configuration,
    vehicle._mountingPoints
  );

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: uiConfig.background,
        alignItems: "center",
      }}
    >
      {/* 工具栏 */}
      <Grid item xs={12}>
        <Box
          sx={{
            height: "50px",
            width: "100%",
            backgroundColor: "#f8f8f8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 1400,
          }}
        >
          <Box>
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
                        setUiConfig((prev) => ({
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
                        setUiConfig((prev) => ({
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
                        setUiConfig((prev) => ({
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
                        setUiConfig((prev) => ({
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
                        setUiConfig((prev) => ({
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
                        setUiConfig((prev) => ({
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
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100%",
            height: "100%",
            transform: "scale(0.7)",
          }}
        >
          <Stage width={stageSize.width} height={stageSize.height}>
            {uiConfig.showCarImage && (
              <CarImage
                x={vehicle.origin.x}
                y={vehicle.origin.y}
                width={vehicle.width}
                height={vehicle.length}
                image={vehicle.image}
              />
            )}
            {uiConfig.showUssZones && (
              <UssZones
                x={vehicle.origin.x}
                y={vehicle.origin.y}
                carWidth={vehicle.width}
                carLength={vehicle.length}
                frontOverhang={vehicle.frontOverhang}
                rearOverhang={vehicle.rearOverhang}
                frontZones={uiConfig.frontZones}
                rearZones={uiConfig.rearZones}
                sideZones={uiConfig.sideZones}
              />
            )}

            <Layer>
              {uiConfig.showVehicleRefPoint &&
                Object.values(vehicleKeyPoint).map((position, index) => (
                  <Marker key={index} position={position} fill="red" />
                ))}

              {uiConfig.showUssSensors &&
                sensor_configuration
                  .filter((sensor) => sensor.type === "uss")
                  .map((sensorConfig, index) => (
                    <Sensor
                      key={index}
                      type={sensorConfig.type}
                      mountPosition={sensorConfig.mountPosition}
                      fov={sensorConfig.fov}
                      range={sensorConfig.range}
                      uiConfig={uiConfig}
                    />
                  ))}
              {uiConfig.showLidarSensors &&
                sensor_configuration
                  .filter((sensor) => sensor.type === "lidar")
                  .map((sensorConfig, index) => (
                    <Sensor
                      key={index}
                      type={sensorConfig.type}
                      mountPosition={sensorConfig.mountPosition}
                      fov={sensorConfig.fov}
                      range={sensorConfig.range}
                      uiConfig={uiConfig}
                    />
                  ))}
              {uiConfig.showRadarSensors &&
                sensor_configuration
                  .filter((sensor) => sensor.type === "radar")
                  .map((sensorConfig, index) => (
                    <Sensor
                      key={index}
                      type={sensorConfig.type}
                      mountPosition={sensorConfig.mountPosition}
                      fov={sensorConfig.fov}
                      range={sensorConfig.range}
                      uiConfig={uiConfig}
                    />
                  ))}
              {uiConfig.showCameraSensors &&
                sensor_configuration
                  .filter((sensor) => sensor.type === "camera")
                  .map((sensorConfig, index) => (
                    <Sensor
                      key={index}
                      type={sensorConfig.type}
                      mountPosition={sensorConfig.mountPosition}
                      fov={sensorConfig.fov}
                      range={sensorConfig.range}
                      uiConfig={uiConfig}
                    />
                  ))}
            </Layer>
          </Stage>
        </Box>
      </Grid>

      {uiConfig.panelVisible && (
        <Box sx={{ zIndex: 1400 }}>
          <ControlPanel
            uiConfig={uiConfig}
            setUiConfig={setUiConfig}
            sensorConfiguration={sensorConfiguration}
            setSensorConfiguration={setSensorConfiguration}
            mountingPoints={vehicle.mountingPoints}
          />
        </Box>
      )}

      {/* 引入 BottomDrawer 组件 */}
      <BottomDrawer />
    </Grid>
  );
};

export default SensorSetBuilderMain;
