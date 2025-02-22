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

  // Define actual vehicle dimensions in meters
  const VEHICLE_DIMENSIONS = {
    length: 4.5, // 车长 4.5 meters
    width: 1.8, // 车宽 1.8 meters
  };

  // Scale factor to convert meters to pixels (e.g., 100 pixels per meter)
  const SCALE_FACTOR = 100;

  const stageRef = useRef<Konva.Stage>(null);
  const { addVehicleImage, setCurrentVehicleImage } = useVehicleImageStore();

  // Load all vehicle images
  const [defaultVehicleImage] = useImage(
    process.env.PUBLIC_URL + "/vehicles/vehicle.svg"
  );
  const [vehicle2Image] = useImage(
    process.env.PUBLIC_URL + "/vehicles/vehicle2.svg"
  );

  useEffect(() => {
    const loadVehicleImage = async (
      image: HTMLImageElement | undefined,
      key: string
    ) => {
      if (image) {
        // Calculate the desired image dimensions based on actual vehicle size
        const desiredWidth = VEHICLE_DIMENSIONS.width * SCALE_FACTOR;
        const desiredHeight = VEHICLE_DIMENSIONS.length * SCALE_FACTOR;

        // Create a temporary canvas to resize the SVG
        const canvas = document.createElement("canvas");
        canvas.width = desiredWidth;
        canvas.height = desiredHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(image, 0, 0, desiredWidth, desiredHeight);
          const resizedImage = new Image();
          resizedImage.src = canvas.toDataURL();

          await new Promise((resolve) => {
            resizedImage.onload = resolve;
          });

          addVehicleImage(key, resizedImage);
        }
      }
    };

    const loadAllVehicleImages = async () => {
      await loadVehicleImage(defaultVehicleImage, "default");
      await loadVehicleImage(vehicle2Image, "vehicle2");
      setCurrentVehicleImage("default"); // Set default vehicle after loading all images
    };

    loadAllVehicleImages();
  }, [
    defaultVehicleImage,
    vehicle2Image,
    addVehicleImage,
    setCurrentVehicleImage,
    SCALE_FACTOR,
    VEHICLE_DIMENSIONS.width,
    VEHICLE_DIMENSIONS.length,
  ]);

  const vehicle = new Vehicle(
    stageSize,
    VEHICLE_DIMENSIONS.width * SCALE_FACTOR,
    VEHICLE_DIMENSIONS.length * SCALE_FACTOR,
    "vehicle2" // Pass the default image key
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
