import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import useImage from "use-image";
import Viewer from "./components/Viewer/Viewer";
import { Vehicle } from "./types/Vehicle";
import MenuBar from "./components/Menu/MenuBar";
import Konva from "konva";
import SidebarMenu from "./components/Menu/SidebarMenu";
import BottomMenu from "./components/Menu/BottomMenu";
import CanvasRenderer from "./components/konva/CanvasRender";

export const SensorSetBuilderMain: React.FC = () => {
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

  return (
    <Grid
      container
      alignItems="center"
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <MenuBar stageRef={stageRef} />
      <Grid item xs={12}>
        {/* <Viewer stageSize={stageSize} vehicle={vehicle} stageRef={stageRef} /> */}
        <CanvasRenderer></CanvasRenderer>
      </Grid>
      <SidebarMenu />
      <BottomMenu />
    </Grid>
  );
};

export default SensorSetBuilderMain;
