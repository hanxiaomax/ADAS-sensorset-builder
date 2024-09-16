import { Circle } from "react-konva";
import { MountPosition, Position } from "../types/Common";

interface MarkerProps {
  position: Position;
  fill?: string;
}

// Marker 组件显示一个圆形标记
const Marker: React.FC<MarkerProps> = ({ position, fill = "black" }) => {
  const radius = 5;
  return <Circle x={position.x} y={position.y} radius={radius} fill={fill} />;
};

export default Marker;
