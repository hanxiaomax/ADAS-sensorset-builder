import React from "react";
import { Stage, Layer, Rect } from "react-konva"; // 使用 react-konva 提供的 Stage
import CarImage from "./carImage";
import UssZones from "./UssZones";
import { SensorBlock } from "./Sensors";
import { Box } from "@mui/material";
import Marker from "./utils";
import { Sensor } from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import Konva from "konva"; // 引入 Konva

interface ViewerProps {
  stageSize: { width: number; height: number };
  vehicle: Vehicle;
  sensorConfiguration: Sensor[];
  uiConfig: any;
  stageRef: React.RefObject<Konva.Stage>; // 修正类型为 react-konva 提供的 Stage
}

const Viewer: React.FC<ViewerProps> = ({
  stageSize,
  vehicle,
  sensorConfiguration,
  uiConfig,
  stageRef,
}) => {
  return (
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
      <Stage width={stageSize.width} height={stageSize.height} ref={stageRef}>
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

          {sensorConfiguration.map((sensor, index) => (
            <SensorBlock key={index} sensor={sensor} uiConfig={uiConfig} />
          ))}
        </Layer>
      </Stage>
    </Box>
  );
};

export default Viewer;
