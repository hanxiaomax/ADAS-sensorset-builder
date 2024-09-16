import { MountPosition, SensorItem } from "./Common";

export const sensorColorMap: {
  [key: string]: { color: string; opacity: number };
} = {
  uss: { color: "#3a3895", opacity: 0.4 },
  lidar: { color: "#4e4e7f", opacity: 0.2 },
  radar: { color: "#00973d", opacity: 0.3 },
  camera: { color: "#57b1b9", opacity: 0.2 },
  tele_camera: { color: "#f1dae0", opacity: 0.5 },
  // 可以添加更多类型
};

export class Sensor {
  id: string;
  sensorInfo: SensorItem;
  mountPosition: MountPosition;
  options: string[]; // 存储传感器的额外选项，如 "highlight" 或 "hide"

  constructor(
    id: string,
    sensorInfo: SensorItem,
    mountPosition: MountPosition,
    options: string[] = []
  ) {
    this.id = id;
    this.sensorInfo = sensorInfo;
    this.mountPosition = mountPosition;
    this.options = options;
  }

  //箭头函数可以自绑定当前上下文的this
  getMountPosition = (): MountPosition | undefined => {
    const mountingPointsData = localStorage.getItem("mountingPoints");

    if (mountingPointsData) {
      const data: Record<string, MountPosition> =
        JSON.parse(mountingPointsData);

      if (data[this.mountPosition.name]) {
        return data[this.mountPosition.name];
      } else {
        console.log(
          `Mounting point '${this.mountPosition.name}' not found in data.`
        );
        return undefined;
      }
    } else {
      console.log("No mounting points data found in localStorage.");
      return undefined;
    }
  };
}

export default Sensor;
