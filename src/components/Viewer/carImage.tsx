import React from "react";
import { Layer, Image as KonvaImage } from "react-konva";

interface CarImageProps {
  show: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement | undefined;
}

const CarImage: React.FC<CarImageProps> = ({
  show,
  x,
  y,
  width,
  height,
  image,
}) => {
  if (!show) {
    return null;
  }

  return (
    <>
      {image && (
        <KonvaImage image={image} x={x} y={y} width={width} height={height} />
      )}
    </>
  );
};

export default CarImage;
