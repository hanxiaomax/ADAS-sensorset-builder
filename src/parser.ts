import { MountPosition } from "./types/Common";

interface SensorConfigurationData {
  name: string;
  type: string;
  fov: number;
  range: number;
  mountPosition: string | MountPosition;
}

interface MountingPoints {
  [key: string]: MountPosition;
}

export function transformJsonArray(
  dataArray: SensorConfigurationData[],
  mountingPoints: MountingPoints
): SensorConfigurationData[] {
  return dataArray.map((item) => {
    const _key = item.mountPosition as string;
    const pos = mountingPoints[_key] as MountPosition;
    console.log(_key, pos);
    if (pos) {
      return {
        ...item,
        mountPosition: pos, // 用坐标替换原本的 locate 字符串
      };
    } else {
      console.warn(`Location key "${_key}" not found in locals.`);
      return item;
    }
  });
}
