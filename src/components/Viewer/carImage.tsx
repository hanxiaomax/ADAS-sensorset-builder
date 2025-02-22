import React from "react";
import { Layer, Image as KonvaImage } from "react-konva";
import { Vehicle } from "../../types/Vehicle";

interface CarImageProps {
  show: boolean;
  vehicle: Vehicle;
}

const CarImage: React.FC<CarImageProps> = ({ show, vehicle }) => {
  const image = vehicle.getImage();

  if (!show) {
    return null;
  }

  return (
    <>
      {image && (
        <KonvaImage
          image={image}
          x={0}
          y={0}
          width={vehicle.width}
          height={vehicle.length}
        />
      )}
    </>
  );
};

export default CarImage;
