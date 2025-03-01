import { MountPosition, Position, SensorItem } from "./Common";

export const sensorColorMap: {
  [key: string]: { color: string; opacity: number };
} = {
  uss: { color: "#3a3895", opacity: 0.4 },
  lidar: { color: "#4e4e7f", opacity: 0.2 },
  radar: { color: "#00973d", opacity: 0.3 },
  camera: { color: "#57b1b9", opacity: 0.2 },
  tele_camera: { color: "#f1dae0", opacity: 0.5 },
  // Add more types as needed
};

export type SensorType = "camera" | "radar" | "lidar" | "ultrasonic" | "other"; // Add more types as needed

export class Sensor {
  id: string;
  sensorInfo: SensorItem;
  mountPointId: string; // 引用车辆上的挂载点ID
  mountPosition: MountPosition;
  options: Record<string, any>;
  enabled: boolean;
  visible: boolean;

  constructor(
    id: string,
    sensorInfo: SensorItem,
    mountPointId: string,
    mountPosition: MountPosition,
    options: Record<string, any> = {},
    enabled: boolean = true,
    visible: boolean = true
  ) {
    this.id = id;
    this.sensorInfo = sensorInfo;
    this.mountPointId = mountPointId;
    this.mountPosition = mountPosition;
    this.options = options;
    this.enabled = enabled;
    this.visible = visible;
  }
}

export default Sensor;
