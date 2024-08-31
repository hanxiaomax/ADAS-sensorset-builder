import React, { useState, useEffect } from "react";
import { Grid, Box, AppBar, ButtonGroup, Typography } from "@mui/material";
import { Stage, Layer, Rect } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import { Sensor } from "../components/Sensors";
import useImage from "use-image";
import {
  Position,
  SensorConfig,
  MountPosition,
  SensorStock,
} from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import BottomDrawer from "../components/BottomDrawer";
import ViewMenu from "../components/ViewMenu";
import ProfileMenu from "../components/ProfileMenu";
import NerdMode from "../components/NerdMode";
import SensorPanel from "../components/SensorPanel"; // 导入新的 SensorPanel 组件
import Marker from "../components/utils";

const SensorSetBuilderMain: React.FC = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [sensorConfiguration, setSensorConfiguration] = useState<
    SensorConfig[]
  >([]);
  const [sensorData, setSensorData] = useState<SensorStock>();

  const [selectedSensorIndex, setSelectedSensorIndex] = useState<number | null>(
    null
  ); // 用于存储选中的传感器索引

  const [uiConfig, setUiConfig] = useState({
    showCarImage: true,
    showUssZones: false,
    showUssSensors: true,
    showLidarSensors: true,
    showRadarSensors: true,
    showCameraSensors: true,
    showVehicleRefPoint: false,
    showNerdMode: false,
    frontZones: 6,
    rearZones: 4,
    sideZones: 6,
    panelVisible: false,
    background: "white",
  });

  const [image] = useImage("/vehicle.png");
  const vehicle = new Vehicle(stageSize, image);

  const mountingPointsJSON = JSON.stringify(vehicle._mountingPoints);
  localStorage.setItem("mountingPoints", mountingPointsJSON);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 在组件加载时从 localStorage 中加载数据
  useEffect(() => {
    const storedSensorConfig = localStorage.getItem("sensorConfig");
    const storedSensorData = localStorage.getItem("sensorData");
    if (storedSensorConfig) {
      const parsedConfig = JSON.parse(storedSensorConfig);
      setSensorConfiguration(parsedConfig);
    }

    if (storedSensorData) {
      setSensorData(JSON.parse(storedSensorData) as SensorStock);
    }
  }, []);

  const handleSensorSetConfigImport = (data: SensorConfig[]) => {
    // const transformedData = transformJsonArray(data, vehicle._mountingPoints);
    setSensorConfiguration(data);
    localStorage.setItem("sensorConfig", JSON.stringify(data)); // 保存到 localStorage
  };

  const handleSensorStockImport = (data: SensorStock) => {
    setSensorData(data);
    localStorage.setItem("sensorData", JSON.stringify(data)); // 保存到 localStorage
  };

  const handleExport = () => {
    const sensorConfig = localStorage.getItem("sensorConfig");
    const sensorData = localStorage.getItem("sensorData");

    if (sensorConfig) {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(JSON.parse(sensorConfig), null, 2));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "sensor_config.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      alert("No sensor configuration data available to export.");
    }

    if (sensorData) {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(JSON.parse(sensorData), null, 2));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "sensor_data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      alert("No sensor data available to export.");
    }
  };

  const handleDeleteSensor = (index: number) => {
    const updatedConfig = [...sensorConfiguration];
    updatedConfig.splice(index, 1); // 删除指定的传感器
    setSensorConfiguration(updatedConfig);
    localStorage.setItem("sensorConfig", JSON.stringify(updatedConfig)); // 更新localStorage中的数据
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
      <AppBar
        position="static"
        elevation={1}
        sx={{
          backgroundColor: "#f8f8f8",
          color: "black",
        }}
      >
        <ButtonGroup
          disableElevation
          variant="outlined"
          size="small"
          sx={{
            "& .MuiButtonBase-root": {
              backgroundColor: "#ebebeb",
              borderColor: "#f6f6f6",
              borderRightColor: "#d1d1d1",
              borderLeftColor: "#d1d1d1",
              color: "black",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: "#f6f6f6",
              },
            },
          }}
        >
          <ProfileMenu
            onImportSensorSetConfigImport={handleSensorSetConfigImport}
            onImportSensorStock={handleSensorStockImport}
            onExport={handleExport}
          />
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
            zIndex: 1000,
          }}
        >
          <Stage width={stageSize.width} height={stageSize.height}>
            <CarImage
              show={uiConfig.showCarImage}
              x={vehicle.origin.x}
              y={vehicle.origin.y}
              width={vehicle.width}
              height={vehicle.length}
              image={vehicle.image}
            />

            <UssZones
              show={uiConfig.showUssZones}
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

            <Layer>
              {uiConfig.showVehicleRefPoint &&
                Object.values(vehicle.refPoints).map((position, index) => (
                  <Marker key={index} position={position} fill="red" />
                ))}

              {sensorConfiguration.map((sensor, index) => (
                <Sensor
                  key={index}
                  sensorConfig={sensor}
                  uiConfig={uiConfig}
                  highlighted={selectedSensorIndex === index} // 高亮显示选中的传感器
                />
              ))}
            </Layer>
          </Stage>
        </Box>
      </Grid>

      <BottomDrawer sensorStocks={sensorData} />

      {/* <NerdMode
        show={uiConfig.showNerdMode}
        sensor_configuration={sensorConfiguration}
        sensor_stocks={sensorData}
      /> */}

      {/* 使用新的 SensorPanel 组件，并传递 onDelete 和 setSelectedSensorIndex 函数 */}
      <SensorPanel
        sensorConfiguration={sensorConfiguration}
        onDelete={handleDeleteSensor}
        onSelectSensor={(index) => setSelectedSensorIndex(index)} // 传递选择传感器的回调
      />
    </Grid>
  );
};

export default SensorSetBuilderMain;
