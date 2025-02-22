import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import useImage from "use-image";
import Viewer from "./components/Viewer/Viewer";
import Konva from "konva";
import SidebarMenu from "./components/Menu/SidebarMenu";
import BottomMenu from "./components/Menu/BottomMenu";
import { useVehicleStore } from "./stores/vehicleStore";
import { SedanVehicle } from "./types/vehicles/SedanVehicle";

export const SensorSetBuilderMain: React.FC = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Scale factor to convert meters to pixels (e.g., 100 pixels per meter)
  const SCALE_FACTOR = 100;

  const stageRef = useRef<Konva.Stage>(null);
  const { setCurrentVehicle, updateVehicleImage, currentVehicle } =
    useVehicleStore();

  // Create vehicle instance first
  useEffect(() => {
    const vehicle = new SedanVehicle(stageSize, SCALE_FACTOR);
    setCurrentVehicle(vehicle);
  }, [stageSize, setCurrentVehicle]);

  // Load vehicle image after vehicle instance is created
  const [vehicleImage] = useImage(currentVehicle?.imagePath || "");

  useEffect(() => {
    if (vehicleImage && currentVehicle) {
      // Calculate the desired image dimensions based on actual vehicle size
      const desiredWidth = currentVehicle.width;
      const desiredHeight = currentVehicle.length;

      // Create a temporary canvas to resize the SVG
      const canvas = document.createElement("canvas");
      canvas.width = desiredWidth;
      canvas.height = desiredHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(vehicleImage, 0, 0, desiredWidth, desiredHeight);
        const resizedImage = new Image();
        resizedImage.src = canvas.toDataURL();

        resizedImage.onload = () => {
          updateVehicleImage(resizedImage);
        };
      }
    }
  }, [vehicleImage, currentVehicle, updateVehicleImage]);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!currentVehicle) {
    return null;
  }

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
        <Viewer
          stageSize={stageSize}
          vehicle={currentVehicle}
          stageRef={stageRef}
        />
      </Grid>
      <SidebarMenu />
      <BottomMenu />
    </Grid>
  );
};

export default SensorSetBuilderMain;
