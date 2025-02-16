import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Vehicle } from "../types/Vehicle";
import { MountPosition, Position } from "../types/Common";
import Sensor from "../types/Sensor";

export interface SceneState {
  // Vehicle related
  vehicle: Vehicle | null;
  mountingPoints: { [key: string]: MountPosition };

  // Sensors
  sensors: Sensor[];

  // Viewer related
  scale: number;
  stagePos: Position;
  rotation: number;
  selectedSensor: Sensor | null;
  showSensorInfo: boolean;
  floatingWindowPos: Position;

  // Actions
  setVehicle: (vehicle: Vehicle) => void;
  setMountingPoints: (points: { [key: string]: MountPosition }) => void;
  addMountingPoint: (name: string, point: MountPosition) => void;
  removeMountingPoint: (name: string) => void;

  setSensors: (sensors: Sensor[]) => void;
  addSensor: (sensor: Sensor) => void;
  removeSensor: (sensorId: string) => void;
  updateSensor: (sensorId: string, updates: Partial<Sensor>) => void;

  // Viewer actions
  setScale: (scale: number) => void;
  setStagePos: (pos: Position) => void;
  setRotation: (rotation: number) => void;
  setSelectedSensor: (sensor: Sensor | null) => void;
  setShowSensorInfo: (show: boolean) => void;
  setFloatingWindowPos: (pos: Position) => void;
}

export const useSceneStore = create<SceneState>()(
  persist(
    (set, get) => ({
      // Initial state
      vehicle: null,
      mountingPoints: {},
      sensors: [],

      // Viewer initial state
      scale: 1,
      stagePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      rotation: 0,
      selectedSensor: null,
      showSensorInfo: false,
      floatingWindowPos: { x: 0, y: 0 },

      // Vehicle actions
      setVehicle: (vehicle) => set({ vehicle }),

      // Mounting points actions
      setMountingPoints: (points) => set({ mountingPoints: points }),
      addMountingPoint: (name, point) =>
        set((state) => ({
          mountingPoints: { ...state.mountingPoints, [name]: point },
        })),
      removeMountingPoint: (name) =>
        set((state) => {
          const { [name]: removed, ...rest } = state.mountingPoints;
          return { mountingPoints: rest };
        }),

      // Sensor actions
      setSensors: (sensors) => set({ sensors }),
      addSensor: (sensor) =>
        set((state) => ({ sensors: [...state.sensors, sensor] })),
      removeSensor: (sensorId) =>
        set((state) => ({
          sensors: state.sensors.filter((s) => s.id !== sensorId),
        })),
      updateSensor: (sensorId, updates) =>
        set((state) => ({
          sensors: state.sensors.map((sensor) =>
            sensor.id === sensorId ? { ...sensor, ...updates } : sensor
          ),
        })),

      // Viewer actions
      setScale: (scale) => set({ scale }),
      setStagePos: (pos) => set({ stagePos: pos }),
      setRotation: (rotation) => set({ rotation }),
      setSelectedSensor: (sensor) => set({ selectedSensor: sensor }),
      setShowSensorInfo: (show) => set({ showSensorInfo: show }),
      setFloatingWindowPos: (pos) => set({ floatingWindowPos: pos }),
    }),
    {
      name: "scene-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 数据迁移函数
export const migrateDataToSceneStore = () => {
  const store = useSceneStore.getState();

  // 迁移车辆数据
  const vehicleData = localStorage.getItem("vehicle");
  if (vehicleData) {
    try {
      const vehicle = JSON.parse(vehicleData);
      store.setVehicle(vehicle);
    } catch (e) {
      console.error("Failed to migrate vehicle data:", e);
    }
  }

  // 迁移挂载点数据
  const mountingPointsData = localStorage.getItem("mountingPoints");
  if (mountingPointsData) {
    try {
      const mountingPoints = JSON.parse(mountingPointsData);
      store.setMountingPoints(mountingPoints);
    } catch (e) {
      console.error("Failed to migrate mounting points data:", e);
    }
  }

  // 迁移传感器数据
  const sensorsData = localStorage.getItem("sensors");
  if (sensorsData) {
    try {
      const sensors = JSON.parse(sensorsData);
      store.setSensors(
        sensors.map(
          (sensorData: any) =>
            new Sensor(
              sensorData.id,
              sensorData.sensorInfo,
              sensorData.mountPosition,
              sensorData.options
            )
        )
      );
    } catch (e) {
      console.error("Failed to migrate sensors data:", e);
    }
  }
};
