import { Circle, Line, Rect } from "react-konva";
import {
  MountPosition,
  SENSOR_RANGE_FACTOR,
  StageSize,
} from "../../types/Common";
import Sensor from "../../types/Sensor";
import { Vehicle } from "../../types/Vehicle";

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
    const mount_position = sensor.getMountPosition() as MountPosition;

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

  // 计算包围框的中心点
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const width = maxX - minX;
  const height = maxY - minY;

  const center = { x: centerX, y: centerY };
  const bbox = {
    origin: { x: centerX - width / 2, y: centerY - height / 2 },
    center: center,
    width: width,
    height: height,
  };
  return bbox;
};

// 计算车辆和传感器的边界框
export const getBoundingBox = (vehicle: Vehicle) => {
  let minX = vehicle.origin.x;
  let minY = vehicle.origin.y;
  let maxX = vehicle.origin.x + vehicle.width;
  let maxY = vehicle.origin.y + vehicle.length;

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const width = maxX - minX;
  const height = maxY - minY;

  const center = { x: centerX, y: centerY };
  const bbox = {
    origin: { x: centerX - width / 2, y: centerY - height / 2 },
    center: center,
    width: width,
    height: height,
  };

  return bbox;
};

export const renderBoundingBox = (sensor: Sensor[]) => {
  const { origin, center, width, height } =
    getSensorCoverageBoundingBox(sensor);
  return (
    <Rect
      x={origin.x}
      y={origin.y}
      width={width}
      height={height}
      stroke="blue"
      strokeWidth={5}
    />
  );
};

export const renderLayerBoundary = (layerSize: {
  width: number;
  height: number;
}) => {
  return (
    <Rect
      x={0}
      y={0}
      width={layerSize.width}
      height={layerSize.height}
      stroke="black"
      dash={[10, 5]}
    />
  );
};

// 计算给定包围框或图层的原点在stage坐标系中的坐标
// 计算图层的新原点位置，使其中心与stage的中心对齐
export const calculateNewOrigin = (
  boundingBoxCenter: { x: number; y: number }, // 图层或包围框的中心点
  scale: number, // 当前缩放比例
  stageSize: { width: number; height: number } // Stage 的大小
) => {
  // 计算图层的新原点
  const newOrigin = {
    x: stageSize.width / 2 - boundingBoxCenter.x * scale,
    y: stageSize.height / 2 - boundingBoxCenter.y * scale,
  };

  return newOrigin;
};
