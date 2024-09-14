import { Circle, Line, Rect } from "react-konva";
import {
  MountPosition,
  Sensor,
  SENSOR_RANGE_FACTOR,
  StageSize,
} from "../types/Common";
import { mountStringToPosition } from "./utils";
import { Vehicle } from "../types/Vehicle";

export const renderDebugOverlay = (stageSize: StageSize) => {
  const centerX = stageSize.width / 2;
  const centerY = stageSize.height / 2;

  return (
    <>
      {/* 边界矩形 */}
      <Rect
        x={0}
        y={0}
        width={stageSize.width}
        height={stageSize.height}
        stroke="blue"
        strokeWidth={2}
        dash={[10, 5]} // 边界线设置为虚线
      />

      {/* 中心点 */}
      <Circle x={centerX} y={centerY} radius={5} fill="red" />

      {/* X轴 (虚线) */}
      <Line
        points={[0, centerY, stageSize.width, centerY]}
        stroke="green"
        strokeWidth={1}
        dash={[10, 5]} // X轴设置为虚线
      />

      {/* Y轴 (虚线) */}
      <Line
        points={[centerX, 0, centerX, stageSize.height]}
        stroke="green"
        strokeWidth={1}
        dash={[10, 5]} // Y轴设置为虚线
      />
    </>
  );
};

export const renderGrid = (stageSize: StageSize, girdMargin: number) => {
  const gridSize = 50;
  const lines = [];
  for (let i = -girdMargin; i < stageSize.width + girdMargin; i += gridSize) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i, -girdMargin, i, stageSize.height + girdMargin]}
        stroke="#989898"
        strokeWidth={0.5}
      />
    );
  }

  for (let i = -girdMargin; i < stageSize.height + girdMargin; i += gridSize) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[-girdMargin, i, stageSize.width + girdMargin, i]}
        stroke="#989898"
        strokeWidth={0.5}
      />
    );
  }

  return lines;
};

export const getSensorCoverageBoundingBox = (sensors: Sensor[]) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  sensors.forEach((sensor) => {
    const mount_position = mountStringToPosition(
      sensor.mountPosition!.name
    ) as MountPosition;

    const sensorX = mount_position.position!.x;
    const sensorY = mount_position.position!.y;
    const sensorRange =
      sensor.sensorInfo.spec?.range * SENSOR_RANGE_FACTOR || 0;

    const sensorMinX = sensorX - sensorRange;
    const sensorMinY = sensorY - sensorRange;
    const sensorMaxX = sensorX + sensorRange;
    const sensorMaxY = sensorY + sensorRange;

    if (sensorMinX < minX) minX = sensorMinX;
    if (sensorMinY < minY) minY = sensorMinY;
    if (sensorMaxX > maxX) maxX = sensorMaxX;
    if (sensorMaxY > maxY) maxY = sensorMaxY;
  });

  return { minX, minY, maxX, maxY };
};

// 计算车辆和传感器的边界框
export const getBoundingBox = (sensors: Sensor[], vehicle: Vehicle) => {
  let minX = vehicle.origin.x;
  let minY = vehicle.origin.y;
  let maxX = vehicle.origin.x + vehicle.width;
  let maxY = vehicle.origin.y + vehicle.length;

  sensors.forEach((sensor) => {
    const mount_position = mountStringToPosition(
      sensor.mountPosition!.name
    ) as MountPosition;

    const sensorX = mount_position.position!.x;
    const sensorY = mount_position.position!.y;

    // 更新最小和最大坐标
    if (sensorX < minX) minX = sensorX;
    if (sensorY < minY) minY = sensorY;
    if (sensorX > maxX) maxX = sensorX;
    if (sensorY > maxY) maxY = sensorY;
  });

  return { minX, minY, maxX, maxY };
};

export const renderBoundingBox = (sensor: Sensor[]) => {
  const { minX, minY, maxX, maxY } = getSensorCoverageBoundingBox(sensor);

  const width = maxX - minX;
  const height = maxY - minY;

  return (
    <Rect
      x={minX}
      y={minY}
      width={width}
      height={height}
      stroke="green"
      strokeWidth={5}
    />
  );
};
