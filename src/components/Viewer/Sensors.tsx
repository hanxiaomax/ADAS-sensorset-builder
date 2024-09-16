import React from "react";
import { Arc, Circle, Line } from "react-konva";
import {
  UiConfig,
  MountPosition,
  SENSOR_RANGE_FACTOR,
} from "../../types/Common";

import { sensorColorMap, Sensor } from "../../types/Sensor";

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
  const mount_position = sensor.getMountPosition() as MountPosition;

  console.log(sensor.options);
  const { color, opacity } = sensorColorMap[type] || {
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
    if (options.includes("highlight")) {
      return {
        fill: `${color}${Math.floor(opacity * 1.5 * 255)
          .toString(16)
          .padStart(2, "0")}`,
        strokeWidth: 2, // 更粗的边框表示高亮状态
        stroke: "black",
      };
    } else {
      return {
        fill: `${color}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`,
        strokeWidth: 0,
      };
    }
  };

  const getSensorStyle = (options: string[]) => {
    if (isSelected) {
      return {
        width: 15,
        height: 15,
        fill: "#ff9c2d", // 选中时高亮的颜色
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
  return (
    <>
      <Arc
        x={mount_position.position!.x}
        y={mount_position.position!.y}
        innerRadius={0}
        outerRadius={range}
        angle={fov}
        rotation={mount_position.orientation! - fov / 2}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={0.5}
        listening={false} // 禁止FOV响应点击事件
      />
      {/* 渲染传感器本身，允许点击 */}

      <Circle
        x={mount_position.position!.x}
        y={mount_position.position!.y}
        width={sensor_style.width}
        height={sensor_style.height}
        fill={sensor_style.fill}
        onClick={onClick} // 点击事件只在 Circle 上生效
      />
    </>
  );
};
