import { Circle } from "react-konva";
import { MountPosition, Position } from "../types/Common";

// 将字符串映射为对应的安装位置对象
export function mountStringToPosition(name: string): MountPosition | undefined {
  const mountingPointsData = localStorage.getItem("mountingPoints");

  if (mountingPointsData) {
    const data: Record<string, MountPosition> = JSON.parse(mountingPointsData);

    if (data[name]) {
      return data[name];
    } else {
      console.log(`Mounting point '${name}' not found in data.`);
      return undefined;
    }
  } else {
    console.log("No mounting points data found in localStorage.");
    return undefined;
  }
}

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
