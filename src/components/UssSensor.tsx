import React from "react";
import { Layer, Arc, Rect } from "react-konva";
import { Position, MountingPoint, SensorConfig } from "../types/Common";

const UssSensor: React.FC<SensorConfig> = ({ position, orientation, fov }) => {
  const offset = 5;
  const range = 100;
  return (
    <React.Fragment>
      {/* 绘制传感器的FOV扇形区域 */}
      <Arc
        x={position.x}
        y={position.y}
        innerRadius={0}
        outerRadius={range} // 视场的可见范围大小，通常根据需求进行调整
        angle={fov}
        rotation={orientation - fov / 2}
        fill="rgb(207, 195, 239,0.3)" // 半透明的红色表示FOV
        strokeWidth={2}
      />
      {/* 绘制传感器的主体 */}
      <Rect
        x={position.x - offset}
        y={position.y - offset}
        width={2 * offset}
        height={2 * offset}
        fill="blue"
      />
    </React.Fragment>
  );
};

export default UssSensor;
