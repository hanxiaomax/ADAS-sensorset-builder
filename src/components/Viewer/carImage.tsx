import React from "react";
import { Layer, Image as KonvaImage } from "react-konva";
import { Vehicle } from "../../types/Vehicle";

interface CarImageProps {
  show: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  vehicle: Vehicle;
}

const CarImage: React.FC<CarImageProps> = ({
  show,
  x,
  y,
  width,
  height,
  vehicle,
}) => {
  const image = vehicle.getImage();

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
