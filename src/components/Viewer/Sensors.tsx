import React from "react";
import { Arc, Circle } from "react-konva";
import { SENSOR_RANGE_FACTOR } from "../../types/Common";

import { sensorColorMap, Sensor } from "../../types/Sensor";
import useGlobalConfigStore from "../../stores/globalConfigStore";

interface SensorProp {
  sensor: Sensor;
  onClick: (event: any) => void;
  isSelected: boolean;
}

export const SensorBlock: React.FC<SensorProp> = ({
  sensor,
  onClick,
  isSelected,
}) => {
  const type = sensor.sensorInfo.type;
  const fov = sensor.sensorInfo.spec.fov;
  const range = sensor.sensorInfo.spec.range * SENSOR_RANGE_FACTOR;

  const position = sensor.mountPosition.position;
  const orientation = sensor.mountPosition.orientation;

  const { color, opacity } = sensorColorMap[type] || {
    color: "#000",
    opacity: 1,
  };
  const { layerVisibility } = useGlobalConfigStore();

  const visibility = (() => {
    if (type.includes("uss")) return layerVisibility.showUssSensors;
    if (type.includes("lidar")) return layerVisibility.showLidarSensors;
    if (type.includes("radar")) return layerVisibility.showRadarSensors;
    if (type.includes("camera")) return layerVisibility.showCameraSensors;
    return false;
  })();

  // 如果位置信息不完整，不渲染传感器
  if (
    !visibility ||
    sensor.options?.includes("hide") ||
    !position ||
    orientation === undefined
  ) {
    return null;
  }

  const getStyle = (options: Record<string, any>) => {
    const color = sensorColorMap[sensor.sensorInfo.type]?.color || "#000000";
    const opacity = sensorColorMap[sensor.sensorInfo.type]?.opacity || 0.2;

    if (isSelected) {
      return {
        opacity: 0.8,
        fill: `${color}`,
        stroke: "#ff0000",
        strokeWidth: 2,
      };
    } else if (options.highlight) {
      return {
        opacity: 0.6,
        fill: `${color}`,
        stroke: "#ffff00",
        strokeWidth: 1,
      };
    } else {
      return {
        opacity: opacity,
        fill: `${color}`,
      };
    }
  };

  const getSensorStyle = (options: Record<string, any>) => {
    const color = sensorColorMap[sensor.sensorInfo.type]?.color || "#000000";

    if (isSelected) {
      return {
        width: 15,
        height: 15,
        fill: "#ff0000",
      };
    } else if (options.highlight) {
      return {
        width: 12,
        height: 12,
        fill: "#ffff00",
      };
    } else {
      return {
        width: 10,
        height: 10,
        fill: `${color}`,
      };
    }
  };

  const style = getStyle(sensor.options || {});
  const sensor_style = getSensorStyle(sensor.options || {});

  return (
    <>
      <Arc
        x={position.x}
        y={position.y}
        innerRadius={0}
        outerRadius={range}
        angle={fov}
        rotation={orientation - fov / 2}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={0.5}
        opacity={style.opacity}
        listening={false}
      />
      <Circle
        x={position.x}
        y={position.y}
        width={sensor_style.width}
        height={sensor_style.height}
        fill={sensor_style.fill}
        onClick={onClick}
      />
    </>
  );
};
