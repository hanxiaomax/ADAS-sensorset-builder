import React, { useState } from "react";
import { Grid, Box, IconButton, TextField } from "@mui/material";
import { Stage, Layer, Rect, Arc } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import UssSensor from "../components/UssSensor";
import ControlPanel from "../components/ControlPanel";
import SettingsIcon from "@mui/icons-material/Settings";
import useImage from "use-image";
import { Position, MountingPoint } from "../types/Common";

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

function setMountingPoint(
  x: number,
  y: number,
  orientation: number
): MountingPoint {
  return {
    position: { x: x, y: y },
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

  const [showUssZones, setShowUssZones] = useState<boolean>(true);
  const [showCarImage, setShowCarImage] = useState<boolean>(true);
  const [showUssSensors, setShowUssSensors] = useState<boolean>(true);

  const [panelVisible, setPanelVisible] = useState<boolean>(false);
  const imageSrc = "/vehicle.png";
  const [image] = useImage(imageSrc);
  const image_margin = 20;
  const overhang = 60 + image_margin;
  const frontOverhang = overhang / 2;
  const rearOverhang = overhang / 2;
  const carWidth = image?.width!;
  const carLength = image?.height!;

  const stage_size = { width: 400, height: 800 };
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
  };

  const orientation_front = -90;
  const orientation_rear = 90;
  const sensor_mounting_point = {
    uss: {
      front_middle_right1: setMountingPoint(
        vehicle_keypoint.front_center.x + 20,
        vehicle_keypoint.front_center.y + 5,
        orientation_front
      ),
      front_middle_right2: setMountingPoint(
        vehicle_keypoint.front_center.x + 45,
        vehicle_keypoint.front_center.y + 13,
        orientation_front
      ),

      front_middle_left1: setMountingPoint(
        vehicle_keypoint.front_center.x - 20,
        vehicle_keypoint.front_center.y + 5,
        orientation_front
      ),
      front_middle_left2: setMountingPoint(
        vehicle_keypoint.front_center.x - 45,
        vehicle_keypoint.front_center.y + 13,
        orientation_front
      ),
      front_right_side: setMountingPoint(
        vehicle_keypoint.front_bumper_right.x - 5,
        vehicle_keypoint.front_bumper_right.y,
        orientation_front
      ),
      front_left_side: setMountingPoint(
        vehicle_keypoint.front_bumper_left.x + 5,
        vehicle_keypoint.front_bumper_left.y,
        orientation_front
      ),
      rear_middle_right1: setMountingPoint(
        vehicle_keypoint.rear_center.x + 20,
        vehicle_keypoint.rear_center.y - 5,
        orientation_rear
      ),
      rear_middle_right2: setMountingPoint(
        vehicle_keypoint.rear_center.x + 45,
        vehicle_keypoint.rear_center.y - 13,
        orientation_rear
      ),
      rear_middle_left1: setMountingPoint(
        vehicle_keypoint.rear_center.x - 20,
        vehicle_keypoint.rear_center.y - 5,
        orientation_rear
      ),
      rear_middle_left2: setMountingPoint(
        vehicle_keypoint.rear_center.x - 45,
        vehicle_keypoint.rear_center.y - 13,
        orientation_rear
      ),
      rear_right_side: setMountingPoint(
        vehicle_keypoint.rear_bumper_right.x - 5,
        vehicle_keypoint.rear_bumper_right.y,
        orientation_rear
      ),
      rear_left_side: setMountingPoint(
        vehicle_keypoint.rear_bumper_left.x + 5,
        vehicle_keypoint.rear_bumper_left.y,
        orientation_rear
      ),
    },
  };

  const layers = [
    {
      name: "USS 区域",
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
      name: "车辆图像",
      visible: showCarImage,
      toggleVisibility: () => setShowCarImage(!showCarImage),
      controls: null,
    },
    {
      name: "超声波传感器",
      visible: showUssSensors,
      toggleVisibility: () => setShowUssSensors(!showUssSensors),
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
            // transform: "rotate(270deg)",
          }}
        >
          <Stage width={stage_size.width} height={stage_size.height}>
            <Layer>
              {/* 绘制Stage的边框 */}
              <Rect
                x={0}
                y={0}
                width={stage_size.width}
                height={stage_size.height}
                stroke="black" // 边框颜色
                strokeWidth={2} // 边框宽度
              />

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
              {/* <Marker position={vehicle_keypoint.front_center}></Marker> */}
              {/* <Marker position={vehicle_keypoint.rear_center}></Marker> */}
              {/* <Marker position={origin} fill="red"></Marker> */}
              {/* {Object.values(sensor_mounting_point.uss).map(
                (position, index) => (
                  <Marker key={index} position={position} fill="blue" />
                )
              )} */}

              {showUssSensors &&
                Object.values(sensor_mounting_point.uss).map(
                  (mountingPoint, index) => (
                    <UssSensor
                      key={index}
                      position={mountingPoint.position}
                      orientation={mountingPoint.orientation}
                      fov={120}
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
