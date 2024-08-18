export interface Position {
  x: number;
  y: number;
}
export interface MountingPoint {
  position: Position;
  orientation: number;
}

export interface SensorConfig {
  position: Position;
  orientation: number;
  fov: number;
}
