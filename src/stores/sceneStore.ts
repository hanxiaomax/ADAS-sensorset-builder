import { create } from "zustand";
import { Scene, Shape } from "./models"; // 确保路径正确

interface SceneStore {
  scene: Scene;
  updateScene: (updates: Partial<Scene>) => void;
  updateShape: (shape: Shape) => void;
  resetScene: (initialScene: Scene) => void;
}

const useSceneStore = create<SceneStore>((set) => ({
  scene: {
    canvasProps: {
      width: 600,
      height: 400,
      backgroundColor: "white",
    },
    layers: [
      {
        id: "layer1",
        name: "Layer 1",
        shapes: ["rect1", "circle1"],
        locked: false,
        opacity: 1,
      },
      {
        id: "layer2",
        name: "Layer 2",
        shapes: ["line1", "text1"],
        locked: false,
        opacity: 0.5,
      },
    ],
    vehicles: [
      {
        id: "vehicle1",
        x: 100,
        y: 100,
        rotation: 30,
        draggable: true,
        mountingPoints: {
          point1: {
            name: "point1",
            position: { x: 10, y: 10 },
            oriation: 0,
          },
          point2: {
            name: "point2",
            position: { x: 20, y: 20 },
            oriation: 0,
          },
        },
        sensorSet: {},
      },
    ],
    shapes: [
      {
        id: "rect1",
        type: "rect",
        x: 50,
        y: 50,
        width: 100,
        height: 50,
        fill: "red",
        draggable: true,
        zIndex: 1,
      },
      {
        id: "circle1",
        type: "circle",
        x: 200,
        y: 100,
        radius: 30,
        fill: "blue",
        draggable: true,
        zIndex: 2,
      },
      {
        id: "line1",
        type: "line",
        points: [
          { x: 10, y: 10 },
          { x: 100, y: 100 },
        ],
        stroke: "black",
        strokeWidth: 2,
        draggable: true,
        zIndex: 2,
        lineCap: "round",
        lineDash: [5, 5],
      },
      {
        id: "text1",
        type: "text",
        x: 100,
        y: 200,
        text: "This is a text",
        fontSize: 20,
        fontFamily: "Calibri",
        draggable: true,
        zIndex: 2,
      },
    ],
    sceneObjects: [
      {
        id: "sceneObject1",
        type: "image",
        x: 10,
        y: 200,
        src: "https://konvajs.org/assets/yoda.jpg",
        width: 100,
        height: 100,
        draggable: true,
      },
      {
        id: "group1",
        type: "group",
        x: 200,
        y: 200,
        children: ["rect2", "circle2"],
        draggable: true,
      },
      {
        id: "rect2",
        type: "rect",
        x: 0,
        y: 0,
        width: 50,
        height: 25,
        fill: "yellow",
        draggable: false,
      },
      {
        id: "circle2",
        type: "circle",
        x: 50,
        y: 0,
        radius: 15,
        fill: "green",
        draggable: false,
      },
    ],
  },
  updateScene: (updates) =>
    set((state) => ({ scene: { ...state.scene, ...updates } })),
  updateShape: (shape) => {
    set((state) => {
      const updateShapes = state.scene.shapes.map((item) =>
        item.id === shape.id ? { ...item, ...shape } : item
      );
      return { scene: { ...state.scene, shapes: updateShapes } };
    });
  },
  resetScene: (initialScene) => set(() => ({ scene: initialScene })),
}));

export default useSceneStore;
