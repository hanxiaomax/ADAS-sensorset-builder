import React from "react";
import { Layer, Image as KonvaImage } from "react-konva";
import { useVehicleImageStore } from "../../stores/vehicleImageStore";
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
  const { vehicleImages } = useVehicleImageStore();
  const image = vehicleImages[vehicle.imageKey];

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
