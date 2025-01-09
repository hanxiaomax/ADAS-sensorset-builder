import { create } from "zustand";
import { Scene, Shape } from "./models";

interface SceneStore {
  scene: Scene;
  updateScene: (updates: Partial<Scene>) => void;
  updateShape: (shape: Shape) => void;
  resetScene: (initialScene: Scene) => void;
  saveSceneToFile: () => void;
  loadSceneFromFile: () => Promise<void>;
  initializeScene: () => void;
  clearScene: () => void;
}

const SCENE_VERSION = "1.0";
const SCENE_STORAGE_KEY = "scene-store";

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

const getInitialScene = () => {
  const storedScene = localStorage.getItem(SCENE_STORAGE_KEY);
  if (storedScene) {
    try {
      const parsed = JSON.parse(storedScene);
      if (validateScene(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.error("Failed to parse stored scene:", error);
    }
  }
  return {
    canvasProps: {
      width: 600,
      height: 400,
      backgroundColor: "white",
    },
    layers: [],
    vehicles: [],
    shapes: [],
    sceneObjects: [],
  };
};

const useSceneStore = create<SceneStore>((set, get) => ({
  scene: getInitialScene(),

  updateScene: (updates) => {
    set((state) => {
      const newScene = { ...state.scene, ...updates };
      localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(newScene));
      return { scene: newScene };
    });
  },

  updateShape: (shape) => {
    set((state) => {
      const updateShapes = state.scene.shapes.map((item) =>
        item.id === shape.id ? { ...item, ...shape } : item
      );
      const newScene = { ...state.scene, shapes: updateShapes };
      localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(newScene));
      return { scene: newScene };
    });
  },

  resetScene: (initialScene) => {
    set(() => {
      localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(initialScene));
      return { scene: initialScene };
    });
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
                localStorage.setItem(
                  SCENE_STORAGE_KEY,
                  JSON.stringify(parsed.scene)
                );
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

  initializeScene: () => {
    set((state) => {
      const newScene = {
        ...state.scene,
        layers: [
          {
            id: "default-layer",
            name: "Default Layer",
            locked: false,
            opacity: 1,
            shapes: [],
          },
        ],
        shapes: [
          {
            id: "default-rect",
            type: "rect" as const,
            x: 100,
            y: 100,
            width: 200,
            height: 100,
            fill: "#00ff00",
            stroke: "#000000",
            strokeWidth: 2,
            draggable: true,
            zIndex: 1,
          },
        ],
        vehicles: [],
        sceneObjects: [],
      };
      localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(newScene));
      return { scene: newScene };
    });
  },

  clearScene: () => {
    set(() => {
      const initialScene = getInitialScene();
      localStorage.removeItem(SCENE_STORAGE_KEY);
      return { scene: initialScene };
    });
  },
}));

export default useSceneStore;
