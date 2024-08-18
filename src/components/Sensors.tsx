import React from "react";
import { Layer, Arc, Rect } from "react-konva";
import { Position, SensorConfig } from "../types/Common";

const sensorStyles: { [key: string]: { color: string; opacity: number } } = {
  uss: { color: "#3a3895", opacity: 0.4 },
  lidar: { color: "#fa973d", opacity: 0.2 },
  radar: { color: "#00973d", opacity: 0.3 },
  camera: { color: "#57b1b9", opacity: 0.2 },
  tele_camera: { color: "#f1dae0", opacity: 0.5 },
};

export const Sensor: React.FC<SensorConfig> = ({
  mountPosition,
  fov,
  range,
  type,
}) => {
  const offset = 5;

  // 根据传感器类型动态设置颜色和透明度
  const { color, opacity } = sensorStyles[type] || {
    color: "#000",
    opacity: 1,
  };

  return (
    <React.Fragment>
      {/* 绘制传感器的FOV扇形区域 */}
      <Arc
        x={mountPosition.position.x}
        y={mountPosition.position.y}
        innerRadius={0}
        outerRadius={range} // 视场的可见范围大小，通常根据需求进行调整
        angle={fov}
        rotation={mountPosition.orientation - fov / 2}
        fill={`${color}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`} // 计算透明度的hex值
        strokeWidth={2}
      />
      {/* 绘制传感器的主体 */}
      <Rect
        x={mountPosition.position.x - offset}
        y={mountPosition.position.y - offset}
        width={2 * offset}
        height={2 * offset}
        fill={color} // 使用传入的hex颜色值
      />
    </React.Fragment>
  );
};
