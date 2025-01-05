import { create } from "zustand";

interface UiConfigState {
  theme: "light" | "dark";
  layout: "compact" | "spacious";
  layerVisibility: {
    showTooltips: boolean;
    showCarImage: boolean;
    showUssZones: boolean;
    showUssSensors: boolean;
    showLidarSensors: boolean;
    showRadarSensors: boolean;
    showCameraSensors: boolean;
    showVehicleRefPoint: boolean;
    showDebugMode: boolean;
    showGrid: boolean;
  };
  ussZoneConfig: {
    frontZones: number;
    sideZones: number;
    rearZones: number;
  };
  sidebarOpen: boolean;
  setTheme: (theme: "light" | "dark") => void;
  setLayout: (layout: "compact" | "spacious") => void;
  toggleSidebar: () => void;
  toggleLayerVisibility: (key: keyof UiConfigState["layerVisibility"]) => void;
  setUssZoneConfig: (
    key: keyof UiConfigState["ussZoneConfig"],
    value: number
  ) => void;
}

const useUiConfigStore = create<UiConfigState>((set) => ({
  theme: "light",
  layout: "compact",
  layerVisibility: {
    showTooltips: true,
    showCarImage: true,
    showUssZones: false,
    showUssSensors: true,
    showLidarSensors: true,
    showRadarSensors: true,
    showCameraSensors: true,
    showVehicleRefPoint: false,
    showDebugMode: false,
    showGrid: false,
  },
  ussZoneConfig: {
    frontZones: 8,
    sideZones: 5,
    rearZones: 8,
  },
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  setLayout: (layout) => set({ layout }),
  toggleLayerVisibility: (key) =>
    set((state) => ({
      layerVisibility: {
        ...state.layerVisibility,
        [key]: !state.layerVisibility[key],
      },
    })),
  setUssZoneConfig: (key, value) =>
    set((state) => ({
      ussZoneConfig: {
        ...state.ussZoneConfig,
        [key]: value,
      },
    })),
}));

export default useUiConfigStore;
