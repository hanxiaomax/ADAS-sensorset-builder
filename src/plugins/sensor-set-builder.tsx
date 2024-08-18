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
  const [uiConfig, setUiconfig] = useState({
    showCarImage: true,
    showUssZones: false,
    showUssSensors: true,
    showLidarSensors: true,
    showRadarSensors: true,
    showCameraSensors: true,
    showVehicleRefPoint: false,
    frontZones: 6,
    rearZones: 4,
    sideZones: 6,
    panelVisible: false,
    background: "white",
  });

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

  return (
    <Grid
      container
      spacing={2}
      style={{ height: "100vh", alignItems: "center" }}
      sx={{ backgroundColor: uiConfig.background }}
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
            {uiConfig.showUssZones && (
              <UssZones
                x={origin.x}
                y={origin.y}
                carWidth={carWidth}
                carLength={carLength}
                frontOverhang={frontOverhang}
                rearOverhang={rearOverhang}
                frontZones={uiConfig.frontZones}
                rearZones={uiConfig.rearZones}
                sideZones={uiConfig.sideZones}
              />
            )}

            <Layer>
              {uiConfig.showVehicleRefPoint &&
                Object.values(vehicle_keypoint).map((position, index) => (
                  <Marker key={index} position={position} fill="red" />
                ))}

              {uiConfig.showUssSensors &&
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
              {uiConfig.showLidarSensors &&
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
              {uiConfig.showRadarSensors &&
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
              {uiConfig.showCameraSensors &&
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
              {uiConfig.showCameraSensors &&
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
            {uiConfig.showCarImage && (
              <CarImage
                x={origin.x}
                y={origin.y}
                width={carWidth}
                height={carLength}
                imageSrc={imageSrc}
              />
            )}
          </Stage>
        </Box>
      </Grid>

      {uiConfig.panelVisible && (
        <ControlPanel uiConfig={uiConfig} setUiConfig={setUiconfig} />
      )}

      {!uiConfig.panelVisible && (
        <IconButton
          onClick={() =>
            setUiconfig((prev) => ({ ...prev, panelVisible: true }))
          }
          style={{
            position: "absolute",
            top: 20,
            right: 100,
            padding: "16px", // 增加内部填充
            fontSize: "64px", // 增加文本大小
            width: "64px", // 设置宽度
            height: "64px", // 设置高度
            borderRadius: "8px", // 可选：让按钮更圆滑
            backgroundColor: "#f1f0ee",
          }}
        >
          <SettingsIcon />
        </IconButton>
      )}
    </Grid>
  );
};

export default SensorSetBuilderMain;
