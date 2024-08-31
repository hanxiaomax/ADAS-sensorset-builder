import React from "react";
import { Layer, Arc, Rect } from "react-konva";
import {
  UiConfig,
  MountPosition,
  SensorConfig,
  Position,
} from "../types/Common";
import { mountStringToPosition } from "../parser";

const sensorStyles: {
  [key: string]: { color: string; opacity: number };
} = {
  uss: { color: "#3a3895", opacity: 0.4 },
  lidar: { color: "#4e4e7f", opacity: 0.2 },
  radar: { color: "#00973d", opacity: 0.3 },
  camera: { color: "#57b1b9", opacity: 0.2 },
  tele_camera: { color: "#f1dae0", opacity: 0.5 },
};

interface SensorProp {
  sensorConfig: SensorConfig;
  uiConfig: UiConfig;
  highlighted: boolean; // 新增的属性
}

export const Sensor: React.FC<SensorProp> = ({
  uiConfig,
  sensorConfig,
  highlighted, // 接受 highlighted 属性
}) => {
  const offset = 5;
  const type = sensorConfig.profile.type;
  const fov = sensorConfig.spec.fov;
  const range = sensorConfig.spec.range;
  const mount_position = mountStringToPosition(
    sensorConfig.mountPosition!.name
  ) as MountPosition;
  console.log(mount_position);
  // 根据传感器类型动态设置颜色和透明度
  const { color, opacity } = sensorStyles[type] || {
    color: "#000",
    opacity: 1,
  };

  // 根据传感器类型选择 visibility 条件
  const visibility = (() => {
    if (type.includes("uss")) {
      return uiConfig.showUssSensors;
    } else if (type.includes("lidar")) {
      return uiConfig.showLidarSensors;
    } else if (type.includes("radar")) {
      return uiConfig.showRadarSensors;
    } else if (type.includes("camera")) {
      return uiConfig.showCameraSensors;
    } else {
      return false;
    }
  })();

  if (!visibility) {
    return null; // 如果 visibility 为 false，则返回 null，不渲染任何内容
  }

  return (
    <React.Fragment>
      {/* 绘制传感器的FOV扇形区域 */}
      <Arc
        x={mount_position.position!.x}
        y={mount_position.position!.y}
        innerRadius={0}
        outerRadius={range} // 视场的可见范围大小，通常根据需求进行调整
        angle={fov}
        rotation={mount_position.orientation! - fov / 2}
        fill={`${color}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`} // 计算透明度的hex值
        strokeWidth={highlighted ? 4 : 0} // 高亮时设置边框宽度
        stroke={highlighted ? "#f9653e" : color} // 高亮时使用蓝色边框
        dash={highlighted ? [10, 5] : undefined} // 高亮时设置虚线轮廓
      />
      {/* 绘制传感器的主体 */}
      <Rect
        x={mount_position.position!.x - offset}
        y={mount_position.position!.y - offset}
        width={2 * offset}
        height={2 * offset}
        fill={highlighted ? "#f9653e" : color} // 传感器主体颜色
      />
    </React.Fragment>
  );
};
