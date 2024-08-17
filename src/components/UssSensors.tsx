import React from "react";
import { Layer, Rect } from "react-konva";

interface UssSensorsProps {
  x: number;
  y: number;
  carWidth: number;
  carLength: number;
}

const UssSensors: React.FC<UssSensorsProps> = ({
  x,
  y,
  carWidth,
  carLength,
}) => {
  const sensorSize = 10; // 传感器矩形的大小
  const sensorColor = "#ff0000"; // 传感器矩形的颜色
  const sensorPositions = [
    // 前方传感器 (假设三个)
    { x: x + carWidth * 0.2, y: y - sensorSize / 2 },
    { x: x + carWidth * 0.5 - sensorSize / 2, y: y - sensorSize / 2 },
    { x: x + carWidth * 0.8, y: y - sensorSize / 2 },

    // 后方传感器 (假设三个)
    { x: x + carWidth * 0.2, y: y + carLength - sensorSize / 2 },
    {
      x: x + carWidth * 0.5 - sensorSize / 2,
      y: y + carLength - sensorSize / 2,
    },
    { x: x + carWidth * 0.8, y: y + carLength - sensorSize / 2 },

    // 左侧传感器 (假设三个)
    { x: x - sensorSize / 2, y: y + carLength * 0.2 },
    { x: x - sensorSize / 2, y: y + carLength * 0.5 - sensorSize / 2 },
    { x: x - sensorSize / 2, y: y + carLength * 0.8 },

    // 右侧传感器 (假设三个)
    { x: x + carWidth - sensorSize / 2, y: y + carLength * 0.2 },
    {
      x: x + carWidth - sensorSize / 2,
      y: y + carLength * 0.5 - sensorSize / 2,
    },
    { x: x + carWidth - sensorSize / 2, y: y + carLength * 0.8 },
  ];

  return (
    <Layer>
      {sensorPositions.map((pos, index) => (
        <Rect
          key={index}
          x={pos.x}
          y={pos.y}
          width={sensorSize}
          height={sensorSize}
          fill={sensorColor}
        />
      ))}
    </Layer>
  );
};

export default UssSensors;
