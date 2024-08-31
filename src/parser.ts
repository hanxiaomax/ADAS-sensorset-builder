import { MountPosition } from "./types/Common";

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
