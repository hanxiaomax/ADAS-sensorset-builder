import { MountPosition, SensorConfig } from "./types/Common";

interface MountingPoints {
  [key: string]: MountPosition;
}

export function transformJsonArray(
  dataArray: SensorConfig[],
  mountingPoints: MountingPoints
): SensorConfig[] {
  return dataArray.map((item) => {
    const name = item.mountPosition as string;
    let pose = mountingPoints[name];
    pose["name"] = name;
    console.log(name, pose);
    if (pose) {
      return {
        ...item,
        mountPosition: pose,
      };
    } else {
      console.warn(`Location key "${name}" not found in locals.`);
      return item;
    }
  });
}
