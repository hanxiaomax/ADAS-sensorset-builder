import { create } from "zustand";
import { Scene, Shape } from "./models";

interface SceneStore {
  scene: Scene;
  updateScene: (updates: Partial<Scene>) => void;
  updateShape: (shape: Shape) => void;
  resetScene: (initialScene: Scene) => void;
  saveScene: () => void;
  loadScene: () => void;
  saveSceneToFile: () => void;
  loadSceneFromFile: () => Promise<void>;
}

const SCENE_STORAGE_KEY = "vehicle-sensorset-scene";
const SCENE_VERSION = "1.0";

const validateScene = (scene: any): scene is Scene => {
  return (
    scene &&
    typeof scene === "object" &&
    Array.isArray(scene.layers) &&
    Array.isArray(scene.shapes) &&
    Array.isArray(scene.vehicles) &&
    Array.isArray(scene.sceneObjects)
  );
};

const useSceneStore = create<SceneStore>((set, get) => ({
  scene: {
    canvasProps: {
      width: 600,
      height: 400,
      backgroundColor: "white",
    },
    layers: [],
    vehicles: [],
    shapes: [],
    sceneObjects: [],
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
  saveScene: () => {
    const scene = get().scene;
    const data = {
      version: SCENE_VERSION,
      scene,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(data));
  },
  loadScene: () => {
    const data = localStorage.getItem(SCENE_STORAGE_KEY);
    if (!data) {
      console.warn("No saved scene found");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      if (parsed.version !== SCENE_VERSION) {
        console.warn("Scene version mismatch");
        return;
      }

      if (validateScene(parsed.scene)) {
        set({ scene: parsed.scene });
      } else {
        console.error("Invalid scene data");
      }
    } catch (error) {
      console.error("Failed to load scene:", error);
    }
  },
  saveSceneToFile: () => {
    const scene = get().scene;
    const data = {
      version: SCENE_VERSION,
      scene,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `scene-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  loadSceneFromFile: async () => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const result = event.target?.result;
            if (typeof result === "string") {
              const parsed = JSON.parse(result);
              if (parsed.version !== SCENE_VERSION) {
                console.warn("Scene version mismatch");
                return;
              }

              if (validateScene(parsed.scene)) {
                set({ scene: parsed.scene });
                resolve();
              } else {
                console.error("Invalid scene data");
              }
            }
          } catch (error) {
            console.error("Failed to load scene file:", error);
          }
        };
        reader.readAsText(file);
      };

      input.click();
    });
  },
}));

export default useSceneStore;
