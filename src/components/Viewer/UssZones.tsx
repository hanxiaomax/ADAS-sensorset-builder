import React from "react";
import { Layer, Rect, Arc } from "react-konva";
import { Vehicle } from "../../types/Vehicle";

interface UssZonesProps {
  show: boolean;
  vehicle: Vehicle;
  frontZones: number;
  rearZones: number;
  sideZones: number;
}

const UssZones: React.FC<UssZonesProps> = ({
  show,
  vehicle,
  frontZones,
  rearZones,
  sideZones,
}) => {
  const overhang = vehicle.frontOverhang + vehicle.rearOverhang;
  const sideMaxHeight = vehicle.length - overhang;
  const zoneHeight = sideMaxHeight / sideZones;
  const frontRearRadius = 150;
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
            x={-sideZoneWidth + sideoffset}
            y={index * zoneHeight + overhang / 2}
            width={sideZoneWidth}
            height={zoneHeight}
            fill={areaColor}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <Rect
            x={vehicle.width - sideZoneWidth / 2 + sideoffset}
            y={index * zoneHeight + overhang / 2}
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
            x={vehicle.width / 2}
            y={vehicle.frontOverhang}
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
            x={vehicle.width / 2}
            y={vehicle.length - vehicle.rearOverhang}
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
