import { MountPosition, Position, SensorConfig } from "./types/Common";

interface MountingPoints {
  [key: string]: MountPosition;
}

export function transformJsonArray(
  dataArray: SensorConfig[],
  mountingPoints: MountingPoints
): SensorConfig[] {
  return dataArray.map((item) => {
    const name = item.mountPosition!.name as string;
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

export function mountStringToPosition(name: string): MountPosition | undefined {
  const mountingPointsData = localStorage.getItem("mountingPoints");
  if (mountingPointsData) {
    const data = JSON.parse(mountingPointsData);
    return data[name];
  } else {
    console.log("No user data found in localStorage.");
    return undefined;
  }
}
