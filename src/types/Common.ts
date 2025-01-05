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
  image: string;
  spec: SensorSpec;
  attr: SensorAttr;
  configuration?: { [key: string]: any }; // 添加可选的configuration属性
}

export interface SensorStocks {
  [key: string]: SensorItem;
}

export const SENSOR_RANGE_FACTOR = 5;

export interface StageSize {
  width: number;
  height: number;
}
