export interface Position {
  x: number;
  y: number;
}
export interface MountPosition {
  position: Position;
  orientation: number;
}

export interface SensorConfig {
  name?: string;
  type: string;
  mountPosition: MountPosition;
  fov: number;
}

// ui configuration interface used in control panel
export interface UiConfig {
  showCarImage: boolean;
  showUssZones: boolean;
  showUssSensors: boolean;
  showLidarSensors: boolean;
  showRadarSensors: boolean;
  showCameraSensors: boolean;
  showVehicleRefPoint: boolean;
  frontZones: number;
  rearZones: number;
  sideZones: number;
  panelVisible: boolean;
  background: string;
}
