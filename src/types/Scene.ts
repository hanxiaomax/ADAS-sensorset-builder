import { Position } from "./Common";
import { Vehicle } from "./Vehicle";
import Sensor from "./Sensor";

/**
 * Scene information
 */
export interface SceneInfo {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * View state for the scene
 */
export interface ViewState {
  scale: number;
  stagePos: Position;
  rotation: number;
  showGrid: boolean;
  showRulers: boolean;
}

/**
 * Selection state for the scene
 */
export interface SelectionState {
  selectedSensorId: string | null;
  selectedObjectId: string | null;
  showSensorInfo: boolean;
  floatingWindowPos: Position;
}

/**
 * Generic scene object interface for future extensions
 */
export interface SceneObject {
  id: string;
  type: string;
  position: Position;
  rotation: number;
  scale: number;
  properties: Record<string, any>;
}
