import React from "react";
import { Group, Rect, Line } from "react-konva";
import { Vehicle } from "../../types/Vehicle";

interface VehicleShapeProps {
  vehicle: Vehicle;
  onChange: (vehicle: Vehicle) => void;
}

const VehicleShape: React.FC<VehicleShapeProps> = ({ vehicle, onChange }) => {
  const { width, length, origin } = vehicle;

  return (
    <Group
      x={origin.x}
      y={origin.y}
      draggable
      onDragEnd={(e) => {
        const newVehicle = { ...vehicle };
        newVehicle.origin = {
          x: e.target.x(),
          y: e.target.y(),
        };
        onChange(newVehicle);
      }}
    >
      {/* Main vehicle body */}
      <Rect
        width={width}
        height={length}
        fill="rgba(200, 200, 200, 0.5)"
        stroke="black"
        strokeWidth={1}
      />

      {/* Reference points */}
      {Object.entries(vehicle.refPoints).map(([name, point]) => (
        <Line
          key={name}
          points={[point.x, point.y, point.x, point.y]}
          stroke="red"
          strokeWidth={4}
        />
      ))}
    </Group>
  );
};

export default VehicleShape;
