import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import useImage from "use-image";
import Viewer from "./components/Viewer/Viewer"; // 引入 Viewer 组件
import { SensorStocks } from "./types/Common";
import { Vehicle } from "./types/Vehicle";
import BottomDrawer from "./components/BottomDrawer";
import SensorPanel from "./components/SensorPanel";
import MenuBar from "./components/Menu/MenuBar";
import Konva from "konva"; // 引入 Konva
import Sensor from "./types/Sensor";

export const SensorSetBuilderMain: React.FC = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const stageRef = useRef<Konva.Stage>(null);

  const [sensorConfiguration, setSensorConfiguration] = useState<Sensor[]>([]);
  const [sensorData, setSensorData] = useState<SensorStocks>({});

  const [uiConfig, setUiConfig] = useState({
    showCarImage: true,
    showUssZones: false,
    showUssSensors: true,
    showLidarSensors: true,
    showRadarSensors: true,
    showCameraSensors: true,
    showVehicleRefPoint: false,
    showDebugMode: false,
    showGrid: true,
    frontZones: 6,
    rearZones: 4,
    sideZones: 6,
    panelVisible: false,
    background: "white",
  });

  const [image] = useImage(process.env.PUBLIC_URL + "/vehicle.png");
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

  useEffect(() => {
    const storedSensorConfig = localStorage.getItem("sensorConfig");
    const storedSensorStocks = localStorage.getItem("sensorStocks");

    if (storedSensorConfig) {
      const parsedConfig = JSON.parse(storedSensorConfig);
      // 实例化 Sensor 对象
      const sensorInstances = parsedConfig.map(
        (sensorData: any) =>
          new Sensor(
            sensorData.id,
            sensorData.sensorInfo,
            sensorData.mountPosition,
            sensorData.options
          )
      );

      setSensorConfiguration(sensorInstances);
    }
    if (storedSensorStocks) {
      setSensorData(JSON.parse(storedSensorStocks) as SensorStocks);
    }
  }, []);

  const handleSensorSetConfigImport = (data: Sensor[]) => {
    setSensorConfiguration(data);
    localStorage.setItem("sensorConfig", JSON.stringify(data));
  };

  const handleSensorStockImport = (data: SensorStocks) => {
    setSensorData(data);
    localStorage.setItem("sensorStocks", JSON.stringify(data));
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
        stageRef={stageRef}
      />
      <Grid item xs={12}>
        <Viewer
          stageSize={stageSize}
          vehicle={vehicle}
          sensorConfiguration={sensorConfiguration}
          uiConfig={uiConfig}
          setUiConfig={setUiConfig}
          stageRef={stageRef}
        />
      </Grid>
      <BottomDrawer
        sensorStocks={sensorData}
        setSensorStocks={setSensorData}
        setSensorConfiguration={setSensorConfiguration}
      />

      <SensorPanel
        sensors={sensorConfiguration}
        setSensors={setSensorConfiguration}
      />
    </Grid>
  );
};

export default SensorSetBuilderMain;
