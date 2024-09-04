import React from "react";
import { Arc, Circle, Line } from "react-konva";
import { UiConfig, MountPosition, SensorConfig } from "../types/Common";
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
  sensorConfig: SensorConfig;
  uiConfig: UiConfig;
}

export const Sensor: React.FC<SensorProp> = ({ uiConfig, sensorConfig }) => {
  const type = sensorConfig.profile.type;
  const fov = sensorConfig.spec.fov;
  const range = sensorConfig.spec.range * SENSOR_RANGE_FACTOR;
  const mount_position = mountStringToPosition(
    sensorConfig.mountPosition!.name
  ) as MountPosition;

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

  if (!visibility || sensorConfig.selectedOptions?.includes("hide")) {
    return null;
  }

  const getStyle = (options: string[]) => {
    console.log(options);
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

  const style = getStyle(sensorConfig.selectedOptions || []);

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
      {sensorConfig.selectedOptions?.includes("broken") ? (
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
          width={10}
          height={10}
          fill={style.fill} // 使用getStyle生成的fill颜色
        />
      )}
    </>
  );
};
