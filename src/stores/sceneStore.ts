import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Vehicle } from "../types/Vehicle";
import { Position } from "../types/Common";
import Sensor from "../types/Sensor";
import {
  SceneInfo,
  ViewState,
  SelectionState,
  SceneObject,
} from "../types/Scene";
import { generateId } from "../utils/idGenerator";

export interface SceneState {
  // 场景基本信息
  sceneInfo: SceneInfo;

  // 车辆信息（不包含传感器）
  vehicle: Vehicle | null;

  // 传感器列表
  sensors: Sensor[];

  // 场景中的其他对象（未来扩展用）
  objects: SceneObject[];

  // 视图状态
  viewState: ViewState;

  // 选中状态
  selectionState: SelectionState;

  // 操作方法
  // 场景操作
  setSceneInfo: (info: Partial<SceneInfo>) => void;

  // 车辆操作
  setVehicle: (vehicle: Vehicle) => void;

  // 传感器操作
  setSensors: (sensors: Sensor[]) => void;
  addSensor: (sensor: Sensor) => void;
  removeSensor: (sensorId: string) => void;
  updateSensor: (sensorId: string, updates: Partial<Sensor>) => void;

  // 对象操作（未来扩展用）
  addObject: (object: SceneObject) => void;
  removeObject: (objectId: string) => void;
  updateObject: (objectId: string, updates: Partial<SceneObject>) => void;

  // 视图操作
  updateViewState: (updates: Partial<ViewState>) => void;

  // 选中操作
  updateSelectionState: (updates: Partial<SelectionState>) => void;
}

export const useSceneStore = create<SceneState>()(
  persist(
    (set, get) => ({
      // 场景基本信息
      sceneInfo: {
        id: generateId("scene"),
        name: "默认场景",
        description: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 车辆信息
      vehicle: null,

      // 传感器列表
      sensors: [],

      // 其他对象
      objects: [],

      // 视图状态
      viewState: {
        scale: 1,
        stagePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        rotation: 0,
        showGrid: true,
        showRulers: false,
      },

      // 选中状态
      selectionState: {
        selectedSensorId: null,
        selectedObjectId: null,
        showSensorInfo: false,
        floatingWindowPos: { x: 0, y: 0 },
      },

      // 场景操作
      setSceneInfo: (info: Partial<SceneInfo>) =>
        set((state) => ({
          sceneInfo: { ...state.sceneInfo, ...info, updatedAt: Date.now() },
        })),

      // 车辆操作
      setVehicle: (vehicle: Vehicle) => set({ vehicle }),

      // 传感器操作
      setSensors: (sensors: Sensor[]) => set({ sensors }),
      addSensor: (sensor: Sensor) =>
        set((state) => ({
          sensors: [...state.sensors, sensor],
        })),
      removeSensor: (sensorId: string) =>
        set((state) => ({
          sensors: state.sensors.filter((s) => s.id !== sensorId),
          selectionState:
            state.selectionState.selectedSensorId === sensorId
              ? { ...state.selectionState, selectedSensorId: null }
              : state.selectionState,
        })),
      updateSensor: (sensorId: string, updates: Partial<Sensor>) =>
        set((state) => ({
          sensors: state.sensors.map((sensor) =>
            sensor.id === sensorId ? { ...sensor, ...updates } : sensor
          ),
        })),

      // 对象操作
      addObject: (object: SceneObject) =>
        set((state) => ({
          objects: [...state.objects, object],
        })),
      removeObject: (objectId: string) =>
        set((state) => ({
          objects: state.objects.filter((obj) => obj.id !== objectId),
          selectionState:
            state.selectionState.selectedObjectId === objectId
              ? { ...state.selectionState, selectedObjectId: null }
              : state.selectionState,
        })),
      updateObject: (objectId: string, updates: Partial<SceneObject>) =>
        set((state) => ({
          objects: state.objects.map((obj) =>
            obj.id === objectId ? { ...obj, ...updates } : obj
          ),
        })),

      // 视图操作
      updateViewState: (updates: Partial<ViewState>) =>
        set((state) => ({
          viewState: { ...state.viewState, ...updates },
        })),

      // 选中操作
      updateSelectionState: (updates: Partial<SelectionState>) =>
        set((state) => ({
          selectionState: { ...state.selectionState, ...updates },
        })),
    }),
    {
      name: "scene-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
