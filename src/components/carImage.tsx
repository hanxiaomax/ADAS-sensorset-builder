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
        <KonvaImage
          image={image}
          x={x}
          y={y}
          width={width} // 使用传入的宽度和高度，而不是 image 的原始大小
          height={height}
        />
      )}
    </>
  );
};

export default CarImage;
