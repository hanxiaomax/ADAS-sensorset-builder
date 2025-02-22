import { Circle } from "react-konva";
import { Position } from "../types/Common";

interface MarkerProps {
  position: Position;
  fill?: string;
}

const Marker: React.FC<MarkerProps> = ({ position, fill = "black" }) => {
  const radius = 5;
  return <Circle x={position.x} y={position.y} radius={radius} fill={fill} />;
};

export default Marker;
