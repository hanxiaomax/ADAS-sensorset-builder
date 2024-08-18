import React from "react";
import { Layer, Arc, Rect } from "react-konva";
import { Position, SensorConfig } from "../types/Common";

interface SensorProps extends SensorConfig {
  range: number;
  color: string; // 使用hex格式的颜色值
  opacity: number;
}

export const Sensor: React.FC<SensorProps> = ({
  mountPosition,
  fov,
  range,
  color,
  opacity,
}) => {
  const offset = 5;
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

export const UssSensor: React.FC<SensorConfig> = (props) => (
  <Sensor {...props} range={100} color="#3a3895" opacity={0.2} />
);

export const LidarSensor: React.FC<SensorConfig> = (props) => (
  <Sensor {...props} range={400} color="#fa973d" opacity={0.1} />
);

export const RadarSensor: React.FC<SensorConfig> = (props) => (
  <Sensor {...props} range={400} color="#00973d" opacity={0.1} />
);

export const CameraSensor: React.FC<SensorConfig> = (props) => (
  <Sensor {...props} range={100} color="#b9455e" opacity={0.5} />
);

export const TeleCameraSensor: React.FC<SensorConfig> = (props) => (
  <Sensor {...props} range={400} color="#f1dae0" opacity={0.5} />
);
