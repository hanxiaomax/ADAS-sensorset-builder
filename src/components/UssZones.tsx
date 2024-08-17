import React from "react";
import { Stage, Layer, Rect, Arc, Image } from "react-konva";
import useImage from "use-image";

interface UssZonesProps {
  width: number;
  height: number;
  frontZones: number[];
  rearZones: number[];
  sideZones: number[]; // 统一左右两侧的分区
  carImageSrc: string; // 车辆图片的路径
}

const UssZones: React.FC<UssZonesProps> = ({
  width,
  height,
  frontZones,
  rearZones,
  sideZones,
  carImageSrc,
}) => {
  const [carImage] = useImage(carImageSrc);
  const image_margin = 20;
  const overhange = 60 + image_margin; // assuming equal front real overhang
  const frontOverhange = overhange / 2;
  const rearOverhange = overhange / 2;
  const carWidth = carImage?.width!;
  const carHeight = carImage?.height! - overhange;
  const sideMaxHeight = carHeight; // 左右侧区域的总高度
  const zoneHeight = sideMaxHeight / sideZones.length; // 每个分区的高度
  const frontRearRadius = 140; // 前后扇形区域的最大半径
  const areaColor = "#2199d6";
  const lineColor = "#c0e2f7";
  const lineWidth = 3;

  // 计算车辆位置
  const carX = (width - carWidth) / 2;
  const carY = (height - carHeight) / 2;

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* 绘制左右两侧分区 */}
        {sideZones.map((zone, index) => (
          <React.Fragment key={index}>
            {/* 左侧 */}
            <Rect
              x={carX + 40}
              y={carY + index * zoneHeight + overhange / 2}
              width={80}
              height={zoneHeight}
              fill={areaColor}
              stroke={lineColor}
              strokeWidth={lineWidth}
            />
            {/* 右侧 */}
            <Rect
              x={carX + carImage?.width! - 120}
              y={carY + index * zoneHeight + overhange / 2}
              width={80}
              height={zoneHeight}
              fill={areaColor}
              stroke={lineColor}
              strokeWidth={lineWidth}
            />
          </React.Fragment>
        ))}

        {/* 绘制前方分区 */}
        {frontZones.map((zone, index) => {
          const startAngle = 180 + (index * 180) / frontZones.length;
          const endAngle = 180 + ((index + 1) * 180) / frontZones.length;
          return (
            <Arc
              key={`front-${index}`}
              x={carX + carImage?.width! / 2}
              y={carY + frontOverhange}
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
        {rearZones.map((zone, index) => {
          const startAngle = (index * 180) / rearZones.length;
          const endAngle = ((index + 1) * 180) / rearZones.length;
          return (
            <Arc
              key={`rear-${index}`}
              x={carX + carImage?.width! / 2}
              y={carY + carImage?.height! - rearOverhange}
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

        {/* 绘制车辆图片 */}
        {carImage && (
          <Image
            image={carImage}
            x={carX}
            y={carY}
            width={carImage.width}
            height={carImage.height}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default UssZones;
