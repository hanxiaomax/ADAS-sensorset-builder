import React from "react";
import { Layer, Arc } from "react-konva";

interface SensorConfig {
  x: number;
  y: number;
  orientation: number;
  fov: number;
}

interface UssSensorsProps {
  sensors: SensorConfig[]; // 传感器的配置数组
  sensorSize: number; // 传感器的大小
}

const UssSensors: React.FC<UssSensorsProps> = ({
  sensors = [],
  sensorSize,
}) => {
  // 默认传感器配置为空数组，以防止未定义时的错误
  return (
    <Layer>
      {sensors.map((sensor, index) => (
        <React.Fragment key={index}>
          {/* 绘制传感器的FOV扇形区域 */}
          <Arc
            x={sensor.x}
            y={sensor.y}
            innerRadius={0}
            outerRadius={sensorSize * 3} // 视场的可见范围大小，通常根据需求进行调整
            angle={sensor.fov}
            rotation={sensor.orientation - sensor.fov / 2}
            fill="rgba(255, 0, 0, 0.3)" // 半透明的红色表示FOV
            stroke="red"
            strokeWidth={1}
          />
          {/* 绘制传感器的主体 */}
          <Arc
            x={sensor.x}
            y={sensor.y}
            innerRadius={0}
            outerRadius={sensorSize}
            angle={360}
            fill="red"
            rotation={0}
          />
        </React.Fragment>
      ))}
    </Layer>
  );
};

export default UssSensors;
