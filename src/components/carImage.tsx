import React from "react";
import { Layer, Image } from "react-konva";

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
    <Layer>
      {image && (
        <Image
          image={image}
          x={x}
          y={y}
          width={image?.width!}
          height={image?.height}
        />
      )}
    </Layer>
  );
};

export default CarImage;
