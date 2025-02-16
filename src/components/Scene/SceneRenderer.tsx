import React, { useEffect, useRef } from "react";
import { Stage, Layer, Group } from "react-konva";
import { useSceneStore } from "../../stores/sceneStore";
import VehicleShape from "./VehicleShape";
import MountingPoint from "./MountingPoint";
import SensorShape from "./SensorShape";
import { Vehicle } from "../../types/Vehicle";
import { MountPosition } from "../../types/Common";
import Sensor from "../../types/Sensor";
import Konva from "konva";

interface SceneRendererProps {
  width: number;
  height: number;
}

const SceneRenderer: React.FC<SceneRendererProps> = ({ width, height }) => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const {
    vehicle,
    mountingPoints,
    sensors,
    setVehicle,
    setMountingPoints,
    setSensors,
  } = useSceneStore();

  // Handle stage scaling and centering
  useEffect(() => {
    if (stageRef.current && vehicle) {
      // Center the vehicle in the stage
      const stage = stageRef.current;
      const scale = Math.min(
        width / (vehicle.width * 1.5),
        height / (vehicle.length * 1.5)
      );

      stage.scale({ x: scale, y: scale });
      stage.position({
        x: width / 2 - (vehicle.width * scale) / 2,
        y: height / 2 - (vehicle.length * scale) / 2,
      });
    }
  }, [vehicle, width, height]);

  return (
    <Stage ref={stageRef} width={width} height={height} draggable>
      <Layer>
        {/* Render Vehicle */}
        {vehicle && (
          <VehicleShape
            vehicle={vehicle}
            onChange={(updatedVehicle: Vehicle) => setVehicle(updatedVehicle)}
          />
        )}

        {/* Render Mounting Points */}
        <Group>
          {Object.entries(mountingPoints).map(([name, point]) => (
            <MountingPoint
              key={name}
              name={name}
              position={point.position!}
              orientation={point.orientation!}
              onUpdate={(updatedPoint: MountPosition) =>
                setMountingPoints({
                  ...mountingPoints,
                  [name]: updatedPoint,
                })
              }
            />
          ))}
        </Group>

        {/* Render Sensors */}
        <Group>
          {sensors.map((sensor) => (
            <SensorShape
              key={sensor.id}
              sensor={sensor}
              onUpdate={(updatedSensor: Sensor) =>
                setSensors(
                  sensors.map((s) => (s.id === sensor.id ? updatedSensor : s))
                )
              }
            />
          ))}
        </Group>
      </Layer>
    </Stage>
  );
};

export default SceneRenderer;
