import React, { useState, useEffect } from "react";
import { Grid, Box, AppBar, Toolbar, ButtonGroup } from "@mui/material";
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
import ViewMenu from "../components/ViewMenu"; // 引入ViewMenu组件
import ProfileMenu from "../components/ProfileMenu"; // 引入ProfileMenu组件

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

  const handleImport = () => {
    console.log("Import clicked");
    // 实现导入功能的逻辑
  };

  const handleExport = () => {
    console.log("Export clicked");
    // 实现导出功能的逻辑
  };

  return (
    <Grid
      container
      alignItems="center"
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: uiConfig.background,
      }}
    >
      {/* 工具栏 */}
      <AppBar
        position="static"
        elevation={1} // 移除 AppBar 的阴影
        sx={{
          backgroundColor: "#f8f8f8",
          color: "black",
        }}
      >
        {/* Profile 和 View 菜单按钮 */}
        <ButtonGroup
          disableElevation
          variant="outlined"
          size="small"
          sx={{
            "& .MuiButtonBase-root": {
              backgroundColor: "#ebebeb", // 设置按钮的背景色为灰色
              borderColor: "#f6f6f6",
              borderRightColor: "#d1d1d1",
              borderLeftColor: "#d1d1d1",
              color: "black", // 设置按钮文字颜色为黑色
              borderRadius: 0, // 移除按钮的圆角
              "&:hover": {
                backgroundColor: "#f6f6f6", // 设置悬停时的背景色
              },
            },
          }}
        >
          <ProfileMenu onImport={handleImport} onExport={handleExport} />
          <ViewMenu uiConfig={uiConfig} setUiConfig={setUiConfig} />
        </ButtonGroup>
      </AppBar>

      <Grid item xs={12}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100%",
            height: "100%",
            transform: "scale(0.8)",
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

      {/* 引入 BottomDrawer 组件 */}
      <BottomDrawer />
    </Grid>
  );
};

export default SensorSetBuilderMain;
