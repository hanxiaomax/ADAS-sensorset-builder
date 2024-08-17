import React from "react";
import { Layer, Image } from "react-konva";
import useImage from "use-image";

interface CarImageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  imageSrc: string;
}

const CarImage: React.FC<CarImageProps> = ({
  x,
  y,
  width,
  height,
  imageSrc,
}) => {
  const [image] = useImage(imageSrc);
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
