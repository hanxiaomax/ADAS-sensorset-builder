import React, { useState } from "react";
import { Grid, Box, IconButton, TextField } from "@mui/material";
import { Stage, Layer, Rect, Arc } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import { Sensor } from "../components/Sensors";
import ControlPanel from "../components/ControlPanel";
import SettingsIcon from "@mui/icons-material/Settings";
import useImage from "use-image";
import { Position, MountPosition, SensorConfig } from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import _sensor_configuration from "../sensorConfiguration.json";
import { transformJsonArray } from "../parser";

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
  const stage_size = { width: 800, height: 1000 };
  const stage_center = {
    x: stage_size.width / 2,
    y: stage_size.height / 2,
  };
  const [image] = useImage("/vehicle.png");
  const vehicle = new Vehicle(stage_size, image);

  const [uiConfig, setUiconfig] = useState({
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

  let vehicle_keypoint = vehicle.refPoints;
  const [sensorConfiguration, setSensorConfiguration] = useState<
    SensorConfig[]
  >([]);

  const sensor_configuration = transformJsonArray(
    _sensor_configuration,
    vehicle._mountingPoints
  );

  console.log("Printing each object in the array:");
  sensor_configuration.forEach((item) => {
    console.log(JSON.stringify(item, null, 2));
  });

  // const sensor_configuration: SensorConfig[] = [
  //   {
  //     name: "Front Right Side",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.front_right_side,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Front Middle Right 1",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.front_middle_right1,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Front Middle Right 2",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.front_middle_right2,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Front Middle Left 1",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.front_middle_left1,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Front Middle Left 2",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.front_middle_left2,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Front Left Side",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.front_left_side,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Rear Right Side",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.rear_right_side,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Rear Middle Right 1",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.rear_middle_right1,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Rear Middle Right 2",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.rear_middle_right2,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Rear Middle Left 1",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.rear_middle_left1,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Rear Middle Left 2",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.rear_middle_left2,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Rear Left Side",
  //     type: "uss",
  //     mountPosition: vehicle.mountingPoints.rear_left_side,
  //     fov: 120,
  //     range: 50,
  //   },
  //   {
  //     name: "Lidar Top",
  //     type: "lidar",
  //     mountPosition: vehicle.mountingPoints.roof_top,
  //     fov: 360,
  //     range: 400,
  //   },
  //   {
  //     name: "Rear Left Corner Radar",
  //     type: "radar",
  //     mountPosition: vehicle.mountingPoints.rear_left_corner,
  //     fov: 90,
  //     range: 300,
  //   },
  //   {
  //     name: "Rear Right Corner Radar",
  //     type: "radar",
  //     mountPosition: vehicle.mountingPoints.rear_right_corner,
  //     fov: 90,
  //     range: 300,
  //   },
  //   {
  //     name: "Tele Camera",
  //     type: "tele_camera",
  //     mountPosition: vehicle.mountingPoints.front_windshield,
  //     fov: 60,
  //     range: 450,
  //   },
  //   {
  //     name: "Wide Camera",
  //     type: "camera",
  //     mountPosition: vehicle.mountingPoints.front_windshield,
  //     fov: 120,
  //     range: 200,
  //   },
  //   {
  //     name: "AVM Camera",
  //     type: "camera",
  //     mountPosition: vehicle.mountingPoints.b_pillar_left,
  //     fov: 180,
  //     range: 120,
  //   },
  //   {
  //     name: "AVM Camera",
  //     type: "camera",
  //     mountPosition: vehicle.mountingPoints.b_pillar_right,
  //     fov: 180,
  //     range: 120,
  //   },
  // ];

  return (
    <Grid
      container
      spacing={2}
      style={{ height: "100vh", alignItems: "center" }}
      sx={{ backgroundColor: uiConfig.background }}
    >
      <Grid item xs={10}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "scale(0.8)", // 0.5表示缩小为原始大小的50%
          }}
        >
          <Stage width={stage_size.width} height={stage_size.height}>
            {uiConfig.showCarImage && (
              <CarImage
                x={vehicle.origin.x}
                y={vehicle.origin.y}
                width={vehicle.width}
                height={vehicle.length}
                image={vehicle.image}
              />
            )}
            {/* <Layer>
              <Marker position={stage_center}></Marker>
            </Layer> */}
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
                Object.values(vehicle_keypoint).map((position, index) => (
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
          setUiConfig={setUiconfig}
          sensorConfiguration={sensorConfiguration}
          setSensorConfiguration={setSensorConfiguration}
          mountingPoints={vehicle.mountingPoints}
        />
      )}

      {!uiConfig.panelVisible && (
        <IconButton
          onClick={() =>
            setUiconfig((prev) => ({ ...prev, panelVisible: true }))
          }
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "16px", // 增加内部填充
            fontSize: "64px", // 增加文本大小
            width: "64px", // 设置宽度
            height: "64px", // 设置高度
            borderRadius: "8px", // 可选：让按钮更圆滑
            backgroundColor: "#f1f0ee",
          }}
        >
          <SettingsIcon />
        </IconButton>
      )}
    </Grid>
  );
};

export default SensorSetBuilderMain;
