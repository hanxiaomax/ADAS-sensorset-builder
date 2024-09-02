import React from "react";
import { Layer, Arc, Circle } from "react-konva";
import {
  UiConfig,
  MountPosition,
  SensorConfig,
  SensorState,
} from "../types/Common";
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
  highlighted: boolean;
}

export const Sensor: React.FC<SensorProp> = ({
  uiConfig,
  sensorConfig,
  highlighted,
}) => {
  const type = sensorConfig.profile.type;
  const fov = sensorConfig.spec.fov;
  const range = sensorConfig.spec.range * SENSOR_RANGE_FACTOR;
  const mount_position = mountStringToPosition(
    sensorConfig.mountPosition!.name
  ) as MountPosition;
  // 根据传感器类型动态设置颜色和透明度
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

  if (!visibility || sensorConfig.state === SensorState.HIDE) {
    return null;
  }

  const getStyle = (state: SensorState, highlighted: boolean) => {
    switch (state) {
      case SensorState.BROKEN:
        return {
          fill: "rgba(252, 68, 0, 0.8)", // 半透明红色用于表示损坏状态
          strokeWidth: highlighted ? 2 : 0,
          stroke: highlighted ? "#fc4400" : color,
          dash: [8, 5],
        };
      default:
        return {
          fill: `${color}${Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, "0")}`, // 使用默认颜色的透明度
          strokeWidth: highlighted ? 2 : 0,
          stroke: highlighted ? "#fc4400" : color,
          dash: undefined,
        };
    }
  };

  const style = getStyle(sensorConfig.state, highlighted);

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
      {
        <Circle
          x={mount_position.position!.x}
          y={mount_position.position!.y}
          width={highlighted ? 20 : 10}
          height={highlighted ? 20 : 10}
          fill={highlighted ? "#fc4400" : color} // 传感器主体颜色
        />
      }
    </>
  );
};
