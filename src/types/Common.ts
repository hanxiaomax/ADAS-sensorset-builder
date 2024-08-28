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
  brand?: string;
  desc?: string;
  type: string;
  img?: string;
  mountPosition: string | MountPosition;
  fov: number;
  range: number;
}

interface Sensor {
  id: number;
  name: string;
  type: string;
  isNew: boolean;
  description: string;
  specs: {
    [key: string]: string; // 动态键值对，用于传感器的规格描述
  };
  image?: string; // 可选字段，用于传感器的图片链接
}

// 定义传感器类型的接口
interface SensorType {
  title: string;
  sensors: Sensor[]; // 包含传感器列表
}

// 定义sensorData接口，用于表示传感器的完整数据结构
export interface SensorData {
  uss_sensors: SensorType;
  lidar_sensors: SensorType;
  radar_sensors: SensorType;
  camera_sensors: SensorType;
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
