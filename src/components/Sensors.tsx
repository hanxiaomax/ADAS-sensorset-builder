import React from "react";
import { Layer, Arc, Rect } from "react-konva";
import { MountPosition, SensorConfig } from "../types/Common";
import { UiConfig } from "../types/Common";

const sensorStyles: {
  [key: string]: { color: string; opacity: number };
} = {
  uss: { color: "#3a3895", opacity: 0.4 },
  lidar: { color: "#4e4e7f", opacity: 0.2 },
  radar: { color: "#00973d", opacity: 0.3 },
  camera: { color: "#57b1b9", opacity: 0.2 },
  tele_camera: { color: "#f1dae0", opacity: 0.5 },
};

interface SensorProp extends SensorConfig {
  uiConfig: UiConfig;
  highlighted: boolean; // 新增的属性
}

export const Sensor: React.FC<SensorProp> = ({
  mountPosition,
  fov,
  range,
  type,
  uiConfig,
  highlighted, // 接受 highlighted 属性
}) => {
  const offset = 5;

  // 根据传感器类型动态设置颜色和透明度
  const { color, opacity } = sensorStyles[type] || {
    color: "#000",
    opacity: 1,
  };
  const mt = mountPosition as MountPosition;

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
        x={mt.position.x}
        y={mt.position.y}
        innerRadius={0}
        outerRadius={range} // 视场的可见范围大小，通常根据需求进行调整
        angle={fov}
        rotation={mt.orientation - fov / 2}
        fill={`${color}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`} // 计算透明度的hex值
        strokeWidth={highlighted ? 4 : 2} // 当传感器高亮时增加边框厚度
        stroke={highlighted ? "yellow" : color} // 当传感器高亮时显示黄色边框
      />
      {/* 绘制传感器的主体 */}
      <Rect
        x={mt.position.x - offset}
        y={mt.position.y - offset}
        width={2 * offset}
        height={2 * offset}
        fill={highlighted ? "yellow" : color} // 当传感器高亮时填充黄色
      />
    </React.Fragment>
  );
};
