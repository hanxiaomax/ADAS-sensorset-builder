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
  type: string;
  mountPosition: MountPosition;
  fov: number;
}
