import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import useImage from "use-image";
import Viewer from "./components/Viewer/Viewer";
import { Vehicle } from "./types/Vehicle";
import Konva from "konva";
import SidebarMenu from "./components/Menu/SidebarMenu";
import BottomMenu from "./components/Menu/BottomMenu";
import { useVehicleImageStore } from "./stores/vehicleImageStore";

export const SensorSetBuilderMain: React.FC = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const stageRef = useRef<Konva.Stage>(null);
  const { addVehicleImage, setCurrentVehicleImage } = useVehicleImageStore();

  const [image] = useImage(process.env.PUBLIC_URL + "/vehicle.png");

  useEffect(() => {
    if (image) {
      addVehicleImage("default", image);
      setCurrentVehicleImage("default");
    }
  }, [image, addVehicleImage, setCurrentVehicleImage]);

  const vehicle = new Vehicle(
    stageSize,
    image?.width || 800,
    image?.height || 600
  );

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
      <Grid item xs={12}>
        <Viewer stageSize={stageSize} vehicle={vehicle} stageRef={stageRef} />
      </Grid>
      <SidebarMenu />
      <BottomMenu />
    </Grid>
  );
};

export default SensorSetBuilderMain;
