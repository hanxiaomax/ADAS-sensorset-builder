import React from "react";
import { Group, Circle, Text } from "react-konva";
import { MountPosition, Position } from "../../types/Common";

interface MountingPointProps {
  name: string;
  position: Position;
  orientation: number;
  onUpdate: (point: MountPosition) => void;
}

const MountingPoint: React.FC<MountingPointProps> = ({
  name,
  position,
  orientation,
  onUpdate,
}) => {
  return (
    <Group
      x={position.x}
      y={position.y}
      draggable
      onDragEnd={(e) => {
        onUpdate({
          name,
          position: {
            x: e.target.x(),
            y: e.target.y(),
          },
          orientation,
        });
      }}
    >
      {/* Mounting point marker */}
      <Circle radius={5} fill="blue" stroke="white" strokeWidth={1} />

      {/* Orientation indicator */}
      <Circle
        radius={2}
        fill="white"
        x={Math.cos((orientation * Math.PI) / 180) * 8}
        y={Math.sin((orientation * Math.PI) / 180) * 8}
      />

      {/* Label */}
      <Text text={name} fontSize={12} fill="black" x={10} y={-6} />
    </Group>
  );
};

export default MountingPoint;
