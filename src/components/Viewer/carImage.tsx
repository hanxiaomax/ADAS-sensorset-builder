import React from "react";
import { Layer, Image as KonvaImage } from "react-konva";
import { useVehicleImageStore } from "../../stores/vehicleImageStore";

interface CarImageProps {
  show: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

const CarImage: React.FC<CarImageProps> = ({ show, x, y, width, height }) => {
  const { getCurrentVehicleImage } = useVehicleImageStore();
  const image = getCurrentVehicleImage();

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
