import React, { useState, useEffect } from "react";
import { Grid, Box, IconButton } from "@mui/material";
import { Stage, Layer, Rect } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import { Sensor } from "../components/Sensors";
import ControlPanel from "../components/ControlPanel";
import SettingsIcon from "@mui/icons-material/Settings";
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
  const stageCenter = { x: stageSize.width / 2, y: stageSize.height / 2 };
  const [image] = useImage("/vehicle.png");
  const vehicle = new Vehicle(stageSize, image);

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

              {sensor_configuration.length > 0 &&
                sensor_configuration.map((sensorConfig, index) => (
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
        <ControlPanel
          uiConfig={uiConfig}
          setUiConfig={setUiConfig}
          sensorConfiguration={sensorConfiguration}
          setSensorConfiguration={setSensorConfiguration}
          mountingPoints={vehicle.mountingPoints}
        />
      )}

      {!uiConfig.panelVisible && (
        <IconButton
          onClick={() =>
            setUiConfig((prev) => ({ ...prev, panelVisible: true }))
          }
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            padding: "16px",
            fontSize: "64px",
            width: "64px",
            height: "64px",
            borderRadius: "8px",
            backgroundColor: "#f1f0ee",
          }}
        >
          <SettingsIcon />
        </IconButton>
      )}

      {/* 引入 BottomDrawer 组件 */}
      <BottomDrawer />
    </Grid>
  );
};

export default SensorSetBuilderMain;
