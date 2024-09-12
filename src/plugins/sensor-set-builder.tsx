import React, { useState, useEffect, useRef } from "react";
import { Grid, Box } from "@mui/material";
import { Stage as KonvaStage, Layer, Rect } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import { SensorBlock } from "../components/Sensors";
import useImage from "use-image";
import { Sensor, SensorStocks } from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import BottomDrawer from "../components/BottomDrawer";
import SensorPanel from "../components/SensorPanel"; // 导入新的 SensorPanel 组件
import Marker from "../components/utils";
import MenuBar from "../components/MenuBar";
import { Stage } from "konva/lib/Stage";

const SensorSetBuilderMain: React.FC = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const stageRef = useRef<Stage>(null);

  const [sensorConfiguration, setSensorConfiguration] = useState<Sensor[]>([]);
  const [sensorData, setSensorData] = useState<SensorStocks>({});

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
    const storedSensorStocks = localStorage.getItem("sensorStocks");
    if (storedSensorConfig) {
      const parsedConfig = JSON.parse(storedSensorConfig);
      setSensorConfiguration(parsedConfig);
    }

    if (storedSensorStocks) {
      setSensorData(JSON.parse(storedSensorStocks) as SensorStocks);
    }
  }, []);

  const handleSensorSetConfigImport = (data: Sensor[]) => {
    setSensorConfiguration(data);
    localStorage.setItem("sensorConfig", JSON.stringify(data)); // 保存到 localStorage
  };

  const handleSensorStockImport = (data: SensorStocks) => {
    setSensorData(data);
    localStorage.setItem("sensorStocks", JSON.stringify(data)); // 保存到 localStorage
  };

  const handleExport = () => {
    const sensorConfig = localStorage.getItem("sensorConfig");
    const sensorStockData = localStorage.getItem("sensorStocks");

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

    if (sensorStockData) {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(
          JSON.stringify(JSON.parse(sensorStockData), null, 2)
        );
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
      <MenuBar
        handleSensorSetConfigImport={handleSensorSetConfigImport}
        handleSensorStockImport={handleSensorStockImport}
        handleExport={handleExport}
        uiConfig={uiConfig}
        setUiConfig={setUiConfig}
        stageRef={stageRef} //
      />

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
          <KonvaStage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
          >
            <Layer>
              <Rect
                width={stageSize.width}
                height={stageSize.height}
                fill="white"
              />
            </Layer>

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
            <CarImage
              show={uiConfig.showCarImage}
              x={vehicle.origin.x}
              y={vehicle.origin.y}
              width={vehicle.width}
              height={vehicle.length}
              image={vehicle.image}
            />
            <Layer>
              {uiConfig.showVehicleRefPoint &&
                Object.values(vehicle.refPoints).map((position, index) => (
                  <Marker key={index} position={position} fill="red" />
                ))}

              {sensorConfiguration!.map((sensor, index) => (
                <SensorBlock key={index} sensor={sensor} uiConfig={uiConfig} />
              ))}
            </Layer>
          </KonvaStage>
        </Box>
      </Grid>

      <BottomDrawer
        sensorStocks={sensorData}
        setSensorStocks={setSensorData}
        setSensorConfiguration={setSensorConfiguration}
      />

      {/* <NerdMode
        show={uiConfig.showNerdMode}
        sensor_configuration={sensorConfiguration}
        sensor_stocks={sensorData}
      /> */}

      {/* 使用新的 SensorPanel 组件，并传递 onDelete 和 setSelectedSensorIndex 函数 */}
      <SensorPanel
        sensorConfiguration={sensorConfiguration}
        setSensorConfiguration={setSensorConfiguration}
        onSelectSensor={(index) => setSelectedSensorIndex(index)} // 传递选择传感器的回调
      />
    </Grid>
  );
};

export default SensorSetBuilderMain;
