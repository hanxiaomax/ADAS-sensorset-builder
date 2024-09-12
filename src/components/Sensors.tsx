import React from "react";
import { Arc, Circle, Line } from "react-konva";
import { UiConfig, MountPosition, SensorConfig, Sensor } from "../types/Common";
import { mountStringToPosition } from "./utils";

const SENSOR_RANGE_FACTOR = 5;
const sensorStyles: {
  [key: string]: { color: string; opacity: number };
} = {
  uss: { color: "#3a3895", opacity: 0.4 },
  lidar: { color: "#4e4e7f", opacity: 0.2 },
  radar: { color: "#00973d", opacity: 0.3 },
  camera: { color: "#57b1b9", opacity: 0.2 },
  tele_camera: { color: "#f1dae0", opacity: 0.5 },
};

interface SensorProp {
  sensor: Sensor;
  uiConfig: UiConfig;
}

export const SensorBlock: React.FC<SensorProp> = ({ uiConfig, sensor }) => {
  const type = sensor.profile.type;
  const fov = sensor.spec.fov;
  const range = sensor.spec.range * SENSOR_RANGE_FACTOR;
  const mount_position = mountStringToPosition(
    sensor.mountPosition!.name
  ) as MountPosition;

  console.log(sensor);
  const { color, opacity } = sensorStyles[type] || {
    color: "#000",
    opacity: 1,
  };

  const visibility = (() => {
    if (type.includes("uss")) return uiConfig.showUssSensors;
    if (type.includes("lidar")) return uiConfig.showLidarSensors;
    if (type.includes("radar")) return uiConfig.showRadarSensors;
    if (type.includes("camera")) return uiConfig.showCameraSensors;
    return false;
  })();

  if (!visibility || sensor.options?.includes("hide")) {
    return null;
  }

  const getStyle = (options: string[]) => {
    if (options.includes("broken")) {
      return {
        fill: "rgba(252, 68, 0, 0.8)", // 半透明红色用于表示损坏状态
        strokeWidth: 2, // 更粗的边框表示高亮状态
        stroke: "#fc4400",
        dash: [8, 5],
      };
    } else if (options.includes("highlight")) {
      return {
        fill: `${color}${Math.floor(opacity * 1.5 * 255)
          .toString(16)
          .padStart(2, "0")}`,
        strokeWidth: 2, // 更粗的边框表示高亮状态
        stroke: "#black",
      };
    } else {
      return {
        fill: `${color}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`,
        strokeWidth: 0,
        stroke: color,
        dash: undefined,
      };
    }
  };

  const getSensorStyle = (options: string[]) => {
    if (options.includes("highlight_sensor")) {
      return {
        width: 15,
        height: 15,
        fill: "#ff9c2d",
      };
    } else {
      return {
        width: 10,
        height: 10,
        fill: `${color}`,
      };
    }
  };
  const style = getStyle(sensor.options || []);
  const sensor_style = getSensorStyle(sensor.options || []);
  console.log(sensor.options);
  return (
    <>
      <Arc
        x={mount_position.position!.x}
        y={mount_position.position!.y}
        innerRadius={0}
        outerRadius={range}
        angle={fov}
        rotation={mount_position.orientation! - fov / 2}
        fill={style.fill} // 使用getStyle生成的fill颜色
        strokeWidth={style.strokeWidth}
        stroke={style.stroke}
        dash={style.dash}
      />
      {sensor.options?.includes("broken") ? (
        <Line
          x={mount_position.position!.x}
          y={mount_position.position!.y}
          points={[-10, -10, 10, 10, 0, 0, 10, -10, -10, 10]} // 绘制一个 "X" 形状
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
        />
      ) : (
        <Circle
          x={mount_position.position!.x}
          y={mount_position.position!.y}
          width={sensor_style.width}
          height={sensor_style.height}
          fill={sensor_style.fill} // 使用getStyle生成的fill颜色
        />
      )}
    </>
  );
};
