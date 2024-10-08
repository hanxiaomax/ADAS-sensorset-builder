export interface Position {
  x: number;
  y: number;
}
export interface MountPosition {
  name: string;
  position?: Position;
  orientation?: number;
}

export interface SensorSpec {
  range: number;
  fov: number;
}
export interface SensorAttr {
  promotion: boolean;
  new: boolean;
}
export interface SensorProfile {
  name: string;
  brand?: string;
  desc?: string;
  type: string;
  image?: string;
}

export interface SensorItem {
  id: string;
  type: string;
  name: string;
  desc: string;
  brand: string;
  image: "";
  spec: SensorSpec;
  attr: SensorAttr;
}

export interface SensorStocks {
  [key: string]: SensorItem;
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

export const SENSOR_RANGE_FACTOR = 5;

export interface StageSize {
  width: number;
  height: number;
}
