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

export interface SensorConfig {
  id: string;
  profile: SensorProfile;
  spec: SensorSpec;
  attr: SensorAttr;
  mountPosition?: MountPosition;
  selectedOptions?: string[]; // 添加这个属性
}

export interface SensorItem {
  id: string;
  name: string;
  brand: string;
  spec: SensorSpec;
  attr: SensorAttr;
}

// 定义传感器类型的接口
interface SensorType {
  title: string;
  sensors: SensorConfig[]; // 包含传感器列表
}

// 定义sensorData接口，用于表示传感器的完整数据结构
export interface SensorStock {
  uss: SensorType;
  lidar: SensorType;
  radar: SensorType;
  camera: SensorType;
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

export class Sensor {
  id: string;
  profile: SensorProfile;
  sensorItemId: string;
  mountPosition: MountPosition;
  options: string[];
  spec: SensorSpec;
  constructor(
    id: string,
    profile: SensorProfile,
    sensorItemId: string,
    mountPosition: MountPosition,
    spec: SensorSpec
  ) {
    this.id = id;
    this.profile = profile;
    this.sensorItemId = sensorItemId;
    this.mountPosition = mountPosition;
    this.options = [];
    this.spec = spec;
  }
}
