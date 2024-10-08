import React from "react";
import { Layer, Rect, Arc } from "react-konva";

interface UssZonesProps {
  show: boolean;
  x: number;
  y: number;
  carWidth: number;
  carLength: number;
  frontOverhang: number;
  rearOverhang: number;
  frontZones: number;
  rearZones: number;
  sideZones: number;
}

const UssZones: React.FC<UssZonesProps> = ({
  show,
  x,
  y,
  carWidth,
  carLength,
  frontOverhang,
  rearOverhang,
  frontZones,
  rearZones,
  sideZones,
}) => {
  const overhang = frontOverhang + rearOverhang;
  const sideMaxHeight = carLength - overhang;
  const zoneHeight = sideMaxHeight / sideZones;
  const frontRearRadius = 140;
  const areaColor = "rgba(12, 122, 146, 0.8)";
  const lineColor = "#ecffff";
  const lineWidth = 2;
  const sideZoneWidth = 80;
  const sideoffset = 20;

  if (!show) {
    return null;
  }
  return (
    <>
      {/* 绘制左右两侧分区 */}
      {Array.from({ length: sideZones }).map((_, index) => (
        <React.Fragment key={index}>
          <Rect
            x={x - sideZoneWidth + sideoffset}
            y={y + index * zoneHeight + overhang / 2}
            width={sideZoneWidth}
            height={zoneHeight}
            fill={areaColor}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <Rect
            x={x + sideZoneWidth * 2 - sideoffset}
            y={y + index * zoneHeight + overhang / 2}
            width={sideZoneWidth}
            height={zoneHeight}
            fill={areaColor}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
        </React.Fragment>
      ))}
      {/* 绘制前方分区 */}
      {Array.from({ length: frontZones }).map((_, index) => {
        const startAngle = 180 + (index * 180) / frontZones;
        const endAngle = 180 + ((index + 1) * 180) / frontZones;
        return (
          <Arc
            key={`front-${index}`}
            x={x + carWidth / 2}
            y={y + frontOverhang}
            innerRadius={0}
            outerRadius={frontRearRadius}
            angle={endAngle - startAngle}
            rotation={startAngle}
            fill={areaColor}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
        );
      })}
      {/* 绘制后方分区 */}
      {Array.from({ length: rearZones }).map((_, index) => {
        const startAngle = (index * 180) / rearZones;
        const endAngle = ((index + 1) * 180) / rearZones;
        return (
          <Arc
            key={`rear-${index}`}
            x={x + carWidth / 2}
            y={y + carLength - rearOverhang}
            innerRadius={0}
            outerRadius={frontRearRadius}
            angle={endAngle - startAngle}
            rotation={startAngle}
            fill={areaColor}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
        );
      })}
    </>
  );
};

export default UssZones;
