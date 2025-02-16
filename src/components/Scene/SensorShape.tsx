import React from "react";
import { Group, Rect, Line, Text } from "react-konva";
import Sensor from "../../types/Sensor";

interface SensorShapeProps {
  sensor: Sensor;
  onUpdate: (sensor: Sensor) => void;
}

const SensorShape: React.FC<SensorShapeProps> = ({ sensor, onUpdate }) => {
  const { mountPosition, sensorInfo } = sensor;
  const { width = 20, height = 20 } = sensorInfo;
  const fov = sensorInfo.spec?.fov;

  // Calculate FOV lines if sensor has FOV information
  const renderFOV = () => {
    if (!fov || !mountPosition?.orientation) return null;

    const fovLength = 50; // Length of FOV visualization lines

    const leftAngle = ((mountPosition.orientation - fov / 2) * Math.PI) / 180;
    const rightAngle = ((mountPosition.orientation + fov / 2) * Math.PI) / 180;

    const leftPoint = {
      x: Math.cos(leftAngle) * fovLength,
      y: Math.sin(leftAngle) * fovLength,
    };

    const rightPoint = {
      x: Math.cos(rightAngle) * fovLength,
      y: Math.sin(rightAngle) * fovLength,
    };

    return (
      <>
        <Line
          points={[0, 0, leftPoint.x, leftPoint.y]}
          stroke="rgba(255, 0, 0, 0.5)"
          strokeWidth={1}
        />
        <Line
          points={[0, 0, rightPoint.x, rightPoint.y]}
          stroke="rgba(255, 0, 0, 0.5)"
          strokeWidth={1}
        />
      </>
    );
  };

  if (!mountPosition?.position) {
    return null;
  }

  return (
    <Group
      x={mountPosition.position.x}
      y={mountPosition.position.y}
      rotation={mountPosition.orientation || 0}
      draggable
      onDragEnd={(e) => {
        const newSensor = { ...sensor };
        newSensor.mountPosition = {
          ...mountPosition,
          position: {
            x: e.target.x(),
            y: e.target.y(),
          },
        };
        onUpdate(newSensor);
      }}
    >
      {/* Sensor body */}
      <Rect
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        fill="yellow"
        stroke="black"
        strokeWidth={1}
      />

      {/* FOV visualization */}
      {renderFOV()}

      {/* Sensor label */}
      <Text
        text={sensorInfo.name || "Sensor"}
        fontSize={12}
        fill="black"
        x={width / 2 + 5}
        y={-height / 2}
      />
    </Group>
  );
};

export default SensorShape;
