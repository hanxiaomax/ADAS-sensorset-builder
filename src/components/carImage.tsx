import React from "react";
import { Layer, Image, Rect } from "react-konva";
import useImage from "use-image";

interface CarImageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement | undefined;
}

const CarImage: React.FC<CarImageProps> = ({ x, y, width, height, image }) => {
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
