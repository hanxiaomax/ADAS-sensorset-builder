import React, { useState } from "react";
import { Grid, Box, IconButton, TextField } from "@mui/material";
import { Stage, Layer, Rect, Arc } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import {
  UssSensor,
  LidarSensor,
  RadarSensor,
  CameraSensor,
  TeleCameraSensor,
} from "../components/Sensors";
import ControlPanel from "../components/ControlPanel";
import SettingsIcon from "@mui/icons-material/Settings";
import useImage from "use-image";
import { Position, MountPosition } from "../types/Common";

interface MarkerProps {
  position: Position;
  fill?: string;
}

function setPosition(x: number, y: number): Position {
  return {
    x: x,
    y: y,
  };
}

function setMountingPosition(
  x: number,
  y: number,
  orientation: number
): MountPosition {
  return {
    position: setPosition(x, y),
    orientation: orientation,
  };
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
  const [frontZones, setFrontZones] = useState<number>(6);
  const [rearZones, setRearZones] = useState<number>(4);
  const [sideZones, setSideZones] = useState<number>(6);

  const [showUssZones, setShowUssZones] = useState<boolean>(false);
  const [showCarImage, setShowCarImage] = useState<boolean>(true);
  const [showUssSensors, setShowUssSensors] = useState<boolean>(true);
  const [showLidarSensors, setShowLidarSensors] = useState<boolean>(true);
  const [showCameraSensors, setShowCameraSensors] = useState<boolean>(true);
  const [showRadarSensors, setShowRadarSensors] = useState<boolean>(true);

  const [showVehicleRefPoint, setShowVehicleRefPoint] =
    useState<boolean>(false);

  const [panelVisible, setPanelVisible] = useState<boolean>(false);
  const imageSrc = "/vehicle.png";
  const [image] = useImage(imageSrc);
  const image_margin = 20;
  const overhang = 60 + image_margin;
  const frontOverhang = overhang / 2;
  const rearOverhang = overhang / 2;
  const carWidth = image?.width!;
  const carLength = image?.height!;

  const stage_size = { width: 800, height: 1000 };
  const origin = {
    x: (stage_size.width - carWidth) / 2,
    y: (stage_size.height - carLength) / 2,
  };
  const stage_center = {
    x: stage_size.width / 2,
    y: stage_size.height / 2,
  };

  const vehicle_keypoint = {
    front_center: setPosition(origin.x + carWidth / 2, origin.y),
    rear_center: setPosition(origin.x + carWidth / 2, origin.y + carLength),
    front_bumper_right: setPosition(origin.x + carWidth - 15, origin.y + 30),
    front_bumper_left: setPosition(origin.x + 15, origin.y + 30),
    rear_bumper_right: setPosition(
      origin.x + carWidth - 15,
      origin.y + carLength - 30
    ),
    rear_bumper_left: setPosition(origin.x + 15, origin.y + carLength - 30),
    wingside_right: setPosition(origin.x + carWidth - 15, origin.y + 100),
    wingside_left: setPosition(origin.x + 15, origin.y + 100),
    sidemirror_right: setPosition(origin.x + carWidth - 8, origin.y + 120),
    sidemirror_left: setPosition(origin.x + 8, origin.y + 120),
    front_roof: setPosition(origin.x + 15, origin.y + carLength - 30),
    front_windsheild: setPosition(origin.x + carWidth / 2, origin.y + 130),
    rear_windsheild: setPosition(
      origin.x + carWidth / 2,
      origin.y + carLength - 70
    ),
    b_pillar_right: setPosition(origin.x + carWidth - 15, origin.y + 180),
    b_pillar_left: setPosition(origin.x + 15, origin.y + 180),
    roof_top: setPosition(origin.x + carWidth / 2, origin.y + carLength / 2),
  };

  const orientation_front = -90;
  const orientation_rear = 90;

  const sensor_configuration = {
    uss: {
      front_middle_right1: setMountingPosition(
        vehicle_keypoint.front_center.x + 20,
        vehicle_keypoint.front_center.y + 5,
        orientation_front
      ),
      front_middle_right2: setMountingPosition(
        vehicle_keypoint.front_center.x + 45,
        vehicle_keypoint.front_center.y + 13,
        orientation_front
      ),

      front_middle_left1: setMountingPosition(
        vehicle_keypoint.front_center.x - 20,
        vehicle_keypoint.front_center.y + 5,
        orientation_front
      ),
      front_middle_left2: setMountingPosition(
        vehicle_keypoint.front_center.x - 45,
        vehicle_keypoint.front_center.y + 13,
        orientation_front
      ),
      front_right_side: setMountingPosition(
        vehicle_keypoint.front_bumper_right.x - 5,
        vehicle_keypoint.front_bumper_right.y,
        orientation_front
      ),
      front_left_side: setMountingPosition(
        vehicle_keypoint.front_bumper_left.x + 5,
        vehicle_keypoint.front_bumper_left.y,
        orientation_front
      ),
      rear_middle_right1: setMountingPosition(
        vehicle_keypoint.rear_center.x + 20,
        vehicle_keypoint.rear_center.y - 5,
        orientation_rear
      ),
      rear_middle_right2: setMountingPosition(
        vehicle_keypoint.rear_center.x + 45,
        vehicle_keypoint.rear_center.y - 13,
        orientation_rear
      ),
      rear_middle_left1: setMountingPosition(
        vehicle_keypoint.rear_center.x - 20,
        vehicle_keypoint.rear_center.y - 5,
        orientation_rear
      ),
      rear_middle_left2: setMountingPosition(
        vehicle_keypoint.rear_center.x - 45,
        vehicle_keypoint.rear_center.y - 13,
        orientation_rear
      ),
      rear_right_side: setMountingPosition(
        vehicle_keypoint.rear_bumper_right.x - 5,
        vehicle_keypoint.rear_bumper_right.y,
        orientation_rear
      ),
      rear_left_side: setMountingPosition(
        vehicle_keypoint.rear_bumper_left.x + 5,
        vehicle_keypoint.rear_bumper_left.y,
        orientation_rear
      ),
    },
    lidar: {
      roof_top: setMountingPosition(
        vehicle_keypoint.roof_top.x,
        vehicle_keypoint.roof_top.y,
        orientation_front
      ),
    },
    radar: {
      front_left_corner: setMountingPosition(
        vehicle_keypoint.front_bumper_left.x,
        vehicle_keypoint.front_bumper_left.y,
        -120
      ),
      front_right_corner: setMountingPosition(
        vehicle_keypoint.front_bumper_right.x,
        vehicle_keypoint.front_bumper_right.y,
        -60
      ),
      rear_left_corner: setMountingPosition(
        vehicle_keypoint.rear_bumper_left.x,
        vehicle_keypoint.rear_bumper_left.y,
        120
      ),
      rear_right_corner: setMountingPosition(
        vehicle_keypoint.rear_bumper_right.x,
        vehicle_keypoint.rear_bumper_right.y,
        60
      ),
    },
    tele_camera: {
      front: setMountingPosition(
        vehicle_keypoint.front_windsheild.x,
        vehicle_keypoint.front_windsheild.y,
        -90
      ),
    },
    avm_camera: {
      wingside_left: setMountingPosition(
        vehicle_keypoint.wingside_left.x,
        vehicle_keypoint.wingside_left.y,
        -180
      ),
      wingside_right: setMountingPosition(
        vehicle_keypoint.wingside_right.x,
        vehicle_keypoint.wingside_right.y,
        0
      ),
      b_pillar_left: setMountingPosition(
        vehicle_keypoint.b_pillar_left.x,
        vehicle_keypoint.b_pillar_left.y,
        -180
      ),
      b_pillar_right: setMountingPosition(
        vehicle_keypoint.b_pillar_right.x,
        vehicle_keypoint.b_pillar_right.y,
        0
      ),
    },
  };

  const layers = [
    {
      name: "Vehicle",
      visible: showCarImage,
      toggleVisibility: () => setShowCarImage(!showCarImage),
      controls: null,
    },
    {
      name: "USS Zone",
      visible: showUssZones,
      toggleVisibility: () => setShowUssZones(!showUssZones),
      controls: (
        <Box>
          <TextField
            label="Front Zones Numbers"
            type="number"
            variant="outlined"
            value={frontZones}
            onChange={(e) => setFrontZones(parseInt(e.target.value))}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Side Zone Numbers"
            type="number"
            variant="outlined"
            value={sideZones}
            onChange={(e) => setSideZones(parseInt(e.target.value))}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Rear Zones Numbers"
            type="number"
            variant="outlined"
            value={rearZones}
            onChange={(e) => setRearZones(parseInt(e.target.value))}
            margin="normal"
            fullWidth
          />
        </Box>
      ),
    },

    {
      name: "USS",
      visible: showUssSensors,
      toggleVisibility: () => setShowUssSensors(!showUssSensors),
      controls: null,
    },
    {
      name: "Lidar",
      visible: showLidarSensors,
      toggleVisibility: () => setShowLidarSensors(!showLidarSensors),
      controls: null,
    },
    {
      name: "Radar",
      visible: showRadarSensors,
      toggleVisibility: () => setShowRadarSensors(!showRadarSensors),
      controls: null,
    },
    {
      name: "Camera",
      visible: showCameraSensors,
      toggleVisibility: () => setShowCameraSensors(!showCameraSensors),
      controls: null,
    },
    {
      name: "Vehicle Ref Point",
      visible: showVehicleRefPoint,
      toggleVisibility: () => setShowVehicleRefPoint(!showVehicleRefPoint),
      controls: null,
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      style={{ height: "100vh", alignItems: "center" }}
    >
      <Grid item xs={10}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // transform: "scale(0.5) rotate(270deg)", // 0.5表示缩小为原始大小的50%
          }}
        >
          <Stage width={stage_size.width} height={stage_size.height}>
            <Layer>
              {/* 绘制Stage的边框 */}
              {/* <Rect
                x={0}
                y={0}
                width={stage_size.width}
                height={stage_size.height}
                stroke="black" // 边框颜色
                strokeWidth={2} // 边框宽度
              /> */}

              <Marker position={stage_center}></Marker>
            </Layer>
            {showUssZones && (
              <UssZones
                x={origin.x}
                y={origin.y}
                carWidth={carWidth}
                carLength={carLength}
                frontOverhang={frontOverhang}
                rearOverhang={rearOverhang}
                frontZones={frontZones}
                rearZones={rearZones}
                sideZones={sideZones}
              />
            )}
            {showCarImage && (
              <CarImage
                x={origin.x}
                y={origin.y}
                width={carWidth}
                height={carLength}
                imageSrc={imageSrc}
              />
            )}

            <Layer>
              {showVehicleRefPoint &&
                Object.values(vehicle_keypoint).map((position, index) => (
                  <Marker key={index} position={position} fill="red" />
                ))}

              {showUssSensors &&
                Object.values(sensor_configuration.uss).map(
                  (mountingPoint, index) => (
                    <UssSensor
                      key={index}
                      type="uss"
                      mountPosition={mountingPoint}
                      fov={120}
                    />
                  )
                )}
              {showLidarSensors &&
                Object.values(sensor_configuration.lidar).map(
                  (mountingPoint, index) => (
                    <LidarSensor
                      key={index}
                      type="lidar"
                      mountPosition={mountingPoint}
                      fov={360}
                    />
                  )
                )}
              {showRadarSensors &&
                Object.values(sensor_configuration.radar).map(
                  (mountingPoint, index) => (
                    <RadarSensor
                      key={index}
                      type="corner radar"
                      mountPosition={mountingPoint}
                      fov={60}
                    />
                  )
                )}
              {showCameraSensors &&
                Object.values(sensor_configuration.tele_camera).map(
                  (mountingPoint, index) => (
                    <TeleCameraSensor
                      key={index}
                      type="camera"
                      mountPosition={mountingPoint}
                      fov={30}
                    />
                  )
                )}
              {showCameraSensors &&
                Object.values(sensor_configuration.avm_camera).map(
                  (mountingPoint, index) => (
                    <CameraSensor
                      key={index}
                      type="camera"
                      mountPosition={mountingPoint}
                      fov={180}
                    />
                  )
                )}
            </Layer>
          </Stage>
        </Box>
      </Grid>

      {panelVisible && (
        <ControlPanel layers={layers} onClose={() => setPanelVisible(false)} />
      )}

      {!panelVisible && (
        <IconButton
          onClick={() => setPanelVisible(true)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <SettingsIcon />
        </IconButton>
      )}
    </Grid>
  );
};

export default SensorSetBuilderMain;
