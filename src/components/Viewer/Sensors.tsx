import React from "react";
import { Arc, Circle, Line } from "react-konva";
import {
  UiConfig,
  MountPosition,
  Sensor,
  SENSOR_RANGE_FACTOR,
} from "../../types/Common";
import { mountStringToPosition } from "../utils";

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
  onClick: () => void; // 点击事件处理程序
  isSelected: boolean; // 是否选中状态
}

export const SensorBlock: React.FC<SensorProp> = ({
  uiConfig,
  sensor,
  onClick,
  isSelected,
}) => {
  const type = sensor.sensorInfo.type;
  const fov = sensor.sensorInfo.spec.fov;
  const range = sensor.sensorInfo.spec.range * SENSOR_RANGE_FACTOR;
  const mount_position = mountStringToPosition(
    sensor.mountPosition!.name
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

  if (!visibility || sensor.options?.includes("hide")) {
    return null;
  }

  const getSensorStyle = (options: string[]) => {
    if (isSelected) {
      return {
        width: 15,
        height: 15,
        fill: "#ff9c2d", // 选中时高亮的颜色
      };
    } else if (options.includes("highlight_sensor")) {
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

  const sensor_style = getSensorStyle(sensor.options || []);

  return (
    <>
      {/* 渲染 FOV，但不监听点击事件 */}
      <Arc
        x={mount_position.position!.x}
        y={mount_position.position!.y}
        innerRadius={0}
        outerRadius={range}
        angle={fov}
        rotation={mount_position.orientation! - fov / 2}
        fill={`${color}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`}
        strokeWidth={0}
        listening={false} // 禁止FOV响应点击事件
      />
      {/* 渲染传感器本身，允许点击 */}
      {sensor.options?.includes("broken") ? (
        <Line
          x={mount_position.position!.x}
          y={mount_position.position!.y}
          points={[-10, -10, 10, 10, 0, 0, 10, -10, -10, 10]} // 绘制一个 "X" 形状
          stroke="#fc4400"
          strokeWidth={2}
        />
      ) : (
        <Circle
          x={mount_position.position!.x}
          y={mount_position.position!.y}
          width={sensor_style.width}
          height={sensor_style.height}
          fill={sensor_style.fill}
          onClick={onClick} // 点击事件只在 Circle 上生效
        />
      )}
    </>
  );
};
