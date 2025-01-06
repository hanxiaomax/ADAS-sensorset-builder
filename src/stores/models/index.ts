import exp from "constants";

// src/store/models/index.ts
export interface Point {
  x: number;
  y: number;
}

export interface MountingPoint {
  name: string;
  position: Point;
  oriation: number;
}

export interface MountingPoints {
  [key: string]: MountingPoint;
}

export interface SensorSet {}

export interface Vehicle {
  id: string;
  x?: number;
  y?: number;
  rotation?: number;
  draggable: boolean;
  zIndex?: number;
  mountingPoints: MountingPoints;
  sensorSet: SensorSet;
}

export interface Shape {
  id: string;
  type:
    | "rect"
    | "circle"
    | "line"
    | "path"
    | "text"
    | "image"
    | "arrow"
    | "polygon"
    | "ellipse"
    | "group";
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  points?: Point[];
  text?: string;
  src?: string;
  rotation?: number;
  draggable: boolean;
  zIndex?: number;
  fontSize?: number;
  fontFamily?: string;
  lineDash?: number[];
  lineCap?: "butt" | "round" | "square";
  [key: string]: any;
}
export interface Group extends Shape {
  type: "group";
  children: string[]; // 子元素id
}

export interface SceneObject extends Shape {
  image?: string;
}

export interface Layer {
  id: string;
  name: string;
  shapes: string[]; //存储Shape ID
  locked?: boolean;
  opacity?: number;
}

export interface Scene {
  layers: Layer[];
  vehicles: Vehicle[];
  shapes: Shape[];
  sceneObjects: SceneObject[];
  canvasProps: {
    width: number;
    height: number;
    backgroundColor: string;
    [key: string]: any;
  };
  [key: string]: any;
}
