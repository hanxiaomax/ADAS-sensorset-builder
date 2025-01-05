import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import useImage from "use-image";
import Viewer from "./components/Viewer/Viewer";
import { Vehicle } from "./types/Vehicle";
import MenuBar from "./components/Menu/MenuBar";
import Konva from "konva";
import SidebarMenu from "./components/Menu/SidebarMenu";
import BottomMenu from "./components/Menu/BottomMenu";
import { useUiConfig } from "./contexts/UiConfigContext";
import { useSensor } from "./contexts/SensorContext";
import Sensor from "./types/Sensor";
import { SensorStocks } from "./types/Common";

export const SensorSetBuilderMain: React.FC = () => {
  const { uiConfig } = useUiConfig();
  const {
    sensorConfiguration,
    setSensorConfiguration,
    sensorStocks,
    setSensorStocks,
  } = useSensor();

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const stageRef = useRef<Konva.Stage>(null);

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

  const handleSensorSetConfigImport = (data: Sensor[]) => {
    setSensorConfiguration(data);
  };

  const handleSensorStockImport = (data: SensorStocks) => {
    setSensorStocks(data);
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sensorConfiguration, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sensor_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    const stockDataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sensorStocks, null, 2));
    const stockDownloadNode = document.createElement("a");
    stockDownloadNode.setAttribute("href", stockDataStr);
    stockDownloadNode.setAttribute("download", "sensor_data.json");
    document.body.appendChild(stockDownloadNode);
    stockDownloadNode.click();
    stockDownloadNode.remove();
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
        stageRef={stageRef}
      />
      <Grid item xs={12}>
        <Viewer stageSize={stageSize} vehicle={vehicle} stageRef={stageRef} />
      </Grid>
      <SidebarMenu />
      <BottomMenu />
    </Grid>
  );
};

export default SensorSetBuilderMain;
